import React from "react";
import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

const cardsData = [
  {
    title: "Trusted and verified tutors",
    description:
      "Families can search for tutors with stronger subject matching, clearer academic screening, and more confidence in who is coming to teach.",
    icon: "/icons/verified.svg",
    href: "/teachers",
  },
  {
    title: "Guidance before you confirm",
    description:
      "Use trial classes, learning goals, and teaching plans to judge whether the tutor fits the child's pace, board, and weak areas.",
    icon: "/icons/trial.svg",
    href: "/teachers",
  },
  {
    title: "Class-wise academic support",
    description:
      "Support now covers school classes, O and A Level, exam preparation, career roadmaps, PTE practice, and future planning guidance.",
    icon: "/icons/subjects.svg",
    href: "/teachers",
  },
  {
    title: "Friendly support for parents",
    description:
      "Parents can get clearer help on syllabus coverage, exam readiness, tutor communication, and choosing between home and online classes.",
    icon: "/icons/affordable.svg",
    href: "/teachers",
  },
  {
    title: "Better study planning",
    description:
      "Use tutoring alongside revision blocks, digital tools, and structured routines so students build stronger long-term learning habits.",
    icon: "/icons/plans.svg",
    href: "/teachers",
  },
  {
    title: "Modern learning direction",
    description:
      "Students can move from school support into career roadmaps, AI-aware study habits, and higher-level preparation without leaving the platform.",
    icon: "/icons/safe.svg",
    href: "/career-roadmap",
  },
];

const containerVariants = {
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function AdvantagesSection() {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#f0f4f8" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 1.5,
          textAlign: "center",
          color: "#004aad",
          fontWeight: 700,
          fontSize: {
            xs: "1.5rem",
            sm: "1.8rem",
            md: "2rem",
            lg: "2.2rem",
          },
        }}
      >
        Why Families Use A Plus Academy
      </Typography>

      <Typography
        sx={{
          maxWidth: 900,
          mx: "auto",
          mb: 5,
          textAlign: "center",
          color: "#445",
          lineHeight: 1.8,
        }}
      >
        The homepage should immediately explain why the platform is useful, what type of support it offers, and how
        parents or students can move from search to action.
      </Typography>

      <motion.div
        initial={isMobile ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={isMobile ? {} : containerVariants}
      >
        <Grid
          container
          spacing={3}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            },
          }}
        >
          {cardsData.map((card) => {
            const MotionWrapper = isMobile ? "div" : motion.div;

            return (
              <MotionWrapper key={card.title} variants={isMobile ? {} : cardVariants} style={{ width: "100%", height: "100%" }}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "22px",
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    minHeight: { xs: 280, sm: 320, md: 340 },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      padding: "2px",
                      borderRadius: "22px",
                      background: "linear-gradient(120deg, #00a6ff, #00ff8f, #00a6ff)",
                      backgroundSize: "200% 200%",
                      animation: "gradientMove 4s linear infinite",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      zIndex: 1,
                    },
                    "@keyframes gradientMove": {
                      "0%": { backgroundPosition: "0% 50%" },
                      "50%": { backgroundPosition: "100% 50%" },
                      "100%": { backgroundPosition: "0% 50%" },
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 2,
                      p: 4,
                      borderRadius: "20px",
                      background: "rgba(255, 255, 255, 0.25)",
                      backdropFilter: "blur(15px)",
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                      transition: "transform 0.4s ease, box-shadow 0.4s ease",
                      minHeight: { xs: 280, sm: 320, md: 340 },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:hover": {
                        transform: isMobile ? "none" : "translateY(-10px)",
                        boxShadow: isMobile
                          ? "0 12px 32px rgba(0,0,0,0.15)"
                          : "0 25px 70px rgba(0,0,0,0.30)",
                      },
                    }}
                  >
                    <Box sx={{ maxWidth: "280px", pr: 6 }}>
                      <Typography
                        component={RouterLink}
                        to={card.href}
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          display: "inline-block",
                          mb: 1,
                          color: "#29b554",
                          textDecoration: "none",
                          "&:hover": { color: "#004aad" },
                        }}
                      >
                        {card.title}
                      </Typography>

                      <Typography sx={{ fontSize: "0.95rem", color: "#333", lineHeight: 1.8 }}>
                        {card.description}
                      </Typography>
                    </Box>

                    <Box
                      component="img"
                      src={card.icon}
                      alt={card.title}
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        width: { xs: 42, sm: 52, md: 64, lg: 70 },
                        height: "auto",
                        transform: "rotate(-15deg)",
                        filter: "drop-shadow(0px 6px 20px rgba(0,0,0,0.25))",
                        transition: "all 0.35s ease",
                        "&:hover": {
                          transform: isMobile ? "rotate(-15deg)" : "rotate(-10deg) scale(1.15)",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </MotionWrapper>
            );
          })}
        </Grid>
      </motion.div>
    </Box>
  );
}
