import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LahoreIcon from "../icons/LahoreIcon";
import KarachiIcon from "../icons/KarachiIcon";
import IslamabadIcon from "../icons/IslamabadIcon";
import RawalpindiIcon from "../icons/RawalpindiIcon";
import FaisalabadIcon from "../icons/FaisalabadIcon";
import MultanIcon from "../icons/MultanIcon";
import PeshawarIcon from "../icons/PeshawarIcon";
import QuettaIcon from "../icons/QuettaIcon";

const areas = [
  {
    name: "Lahore",
    coverage: "Johar Town, DHA, Gulberg, Model Town, Wapda Town, Bahria Town, and nearby areas where subject demand is strongest.",
    description:
      "Families in Lahore usually request home tutors for school classes, board exam subjects, O Level, A Level, Quran, IELTS, English, and university support.",
    icon: <LahoreIcon size={64} />,
  },
  {
    name: "Karachi",
    coverage: "Gulshan, North Nazimabad, Clifton, DHA, PECHS, and surrounding areas depending on timing and tutor route feasibility.",
    description:
      "Karachi needs flexible matching because travel distance matters. Online and in-home support can both be arranged based on the subject and area.",
    icon: <KarachiIcon size={64} />,
  },
  {
    name: "Islamabad",
    coverage: "Sectors, nearby societies, and family-preferred localities where cleaner scheduling and subject-based matching are important.",
    description:
      "Islamabad families often look for dependable tutors for school support, concept clarity, test preparation, and long-term study planning.",
    icon: <IslamabadIcon size={64} />,
  },
  {
    name: "Rawalpindi",
    coverage: "Satellite Town, Chaklala, Bahria Town, DHA, and connected residential areas where home and online tuition requests overlap.",
    description:
      "Rawalpindi students commonly need Matric, FSc, English, Maths, Science, and language support with practical timing options.",
    icon: <RawalpindiIcon size={64} />,
  },
  {
    name: "Faisalabad",
    coverage: "Main residential and education-focused areas where parents prefer steady local tutors or online specialists when needed.",
    description:
      "Support is often requested for school subjects, board preparation, concept revision, and regular homework follow-up.",
    icon: <FaisalabadIcon size={64} />,
  },
  {
    name: "Multan",
    coverage: "Key city areas and nearby neighborhoods where students need support from primary classes up to higher studies.",
    description:
      "Multan families often ask for disciplined tutors who can maintain weekly progress, not just complete classwork.",
    icon: <MultanIcon size={64} />,
  },
  {
    name: "Peshawar",
    coverage: "Urban localities and online coverage for families who want qualified academic or Quran tutors with clearer availability checks.",
    description:
      "Peshawar demand often includes school subjects, Quran education, English improvement, and exam-focused guidance.",
    icon: <PeshawarIcon size={64} />,
  },
  {
    name: "Quetta",
    coverage: "Selective local coverage plus online tutoring routes for students who need dependable support where local supply may vary.",
    description:
      "Quetta families can still use the platform for subject matching, online tuition, and academic planning guidance.",
    icon: <QuettaIcon size={64} />,
  },
];

const AreasWeCover = () => {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#fafafa" }}>
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
        Cities and Areas Where We Help Students Find Tutors
      </Typography>

      <Typography
        sx={{
          maxWidth: 920,
          mx: "auto",
          mb: 5,
          textAlign: "center",
          color: "#445",
          lineHeight: 1.8,
          fontSize: { xs: "0.95rem", md: "1rem" },
        }}
      >
        Tutor availability depends on the subject, class level, preferred timing, and area. In major cities, A Plus
        Academy can often match both home tutors and online tutors depending on travel and specialist demand.
      </Typography>

      <Grid container spacing={3}>
        {areas.map((area) => (
          <Grid item xs={12} sm={6} md={6} key={area.name} sx={{ display: "flex" }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: "22px",
                overflow: "hidden",
                width: "100%",
                minHeight: 260,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  padding: "1px",
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
                  p: 3,
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(15px)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  minHeight: 260,
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 25px 70px rgba(0,0,0,0.30)",
                  },
                }}
              >
                <Box sx={{ maxWidth: { xs: "100%", md: "80%" }, pr: 5 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: "#29b554" }}>
                    {area.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem", color: "#004aad", lineHeight: 1.75, fontWeight: 700, mb: 1 }}>
                    {area.coverage}
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem", color: "#333", lineHeight: 1.8 }}>
                    {area.description}
                  </Typography>
                </Box>

                <Button
                  component={RouterLink}
                  to={`/teachers?city=${encodeURIComponent(area.name)}`}
                  variant="contained"
                  sx={{
                    mt: 2,
                    alignSelf: "flex-start",
                    textTransform: "none",
                    fontWeight: 800,
                    borderRadius: "10px",
                    background: "#29b554",
                    "&:hover": { background: "#22a049" },
                  }}
                >
                  Find Tutors in {area.name}
                </Button>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    width: { xs: 40, sm: 50, md: 60, lg: 70 },
                    height: "auto",
                    transform: "rotate(-15deg)",
                    filter: "drop-shadow(0px 6px 20px rgba(0,0,0,0.25))",
                    transition: "all 0.35s ease",
                    "&:hover": { transform: "rotate(-10deg) scale(1.15)" },
                  }}
                >
                  {area.icon}
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AreasWeCover;
