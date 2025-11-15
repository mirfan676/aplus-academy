import { Box, Typography, Grid, Paper } from "@mui/material";

const areas = [
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Karachi",
  "Faisalabad",
  "Multan",
];

const AreasWeCover = () => {
  return (
    <Box sx={{ py: 5, px: 2, backgroundColor: "#fafafa" }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 3, textAlign: "center", color: "#004aad" }}
      >
        Areas We Cover
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {areas.map((area, i) => (
          <Grid item xs={6} sm={4} md={2} key={i}>
            <Paper sx={{ p: 2, textAlign: "center" }} elevation={1}>
              {area}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AreasWeCover;
