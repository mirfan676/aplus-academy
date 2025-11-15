import { Box, Grid, Typography, Paper } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CheckIcon from "@mui/icons-material/Check";

const steps = [
  { icon: <PersonSearchIcon />, text: "Tell Us Your Requirements" },
  { icon: <SchoolIcon />, text: "We Match the Best Tutor" },
  { icon: <CheckIcon />, text: "Start Free Trial Class" },
];

const StepsSection = () => {
  return (
    <Box sx={{ py: 5, px: 2, backgroundColor: "#fafafa" }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 3, textAlign: "center", color: "#004aad" }}
      >
        How It Works
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {steps.map((s, i) => (
          <Grid item xs={12} sm={4} md={3} key={i}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: "10px",
              }}
              elevation={1}
            >
              <Box sx={{ fontSize: "40px", color: "#29b554" }}>{s.icon}</Box>
              <Typography sx={{ mt: 1 }}>{s.text}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StepsSection;
