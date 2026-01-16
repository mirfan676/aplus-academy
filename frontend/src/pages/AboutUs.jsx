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
  Button,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useSEO from "../hooks/useSEO";

const AboutUs = () => {
  useSEO({
    title: "About A Plus Home Tutors — Trusted Online & Home Tuition in Pakistan",
    description:
      "Learn about A Plus Home Tutors, Pakistan’s trusted platform for home and online tutoring. Discover our mission, vision, and expert tutoring services.",
    canonical: "https://www.aplusacademy.pk/about",
    ogImage: "https://www.aplusacademy.pk/aplus-logo.png",
    ogUrl: "https://www.aplusacademy.pk/about",
  });

  return (
    <Container sx={{ py: 6 }}>
      {/* H1 */}
      <Typography
        component="h1"
        variant="h4"
        color="primary"
        fontWeight="bold"
        gutterBottom
      >
        About A Plus Home Tutors
      </Typography>

      {/* Intro */}
      <Typography component="p" variant="body1" sx={{ mb: 3 }}>
        Education is not just about passing exams — it’s about building
        confidence, mastering concepts, and shaping brighter futures. At{" "}
        <strong>A Plus Home Tutors</strong>, we connect students across Pakistan
        with experienced and verified tutors for home and online learning.
      </Typography>

      {/* Quick navigation (FIXES DEAD-END PAGE) */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button component={RouterLink} to="/register" variant="outlined">
          Register With Us
        </Button>
        <Button component={RouterLink} to="/teachers" variant="outlined">
          Find Tutors
        </Button>
        <Button component={RouterLink} to="/jobs" variant="outlined">
          Latest Jobs
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Mission */}
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
        Our Mission
      </Typography>
      <Typography component="p" variant="body1" sx={{ mb: 3 }}>
        Our mission is to make quality education accessible, personalized, and
        effective. Through one-on-one tutoring, we help students improve grades,
        strengthen concepts, and gain confidence.
      </Typography>

      {/* Vision */}
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
        Our Vision
      </Typography>
      <List dense>
        {[
          "Provide experienced and qualified tutors across Pakistan.",
          "Offer both home tuition and online classes for flexibility.",
          "Focus on concept-based learning and long-term success.",
          "Use technology to deliver safe and effective online education.",
        ].map((item, i) => (
          <ListItem key={i} disablePadding>
            <ListItemText primary={`• ${item}`} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 4 }} />

      {/* Services */}
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
        Our Services
      </Typography>

      <Typography component="h3" variant="h6" sx={{ mt: 2 }}>
        O & A Level Home and Online Tuition
      </Typography>
      <Typography component="p" variant="body1" sx={{ mb: 2 }}>
        We provide expert tutoring for Cambridge O & A Levels including
        Mathematics, Physics, Chemistry, Biology, English, Economics, Business,
        and Computer Science.
      </Typography>

      <Typography component="h3" variant="h6" sx={{ mt: 2 }}>
        Quran & Islamic Studies
      </Typography>
      <Typography component="p" variant="body1" sx={{ mb: 2 }}>
        Our Quran classes include Tajweed, daily duas, prayer guidance, and moral
        training — available online or at home.
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Contact */}
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
        Contact A Plus Home Tutors
      </Typography>
      <Box sx={{ lineHeight: 1.8 }}>
        <Typography component="p">
          <strong>Call / WhatsApp:</strong> 0306-6762289 | 0306-5555415
        </Typography>
        <Typography component="p">
          <strong>Email:</strong> aplushometutorspk@gmail.com
        </Typography>
        <Typography component="p">
          <strong>Location:</strong> Lahore, Punjab — Serving students across
          Pakistan
        </Typography>
      </Box>

      {/* CTA */}
      <Box sx={{ mt: 4 }}>
        <Button
          component={RouterLink}
          to="/teachers"
          variant="contained"
          size="large"
        >
          Find a Tutor Now
        </Button>
      </Box>
    </Container>
  );
};

export default AboutUs;
