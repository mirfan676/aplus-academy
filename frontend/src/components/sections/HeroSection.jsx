import React from "react";
import { Box, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const glassFrame = {
    position: "absolute",
    bottom: isMobile ? "-15px" : "-25px",
    right: isMobile ? "-10px" : "-30px",
    padding: isMobile ? "6px" : "10px",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
    background: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.35)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  };

  const whiteFrame = {
    position: "absolute",
    bottom: isMobile ? "-15px" : "-25px",
    right: isMobile ? "-10px" : "-30px",
    padding: isMobile ? "6px" : "10px",
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
        flexDirection: { xs: "column-reverse", md: "row" },
        px: { xs: 3, sm: 5, md: 10 },
        pt: { xs: 4, sm: 6, md: 10 },
        backgroundColor: "#f5f5f7",
        position: "relative",
      }}
    >
      {/* LEFT TEXT */}
      <Box
        sx={{
          maxWidth: { xs: "100%", sm: 450, md: 520 },
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3.2rem" },
            fontWeight: 800,
            lineHeight: 1.2,
            color: "#004aad",
          }}
        >
          Premium Home Tutors For All Classes
        </Typography>

        <Typography
          sx={{
            mt: 2,
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
            color: "#555",
          }}
        >
          Expert one-to-one tutoring at your home — trusted by parents,
          students, and teachers.
        </Typography>

        {/* BUTTONS */}
<Box
  sx={{
    mt: 3,
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    gap: 2,
    justifyContent: { xs: "center", md: "flex-start" },
  }}
>
  {/* WHATSAPP BUTTON */}
  <Button
    component="a"
    href="https://wa.me/923066762289"
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
    }}
  >
    Contact Now
  </Button>

  {/* EXISTING HIRE TUTOR BUTTON */}
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
    }}
  >
    Find Your Tutor
  </Button>
</Box>

      </Box>

      {/* RIGHT HERO IMAGES */}
      <Box
        sx={{
          position: "relative",
          mt: { xs: 6, md: 0 },
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
        }}
      >
        {/* MAIN LCP IMAGE */}
        <Box
          component="img"
          src="assets/hero-main-430.webp"
          alt="Students"
          width={430}
          height={322}
          fetchpriority="high"
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

        {/* SMALL IMAGE WITH WHITE FRAME */}
        <Box sx={whiteFrame}>
          <Box
            component="img"
            src="assets/hero-small.webp"
            alt="Tutor"
            width={150}  
            height={112} 
            sx={{
              width: { xs: 100, sm: 120, md: 150 },
              height: "auto",
              borderRadius: "15px",
              display: "block",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
