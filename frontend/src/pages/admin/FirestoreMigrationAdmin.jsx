import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import {
  approveTeacherApplication,
  fetchPendingTeacherApplications,
  getFirestoreMigrationCounts,
  migrateLegacyData,
  seedBundledPteQuestions,
} from "../../services/firestoreMigration";

const FirestoreMigrationAdmin = () => {
  const [counts, setCounts] = useState({});
  const [applications, setApplications] = useState([]);
  const [progress, setProgress] = useState(null);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const refresh = async () => {
    const [nextCounts, pending] = await Promise.all([
      getFirestoreMigrationCounts(),
      fetchPendingTeacherApplications().catch(() => []),
    ]);
    setCounts(nextCounts);
    setApplications(pending);
  };

  useEffect(() => {
    refresh().catch((refreshError) => setError(refreshError.message));
  }, []);

  const runMigration = async () => {
    setRunning(true);
    setMessage("");
    setError("");
    try {
      const result = await migrateLegacyData(setProgress);
      setMessage(`Imported ${result.teachers} teachers. Image failures: ${result.imageFailures}.`);
      await refresh();
    } catch (migrationError) {
      console.error(migrationError);
      setError(migrationError.message || "Migration failed.");
    } finally {
      setRunning(false);
    }
  };

  const runPteSeed = async () => {
    setRunning(true);
    setMessage("");
    setError("");
    try {
      const result = await seedBundledPteQuestions(setProgress);
      setMessage(`Seeded ${result.imported} bundled PTE questions into Firestore.`);
      await refresh();
    } catch (seedError) {
      console.error(seedError);
      setError(seedError.message || "PTE question seeding failed.");
    } finally {
      setRunning(false);
    }
  };

  const approve = async (application) => {
    setError("");
    try {
      await approveTeacherApplication(application);
      setApplications((current) => current.filter((item) => item.id !== application.id));
      setMessage(`${application.name || "Tutor"} approved.`);
    } catch (approvalError) {
      setError(approvalError.message || "Application could not be approved.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#eef5ff" }}>
      <Box sx={{ bgcolor: "#102019", color: "#fff", py: 2.5, borderBottom: "4px solid #198754" }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
            <Box>
              <Typography component="h1" variant="h4" fontWeight={900}>Firestore data migration</Typography>
              <Typography sx={{ opacity: 0.75 }}>Import legacy records and approve tutor applications.</Typography>
            </Box>
            <Button component={RouterLink} to="/admin" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ color: "#fff", borderColor: "#6ea884" }}>Dashboard</Button>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "380px minmax(0, 1fr)" }, gap: 3 }}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #dce8f1", borderRadius: 1 }}>
            <Typography component="h2" variant="h5" fontWeight={900}>Migration status</Typography>
            <Stack spacing={1.2} sx={{ my: 2.5 }}>
              {Object.entries(counts).map(([name, count]) => (
                <Stack key={name} direction="row" justifyContent="space-between"><Typography>{name}</Typography><Chip label={count ?? "blocked"} size="small" sx={{ borderRadius: 1 }} /></Stack>
              ))}
            </Stack>
            {progress && <Alert severity="info" sx={{ mb: 2 }}>{progress.stage}: {progress.current}/{progress.total} {progress.label}</Alert>}
            <Button variant="contained" startIcon={running ? <CircularProgress size={18} color="inherit" /> : <CloudSyncIcon />} disabled={running} onClick={runMigration} fullWidth sx={{ fontWeight: 900 }}>
              Import legacy data
            </Button>
            <Button variant="outlined" disabled={running} onClick={runPteSeed} fullWidth sx={{ fontWeight: 900, mt: 1.2 }}>
              Seed bundled PTE questions
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.6 }}>
              Both operations are repeatable: documents use stable IDs and are merged, not duplicated.
            </Typography>
          </Paper>

          <Box>
            <Typography component="h2" variant="h5" fontWeight={900}>Pending tutor applications</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>{applications.length} awaiting review</Typography>
            <Stack spacing={2}>
              {applications.map((application) => (
                <Paper key={application.id} elevation={0} sx={{ p: 2.5, border: "1px solid #dce8f1", borderRadius: 1 }}>
                  <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
                    <Stack direction="row" spacing={1.5}>
                      <Avatar src={application.photoURL || undefined}>{application.name?.[0] || "T"}</Avatar>
                      <Box>
                        <Typography fontWeight={900}>{application.name || "Tutor"}</Typography>
                        <Typography color="text.secondary">{application.qualification} · {application.subject}</Typography>
                        <Typography variant="body2">{application.experience || 0} years · {application.phone}</Typography>
                      </Box>
                    </Stack>
                    <Button variant="contained" startIcon={<CheckCircleIcon />} onClick={() => approve(application)} sx={{ alignSelf: "flex-start", fontWeight: 900 }}>Approve</Button>
                  </Stack>
                </Paper>
              ))}
              {!applications.length && <Alert severity="info">No pending tutor applications.</Alert>}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FirestoreMigrationAdmin;
