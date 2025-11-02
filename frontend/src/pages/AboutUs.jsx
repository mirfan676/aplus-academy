// src/pages/AboutUs.jsx
import React from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const AboutUs = () => {
  return (
    <Container sx={{ py: 6 }}>
      {/* Heading */}
      <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
        Welcome to A Plus Home Tutors
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Education is not just about passing exams — it’s about building
        confidence, mastering concepts, and shaping brighter futures. At{" "}
        <strong>A Plus Home Tutors</strong>, we are on a mission to make
        high-quality, personalized learning accessible to every student in
        Pakistan. Whether you’re struggling with equations, preparing for O / A
        Levels, or looking for expert guidance in Qur’an and Tajweed, we’re here
        to help you every step of the way.
      </Typography>

      {/* Mission */}
      <Typography variant="h5" color="primary" sx={{ mt: 4, mb: 1 }}>
        🎯 Our Mission: Shaping Brighter Futures
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Our mission is simple yet powerful — to make learning accessible,
        effective, and personalized. We believe every student has the potential
        to achieve greatness with the right guidance. That’s why our experienced
        tutors provide one-on-one attention that helps students not only improve
        grades but also build lifelong learning habits.
      </Typography>
      <Typography variant="body1">
        Our goal is to help learners across Pakistan — from primary students to
        A Level candidates — overcome challenges, boost confidence, and reach
        their full academic potential through tailored teaching methods and
        modern learning tools.
      </Typography>

      {/* Vision */}
      <Typography variant="h5" color="primary" sx={{ mt: 4, mb: 1 }}>
        💡 Our Vision: Pakistan’s Leading Home Tuition Network
      </Typography>
      <List dense>
        {[
          "Providing expert subject tutors who are experienced, trained, and passionate about teaching.",
          "Building a network that connects parents and students with reliable educators anywhere in Pakistan.",
          "Empowering students through concept-based learning, personalized strategies, and consistent progress tracking.",
          "Integrating technology — Zoom, Skype, and other platforms — to make learning flexible and convenient.",
        ].map((item, i) => (
          <ListItem key={i} disablePadding>
            <ListItemText primary={`• ${item}`} />
          </ListItem>
        ))}
      </List>

      {/* Services */}
      <Typography variant="h5" color="primary" sx={{ mt: 4, mb: 1 }}>
        📘 Our Services
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        🏫 O / A Level Home & Online Tutoring
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        We specialize in Cambridge O & A Level subjects taught by tutors with
        20–25 years of proven success. Our teaching approach ensures students
        understand concepts deeply rather than memorizing for exams. Subjects
        include Mathematics, Physics, Chemistry, Biology, English, Economics,
        Business, Computer Science, Urdu, Sociology, and more.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        📖 Online & In-Home Qur’an Classes
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Our Qur’an courses include Tajweed, daily duas, prayer guidance,
        character building, and moral training. Classes are flexible, conducted
        via Zoom, Skype, or in-person, allowing parents to monitor progress
        conveniently.
      </Typography>

      {/* Tutor Hiring */}
      <Typography variant="h5" color="primary" sx={{ mt: 4, mb: 1 }}>
        🎓 Tutor Hiring & Career Opportunities
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Passionate educators are invited to join our growing team. Subjects
        currently hiring: English, Mathematics, Physics, Chemistry, Biology, and
        Computer Science. Contact us via WhatsApp or email to start your
        teaching journey.
      </Typography>

      {/* Why Choose Us */}
      <Typography variant="h5" color="primary" sx={{ mt: 4, mb: 1 }}>
        ✨ Why Students & Parents Choose A Plus Home Tutors
      </Typography>
      <List dense>
        {[
          "Experienced Educators: 15–25 years of proven experience.",
          "Concept-Based Teaching: Focus on clarity and problem-solving.",
          "Personalized Attention: One-on-one support at every pace.",
          "Online & In-Home Options: Learn conveniently anywhere.",
          "Affordable Fees: Transparent and family-friendly packages.",
          "Continuous Feedback: Regular progress updates for parents.",
          "Special Offers: Limited-time discounts like 25% OFF on new enrollments.",
        ].map((item, i) => (
          <ListItem key={i} disablePadding>
            <ListItemText primary={`• ${item}`} />
          </ListItem>
        ))}
      </List>

      {/* Locations */}
      <Typography variant="h5" color="primary" sx={{ mt: 4, mb: 1 }}>
        📍 Locations We Serve
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Lahore (Headquarters), Karachi, Islamabad, Rawalpindi, Faisalabad, and
        all cities through online sessions.
      </Typography>

      {/* Contact */}
      <Typography variant="h5" color="primary" sx={{ mt: 4, mb: 1 }}>
        📞 Contact Us
      </Typography>
      <Box sx={{ lineHeight: 1.8 }}>
        <Typography variant="body1">
          <strong>Call or WhatsApp:</strong> 0306-6762289 | 0306-5555415
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> aplushometutors.pk@gmail.com
        </Typography>
        <Typography variant="body1">
          <strong>Facebook:</strong> facebook.com/aplusacademypk
        </Typography>
        <Typography variant="body1">
          <strong>Location:</strong> Lahore, Punjab — Offering home and online
          tutoring across Pakistan.
        </Typography>
      </Box>

      <Divider sx={{ mt: 5, mb: 2 }} />
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 2 }}
      >
        © {new Date().getFullYear()} A Plus Home Tutors — Empowering Students
        Nationwide.
      </Typography>
    </Container>
  );
};

export default AboutUs;
