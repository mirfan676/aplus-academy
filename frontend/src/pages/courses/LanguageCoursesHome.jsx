import React from "react";
import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LanguageIcon from "@mui/icons-material/Language";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import useSEO from "../../hooks/useSEO";
import { languageCourses } from "./languageCoursesData";

const formatPrice = (value) => `Rs. ${value.toLocaleString("en-PK")}`;
const getFlagUrl = (flagCode) => `https://flagcdn.com/w80/${flagCode}.png`;

export default function LanguageCoursesHome() {
  useSEO({
    title: "Language Courses in Pakistan | Learn Any Language from Home",
    description:
      "Explore English, German, Chinese, Korean, Japanese, and Arabic language courses from home with guided levels, speaking practice, and structured learning paths.",
    canonical: "https://www.aplusacademy.pk/courses/languages",
    ogUrl: "https://www.aplusacademy.pk/courses/languages",
    ogImage: "https://www.aplusacademy.pk/aplus-logo.png",
  });

  return (
    <Box sx={{ bgcolor: "#f7fbff" }}>
      <Box
        sx={{
          background: "linear-gradient(135deg, rgba(0,74,173,0.95), rgba(41,181,84,0.92))",
          color: "#fff",
          py: { xs: 7, md: 9 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Language Courses"
                sx={{
                  mb: 2,
                  bgcolor: "rgba(255,255,255,0.14)",
                  color: "#fff",
                  fontWeight: 900,
                  borderRadius: 1,
                }}
              />
              <Typography component="h1" sx={{ fontSize: { xs: "2rem", md: "3.2rem" }, fontWeight: 950, lineHeight: 1.05 }}>
                Learn Any Language from Home
              </Typography>
              <Typography sx={{ mt: 2, maxWidth: 760, lineHeight: 1.85, color: "rgba(255,255,255,0.92)" }}>
                Join structured language courses for English, German, Chinese, Korean, Japanese, and Arabic.
                Each course focuses on practical communication, level-based progress, and clear learning outcomes for
                students, professionals, and beginners learning from home.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                <Button component={RouterLink} to="/register" variant="contained" sx={{ bgcolor: "#fff", color: "#004aad", fontWeight: 900, textTransform: "none", borderRadius: 1 }}>
                  Enquire Now
                </Button>
                <Button component={RouterLink} to="/courses/languages/english" variant="outlined" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.45)", fontWeight: 900, textTransform: "none", borderRadius: 1 }}>
                  View English Course
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Grid container spacing={2}>
                {[
                  ["6 course tracks", "Language options for students and working learners"],
                  ["Live from home", "Structured guided learning without travel"],
                  ["Starts from Rs. 8,500", "Entry-level price for basic language course support"],
                ].map(([title, body]) => (
                  <Grid item xs={12} key={title}>
                    <Box sx={{ p: 2.2, borderRadius: 1, bgcolor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}>
                      <Typography fontWeight={900}>{title}</Typography>
                      <Typography sx={{ mt: 0.6, color: "rgba(255,255,255,0.84)", lineHeight: 1.7 }}>
                        {body}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={5}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" fontWeight={900} sx={{ color: "#102019", mb: 1.2 }}>
              Choose a language path that matches your goal
            </Typography>
            <Typography sx={{ maxWidth: 880, mx: "auto", color: "#475569", lineHeight: 1.85 }}>
              Real language courses usually include level placement, guided vocabulary, speaking practice,
              reading and writing development, and a clear path for learners preparing for study, travel, work,
              or language exams.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {languageCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.slug} sx={{ display: "flex" }}>
                <Box
                  sx={{
                    width: "100%",
                    p: 3,
                    borderRadius: 1,
                    bgcolor: "#fff",
                    border: "1px solid #dce8f1",
                    boxShadow: "0 10px 24px rgba(16,32,25,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 330,
                  }}
                >
                  <Box
                    sx={{
                      height: 94,
                      borderRadius: 1,
                      background: course.gradient,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      p: 2,
                      color: "#fff",
                      mb: 2,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box>
                      <Box
                        component="img"
                        src={getFlagUrl(course.flagCode)}
                        alt={`${course.countryLabel} flag`}
                        sx={{
                          width: 36,
                          height: 24,
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid rgba(255,255,255,0.35)",
                          boxShadow: "0 6px 12px rgba(0,0,0,0.16)",
                          mb: 1,
                          bgcolor: "rgba(255,255,255,0.92)",
                        }}
                      />
                      <Typography variant="h6" fontWeight={900}>{course.shortName}</Typography>
                    </Box>
                    <LanguageIcon />
                  </Box>
                  <Typography
                    component={RouterLink}
                    to={`/courses/languages/${course.slug}`}
                    variant="h6"
                    fontWeight={900}
                    sx={{ color: course.accentColor, textDecoration: "none", "&:hover": { color: "#29b554" } }}
                  >
                    {course.name} Course
                  </Typography>
                  <Typography sx={{ mt: 1, color: "#475569", lineHeight: 1.75, flexGrow: 1 }}>
                    {course.heroIntro}
                  </Typography>
                  <Stack spacing={0.8} sx={{ mt: 2, mb: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: "#102019" }}>Starts from {formatPrice(course.priceFrom)}</Typography>
                    <Typography sx={{ color: course.accentColor, fontWeight: 700 }}>{course.countryLabel}</Typography>
                    <Typography sx={{ color: "#475569" }}>{course.duration}</Typography>
                    <Typography sx={{ color: "#475569" }}>{course.examTrack}</Typography>
                  </Stack>
                  <Button
                    component={RouterLink}
                    to={`/courses/languages/${course.slug}`}
                    variant="contained"
                    sx={{
                      alignSelf: "flex-start",
                      textTransform: "none",
                      fontWeight: 900,
                      borderRadius: 1,
                      bgcolor: course.accentColor,
                      "&:hover": { bgcolor: course.accentColor },
                    }}
                  >
                    View Course
                  </Button>
                  {course.slug === "english" ? (
                    <Button
                      component={RouterLink}
                      to="/pte"
                      variant="text"
                      sx={{ alignSelf: "flex-start", mt: 0.8, px: 0, textTransform: "none", fontWeight: 900, color: course.accentColor }}
                    >
                      Explore PTE Practice
                    </Button>
                  ) : null}
                </Box>
              </Grid>
            ))}
          </Grid>

          {languageCourses.find((course) => course.slug === "english")?.packages ? (
            <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#fff", border: "1px solid #dce8f1" }}>
              <Typography variant="h4" fontWeight={900} sx={{ color: "#102019", mb: 1.2 }}>
                English + PTE monthly packages
              </Typography>
              <Typography sx={{ color: "#475569", lineHeight: 1.85, mb: 3 }}>
                Students who want direct English improvement with guided PTE support can start from these monthly plans, depending on their practice intensity and instructor level.
              </Typography>
              <Grid container spacing={2.2}>
                {languageCourses
                  .find((course) => course.slug === "english")
                  .packages.map((pkg) => (
                    <Grid item xs={12} md={4} key={pkg.name} sx={{ display: "flex" }}>
                      <Box
                        sx={{
                          width: "100%",
                          p: 2.6,
                          borderRadius: 1,
                          bgcolor: "#eff6ff",
                          border: "1px solid #cfe2ee",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography sx={{ color: "#1d4ed8", fontWeight: 900, mb: 0.6 }}>{pkg.name}</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ color: "#102019" }}>
                          {formatPrice(pkg.price)}
                        </Typography>
                        <Typography sx={{ color: "#475569", mb: 1.5 }}>{pkg.period}</Typography>
                        <Typography sx={{ color: "#475569", lineHeight: 1.8, mb: 1.8 }}>{pkg.description}</Typography>
                        <Stack spacing={1} sx={{ mb: 2.2 }}>
                          {pkg.highlights.map((item) => (
                            <Typography key={item} sx={{ color: "#102019", fontWeight: 700 }}>
                              {item}
                            </Typography>
                          ))}
                        </Stack>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                          <Button
                            component={RouterLink}
                            to="/courses/languages/english"
                            variant="contained"
                            sx={{ textTransform: "none", fontWeight: 900, borderRadius: 1 }}
                          >
                            View English Course
                          </Button>
                          <Button
                            component={RouterLink}
                            to="/pte"
                            variant="outlined"
                            sx={{ textTransform: "none", fontWeight: 900, borderRadius: 1 }}
                          >
                            Open PTE Practice
                          </Button>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ) : null}

          <Grid container spacing={3}>
            {[
              {
                icon: <AutoStoriesIcon sx={{ color: "#0f766e" }} />,
                title: "What every course includes",
                body: "Level-based vocabulary, guided speaking tasks, listening practice, reading support, writing correction, and regular revision structure.",
              },
              {
                icon: <SchoolIcon sx={{ color: "#0f766e" }} />,
                title: "Levels and progression",
                body: "German courses often follow CEFR levels, Japanese courses align with JLPT paths, Korean courses connect with TOPIK stages, and Chinese pathways often reference HSK progression.",
              },
              {
                icon: <WorkspacePremiumIcon sx={{ color: "#0f766e" }} />,
                title: "Who these courses suit",
                body: "School and university students, professionals, travel-focused learners, beginners from zero, and learners planning future language exams or study routes.",
              },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Box sx={{ p: 3, borderRadius: 1, bgcolor: "#fff", border: "1px solid #dce8f1", height: "100%" }}>
                  {item.icon}
                  <Typography variant="h6" fontWeight={900} sx={{ mt: 1.5, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>{item.body}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
