import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "primary.main", color: "white", textAlign: "center", py: 3, mt: "auto" }}>
      <Typography variant="body2">© 2025 A Plus Home Tutors — All Rights Reserved</Typography>
      <Typography variant="caption">Empowering education, one student at a time.</Typography>
    </Box>
  );
};

export default Footer;
