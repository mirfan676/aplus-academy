import { Box, Button, Container, Paper, Stack, Typography, Alert } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LockIcon from "@mui/icons-material/Lock";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/useAuth";

const AdminLogin = () => {
  const { hasFirebaseConfig, isAdmin, loading, signInWithGoogle, user } = useAuth();
  const [error, setError] = useState("");

  if (!loading && isAdmin) return <Navigate to="/admin" replace />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#eef5ff",
        background:
          "radial-gradient(circle at 20% 20%, rgba(25,135,84,0.16), transparent 32%), radial-gradient(circle at 80% 0%, rgba(0,74,173,0.16), transparent 28%), #eef5ff",
        display: "flex",
        alignItems: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, border: "1px solid #dce8f1" }}>
          <Stack spacing={2.5} alignItems="center" textAlign="center">
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "18px",
                bgcolor: "#102019",
                color: "#fff",
                display: "grid",
                placeItems: "center",
              }}
            >
              <LockIcon fontSize="large" />
            </Box>
            <Box>
              <Typography component="h1" variant="h4" fontWeight={900} color="#004aad">
                A Plus Admin
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
                Sign in with the approved Google account to manage tutors, users, blog activity, and dashboard insights.
              </Typography>
            </Box>

            {!hasFirebaseConfig && (
              <Alert severity="warning" sx={{ textAlign: "left" }}>
                Firebase environment variables are not configured yet. Add the Firebase web app config in Vercel and local
                `.env` before Google login can work.
              </Alert>
            )}

            {user && !isAdmin && (
              <Alert severity="error" sx={{ textAlign: "left" }}>
                This Google account is signed in but is not listed as an admin for the dashboard.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ textAlign: "left" }}>
                {error}
              </Alert>
            )}

            <Button
              onClick={async () => {
                setError("");
                try {
                  await signInWithGoogle();
                } catch (err) {
                  console.error(err);
                  setError(err?.message || "Google sign-in could not be started.");
                }
              }}
              disabled={!hasFirebaseConfig}
              startIcon={<GoogleIcon />}
              variant="contained"
              size="large"
              fullWidth
              sx={{
                bgcolor: "#198754",
                py: 1.4,
                borderRadius: 1,
                fontWeight: 800,
                textTransform: "none",
                "&:hover": { bgcolor: "#146c43" },
              }}
            >
              Continue with Google
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
