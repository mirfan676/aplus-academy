import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { motion } from "framer-motion";

const FooterCTA = () => {
  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, md: 6 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        background:
          "linear-gradient(135deg, rgba(0,74,173,0.85), rgba(0,74,173,0.95))",
      }}
    >
      {/* Glass Card */}
      <Box
        sx={{
          position: "relative",
          p: { xs: 4, md: 6 },
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
          border: "0px solid",
          borderImage: "linear-gradient(135deg, #00a6ff, #00ff8f) 1",
          maxWidth: 700,
          width: "100%",
        }}
      >
        {/* Heading */}
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mb: 2,
            color: "#fff",
            fontSize: { xs: "1.6rem", md: "2rem" },
          }}
        >
          Ready to Hire an Expert Tutor?
        </Typography>
        <Typography sx={{ mb: 4, color: "#e0e0e0", fontSize: "1rem" }}>
          Contact us to get the best tutor matched within minutes.
        </Typography>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Button
            component={Link}
            to="/teachers"
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.8,
              background: "linear-gradient(135deg, #00a6ff, #00ff8f)",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #00ff8f, #00a6ff)",
              },
            }}
          >
            Hire a Tutor
          </Button>

          <Button
            startIcon={<WhatsAppIcon />}
            href="https://wa.me/923066762289"
            target="_blank"
            variant="outlined"
            sx={{
              px: 5,
              py: 1.8,
              textTransform: "none",
              border: "2px solid",
              borderImage: "linear-gradient(135deg, #00a6ff, #00ff8f) 1",
              color: "#fff",
              backdropFilter: "blur(20px)",
              "&:hover": {
                background: "rgba(0,255,143,0.15)",
              },
            }}
          >
            Quick Inquiry
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FooterCTA;
