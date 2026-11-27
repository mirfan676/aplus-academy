import { useEffect, useState } from "react";
import { Box, Button, Container, Paper, Stack, Typography, Avatar, Chip, LinearProgress, Alert } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/useAuth";
import { fetchUserPteTaskResponses } from "../../services/pteTaskResponseData";
import { QUIZZES, quizLabel } from "../test-center/quizConfig";

const TOTAL_CYBER_QUIZZES = 6;
const TOTAL_CERTIFICATE_ASSESSMENTS = TOTAL_CYBER_QUIZZES + 1;

const AccountDashboard = () => {
  const { isAdmin, loading, logout, user } = useAuth();
  const [profileRole, setProfileRole] = useState("user");
  const [ptePracticeCount, setPtePracticeCount] = useState(0);
  const [studentId, setStudentId] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [testResultsError, setTestResultsError] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!db || !user) return;
      const snapshot = await getDoc(doc(db, "users", user.uid));
      setProfileRole(snapshot.data()?.role || "user");
    };
    loadProfile();
  }, [user]);

  useEffect(() => {
    if (!user?.uid) {
      setPtePracticeCount(0);
      return;
    }
    fetchUserPteTaskResponses(user.uid)
      .then((records) => setPtePracticeCount(records.length))
      .catch(() => setPtePracticeCount(0));
  }, [user?.uid]);

  useEffect(() => {
    const loadTests = async () => {
      if (!db || !user?.uid || !user?.email) {
        setStudentId("");
        setTestResults([]);
        return;
      }
      try {
        setTestResultsError(false);
        const email = user.email.trim().toLowerCase();
        const [idSnapshot, resultsSnapshot] = await Promise.all([
          getDoc(doc(db, "studentEmailIds", email)),
          getDocs(query(collection(db, "testResults"), where("userId", "==", user.uid))),
        ]);
        setStudentId(idSnapshot.exists() ? String(idSnapshot.data().studentId || "") : "");
        setTestResults(resultsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort((a,b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0)));
      } catch (error) {
        console.error("Test history could not be loaded:", error);
        setTestResults([]);
        setTestResultsError(true);
      }
    };
    loadTests();
  }, [user?.uid, user?.email]);

  if (!loading && !user) return <Navigate to="/student/login?returnTo=%2Faccount" replace />;

  const isTutor = profileRole === "teacher" || profileRole === "tutor";
  const isFamily = profileRole === "parent" || profileRole === "student";
  const completedQuizIds = new Set(testResults.map((result) => result.testId));
  const completedQuizCount = QUIZZES.filter((quiz) => completedQuizIds.has(quiz.id)).length;
  const quizProgress = Math.round((completedQuizCount / TOTAL_CYBER_QUIZZES) * 100);
  const certificateProgress = Math.round((completedQuizCount / TOTAL_CERTIFICATE_ASSESSMENTS) * 100);

  return (
    <Box sx={{ bgcolor: "#eef5ff", minHeight: "100vh", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, border: "1px solid #dce8f1", mb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={user?.photoURL || undefined} sx={{ width: 64, height: 64 }}>
                {user?.displayName?.[0] || "A"}
              </Avatar>
              <Box>
                <Typography component="h1" variant="h4" fontWeight={900} color="#004aad">
                  My A Plus Account
                </Typography>
                <Typography color="text.secondary">{user?.email}</Typography>
                <Chip label={isAdmin ? "Admin" : profileRole} color="primary" sx={{ mt: 1, color: "#fff", fontWeight: 800 }} />
              </Box>
            </Stack>
            <Button startIcon={<LogoutIcon />} onClick={logout} variant="outlined">
              Logout
            </Button>
          </Stack>
        </Paper>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
          {isAdmin && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #dce8f1" }}>
              <AdminPanelSettingsIcon color="primary" fontSize="large" />
              <Typography variant="h6" fontWeight={900} sx={{ mt: 1 }}>
                Admin dashboard
              </Typography>
              <Typography color="text.secondary" sx={{ my: 2 }}>
                Manage tutor data, map insights, users, blogs, and analytics.
              </Typography>
              <Button component={RouterLink} to="/admin" variant="contained">Open admin</Button>
            </Paper>
          )}

          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #dce8f1" }}>
            <EditIcon color="primary" fontSize="large" />
            <Typography variant="h6" fontWeight={900} sx={{ mt: 1 }}>
              Edit profile
            </Typography>
            <Typography color="text.secondary" sx={{ my: 2 }}>
              Update your role-specific profile, contact details, location, and learning preferences.
            </Typography>
            <Button component={RouterLink} to={isTutor ? "/register/teacher" : isFamily ? `/register/${profileRole}` : "/register"} variant="contained">
              Edit profile
            </Button>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #dce8f1" }}>
            <SchoolIcon color="primary" fontSize="large" />
            <Typography id="cyber-security-results" variant="h6" fontWeight={900} sx={{ mt: 1 }}>Cyber Security Test Center</Typography>
            <Typography color="text.secondary" sx={{ my: 2 }}>Assigned Student ID: <b>{studentId || "Not assigned"}</b></Typography>
            <Typography fontWeight={800}>Quiz progress: {completedQuizCount} of {TOTAL_CYBER_QUIZZES} completed</Typography>
            <LinearProgress variant="determinate" value={quizProgress} aria-label="Cyber Security quiz progress" sx={{ height: 10, borderRadius: 5, mt: 1, mb: 1.5 }} />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {Array.from({ length: TOTAL_CYBER_QUIZZES }, (_, index) => {
                const label = `Quiz ${index + 1}`;
                const releasedQuiz = QUIZZES.find((quiz) => quiz.label === label);
                const completed = releasedQuiz && completedQuizIds.has(releasedQuiz.id);
                return <Chip key={label} label={`${label}: ${completed ? "Completed" : releasedQuiz ? "Not completed" : "Upcoming"}`} size="small" color={completed ? "success" : "default"} />;
              })}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Certificate pathway: six quizzes and one final exam</Typography>
            <Typography fontWeight={800}>{completedQuizCount} of {TOTAL_CERTIFICATE_ASSESSMENTS} assessments completed</Typography>
            <LinearProgress variant="determinate" value={certificateProgress} aria-label="Cyber Security certificate pathway progress" sx={{ height: 8, borderRadius: 5, mt: 1, mb: 1.5 }} />
            <Chip label="Final exam: Upcoming" size="small" sx={{ mb: 2 }} />
            {testResultsError && <Alert severity="warning" sx={{ mb: 2 }}>Results could not be loaded. Refresh this page or contact the academy administrator.</Alert>}
            <Typography fontWeight={800} sx={{ mb: 1 }}>Saved scores</Typography>
            <Chip label={`${testResults.length} recorded attempt${testResults.length === 1 ? "" : "s"}`} color="primary" sx={{ color: "#fff", fontWeight: 800, mb: 2 }} />
            <Stack spacing={1.2} sx={{ mb: 2 }}>
              {testResults.map((result) => <Paper key={result.id} variant="outlined" sx={{ p: 1.4 }}><Typography variant="body2" fontWeight={800}>{quizLabel(result.testId)}</Typography><Stack direction="row" justifyContent="space-between"><Typography fontWeight={800}>{result.percentage}%</Typography><Chip size="small" label={result.passed ? "PASS" : "NOT PASSED"} color={result.passed ? "success" : "error"} /></Stack><Typography variant="caption" color="text.secondary">{result.submittedAt?.toDate?.().toLocaleString("en-PK") || "Saved attempt"} · {result.correct}/{result.total}</Typography></Paper>)}
            </Stack>
            <Button component={RouterLink} to="/TestCenter" variant="contained" disabled={!studentId}>Open Test Center</Button>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #dce8f1" }}>
            <RateReviewIcon color="primary" fontSize="large" />
            <Typography variant="h6" fontWeight={900} sx={{ mt: 1 }}>
              PTE practice
            </Typography>
            <Typography color="text.secondary" sx={{ my: 2 }}>
              Track your saved PTE attempts, practise text tasks, and continue with essay and section-based drills.
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Chip label={`${ptePracticeCount} saved attempts`} color="primary" sx={{ color: "#fff", fontWeight: 800 }} />
            </Stack>
            <Button component={RouterLink} to="/pte" variant="contained">
              Open PTE practice
            </Button>
          </Paper>

          {isTutor && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #dce8f1" }}>
              <WorkIcon color="primary" fontSize="large" />
              <Typography variant="h6" fontWeight={900} sx={{ mt: 1 }}>
                Latest home tuitions
              </Typography>
              <Typography color="text.secondary" sx={{ my: 2 }}>
                View current home tuition and online teaching opportunities.
              </Typography>
              <Button component={RouterLink} to="/jobs" variant="contained">View jobs</Button>
            </Paper>
          )}

          {!isTutor && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #dce8f1" }}>
              <SchoolIcon color="primary" fontSize="large" />
              <Typography variant="h6" fontWeight={900} sx={{ mt: 1 }}>
                Find teachers
              </Typography>
              <Typography color="text.secondary" sx={{ my: 2 }}>
                Browse verified tutor profiles and request a suitable teacher.
              </Typography>
              <Button component={RouterLink} to="/teachers" variant="contained">View teachers</Button>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default AccountDashboard;

