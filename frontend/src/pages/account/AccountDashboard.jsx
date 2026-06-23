import { useEffect, useState } from "react";
import { Box, Button, Container, Paper, Stack, Typography, Avatar, Chip } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/useAuth";

const AccountDashboard = () => {
  const { isAdmin, loading, logout, user } = useAuth();
  const [profileRole, setProfileRole] = useState("user");

  useEffect(() => {
    const loadProfile = async () => {
      if (!db || !user) return;
      const snapshot = await getDoc(doc(db, "users", user.uid));
      setProfileRole(snapshot.data()?.role || "user");
    };
    loadProfile();
  }, [user]);

  if (!loading && !user) return <Navigate to="/admin/login" replace />;

  const isTutor = profileRole === "teacher" || profileRole === "tutor";
  const isFamily = profileRole === "parent" || profileRole === "student";

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
            <RateReviewIcon color="primary" fontSize="large" />
            <Typography variant="h6" fontWeight={900} sx={{ mt: 1 }}>
              PTE essay practice
            </Typography>
            <Typography color="text.secondary" sx={{ my: 2 }}>
              Write timed essays, receive adaptive feedback, and compare your scored responses.
            </Typography>
            <Button component={RouterLink} to="/pte/write-essay" variant="contained">
              Practise writing
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
