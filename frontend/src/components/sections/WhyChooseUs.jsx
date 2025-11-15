import { Box, Typography, Paper, Grid } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ShieldIcon from "@mui/icons-material/Shield";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const features = [
  { icon: <WorkspacePremiumIcon />, title: "Top Experienced Tutors" },
  { icon: <ShieldIcon />, title: "Highly Trusted by Parents" },
  { icon: <EmojiEventsIcon />, title: "1000+ Successful Students" },
];

const WhyChooseUs = () => {
  return (
    <Box sx={{ py: 5, px: 2 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 3, textAlign: "center", color: "#004aad" }}
      >
        Why Choose APlus Home Tutors?
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {features.map((f, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Paper sx={{ p: 3, textAlign: "center" }} elevation={1}>
              <Box sx={{ fontSize: "40px", color: "#29b554" }}>{f.icon}</Box>
              <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
                {f.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WhyChooseUs;
