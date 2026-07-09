import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
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
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#1f2327" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", lg: "flex-end" },
          gap: 2.5,
          pb: { xs: 3, md: 4 },
          mb: 4,
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Box sx={{ maxWidth: 840 }}>
          <Typography sx={{ color: "#29b554", fontWeight: 900, mb: 1 }}>
            Trusted family support
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: 800,
              fontSize: {
                xs: "1.7rem",
                md: "3rem",
              },
              lineHeight: 1.05,
            }}
          >
            Why families use A Plus Academy
          </Typography>
        </Box>

        <Typography
          sx={{
            maxWidth: 520,
            color: "rgba(255,255,255,0.74)",
            lineHeight: 1.8,
            fontSize: { xs: "0.95rem", md: "1rem" },
          }}
        >
          Families should quickly understand what support is available, how tutor matching works, and what makes the
          platform more dependable than random listings.
        </Typography>
      </Box>

      <motion.div
        initial={isMobile ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={isMobile ? {} : containerVariants}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(3, minmax(0, 1fr))",
            },
            gap: 3,
            gridAutoRows: "1fr",
            alignItems: "stretch",
          }}
        >
          {cardsData.map((card) => {
            const MotionWrapper = isMobile ? "div" : motion.div;

            return (
              <MotionWrapper key={card.title} variants={isMobile ? {} : cardVariants} style={{ width: "100%", height: "100%" }}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "18px",
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    minHeight: { xs: 220, sm: 220, md: 230 },
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "#111514",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 3, md: 3.5 },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      gap: 2.25,
                    }}
                  >
                    <Box>
                      <Typography
                        component={RouterLink}
                        to={card.href}
                        variant="h6"
                        fontWeight={800}
                        sx={{
                          display: "inline-block",
                          mb: 1.1,
                          color: "#6ee7b7",
                          textDecoration: "none",
                          lineHeight: 1.35,
                          "&:hover": { color: "#fff" },
                        }}
                      >
                        {card.title}
                      </Typography>

                      <Typography sx={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.74)", lineHeight: 1.8 }}>
                        {card.description}
                      </Typography>
                    </Box>

                    <Box sx={{ pt: 1, mt: "auto", display: "flex", justifyContent: "flex-end" }}>
                      <Box
                        component="img"
                        src={card.icon}
                        alt={card.title}
                        sx={{
                          width: { xs: 42, sm: 48, md: 54 },
                          height: "auto",
                          opacity: 0.92,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </MotionWrapper>
            );
          })}
        </Box>
      </motion.div>
    </Box>
  );
}
