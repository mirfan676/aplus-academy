// src/pages/TermsAndConditions.jsx
import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import useSEO from "../hooks/useSEO";

const TermsAndConditions = () => {
  useSEO({
    title: "Terms and Conditions — A Plus Home Tutors Pakistan",
    description: "Read the terms and conditions for using A Plus Home Tutors, Pakistan’s trusted home and online tutoring platform. Learn about services, user responsibilities, payments, privacy, and more.",
    canonical: "https://www.aplusacademy.pk/terms",
    ogImage: "https://www.aplusacademy.pk/aplus-logo.png",
    ogUrl: "https://www.aplusacademy.pk/terms",
  });

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
        Terms and Conditions
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome to A Plus Home Tutors. By using our website and services, you agree to comply with the following terms and conditions. Please read them carefully.
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1">
          By accessing our website or services, you accept these terms and conditions. If you do not agree, you may not use our services.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          2. Services Offered
        </Typography>
        <Typography variant="body1">
          A Plus Home Tutors provides highly qualified and experienced home and online tutors across Pakistan. We offer personalized guidance for O/A Levels, Matric, and Qur’an classes.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          3. User Responsibilities
        </Typography>
        <Typography variant="body1">
          Users must provide accurate information during registration and follow our guidelines for respectful behavior and communication during tutoring sessions.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          4. Payment and Billing
        </Typography>
        <Typography variant="body1">
          Payment for services must follow our pricing and billing policies. Fees are generally non-refundable unless otherwise stated.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          5. Privacy Policy
        </Typography>
        <Typography variant="body1">
          Our Privacy Policy explains how we collect, use, and protect user data. By using our services, you agree to these practices.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          6. Intellectual Property
        </Typography>
        <Typography variant="body1">
          Content shared during tutoring sessions remains the property of the user. All users must respect intellectual property rights.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          7. Termination of Services
        </Typography>
        <Typography variant="body1">
          A Plus Home Tutors reserves the right to terminate user access for violations of terms, inappropriate behavior, or misuse of services.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          8. Limitation of Liability
        </Typography>
        <Typography variant="body1">
          We are not liable for direct or indirect damages, losses, or injuries arising from the use of our services.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          9. Dispute Resolution
        </Typography>
        <Typography variant="body1">
          Users agree to resolve disputes in good faith and seek amicable solutions before pursuing legal action.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          10. Modifications to Terms
        </Typography>
        <Typography variant="body1">
          A Plus Home Tutors may update these terms at any time. Continued use of our services constitutes acceptance of the updated terms.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          11. Contact Information
        </Typography>
        <Typography variant="body1">
          For questions or concerns regarding these terms, please contact us at <strong>aplushometutorspk@gmail.com</strong> or via WhatsApp at 0306-6762289.
        </Typography>
      </Box>

    </Container>
  );
};

export default TermsAndConditions;
