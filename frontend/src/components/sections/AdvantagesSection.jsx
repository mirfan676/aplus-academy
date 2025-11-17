import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";

const cardsData = [
  {
    title: "Verified & Qualified Tutors",
    description:
      "Every tutor goes through a strict verification process, academic screening, and background check. Only experienced, subject-specialist teachers are selected to ensure your child receives safe, reliable, and high-quality home tutoring.",
    icon: "/icons/verified.svg",
  },
  {
    title: "2 Days Free Trial",
    description:
      "Experience our teaching quality with a completely free 2-day trial. No payments, no commitments—just pure learning so you can confidently decide if our tutors are the right fit for your child.",
    icon: "/icons/trial.svg",
  },
  {
    title: "All Subjects & Classes",
    description:
      "Whether your child needs help in Math, English, Science, Islamiat, or O/A Levels, we provide expert tutors for every subject and grade. One platform for all academic support needs.",
    icon: "/icons/subjects.svg",
  },
  {
    title: "Affordable Monthly Fee",
    description:
      "Get premium-quality home tutoring with budget-friendly monthly packages. No hidden charges, no long-term commitments—just transparent pricing designed to support every family without compromising on educational excellence.",
    icon: "/icons/affordable.svg",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25, // Delay between each card
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const AdvantagesSection = () => {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#f0f4f8" }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 6, textAlign: "center", color: "#004aad" }}
      >
        Why Parents Trust APlus Home Tutors
      </Typography>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <Grid
          container
          spacing={4}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",        // Mobile: 1 card
              sm: "1fr 1fr",    // Tablet: 2 cards
              lg: "1fr 1fr 1fr",// Desktop: 3 cards
            },
          }}
        >
          {cardsData.map((card, index) => (
            <motion.div key={index} variants={cardVariants} style={{ width: "100%" }}>
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

                      // ⭐ FIX HEIGHT CONSISTENCY
                      minHeight: { xs: 260, sm: 320, md: 360 },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",

                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 25px 70px rgba(0,0,0,0.30)",
                      },
                    }}
                  >
                  {/* Glass shine effect */}
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

                  {/* Fixed text width */}
                  <Box sx={{ maxWidth: "260px" }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                      {card.title}
                    </Typography>

                    <Typography sx={{ fontSize: "0.95rem", color: "#333" }}>
                      {card.description}
                    </Typography>
                  </Box>

                  {/* Dynamic icon */}
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
                        transform: "rotate(-10deg) scale(1.15)",
                      },
                    }}
                  />
                </Box>
              </Box>
            </motion.div>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default AdvantagesSection;
