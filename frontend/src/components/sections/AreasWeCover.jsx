// src/components/sections/AreasWeCover.jsx
import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import LahoreIcon from "../icons/LahoreIcon";
import KarachiIcon from "../icons/KarachiIcon";
import IslamabadIcon from "../icons/IslamabadIcon";
import RawalpindiIcon from "../icons/RawalpindiIcon";
import FaisalabadIcon from "../icons/FaisalabadIcon";
import MultanIcon from "../icons/MultanIcon";
import PeshawarIcon from "../icons/PeshawarIcon";
import QuettaIcon from "../icons/QuettaIcon";

const areas = [
  { name: "Lahore", description: "Expert tutors available", icon: <LahoreIcon size={64} /> },
  { name: "Karachi", description: "Quality home tutoring", icon: <KarachiIcon size={64} /> },
  { name: "Islamabad", description: "Trusted by parents", icon: <IslamabadIcon size={64} /> },
  { name: "Rawalpindi", description: "Flexible schedule", icon: <RawalpindiIcon size={64} /> },
  { name: "Faisalabad", description: "Affordable tutoring", icon: <FaisalabadIcon size={64} /> },
  { name: "Multan", description: "Customized study plans", icon: <MultanIcon size={64} /> },
  { name: "Peshawar", description: "Verified & qualified tutors", icon: <PeshawarIcon size={64} /> },
  { name: "Quetta", description: "Safe & reliable home tutoring", icon: <QuettaIcon size={64} /> },
];

const AreasWeCover = () => {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#fafafa" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 6,
          textAlign: "center",
          color: "#004aad",
          fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem", lg: "2.2rem" },
        }}
      >
        Cities We Cover
      </Typography>

      <Grid
        container
        spacing={4}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr",
          },
        }}
      >
        {areas.map((area, index) => (
          <Grid item key={index}>
            <Box
              sx={{
                position: "relative",
                borderRadius: "22px",
                overflow: "hidden",
                width: "100%",
                minHeight: { xs: 100, sm: 110, md: 110 },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  padding: "1px", // reduced from 2px
                  borderRadius: "22px",
                  background:
                    "linear-gradient(120deg, #00a6ff, #00ff8f, #00a6ff)",
                  backgroundSize: "200% 200%",
                  animation: "gradientMove 4s linear infinite",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  zIndex: 1,
                },
                "@keyframes gradientMove": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  p: 3, // slightly reduced padding
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(15px)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 25px 70px rgba(0,0,0,0.30)",
                  },
                }}
              >
                {/* Fixed text block */}
                <Box sx={{ maxWidth: "220px" }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 1, color: "#29b554" }}
                  >
                    {area.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem", color: "#333" }}>
                    {area.description}
                  </Typography>
                </Box>

                {/* Icon bottom-right */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    width: { xs: 40, sm: 50, md: 60, lg: 70 },
                    height: "auto",
                    transform: "rotate(-15deg)",
                    filter: "drop-shadow(0px 6px 20px rgba(0,0,0,0.25))",
                    transition: "all 0.35s ease",
                    "&:hover": { transform: "rotate(-10deg) scale(1.15)" },
                  }}
                >
                  {area.icon}
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AreasWeCover;
