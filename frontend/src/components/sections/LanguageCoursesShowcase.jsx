import React, { useMemo, useRef, useState } from "react";
import { Box, Button, Chip, Container, IconButton, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StarIcon from "@mui/icons-material/Star";
import { languageCourses } from "../../pages/courses/languageCoursesData";

const formatPrice = (value) => `Rs. ${value.toLocaleString("en-PK")}`;
const getFlagUrl = (flagCode) => `https://flagcdn.com/w160/${flagCode}.png`;

const categoryGroups = [
  { key: "all", label: "All Courses", filter: () => true },
  { key: "english", label: "English & PTE", filter: (course) => course.slug === "english" },
  {
    key: "study-abroad",
    label: "Study Abroad",
    filter: (course) => ["german", "japanese", "korean", "chinese"].includes(course.slug),
  },
  {
    key: "popular",
    label: "Popular Languages",
    filter: (course) => ["english", "german", "arabic", "japanese"].includes(course.slug),
  },
];

export default function LanguageCoursesShowcase() {
  const [activeGroup, setActiveGroup] = useState("all");
  const railRef = useRef(null);

  const visibleCourses = useMemo(() => {
    const group = categoryGroups.find((item) => item.key === activeGroup) || categoryGroups[0];
    return languageCourses.filter(group.filter);
  }, [activeGroup]);

  const move = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * 330, behavior: "smooth" });
  };

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#eef4fb" }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography
              component={RouterLink}
              to="/courses/languages"
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#004aad",
                textDecoration: "none",
                fontSize: { xs: "1.55rem", md: "2.05rem" },
                "&:hover": { color: "#29b554" },
              }}
            >
              Language courses from home
            </Typography>
            <Typography sx={{ mt: 1.1, maxWidth: 920, color: "#445", lineHeight: 1.8 }}>
              Explore structured English, PTE, German, Chinese, Korean, Japanese, and Arabic learning options with clear monthly pricing, guided support, and level-based progress.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
            <Stack direction="row" spacing={1.2} sx={{ flexWrap: "wrap", rowGap: 1.2 }}>
              {categoryGroups.map((group) => (
                <Chip
                  key={group.key}
                  label={group.label}
                  clickable
                  onClick={() => setActiveGroup(group.key)}
                  sx={{
                    borderRadius: "999px",
                    px: 1.1,
                    fontWeight: 800,
                    bgcolor: activeGroup === group.key ? "#1f2937" : "#fff",
                    color: activeGroup === group.key ? "#fff" : "#102019",
                    border: "1px solid #cfe2ee",
                  }}
                />
              ))}
            </Stack>

            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => move(-1)} sx={{ border: "1px solid #cfe2ee", background: "#fff" }}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onClick={() => move(1)} sx={{ border: "1px solid #cfe2ee", background: "#fff" }}>
                <ChevronRightIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Box
            ref={railRef}
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              pb: 1,
              scrollbarWidth: "thin",
              "& > *": { scrollSnapAlign: "start" },
            }}
          >
            {visibleCourses.map((course) => (
              <Box
                key={course.slug}
                sx={{
                  minWidth: { xs: "86%", sm: 320, md: 320 },
                  maxWidth: 320,
                  borderRadius: "18px",
                  background: "#fff",
                  border: "1px solid #d9e6f1",
                  boxShadow: "0 12px 24px rgba(16,32,25,0.08)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    height: 154,
                    background: course.gradient,
                    p: 1.2,
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <Box
                    sx={{
                      flexGrow: 1,
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.35)",
                      position: "relative",
                      background: "rgba(255,255,255,0.12)",
                    }}
                  >
                    <Box
                      component="img"
                      src={getFlagUrl(course.flagCode)}
                      alt={`${course.countryLabel} flag`}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.34))",
                        p: 2,
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.15rem", lineHeight: 1.25, maxWidth: 210 }}>
                        {course.name} Course
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ p: 2.1, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <Stack direction="row" spacing={0.7} alignItems="center" sx={{ mb: 1.1 }}>
                    <Box
                      component="img"
                      src={getFlagUrl(course.flagCode)}
                      alt={`${course.countryLabel} flag`}
                      sx={{ width: 24, height: 16, objectFit: "cover", borderRadius: "3px", border: "1px solid #d9e6f1" }}
                    />
                    <Typography sx={{ color: "#556", fontWeight: 700, fontSize: 14 }}>{course.countryLabel}</Typography>
                  </Stack>

                  <Typography
                    component={RouterLink}
                    to={`/courses/languages/${course.slug}`}
                    sx={{
                      color: "#102019",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      lineHeight: 1.4,
                      "&:hover": { color: course.accentColor },
                    }}
                  >
                    {course.heroTitle}
                  </Typography>

                  <Typography sx={{ mt: 1, color: "#556", lineHeight: 1.7, flexGrow: 1 }}>
                    {course.tag}
                  </Typography>

                  <Stack direction="row" spacing={0.35} alignItems="center" sx={{ mt: 1.6, color: "#102019" }}>
                    <StarIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Starts from {formatPrice(course.priceFrom)}</Typography>
                  </Stack>

                  <Typography sx={{ mt: 0.8, color: course.accentColor, fontWeight: 800 }}>
                    {course.duration}
                  </Typography>

                  <Typography sx={{ mt: 0.6, color: "#556", fontWeight: 700 }}>
                    {course.examTrack}
                  </Typography>

                  {course.packages?.length ? (
                    <Typography sx={{ mt: 0.9, color: "#102019", fontWeight: 800 }}>
                      Packages: {course.packages.map((item) => formatPrice(item.price)).join(" / ")}
                    </Typography>
                  ) : null}

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
                    <Button
                      component={RouterLink}
                      to={`/courses/languages/${course.slug}`}
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        fontWeight: 900,
                        borderRadius: 1,
                        bgcolor: course.accentColor,
                        "&:hover": { bgcolor: course.accentColor },
                      }}
                    >
                      View course
                    </Button>
                    {course.slug === "english" ? (
                      <Button
                        component={RouterLink}
                        to="/pte"
                        variant="outlined"
                        sx={{ textTransform: "none", fontWeight: 900, borderRadius: 1, borderColor: course.accentColor, color: course.accentColor }}
                      >
                        PTE Practice
                      </Button>
                    ) : null}
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
