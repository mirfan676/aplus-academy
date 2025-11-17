import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SchoolIcon from "@mui/icons-material/School";
import CheckIcon from "@mui/icons-material/Check";

const steps = [
  { icon: <PersonSearchIcon sx={{ fontSize: 42 }} />, text: "Find the required Tutor" },
  { icon: <SchoolIcon sx={{ fontSize: 42 }} />, text: "We Match the Best Tutor" },
  { icon: <CheckIcon sx={{ fontSize: 42 }} />, text: "Start Free Trial Class" },
];

const StepsSection = () => {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#f0f4f8" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 6,
          textAlign: "center",
          color: "#004aad",
          fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem", lg: "2.2rem" },
        }}
      >
        How It Works
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 6, sm: 4, md: 5 },
          position: "relative",
        }}
      >
        {steps.map((step, i) => (
          <motion.div key={i} whileHover={{ y: -10 }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: "22px",
                overflow: "hidden",
                width: { xs: "300px", sm: "280px", md: "350px" },
                minHeight: 150,
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
                  minHeight: 150,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 25px 70px rgba(0,0,0,0.3)",
                  },
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
                  "&:hover::after": { left: "150%" },
                }}
              >
                {/* Step Number */}
                <Typography variant="h6" fontWeight={700} sx={{ color: "#29b554", mb: 1 }}>
                  Step {i + 1}
                </Typography>

                {/* Step Text */}
                <Typography sx={{ fontSize: "1rem", color: "#333", fontWeight: 500, mb: i === 0 ? 2 : 0 }}>
                  {step.text}
                </Typography>

                {/* Button only in first step */}
                {i === 0 && (
                   <Button
                      component={Link}
                      to="/teachers"
                      variant="contained"
                      size="medium"
                      sx={{
                        mt: 2,
                        px: 4, // smaller padding for compact design
                        py: 1, 
                        borderRadius: "12px",
                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                        width: { xs: "70%", sm: "70%" , md: "70%"},
                        color: "#29b554",
                        background: "rgba(255, 255, 255, 0.2)", // glass effect
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(40, 200, 100, 0.4)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.35)",
                          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      Find Tutor
                    </Button>
                )}

                {/* Icon */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 16,
                    opacity: 0.85,
                    color: "#29b554",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.2) rotate(-10deg)" },
                  }}
                >
                  {step.icon}
                </Box>
              </Box>
            </Box>

            {/* Arrows */}
            {i !== steps.length - 1 && (
              <Box
                sx={{
                  display: { xs: "none", sm: "block" },
                  position: "absolute",
                  top: "50%",
                  right: "-38px",
                  transform: "translateY(-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "12px solid transparent",
                  borderBottom: "12px solid transparent",
                  borderLeft: "18px solid #00d9a5",
                }}
              />
            )}
            {i !== steps.length - 1 && (
              <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "center", mt: 1 }}>
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    borderLeft: "12px solid transparent",
                    borderRight: "12px solid transparent",
                    borderTop: "18px solid #00d9a5",
                  }}
                />
              </Box>
            )}
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default StepsSection;
