import React from "react";
import { Box, Typography, Button, Grid, useMediaQuery, IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

const HeroSection = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const isTablet = useMediaQuery("(max-width:1200px)");

  return (
    <Box
      sx={{
        py: isMobile ? 6 : 10,
        px: isMobile ? 2 : 6,
        backgroundColor: "#f5f5f7",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grid
        container
        spacing={isMobile ? 3 : 6}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          flexDirection: isMobile ? "column-reverse" : "row",
        }}
      >
        {/* Text Section */}
        <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={700}
            sx={{ color: "#004aad", mb: 2 }}
          >
            Find Expert Home & Online Tutors
          </Typography>

          <Typography sx={{ mb: 3, fontSize: isMobile ? "14px" : "16px" }}>
            APlus Home Tutors provides qualified, verified, and experienced
            teachers for all classes and subjects in Lahore, Islamabad,
            Rawalpindi, Karachi, and across Pakistan.
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{
              background: "#29b554",
              "&:hover": { background: "#22a049" },
              mt: 1,
              width: isMobile ? "100%" : "auto",
            }}
          >
            Hire a Tutor
          </Button>
        </Grid>

        {/* Image Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-end",
          }}
        >
          <Box
            sx={{
              width: isMobile ? "80%" : isTablet ? "60%" : "100%",
              maxWidth: 400,
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
              background: isMobile
                ? "none"
                : "linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)",
            }}
          >
            <Box
              component="img"
              src="assets/hero-image.jpg"
              alt="Aplus Best Home Tutors"
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "16px",
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Floating Icon Buttons */}
      <Box
        sx={{
          position: "absolute",
          bottom: isMobile ? 16 : 32,
          right: isMobile ? 16 : 32,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          zIndex: 10,
        }}
      >
        <IconButton
          component="a"
          href="https://wa.me/923066762289"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: "#25D366",
            color: "white",
            "&:hover": { backgroundColor: "#1ebe5b", transform: "scale(1.1)" },
            width: 56,
            height: 56,
          }}
        >
          <WhatsAppIcon />
        </IconButton>

        <IconButton
          component="a"
          href="mailto:aplushometutorspk@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: "#0072c6",
            color: "white",
            "&:hover": { backgroundColor: "#005ea3", transform: "scale(1.1)" },
            width: 56,
            height: 56,
          }}
        >
          <EmailIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default HeroSection;
