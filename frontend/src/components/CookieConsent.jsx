import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Collapse,
  useTheme,
  Stack,
} from "@mui/material";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const handleConsent = (granted) => {
    localStorage.setItem("cookieConsent", granted ? "granted" : "denied");
    setVisible(false);

    if (window.gtag) {
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
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 640,
          p: 3,
          borderRadius: "16px 16px 0 0",
          backgroundColor: theme.palette.background.paper,
          animation: "slideUp 0.4s ease",
          mb: { xs: 0, sm: 2 },
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🍪 We value your privacy
        </Typography>

        <Typography variant="body2" color="text.secondary">
          We use cookies to improve your browsing experience, deliver
          personalized ads, and analyze traffic. You can accept all cookies or
          manage your preferences.
        </Typography>

        <Collapse in={showDetails}>
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.grey[100],
              textAlign: "left",
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Cookie Categories:
            </Typography>
            <Typography variant="body2">
              <strong>Necessary:</strong> Always enabled — required for core
              functionality.
            </Typography>
            <Typography variant="body2">
              <strong>Analytics:</strong> Helps us understand site performance.
            </Typography>
            <Typography variant="body2">
              <strong>Marketing:</strong> Used for relevant ads and promotions.
            </Typography>
          </Box>
        </Collapse>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mt: 3, justifyContent: "center" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleConsent(true)}
          >
            Accept All
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleConsent(false)}
          >
            Reject All
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {showDetails ? "Hide Details" : "Manage Preferences"}
          </Button>
        </Stack>
      </Paper>

      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default CookieConsent;
