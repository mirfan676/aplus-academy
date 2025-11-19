import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
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
    <Box
      sx={{
        bgcolor: "#0a0a0a",
        color: "#fff",
        pt: 10,
        pb: 6,
        px: { xs: 3, md: 6 },
      }}
    >
      <Grid container spacing={6} justifyContent="center">
        {/* LOGO + DESCRIPTION */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <img
              src="logo-footer.svg"
              alt="APlus Home Tutors"
              style={{ height: "120px", marginRight: "10px" }}
            />
          </Box>
          <Box
            sx={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              p: 3,
              borderRadius: "20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            }}
          >
            <Typography variant="body1" sx={{ opacity: 0.85, lineHeight: 1.7 }}>
              A Plus Home Tutors is Pakistan’s most trusted home and online tutoring
              network — connecting students with expert educators nationwide. From
              O/A Levels to Qur’an with Tajweed, our mission is to create confident
              learners through personalized teaching, modern tools, and one-on-one
              guidance that transforms academic performance.
            </Typography>
          </Box>
        </Grid>

        {/* ACADEMY LINKS */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: "linear-gradient(135deg, #00a6ff, #00ff8f)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
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
                color: "#fff",
                opacity: 0.8,
                py: 0.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  opacity: 1,
                  color: "#00ff8f",
                  transform: "translateX(3px)",
                },
              }}
            >
              {item}
            </Link>
          ))}
        </Grid>

        {/* CLASSES */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: "linear-gradient(135deg, #00a6ff, #00ff8f)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
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
                color: "#fff",
                opacity: 0.8,
                py: 0.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  opacity: 1,
                  color: "#00ff8f",
                  transform: "translateX(3px)",
                },
              }}
            >
              {item}
            </Link>
          ))}
        </Grid>

        {/* CONTACT & SOCIALS */}
        <Grid item xs={12} md={3}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: "linear-gradient(135deg, #00a6ff, #00ff8f)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Contact Us
          </Typography>

          <Box
            sx={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              p: 3,
              borderRadius: "20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            }}
          >
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.85 }}>
              Lahore • Karachi • Islamabad • Rawalpindi • Faisalabad  
              Online tutoring available across Pakistan.
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              📱 0306-6762289 | 0306-5555415  
              <br />
              📧 aplushometutors.pk@gmail.com
            </Typography>

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
                    mx: 0.5,
                    transition: "all 0.3s ease",
                    "&:hover": { color: "#00ff8f", transform: "scale(1.2)" },
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
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
