import React from "react";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

const cardsData = [
  {
    title: "Verified & Qualified Tutors",
    description:
      "Every tutor goes through a strict verification process, academic screening, and background check. Only experienced teachers are selected.",
    icon: "/icons/verified.svg",
  },
  {
    title: "2 Days Free Trial",
    description:
      "Experience teaching quality with a completely free 2-day trial. No payments, no commitments — just learning.",
    icon: "/icons/trial.svg",
  },
  {
    title: "All Subjects & Classes",
    description:
      "Math, English, Science, Islamiat, O/A Levels & more — expert tutors for every class and subject.",
    icon: "/icons/subjects.svg",
  },
  {
    title: "Affordable Monthly Fee",
    description:
      "Premium-quality tutoring with budget-friendly monthly packages. Transparent pricing with no hidden charges.",
    icon: "/icons/affordable.svg",
  },
  {
    title: "Personalised Study Plans",
    description:
      "Customized study plans based on your child's strengths, weaknesses & goals for faster improvement.",
    icon: "/icons/plans.svg",
  },
  {
    title: "Safe & Reliable Home Tutoring",
    description:
      "Background-checked tutors, verified identities, and safe home/online learning trusted by parents nationwide.",
    icon: "/icons/safe.svg",
  },
];

// Animation variants
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

const AdvantagesSection = () => {
  // ❗ Disable animation if screen < 900px (xs + sm)
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#f0f4f8" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 6,
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
        Why Parents Trust APlus Home Tutors
      </Typography>

      {/* ❗ If mobile → no motion wrapper, static grid */}
      <motion.div
        initial={isMobile ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={isMobile ? {} : containerVariants}
      >
        <Grid
          container
          spacing={4}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            },
          }}
        >
          {cardsData.map((card, index) => {
            const MotionWrapper = isMobile ? "div" : motion.div;

            return (
              <MotionWrapper
                key={index}
                variants={isMobile ? {} : cardVariants}
                style={{ width: "100%" }}
              >
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "22px",
                    overflow: "hidden",
                    width: "100%",
                    minHeight: { xs: 260, sm: 300, md: 330 },

                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      padding: "2px",
                      borderRadius: "22px",
                      background:
                        "linear-gradient(120deg, #00a6ff, #00ff8f, #00a6ff)",
                      backgroundSize: "200% 200%",
                      animation: "gradientMove 4s linear infinite",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
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

                      minHeight: { xs: 260, sm: 320, md: 360 },
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
                    {/* Shine effect — disabled on mobile */}
                    {!isMobile && (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          overflow: "hidden",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-100%",
                            width: "60%",
                            height: "100%",
                            background:
                              "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
                            transform: "skewX(-20deg)",
                            transition: "0.7s",
                          },
                          "&:hover::after": {
                            left: "150%",
                          },
                        }}
                      />
                    )}

                    {/* Text */}
                    <Box sx={{ maxWidth: "260px" }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 1, color: "#29b554" }}
                      >
                        {card.title}
                      </Typography>

                      <Typography sx={{ fontSize: "0.95rem", color: "#333" }}>
                        {card.description}
                      </Typography>
                    </Box>

                    {/* Icon */}
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
                        transform: isMobile
                          ? "rotate(-15deg)"
                          : "rotate(-15deg)",
                        filter: "drop-shadow(0px 6px 20px rgba(0,0,0,0.25))",
                        transition: "all 0.35s ease",
                        "&:hover": {
                          transform: isMobile
                            ? "rotate(-15deg)"
                            : "rotate(-10deg) scale(1.15)",
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
};

export default AdvantagesSection;
