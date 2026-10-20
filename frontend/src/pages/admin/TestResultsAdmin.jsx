import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { collection, doc, getDocs, limit, orderBy, query, runTransaction, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../contexts/useAuth";
import { Link as RouterLink } from "react-router-dom";
import { db } from "../../firebase";

const formatDate = (value) => value?.toDate?.().toLocaleString("en-PK") || "Pending timestamp";
const csvCell = (value) => `"${String(value ?? "").replaceAll('"','""')}"`;

export default function TestResultsAdmin() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [assignEmail, setAssignEmail] = useState("");
  const [assignId, setAssignId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignmentMessage, setAssignmentMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        if (!db) throw new Error("Firebase is not configured.");
        const [snapshot, assignmentSnapshot] = await Promise.all([
          getDocs(query(collection(db, "testResults"), orderBy("submittedAt", "desc"), limit(250))),
          getDocs(collection(db, "studentIds")),
        ]);
        setRows(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setAssignments(assignmentSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort((a,b) => String(a.studentId).localeCompare(String(b.studentId))));
      } catch (loadError) {
        console.error(loadError);
        setError("Test results could not be loaded. Check the Firestore rules and connection.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const assignStudentId = async () => {
    const email = assignEmail.trim().toLowerCase();
    const studentId = assignId.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setAssignmentMessage("Enter a valid student email address.");
    if (!/^[a-z0-9_-]{3,20}$/.test(studentId)) return setAssignmentMessage("Use 3 to 20 letters, numbers, underscores or hyphens for the Student ID.");
    setAssigning(true);
    setAssignmentMessage("");
    try {
      await runTransaction(db, async (transaction) => {
        const emailRef = doc(db, "studentEmailIds", email);
        const idRef = doc(db, "studentIds", studentId);
        const [emailSnapshot, idSnapshot] = await Promise.all([transaction.get(emailRef), transaction.get(idRef)]);
        if (idSnapshot.exists() && idSnapshot.data().email !== email) throw new Error(`Student ID ${studentId} is already assigned to another email.`);
        const previousId = emailSnapshot.exists() ? String(emailSnapshot.data().studentId || "") : "";
        if (previousId && previousId !== studentId) transaction.delete(doc(db, "studentIds", previousId));
        const data = { email, studentId, assignedBy: user?.email || "admin", updatedAt: serverTimestamp() };
        transaction.set(emailRef, data, { merge: true });
        transaction.set(idRef, data, { merge: true });
      });
      setAssignments((items) => [...items.filter((item) => item.email !== email && item.studentId !== studentId), { id: studentId, email, studentId }].sort((a,b) => a.studentId.localeCompare(b.studentId)));
      setAssignmentMessage(`Student ID ${studentId} is now linked to ${email}.`);
      setAssignEmail("");
      setAssignId("");
    } catch (assignError) {
      console.error(assignError);
      setAssignmentMessage(assignError.message || "The Student ID could not be assigned.");
    } finally {
      setAssigning(false);
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => [row.studentName,row.studentId,row.userEmail,row.testTitle].some((value) => String(value || "").toLowerCase().includes(term)));
  }, [rows, search]);

  const downloadCsv = () => {
    const header = ["Submitted","Student","Student ID","Email","Score","Total","Percentage","Passed","Incidents","Unanswered","Duration seconds","Result ID"];
    const lines = filtered.map((row) => [formatDate(row.submittedAt),row.studentName,row.studentId,row.userEmail,row.correct,row.total,row.percentage,row.passed ? "Yes" : "No",row.incidents,row.unanswered,row.durationSeconds,row.id].map(csvCell).join(","));
    const blob = new Blob([[header.map(csvCell).join(","),...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aplus-test-results-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <Box sx={{ minHeight: "100vh", bgcolor: "#eef5ff" }}>
    <Box sx={{ bgcolor: "#102019", color: "white", py: 2, borderBottom: "4px solid #198754" }}><Container maxWidth="xl"><Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}><Box><Typography component="h1" variant="h4" fontWeight={900}>Cyber Security Test Results</Typography><Typography sx={{ opacity: .75 }}>Student attempts saved from the Test Center</Typography></Box><Button component={RouterLink} to="/admin" startIcon={<ArrowBackIcon />} variant="outlined" sx={{ color: "white", borderColor: "#6ea884", alignSelf: "center" }}>Dashboard</Button></Stack></Container></Box>
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 2.5, borderRadius: 2, mb: 3 }}>
        <Typography variant="h5" fontWeight={900}>Assign Student ID</Typography>
        <Typography color="text.secondary" sx={{ mt: .5, mb: 2 }}>Each email can have one Student ID, and each Student ID can belong to only one email. Reassigning an email releases its previous ID.</Typography>
        {assignmentMessage && <Alert severity={assignmentMessage.includes("now linked") ? "success" : "warning"} sx={{ mb: 2 }}>{assignmentMessage}</Alert>}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField fullWidth label="Student Google email" value={assignEmail} onChange={(event) => setAssignEmail(event.target.value)} />
          <TextField fullWidth label="Unique Student ID, for example cc125" value={assignId} onChange={(event) => setAssignId(event.target.value)} />
          <Button variant="contained" disabled={assigning} onClick={assignStudentId} sx={{ minWidth: 150 }}>{assigning ? "Assigning..." : "Assign ID"}</Button>
        </Stack>
        <Typography variant="subtitle1" fontWeight={900} sx={{ mt: 3 }}>Assigned IDs ({assignments.length})</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>{assignments.slice(0,100).map((item) => <Chip key={item.studentId} label={`${item.studentId} · ${item.email}`} variant="outlined" />)}</Box>
      </Paper>
      <Paper sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" sx={{ mb: 2 }}><TextField label="Search student, ID or email" value={search} onChange={(event) => setSearch(event.target.value)} sx={{ minWidth: { md: 360 } }} /><Button startIcon={<DownloadIcon />} variant="contained" disabled={!filtered.length} onClick={downloadCsv}>Download CSV</Button></Stack>
        {loading ? <Box sx={{ py: 8, display: "grid", placeItems: "center" }}><CircularProgress /></Box> : <Box sx={{ overflowX: "auto" }}><Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 1050, "th,td": { textAlign: "left", p: 1.4, borderBottom: "1px solid #dce8f1", verticalAlign: "top" }, th: { bgcolor: "#f5f8fb", fontWeight: 900 } }}><thead><tr><th>Student</th><th>Submitted</th><th>Score</th><th>Status</th><th>Integrity activity</th><th>Topic scores</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id}><td><Typography fontWeight={900}>{row.studentName || "Student"}</Typography><Typography variant="body2">{row.studentId}</Typography><Typography variant="caption" color="text.secondary">{row.userEmail}</Typography></td><td>{formatDate(row.submittedAt)}<Typography variant="caption" display="block">Attempt day: {row.attemptDate || "Legacy"}</Typography></td><td><b>{row.correct} / {row.total}</b><br />{row.percentage}%</td><td><Chip label={row.passed ? "PASS" : "NOT PASSED"} color={row.passed ? "success" : "error"} size="small" />{row.automaticSubmission && <Typography variant="caption" display="block" color="warning.main">Auto-submitted: {row.automaticSubmissionReason || "yes"}</Typography>}</td><td><Typography fontWeight={900}>Total: {row.incidents || 0}</Typography>{Object.entries(row.incidentDetails || {}).map(([type, count]) => <Typography key={type} variant="caption" display="block">{type}: {count}</Typography>)}</td><td>{Object.entries(row.topicScores || {}).map(([topic, score]) => <Typography key={topic} variant="body2">{topic}: {score.correct}/{score.total}</Typography>)}</td></tr>)}</tbody></Box></Box>}
        {!loading && !filtered.length && <Alert severity="info">No test results match this search.</Alert>}
      </Paper>
    </Container>
  </Box>;
}
