import React from "react";
import { Box, Typography } from "@mui/material";

export default function SiteLoader() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 4000,
        bgcolor: "#f7fbf8",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Box sx={{ position: "relative", width: { xs: 122, md: 148 }, mx: "auto" }}>
          <Box
            component="img"
            src="/aplus-logo.png"
            alt="A Plus Academy"
            sx={{
              width: "100%",
              opacity: 0.22,
              filter: "grayscale(100%)",
            }}
          />
          <Box
            className="site-loader-fill"
            sx={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src="/aplus-logo.png"
              alt=""
              aria-hidden="true"
              sx={{
                width: "100%",
              }}
            />
          </Box>
        </Box>
        <Typography sx={{ mt: 2.1, fontWeight: 950, color: "#102019", fontSize: { xs: "1rem", md: "1.08rem" } }}>
          Loading A Plus Academy
        </Typography>
        <Typography sx={{ mt: 0.7, color: "#64748b", fontSize: "0.92rem" }}>
          Preparing tutors, guidance, and learning tools
        </Typography>
      </Box>
    </Box>
  );
}
