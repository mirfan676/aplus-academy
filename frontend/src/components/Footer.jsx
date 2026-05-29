import React from "react";
import { Box, Grid, Typography, Link, IconButton, Divider } from "@mui/material";
import {
  Facebook,
  Instagram,
  YouTube,
  WhatsApp,
  Twitter,
  LinkedIn,
  Pinterest,
} from "@mui/icons-material";

const academyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Find a Tutor", href: "/teachers" },
  { label: "Become a Tutor", href: "/register" },
  { label: "Study Abroad", href: "/study-abroad" },
  { label: "Referral Program", href: "/referral-program" },
  { label: "Career Opportunities", href: "/career-opportunities" },
  { label: "Blog", href: "/blog" },
  { label: "Languages", href: "/languages" },
  { label: "Buy Courses", href: "/buy-courses" },
];

const classLinks = [
  { label: "K-12", href: "/k-12" },
  { label: "O & A Level", href: "/o-a-level" },
  { label: "Bachelors / Masters", href: "/bachelors-masters" },
  { label: "Competitive Exams", href: "/competitive-exams" },
  { label: "IT & Technology", href: "/it-technology" },
  { label: "Programming", href: "/programming" },
  { label: "Qur'an & Tajweed", href: "/quran-tajweed" },
  { label: "English Language", href: "/english-language" },
  { label: "IELTS", href: "/ielts" },
  { label: "Graphics & Multimedia", href: "/graphics-multimedia" },
];

const socialLinks = [
  { label: "Facebook", icon: <Facebook />, link: "https://www.facebook.com/aplushometutorspk" },
  { label: "Instagram", icon: <Instagram />, link: "https://www.instagram.com/aplushometutorspk" },
  { label: "X", icon: <Twitter />, link: "https://x.com/aplus_pk" },
  { label: "Pinterest", icon: <Pinterest />, link: "https://www.pinterest.com/aplushometutorspk/" },
  { label: "YouTube", icon: <YouTube />, link: "https://www.youtube.com/@aplushometutors" },
  { label: "WhatsApp", icon: <WhatsApp />, link: "https://wa.me/923066762289" },
  { label: "LinkedIn", icon: <LinkedIn />, link: "https://www.linkedin.com" },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0a0a0a",
        color: "#fff",
        pt: 10,
        pb: 6,
        px: { xs: 3, md: 6 },
      }}
    >
      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Box
              component="img"
              src="/logo-footer.svg"
              alt="A Plus Home Tutors"
              sx={{ height: 120, mr: 1 }}
            />
          </Box>

          <Box
            sx={{
              background: "rgba(255,255,255,0.05)",
              p: 3,
              borderRadius: 2,
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            }}
          >
            <Typography variant="body1" sx={{ opacity: 0.85, lineHeight: 1.7 }}>
              A Plus Home Tutors is Pakistan's trusted home and online tutoring
              network, connecting students with verified educators for O/A Levels,
              Quran with Tajweed, school subjects, and one-to-one academic support.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#29b554" }}>
            Academy
          </Typography>
          {academyLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              underline="none"
              sx={{
                display: "block",
                color: "#fff",
                opacity: 0.8,
                py: 0.5,
                transition: "all 0.2s ease",
                "&:hover": { opacity: 1, color: "#00ff8f", transform: "translateX(3px)" },
              }}
            >
              {item.label}
            </Link>
          ))}
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#29b554" }}>
            Classes
          </Typography>
          {classLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              underline="none"
              sx={{
                display: "block",
                color: "#fff",
                opacity: 0.8,
                py: 0.5,
                transition: "all 0.2s ease",
                "&:hover": { opacity: 1, color: "#00ff8f", transform: "translateX(3px)" },
              }}
            >
              {item.label}
            </Link>
          ))}
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#29b554" }}>
            Contact Us
          </Typography>

          <Box
            sx={{
              background: "rgba(255,255,255,0.05)",
              p: 3,
              borderRadius: 2,
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            }}
          >
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.85 }}>
              Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, and online
              tutoring across Pakistan.
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              0306-6762289 | 0306-5555415
              <br />
              aplushometutorspk@gmail.com
            </Typography>

            <Box sx={{ mt: 2 }}>
              {socialLinks.map((s) => (
                <IconButton
                  key={s.label}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  sx={{
                    color: "#fff",
                    mx: 0.5,
                    transition: "all 0.2s ease",
                    "&:hover": { color: "#00ff8f", transform: "scale(1.12)" },
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 4 }} />

      <Box sx={{ textAlign: "center", opacity: 0.7 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} A Plus Home Tutors - All rights reserved.
        </Typography>
        <Typography variant="caption">
          Empowering students across Pakistan, from basics to brilliance.
        </Typography>
      </Box>
    </Box>
  );
}
