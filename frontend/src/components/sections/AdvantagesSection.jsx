import { Box, Grid, Typography, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const items = [
  "Verified Qualified Tutors",
  "2 Days Free Trial Class",
  "All Subjects & Classes",
  "Affordable Monthly Fee",
  "Home & Online Both Options",
  "Regular Parent Feedback",
];

const AdvantagesSection = () => {
  return (
    <Box sx={{ py: 5, px: 2 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 3, textAlign: "center", color: "#004aad" }}
      >
        Why Parents Trust APlus Home Tutors
      </Typography>

      <Grid container spacing={2}>
        {items.map((item, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                gap: 2,
                alignItems: "center",
                borderRadius: "10px",
              }}
              elevation={1}
            >
              <CheckCircleIcon sx={{ color: "#29b554" }} />
              <Typography>{item}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdvantagesSection;
