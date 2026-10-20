import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Link as RouterLink } from "react-router-dom";
import { db } from "../../firebase";

const formatDate = (value) => value?.toDate?.().toLocaleString("en-PK") || "Pending timestamp";
const csvCell = (value) => `"${String(value ?? "").replaceAll('"','""')}"`;

export default function TestResultsAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        if (!db) throw new Error("Firebase is not configured.");
        const snapshot = await getDocs(query(collection(db, "testResults"), orderBy("submittedAt", "desc"), limit(250)));
        setRows(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      } catch (loadError) {
        console.error(loadError);
        setError("Test results could not be loaded. Check the Firestore rules and connection.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
      <Paper sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" sx={{ mb: 2 }}><TextField label="Search student, ID or email" value={search} onChange={(event) => setSearch(event.target.value)} sx={{ minWidth: { md: 360 } }} /><Button startIcon={<DownloadIcon />} variant="contained" disabled={!filtered.length} onClick={downloadCsv}>Download CSV</Button></Stack>
        {loading ? <Box sx={{ py: 8, display: "grid", placeItems: "center" }}><CircularProgress /></Box> : <Box sx={{ overflowX: "auto" }}><Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 950, "th,td": { textAlign: "left", p: 1.4, borderBottom: "1px solid #dce8f1", verticalAlign: "top" }, th: { bgcolor: "#f5f8fb", fontWeight: 900 } }}><thead><tr><th>Student</th><th>Submitted</th><th>Score</th><th>Status</th><th>Incidents</th><th>Topic scores</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id}><td><Typography fontWeight={900}>{row.studentName || "Student"}</Typography><Typography variant="body2">{row.studentId}</Typography><Typography variant="caption" color="text.secondary">{row.userEmail}</Typography></td><td>{formatDate(row.submittedAt)}</td><td><b>{row.correct} / {row.total}</b><br />{row.percentage}%</td><td><Chip label={row.passed ? "PASS" : "NOT PASSED"} color={row.passed ? "success" : "error"} size="small" /></td><td>{row.incidents || 0}</td><td>{Object.entries(row.topicScores || {}).map(([topic, score]) => <Typography key={topic} variant="body2">{topic}: {score.correct}/{score.total}</Typography>)}</td></tr>)}</tbody></Box></Box>}
        {!loading && !filtered.length && <Alert severity="info">No test results match this search.</Alert>}
      </Paper>
    </Container>
  </Box>;
}
