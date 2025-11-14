// src/pages/AboutUs.jsx
import React from "react";
import { Container, Typography, Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import useSEO from "../hooks/useSEO";

const AboutUs = () => {
  useSEO({
    title: "About A Plus Home Tutors — Trusted Online & Home Tuition in Pakistan",
    description: "Learn about A Plus Home Tutors, Pakistan’s premier platform connecting students with qualified home and online tutors for O/A Levels, Matric, and Quran. Discover our mission, vision, and expert services.",
    canonical: "https://www.aplusacademy.pk/about",
    ogImage: "https://www.aplusacademy.pk/aplus-logo.png",
    ogUrl: "https://www.aplusacademy.pk/about",
  });

  return (
    <Container sx={{ py: 6 }}>
      {/* Heading */}
      <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
        Welcome to A Plus Home Tutors
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Education is not just about passing exams — it’s about building confidence, mastering concepts, and shaping brighter futures. At <strong>A Plus Home Tutors</strong>, we are on a mission to make high-quality, personalized learning accessible to every student in Pakistan.
      </Typography>

      {/* Mission */}
      <Typography variant="h5" color="primary" sx={{ mt: 4, mb: 1 }}>
        🎯 Our Mission: Shaping Brighter Futures
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Our mission is simple yet powerful — to make learning accessible, effective, and personalized. Our experienced tutors provide one-on-one attention to help students improve grades and build lifelong learning habits.
      </Typography>

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
        We specialize in Cambridge O & A Level subjects taught by tutors with proven success. Subjects include Mathematics, Physics, Chemistry, Biology, English, Economics, Business, Computer Science, Urdu, Sociology, and more.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        📖 Online & In-Home Qur’an Classes
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Our Qur’an courses include Tajweed, daily duas, prayer guidance, character building, and moral training. Classes are flexible, conducted via Zoom, Skype, or in-person.
      </Typography>

      {/* Contact */}
      <Typography variant="h5" color="primary" sx={{ mt: 4, mb: 1 }}>
        📞 Contact Us
      </Typography>
      <Box sx={{ lineHeight: 1.8 }}>
        <Typography variant="body1"><strong>Call or WhatsApp:</strong> 0306-6762289 | 0306-5555415</Typography>
        <Typography variant="body1"><strong>Email:</strong> aplushometutorspk@gmail.com</Typography>
        <Typography variant="body1"><strong>Location:</strong> Lahore, Punjab — Offering home and online tutoring across Pakistan.</Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
