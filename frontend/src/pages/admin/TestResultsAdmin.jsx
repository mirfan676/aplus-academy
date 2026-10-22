import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { collection, doc, getDocs, limit, orderBy, query, runTransaction, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../contexts/useAuth";
import { Link as RouterLink } from "react-router-dom";
import { db } from "../../firebase";

const formatDate = (value) => value?.toDate?.().toLocaleString("en-PK") || "Pending timestamp";
const csvCell = (value) => `"${String(value ?? "").replaceAll('"','""')}"`;
const incidentLabels = {
  tabHidden: "Test tab hidden",
  fullscreenExit: "Fullscreen exited",
  windowBlur: "Test window lost focus",
  pointerLeftPage: "Pointer left test page",
  keyboardWhilePointerOutside: "Keyboard used while pointer was outside",
  restrictedShortcut: "Restricted keyboard shortcut",
  pasteAttempt: "Paste attempt",
  contentDropAttempt: "Content drop attempt",
  browserAutomationDetected: "Browser automation indicator",
  inactivityAutoSubmit: "Submitted for inactivity",
};

const topicPercentage = (score) => score?.total ? Math.round((score.correct / score.total) * 100) : 0;
const aiAssistanceReview = (row) => {
  const details = row.incidentDetails || {};
  const evidence = [];
  if (details.browserAutomationDetected) evidence.push("Browser automation indicator detected");
  if (details.pasteAttempt) evidence.push(`${details.pasteAttempt} paste attempt(s)`);
  if (details.contentDropAttempt) evidence.push(`${details.contentDropAttempt} content-drop attempt(s)`);
  if (row.durationSeconds > 0 && row.durationSeconds < 180) evidence.push(`Very rapid completion (${row.durationSeconds} seconds)`);
  if (evidence.length) return { level: "Review recommended", color: "warning", evidence };
  return { level: "No observable indicator", color: "success", evidence: ["No paste, content-drop, browser-automation or unusually rapid completion indicator was recorded."] };
};

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
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!db) throw new Error("Firebase is not configured.");
        const [snapshot, assignmentSnapshot, detailSnapshot] = await Promise.all([
          getDocs(query(collection(db, "testResults"), orderBy("submittedAt", "desc"), limit(250))),
          getDocs(collection(db, "studentIds")),
          getDocs(collection(db, "testResultDetails")),
        ]);
        const detailsById = new Map(detailSnapshot.docs.map((item) => [item.id, item.data()]));
        setRows(snapshot.docs.map((item) => ({ id: item.id, ...item.data(), questionResults: detailsById.get(item.id)?.questionResults || [] })));
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
        {loading ? <Box sx={{ py: 8, display: "grid", placeItems: "center" }}><CircularProgress /></Box> : <Box sx={{ overflowX: "auto" }}><Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 1150, "th,td": { textAlign: "left", p: 1.4, borderBottom: "1px solid #dce8f1", verticalAlign: "top" }, th: { bgcolor: "#f5f8fb", fontWeight: 900 } }}><thead><tr><th>Student</th><th>Submitted</th><th>Score</th><th>Status</th><th>Integrity activity</th><th>Topic scores</th><th>Report</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id}><td><Typography fontWeight={900}>{row.studentName || "Student"}</Typography><Typography variant="body2">{row.studentId}</Typography><Typography variant="caption" color="text.secondary">{row.userEmail}</Typography></td><td>{formatDate(row.submittedAt)}<Typography variant="caption" display="block">Attempt day: {row.attemptDate || "Legacy"}</Typography></td><td><b>{row.correct} / {row.total}</b><br />{row.percentage}%</td><td><Chip label={row.passed ? "PASS" : "NOT PASSED"} color={row.passed ? "success" : "error"} size="small" />{row.automaticSubmission && <Typography variant="caption" display="block" color="warning.main">Auto-submitted: {row.automaticSubmissionReason || "yes"}</Typography>}</td><td><Typography fontWeight={900}>Total: {row.incidents || 0}</Typography>{Object.entries(row.incidentDetails || {}).map(([type, count]) => <Typography key={type} variant="caption" display="block">{incidentLabels[type] || type}: {count}</Typography>)}</td><td>{Object.entries(row.topicScores || {}).map(([topic, score]) => <Typography key={topic} variant="body2">{topic}: {score.correct}/{score.total}</Typography>)}</td><td><Button variant="outlined" onClick={() => setSelectedResult(row)}>Full report</Button></td></tr>)}</tbody></Box></Box>}
        {!loading && !filtered.length && <Alert severity="info">No test results match this search.</Alert>}
      </Paper>
      <Dialog open={Boolean(selectedResult)} onClose={() => setSelectedResult(null)} maxWidth="lg" fullWidth>
        {selectedResult && (() => {
          const topics = Object.entries(selectedResult.topicScores || {});
          const focusTopics = topics.filter(([, score]) => topicPercentage(score) < 80);
          const strongTopics = topics.filter(([, score]) => topicPercentage(score) >= 80);
          const aiReview = aiAssistanceReview(selectedResult);
          return <>
            <DialogTitle><Typography variant="h4" fontWeight={900}>Complete Student Assessment Report</Typography><Typography color="text.secondary">{selectedResult.studentName} · {selectedResult.studentId} · {selectedResult.userEmail}</Typography></DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
                <Paper variant="outlined" sx={{ p: 2 }}><Typography color="text.secondary">Score</Typography><Typography variant="h4" fontWeight={900}>{selectedResult.correct}/{selectedResult.total}</Typography><Typography>{selectedResult.percentage}% · {selectedResult.passed ? "PASS" : "NOT PASSED"}</Typography></Paper>
                <Paper variant="outlined" sx={{ p: 2 }}><Typography color="text.secondary">Duration</Typography><Typography variant="h5" fontWeight={900}>{Math.floor((selectedResult.durationSeconds || 0) / 60)}m {(selectedResult.durationSeconds || 0) % 60}s</Typography><Typography>{selectedResult.unanswered || 0} unanswered</Typography></Paper>
                <Paper variant="outlined" sx={{ p: 2 }}><Typography color="text.secondary">Integrity events</Typography><Typography variant="h4" fontWeight={900}>{selectedResult.incidents || 0}</Typography><Typography>{selectedResult.automaticSubmission ? `Auto-submitted: ${selectedResult.automaticSubmissionReason || "yes"}` : "Student submitted"}</Typography></Paper>
                <Paper variant="outlined" sx={{ p: 2 }}><Typography color="text.secondary">AI-assistance review</Typography><Chip label={aiReview.level} color={aiReview.color} sx={{ mt: 1 }} /><Typography variant="caption" display="block" sx={{ mt: 1 }}>Indicators only; not proof of AI use.</Typography></Paper>
              </Box>
              <Typography variant="h6" fontWeight={900}>Learning analysis</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mt: 1, mb: 3 }}>
                <Alert severity="success"><b>Strong areas:</b> {strongTopics.length ? strongTopics.map(([topic, score]) => `${topic} (${topicPercentage(score)}%)`).join(", ") : "No topic reached 80% yet."}</Alert>
                <Alert severity={focusTopics.length ? "warning" : "success"}><b>Recommended focus:</b> {focusTopics.length ? focusTopics.map(([topic, score]) => `${topic} (${topicPercentage(score)}%)`).join(", ") : "Maintain performance across all assessed topics."}</Alert>
              </Box>
              <Typography variant="h6" fontWeight={900}>Conduct and AI-assistance indicators</Typography>
              <Stack spacing={.5} sx={{ mt: 1, mb: 3 }}>{aiReview.evidence.map((item) => <Typography key={item}>• {item}</Typography>)}{Object.entries(selectedResult.incidentDetails || {}).map(([type, count]) => <Typography key={type}>• {incidentLabels[type] || type}: {count}</Typography>)}</Stack>
              <Alert severity="info" sx={{ mb: 3 }}>This review reports browser-observable signals only. It cannot confirm or exclude use of an external phone, another device, another person or an AI tool outside the test page.</Alert>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>Question-by-question review</Typography>
              {selectedResult.questionResults?.length ? <Stack spacing={1.5}>{selectedResult.questionResults.map((answer) => <Paper key={answer.number} variant="outlined" sx={{ p: 2, borderLeft: `6px solid ${answer.isCorrect ? "#198754" : "#dc3545"}` }}><Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={1}><Typography fontWeight={900}>Q{answer.number}. {answer.question}</Typography><Chip size="small" label={answer.isCorrect ? "CORRECT" : "WRONG"} color={answer.isCorrect ? "success" : "error"} /></Stack><Typography variant="caption" color="text.secondary">{answer.topic}</Typography><Typography sx={{ mt: 1 }}><b>Student answer:</b> {answer.selectedAnswer}</Typography>{!answer.isCorrect && <Typography color="success.dark"><b>Correct answer:</b> {answer.correctAnswer}</Typography>}</Paper>)}</Stack> : <Alert severity="warning">Question-level answers were not stored for this older attempt. Detailed answer reporting is available for tests submitted after this reporting upgrade.</Alert>}
            </DialogContent>
            <DialogActions><Button onClick={() => window.print()}>Print report</Button><Button variant="contained" onClick={() => setSelectedResult(null)}>Close</Button></DialogActions>
          </>;
        })()}
      </Dialog>
    </Container>
  </Box>;
}
