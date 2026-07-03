import { Box, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SchoolIcon from "@mui/icons-material/School";
import CheckIcon from "@mui/icons-material/Check";

const steps = [
  {
    icon: <PersonSearchIcon sx={{ fontSize: 42 }} />,
    title: "Tell us what kind of tutor you need",
    text:
      "Share the student's class, subject, city, area, timing, school board, and whether you want home tuition, online classes, or a female tutor preference.",
    detail:
      "This helps A Plus Academy avoid random matching and focus on the student's actual syllabus, exam pressure, weak concepts, and learning routine.",
    button: { label: "Find Tutor", to: "/teachers" },
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 42 }} />,
    title: "We shortlist suitable tutors",
    text:
      "The platform compares subject fit, teaching experience, class level, communication style, and location so parents do not have to search blindly.",
    detail:
      "This is especially useful for Matric, FSc, O Level, A Level, Quran, IELTS, English language, and university-level support where tutor quality matters more than just availability.",
  },
  {
    icon: <CheckIcon sx={{ fontSize: 42 }} />,
    title: "Start with trial, then review progress",
    text:
      "Families can evaluate punctuality, concept clarity, student comfort, homework follow-up, and whether the tutor understands the required syllabus.",
    detail:
      "Once classes begin, the goal is not only coverage of books but also confidence building, revision planning, test preparation, and long-term academic consistency.",
  },
];

const StepsSection = () => {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#f0f4f8" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 1.5,
          textAlign: "center",
          color: "#004aad",
          fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem", lg: "2.2rem" },
        }}
      >
        How A Plus Academy Works
      </Typography>

      <Typography
        sx={{
          maxWidth: 900,
          mx: "auto",
          mb: 5,
          textAlign: "center",
          color: "#445",
          lineHeight: 1.8,
          fontSize: { xs: "0.95rem", md: "1rem" },
        }}
      >
        A strong tutor match starts with accurate student needs, a relevant shortlist, and clear progress expectations.
        This process helps parents find better support for school classes, board exams, Quran learning, language
        development, and future academic planning.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "stretch",
          gap: { xs: 4, sm: 3, md: 4 },
          position: "relative",
        }}
      >
        {steps.map((step, i) => (
          <motion.div key={step.title} whileHover={{ y: -10 }} style={{ width: "100%" }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: "22px",
                overflow: "hidden",
                width: "100%",
                maxWidth: { xs: 360, sm: 310, md: 380 },
                minHeight: 290,
                mx: "auto",
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
                  p: 3,
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(15px)",
                  borderRadius: "20px",
                  position: "relative",
                  zIndex: 2,
                  minHeight: 290,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 25px 70px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <Stack spacing={1.3}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#29b554" }}>
                    Step {i + 1}
                  </Typography>
                  <Typography sx={{ fontSize: "1.05rem", color: "#004aad", fontWeight: 700, pr: 6 }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ color: "#333", lineHeight: 1.8 }}>
                    {step.text}
                  </Typography>
                  <Typography sx={{ color: "#556", lineHeight: 1.75, fontSize: "0.95rem" }}>
                    {step.detail}
                  </Typography>
                </Stack>

                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  {step.button && (
                    <Button
                      component={Link}
                      to={step.button.to}
                      variant="contained"
                      size="medium"
                      sx={{
                        alignSelf: "flex-start",
                        px: 4.5,
                        py: 1.35,
                        borderRadius: "10px",
                        fontSize: { xs: "0.95rem", sm: "1rem", md: "1.02rem" },
                        background: "#29b554",
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          background: "#22a049",
                        },
                      }}
                    >
                      {step.button.label}
                    </Button>
                  )}
                </Stack>

                <Box
                  sx={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    opacity: 0.9,
                    color: "#29b554",
                  }}
                >
                  {step.icon}
                </Box>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default StepsSection;
