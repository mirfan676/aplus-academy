import React from "react";
import { Box, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const whiteFrame = {
    position: "absolute",
    bottom: isMobile ? "14px" : "-25px",
    right: isMobile ? "14px" : "-30px",
    padding: isMobile ? "4px" : "10px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.95)",
    border: "1px solid rgba(255, 255, 255, 0.35)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "70vh", sm: "75vh", md: "85vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" },
        px: { xs: 3, sm: 5, md: 10 },
        pt: { xs: 4, sm: 6, md: 10 },
        pb: { xs: 5, md: 0 },
        backgroundColor: "#f5f5f7",
        position: "relative",
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: "100%", sm: 470, md: 560 },
          textAlign: { xs: "center", md: "left" },
          mt: { xs: 4, md: 0 },
          position: "relative",
          zIndex: 2,
          order: { xs: 2, md: 1 },
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3.2rem" },
            fontWeight: 800,
            lineHeight: 1.2,
            color: "#004aad",
          }}
        >
          Trusted Home Tutors, Career Guidance, and PTE Support
        </Typography>

        <Typography
          sx={{
            mt: 2,
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.18rem" },
            color: "#555",
            lineHeight: 1.8,
          }}
        >
          Find home and online tutors in Pakistan, explore class-wise academic guidance,
          prepare for exams, and build clearer future paths for students from early years to graduation.
        </Typography>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Button
            component="a"
            href="https://wa.me/923197659491"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="large"
            sx={{
              background: "#007bff",
              "&:hover": { background: "#0069d9" },
              px: 5,
              py: 1.5,
              borderRadius: "10px",
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
              width: { xs: "100%", sm: "auto" },
              transition: "all 0.3s ease",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Contact Now
          </Button>

          <Button
            component={Link}
            to="/teachers"
            variant="contained"
            size="large"
            sx={{
              background: "#29b554",
              "&:hover": { background: "#22a049" },
              px: 5,
              py: 1.5,
              borderRadius: "10px",
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
              width: { xs: "100%", sm: "auto" },
              transition: "all 0.3s ease",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Find Your Tutor
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          mt: { xs: 1, md: 0 },
          mb: { xs: 2, md: 0 },
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
          width: "100%",
          order: { xs: 1, md: 2 },
        }}
      >
        <Box
          component="img"
          src="assets/hero-main-430.webp"
          alt="A Plus Academy students and tutors"
          width={430}
          height={322}
          fetchPriority="high"
          loading="eager"
          sx={{
            width: { xs: 260, sm: 350, md: 430 },
            height: "auto",
            borderRadius: "30px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.02)" },
          }}
        />

        <Box sx={whiteFrame}>
          <Box
            component="img"
            src="assets/hero-small.webp"
            alt="Tutor guiding a student"
            width={150}
            height={112}
            sx={{
              width: { xs: 76, sm: 120, md: 150 },
              height: "auto",
              borderRadius: { xs: "10px", md: "15px" },
              display: "block",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
