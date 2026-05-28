import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useSEO from "../hooks/useSEO";

export default function NotFound() {
  useSEO({
    title: "Page Not Found - A Plus Home Tutors",
    description:
      "The page you requested could not be found. Browse verified tutors or latest home tuition jobs at A Plus Home Tutors.",
    canonical: "https://www.aplusacademy.pk/",
  });

  return (
    <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
      <Typography component="h1" variant="h4" color="primary" fontWeight={800} gutterBottom>
        Page Not Found
      </Typography>
      <Typography sx={{ color: "#444", mb: 4 }}>
        This page is not available right now. You can still find verified tutors,
        register as a tutor, or browse the latest tuition jobs.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
        <Button component={RouterLink} to="/teachers" variant="contained">
          Find Tutors
        </Button>
        <Button component={RouterLink} to="/register" variant="outlined">
          Register as Tutor
        </Button>
        <Button component={RouterLink} to="/jobs" variant="outlined">
          View Jobs
        </Button>
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Button component={RouterLink} to="/" variant="text">
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
