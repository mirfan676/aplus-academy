import { Box, Typography, Button } from "@mui/material";

const FooterCTA = () => {
  return (
    <Box
      sx={{
        py: 5,
        textAlign: "center",
        background: "#004aad",
        color: "white",
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        Ready to Hire an Expert Tutor?
      </Typography>
      <Typography sx={{ mt: 1 }}>
        Contact us to get the best tutor matched within minutes.
      </Typography>

      <Button
        variant="contained"
        size="large"
        sx={{
          mt: 2,
          background: "#29b554",
          "&:hover": { background: "#22a049" },
        }}
      >
        Hire a Tutor
      </Button>
    </Box>
  );
};

export default FooterCTA;
