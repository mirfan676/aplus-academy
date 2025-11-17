import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Button,
} from "@mui/material";

import {
  Facebook,
  Instagram,
  YouTube,
  WhatsApp,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#1a1a1a", color: "#fff", pt: 8, pb: 4, px: { xs: 3, md: 6 } }}>
      <Grid container spacing={6}>

        {/* LOGO + DESCRIPTION */}
        <Grid item xs={6} md={2}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <img
              src="logo-footer.svg"
              alt="APlus Home Tutors"
              style={{ height: "150px", marginRight: "10px" }}
            />
          </Box>

          <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
            A Plus Home Tutors is Pakistan’s most trusted home and online tutoring
            network — connecting students with expert educators nationwide.
            From O/A Levels to Qur’an with Tajweed, our mission is to create
            confident learners through personalized teaching, modern tools,
            and one-on-one guidance that transforms academic performance.
          </Typography>

        </Grid>

        {/* ACADEMY LINKS */}
        <Grid item xs={6} md={2}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Academy
          </Typography>

          {[
            "About Us",
            "Find a Tutor",
            "Become a Tutor",
            "Study Abroad",
            "Referral Program",
            "Career Opportunities",
            "Languages",
            "Buy Courses",
          ].map((item) => (
            <Link
              key={item}
              href="#"
              underline="none"
              sx={{
                display: "block",
                color: "white",
                opacity: 0.8,
                py: 0.5,
                "&:hover": { opacity: 1 },
              }}
            >
              {item}
            </Link>
          ))}
        </Grid>

        {/* CLASSES */}
        <Grid item xs={6} md={2}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Classes
          </Typography>

          {[
            "K-12",
            "O & A Level",
            "Bachelors / Masters",
            "Competitive Exams",
            "IT & Technology",
            "Programming",
            "Qur’an & Tajweed",
            "English Language",
            "IELTS",
            "Graphics & Multimedia",
          ].map((item) => (
            <Link
              key={item}
              href="#"
              underline="none"
              sx={{
                display: "block",
                color: "white",
                opacity: 0.8,
                py: 0.5,
                "&:hover": { opacity: 1 },
              }}
            >
              {item}
            </Link>
          ))}
        </Grid>

        {/* CONTACT & SOCIALS */}
        <Grid item xs={12} md={2}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Contact Us
          </Typography>

          <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
            Lahore • Karachi • Islamabad • Rawalpindi • Faisalabad  
            Online tutoring available across Pakistan.
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            📱 0306-6762289 | 0306-5555415  
            📧 aplushometutors.pk@gmail.com
          </Typography>

          {/* SOCIAL ICONS */}
          <Box sx={{ mt: 2 }}>
            {[
              { icon: <Facebook />, link: "#" },
              { icon: <Instagram />, link: "#" },
              { icon: <Twitter />, link: "#" },
              { icon: <LinkedIn />, link: "#" },
              { icon: <YouTube />, link: "#" },
              {
                icon: <WhatsApp />,
                link: "https://wa.me/923066762289",
              },
            ].map((s, idx) => (
              <IconButton
                key={idx}
                href={s.link}
                sx={{
                  color: "#fff",
                  mx: 0.3,
                  "&:hover": { color: "#25D366" },
                }}
              >
                {s.icon}
              </IconButton>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* DIVIDER */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 4 }} />

      {/* BOTTOM BAR */}
      <Box sx={{ textAlign: "center", opacity: 0.7 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} APlus Home Tutors — All Rights Reserved
        </Typography>
        <Typography variant="caption">
          Empowering students across Pakistan — From Basic to Brilliance.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
