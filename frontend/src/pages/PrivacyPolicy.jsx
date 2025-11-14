// src/pages/PrivacyPolicy.jsx
import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import useSEO from "../hooks/useSEO";

const PrivacyPolicy = () => {
  useSEO({
    title: "Privacy Policy — A Plus Home Tutors Pakistan",
    description: "Learn how A Plus Home Tutors collects, uses, and protects user data. Our privacy policy ensures safe and secure home and online tutoring services across Pakistan.",
    canonical: "https://www.aplusacademy.pk/privacy",
    ogImage: "https://www.aplusacademy.pk/aplus-logo.png",
    ogUrl: "https://www.aplusacademy.pk/privacy",
  });

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
        Privacy Policy
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        At <strong>A Plus Home Tutors</strong>, we value your privacy and are committed to protecting your personal information. By using our website and services, you agree to the practices outlined below.
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          1. Information We Collect
        </Typography>
        <Typography variant="body1">
          We may collect personal information such as your name, email address, phone number, location, and tutoring preferences when you register, book a session, or contact us.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          2. How We Use Your Information
        </Typography>
        <Typography variant="body1">
          Your information is used to provide tutoring services, communicate with you, process payments, improve our website, and send updates or promotions. We never sell your data to third parties.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          3. Cookies & Tracking
        </Typography>
        <Typography variant="body1">
          We use cookies and analytics tools to enhance user experience, track website performance, and measure the effectiveness of our services. You can control cookie preferences via our consent banner.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          4. Data Protection
        </Typography>
        <Typography variant="body1">
          We implement industry-standard measures to safeguard your personal data against unauthorized access, disclosure, or misuse.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          5. Third-Party Services
        </Typography>
        <Typography variant="body1">
          Some services we use (e.g., payment processors, analytics) may collect data on our behalf. These services are bound by strict privacy agreements.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          6. User Rights
        </Typography>
        <Typography variant="body1">
          Users have the right to access, update, or request deletion of their personal information. Contact us at <strong>aplushometutorspk@gmail.com</strong> for assistance.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          7. Changes to Privacy Policy
        </Typography>
        <Typography variant="body1">
          A Plus Home Tutors may update this privacy policy from time to time. Changes will be posted on this page, and continued use of our services constitutes acceptance of updated policies.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          8. Contact Information
        </Typography>
        <Typography variant="body1">
          If you have questions or concerns about your privacy, please reach out via email at <strong>aplushometutorspk@gmail.com</strong> or WhatsApp at 0306-6762289.
        </Typography>
      </Box>

    </Container>
  );
};

export default PrivacyPolicy;
