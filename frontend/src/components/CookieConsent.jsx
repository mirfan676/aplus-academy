import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Link, Paper, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const updateConsent = (value) => {
    localStorage.setItem("cookieConsent", value);
    setVisible(false);

    if (window.gtag) {
      const granted = value === "granted";
      window.gtag("consent", "update", {
        ad_storage: granted ? "granted" : "denied",
        analytics_storage: granted ? "granted" : "denied",
      });
    }
  };

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        left: { xs: 12, sm: 20 },
        right: { xs: 12, sm: "auto" },
        bottom: { xs: 12, sm: 20 },
        zIndex: 2000,
        maxWidth: { xs: "none", sm: 520 },
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 2, sm: 2.25 },
          borderRadius: 2,
          border: "1px solid rgba(25, 135, 84, 0.24)",
          boxShadow: "0 12px 36px rgba(0,0,0,0.18)",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <VerifiedUserIcon color="success" sx={{ mt: 0.25 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={800}>
              Your privacy is protected
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              We use trusted cookies to keep the site reliable, understand what
              parents and tutors need, and improve your experience. We never sell
              your personal data.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ mt: 1.5 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => updateConsent("granted")}
                sx={{ fontWeight: 800, textTransform: "none" }}
              >
                Accept and Continue
              </Button>
              <Link
                href="/privacy"
                underline="hover"
                sx={{ alignSelf: { xs: "center", sm: "auto" }, fontSize: "0.9rem" }}
              >
                Privacy details
              </Link>
            </Stack>
          </Box>
          <IconButton
            aria-label="Close privacy notice"
            size="small"
            onClick={() => updateConsent("closed")}
            sx={{ mt: -0.5, mr: -0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CookieConsent;
