import { useState } from "react";
import { Alert, Box, Button, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import SchoolIcon from "@mui/icons-material/School";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

export default function StudentLogin() {
  const { authError, hasFirebaseConfig, loading, signInWithGoogle, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const returnTo = searchParams.get("returnTo")?.startsWith("/") ? searchParams.get("returnTo") : "/account";

  if (loading) return <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  if (user) return <Navigate to={returnTo} replace />;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#eef5ff", display: "flex", alignItems: "center", py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, border: "1px solid #dce8f1" }}>
          <Stack spacing={2.5} alignItems="center" textAlign="center">
            <Box sx={{ width: 68, height: 68, borderRadius: 2, bgcolor: "#13233f", color: "white", display: "grid", placeItems: "center" }}><SchoolIcon fontSize="large" /></Box>
            <Box>
              <Typography component="h1" variant="h4" fontWeight={900} color="#004aad">Student Sign In</Typography>
              <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>Sign in with your registered Google email to open the Test Center and view your recorded results.</Typography>
            </Box>
            {(error || authError) && <Alert severity="error" sx={{ width: "100%", textAlign: "left" }}>{error || authError}</Alert>}
            {!hasFirebaseConfig && <Alert severity="warning">Google sign-in is temporarily unavailable.</Alert>}
            <Button fullWidth size="large" variant="contained" startIcon={<GoogleIcon />} disabled={!hasFirebaseConfig} onClick={async () => { try { setError(""); await signInWithGoogle(); } catch (signInError) { setError(signInError?.message || "Google sign-in could not be started."); } }} sx={{ bgcolor: "#198754", py: 1.4, fontWeight: 900, textTransform: "none" }}>Continue with Google</Button>
            <Typography variant="body2" color="text.secondary">Use the same email address that was registered with A Plus Academy.</Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
