import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LahoreIcon from "../icons/LahoreIcon";
import KarachiIcon from "../icons/KarachiIcon";
import IslamabadIcon from "../icons/IslamabadIcon";
import RawalpindiIcon from "../icons/RawalpindiIcon";

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
];

const AreasWeCover = () => {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#2a2f33" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", lg: "flex-end" },
          gap: 2,
          pb: { xs: 3, md: 4 },
          mb: 4,
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Box sx={{ maxWidth: 860 }}>
          <Typography sx={{ color: "#29b554", fontWeight: 900, mb: 1 }}>
            Where we help families
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: "#fff",
              fontSize: { xs: "1.75rem", md: "3rem" },
              lineHeight: 1.05,
            }}
          >
            Cities and areas where students most often request tutors
          </Typography>
          <Typography
            sx={{
              mt: 1.2,
              maxWidth: 920,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.8,
              fontSize: { xs: "0.95rem", md: "1rem" },
            }}
          >
            Tutor availability depends on the subject, class level, preferred timing, and location. These are the main
            cities where families most often request support, while online tutoring remains available across Pakistan.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/teachers"
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: "999px",
            px: 2.6,
            py: 1,
            borderColor: "rgba(255,255,255,0.35)",
            color: "#fff",
            "&:hover": {
              borderColor: "#29b554",
              background: "rgba(41,181,84,0.12)",
            },
          }}
        >
          See all locations
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "repeat(2, minmax(0, 1fr))" },
          gap: 3,
          gridAutoRows: "1fr",
        }}
      >
        {areas.map((area) => (
          <Box key={area.name} sx={{ display: "flex" }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: "18px",
                width: "100%",
                minHeight: 320,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#111514",
                boxShadow: "0 12px 28px rgba(16,32,25,0.08)",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  minHeight: 320,
                }}
              >
                <Box sx={{ maxWidth: { xs: "100%", md: "84%" }, pr: 6 }}>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1, color: "#fff" }}>
                    {area.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem", color: "#6ee7b7", lineHeight: 1.75, fontWeight: 700, mb: 1 }}>
                    {area.coverage}
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.74)", lineHeight: 1.8 }}>
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
                    top: 22,
                    right: 22,
                    width: { xs: 40, sm: 48, md: 56 },
                    height: "auto",
                    opacity: 0.92,
                  }}
                >
                  {area.icon}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AreasWeCover;
