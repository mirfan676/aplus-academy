import React from "react";
import { Navigate, Link as RouterLink, useParams } from "react-router-dom";
import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import PublicIcon from "@mui/icons-material/Public";
import useSEO from "../../hooks/useSEO";
import { languageCourseMap } from "./languageCoursesData";

const formatPrice = (value) => `Rs. ${value.toLocaleString("en-PK")}`;
const getFlagUrl = (flagCode) => `https://flagcdn.com/w80/${flagCode}.png`;

export default function LanguageCoursePage() {
  const { slug } = useParams();
  const course = languageCourseMap[slug];

  useSEO({
    title: course ? `${course.name} Course in Pakistan | A Plus Academy` : "Language Courses | A Plus Academy",
    description:
      course?.seoDescription ||
      "Explore language courses from home with structured learning paths at A Plus Academy.",
    canonical: course
      ? `https://www.aplusacademy.pk/courses/languages/${course.slug}`
      : "https://www.aplusacademy.pk/courses/languages",
    ogUrl: course
      ? `https://www.aplusacademy.pk/courses/languages/${course.slug}`
      : "https://www.aplusacademy.pk/courses/languages",
    ogImage: "https://www.aplusacademy.pk/aplus-logo.png",
  });

  if (!course) {
    return <Navigate to="/courses/languages" replace />;
  }

  return (
    <Box sx={{ bgcolor: course.surfaceTint || "#f7fbff" }}>
      <Box
        sx={{
          background: course.gradient,
          color: "#fff",
          py: { xs: 7, md: 9 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label={course.countryLabel}
                sx={{
                  mb: 2,
                  bgcolor: "rgba(255,255,255,0.14)",
                  color: "#fff",
                  fontWeight: 900,
                  borderRadius: 1,
                }}
              />
              <Box
                component="img"
                src={getFlagUrl(course.flagCode)}
                alt={`${course.countryLabel} flag`}
                sx={{
                  width: 52,
                  height: 34,
                  objectFit: "cover",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.35)",
                  boxShadow: "0 10px 18px rgba(0,0,0,0.16)",
                  mb: 2,
                  bgcolor: "rgba(255,255,255,0.94)",
                }}
              />
              <Typography component="h1" sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 950, lineHeight: 1.06 }}>
                {course.heroTitle}
              </Typography>
              <Typography sx={{ mt: 2, maxWidth: 760, lineHeight: 1.85, color: "rgba(255,255,255,0.92)" }}>
                {course.heroIntro}
              </Typography>
              {course.detailedOverview ? (
                <Typography sx={{ mt: 2, maxWidth: 760, lineHeight: 1.82, color: "rgba(255,255,255,0.82)" }}>
                  {course.detailedOverview}
                </Typography>
              ) : null}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{ bgcolor: "#fff", color: course.accentColor, fontWeight: 900, textTransform: "none", borderRadius: 1 }}
                >
                  Enquire About This Course
                </Button>
                <Button
                  component={RouterLink}
                  to="/courses/languages"
                  variant="outlined"
                  sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.45)", fontWeight: 900, textTransform: "none", borderRadius: 1 }}
                >
                  View All Language Courses
                </Button>
                {course.relatedPathways?.[0] ? (
                  <Button
                    component={RouterLink}
                    to={course.relatedPathways[0].to}
                    variant="outlined"
                    sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.45)", fontWeight: 900, textTransform: "none", borderRadius: 1 }}
                  >
                    {course.relatedPathways[0].label}
                  </Button>
                ) : null}
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Grid container spacing={2}>
                {[
                  ["Starts from", formatPrice(course.priceFrom)],
                  ["Course duration", course.duration],
                  ["Study track", course.examTrack],
                  ["Levels", course.levelLabel],
                ].map(([title, body]) => (
                  <Grid item xs={12} sm={6} key={title}>
                    <Box
                      sx={{
                        p: 2.1,
                        borderRadius: 1,
                        bgcolor: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        height: "100%",
                      }}
                    >
                      <Typography fontWeight={900}>{title}</Typography>
                      <Typography sx={{ mt: 0.7, color: "rgba(255,255,255,0.88)", lineHeight: 1.7 }}>
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
          <Grid container spacing={3}>
            {[
              {
                icon: <PublicIcon sx={{ color: "#0f766e" }} />,
                title: "How the course is structured",
                body: course.framework,
              },
              {
                icon: <SchoolIcon sx={{ color: "#0f766e" }} />,
                title: "Who this suits",
                body: course.audience.join(", "),
              },
              {
                icon: <MenuBookIcon sx={{ color: "#0f766e" }} />,
                title: "What learners usually practise",
                body: "Speaking, listening, vocabulary, grammar, reading, writing, revision work, and guided teacher feedback.",
              },
            ].map((item) => (
                <Grid item xs={12} md={4} key={item.title}>
                <Box sx={{ p: 3, borderRadius: 1, bgcolor: "#fff", border: `1px solid ${course.surfaceTint}`, height: "100%" }}>
                  {item.icon}
                  <Typography variant="h6" fontWeight={900} sx={{ mt: 1.5, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>{item.body}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#fff", border: `1px solid ${course.surfaceTint}` }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: "#102019", mb: 1.4 }}>
                  Core focus areas
                </Typography>
                <Typography sx={{ color: "#475569", lineHeight: 1.85, mb: 2.5 }}>
                  A strong {course.shortName.toLowerCase()} course needs more than word lists. It should guide learners through
                  structured lessons, repeated practice, teacher correction, and practical use of the language in class, work,
                  study, travel, or exam situations.
                </Typography>
                <Grid container spacing={2}>
                  {course.focusPoints.map((point) => (
                    <Grid item xs={12} sm={6} key={point}>
                      <Box sx={{ p: 2, borderRadius: 1, bgcolor: course.surfaceTint, border: `1px solid ${course.surfaceTint}`, height: "100%" }}>
                        <Typography fontWeight={900} sx={{ color: course.accentColor }}>
                          {point}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#fff", border: `1px solid ${course.surfaceTint}`, height: "100%" }}>
                <Typography variant="h5" fontWeight={900} sx={{ color: "#102019", mb: 1.4 }}>
                  Course snapshot
                </Typography>
                <Stack spacing={1.7}>
                  {[
                    `Minimum fee: ${formatPrice(course.priceFrom)}`,
                    `Study duration: ${course.duration}`,
                    `Level path: ${course.levelLabel}`,
                    `Exam or progression path: ${course.examTrack}`,
                  ].map((item) => (
                    <Box key={item} sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
                      <CheckCircleOutlineIcon sx={{ color: "#29b554", mt: "2px" }} />
                      <Typography sx={{ color: "#475569", lineHeight: 1.75 }}>{item}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {course.classFormat?.length ? (
              <Grid item xs={12} md={6}>
                <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#fff", border: `1px solid ${course.surfaceTint}`, height: "100%" }}>
                  <Typography variant="h5" fontWeight={900} sx={{ color: "#102019", mb: 2 }}>
                    How classes usually run
                  </Typography>
                  <Stack spacing={1.8}>
                    {course.classFormat.map((item) => (
                      <Box key={item} sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
                        <CheckCircleOutlineIcon sx={{ color: course.accentColor, mt: "2px" }} />
                        <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>{item}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            ) : null}

            {course.supportFeatures?.length ? (
              <Grid item xs={12} md={6}>
                <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#fff", border: `1px solid ${course.surfaceTint}`, height: "100%" }}>
                  <Typography variant="h5" fontWeight={900} sx={{ color: "#102019", mb: 2 }}>
                    Learning support included
                  </Typography>
                  <Stack spacing={1.8}>
                    {course.supportFeatures.map((item) => (
                      <Box key={item} sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
                        <CheckCircleOutlineIcon sx={{ color: "#29b554", mt: "2px" }} />
                        <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>{item}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            ) : null}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#fff", border: `1px solid ${course.surfaceTint}`, height: "100%" }}>
                <Typography variant="h5" fontWeight={900} sx={{ color: "#102019", mb: 2 }}>
                  What can be included in this course
                </Typography>
                <Stack spacing={1.8}>
                  {course.modules.map((module) => (
                    <Box key={module} sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
                      <CheckCircleOutlineIcon sx={{ color: "#0f766e", mt: "2px" }} />
                      <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>{module}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#fff", border: `1px solid ${course.surfaceTint}`, height: "100%" }}>
                <Typography variant="h5" fontWeight={900} sx={{ color: "#102019", mb: 2 }}>
                  Expected outcomes
                </Typography>
                <Stack spacing={1.8}>
                  {course.outcomes.map((outcome) => (
                    <Box key={outcome} sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
                      <CheckCircleOutlineIcon sx={{ color: "#29b554", mt: "2px" }} />
                      <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>{outcome}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>

          {course.curriculum?.length ? (
            <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#fff", border: `1px solid ${course.surfaceTint}` }}>
              <Typography variant="h4" fontWeight={900} sx={{ color: "#102019", mb: 1.5 }}>
                Detailed curriculum direction
              </Typography>
              <Typography sx={{ color: "#475569", lineHeight: 1.85, mb: 2.5 }}>
                The course content can be adjusted to the learner&apos;s age, starting level, and goal, but a strong program should usually cover the following areas in sequence.
              </Typography>
              <Grid container spacing={2}>
                {course.curriculum.map((item, index) => (
                  <Grid item xs={12} md={6} key={item}>
                    <Box sx={{ p: 2.4, borderRadius: 1, bgcolor: course.surfaceTint, border: `1px solid ${course.surfaceTint}`, height: "100%" }}>
                      <Typography sx={{ fontWeight: 900, color: course.accentColor, mb: 0.7 }}>
                        Module {index + 1}
                      </Typography>
                      <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>{item}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : null}

          {course.packages?.length ? (
            <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#fff", border: `1px solid ${course.surfaceTint}` }}>
              <Typography variant="h4" fontWeight={900} sx={{ color: "#102019", mb: 1.5 }}>
                Monthly package options
              </Typography>
              <Typography sx={{ color: "#475569", lineHeight: 1.85, mb: 2.4 }}>
                Choose a package according to how much guided English correction, PTE support, and instructor attention the learner needs each month.
              </Typography>
              <Grid container spacing={2}>
                {course.packages.map((pkg) => (
                  <Grid item xs={12} md={4} key={pkg.name} sx={{ display: "flex" }}>
                    <Box sx={{ width: "100%", p: 2.5, borderRadius: 1, bgcolor: course.surfaceTint, border: `1px solid ${course.surfaceTint}`, display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ color: course.accentColor, fontWeight: 900, mb: 0.6 }}>{pkg.name}</Typography>
                      <Typography variant="h4" fontWeight={900} sx={{ color: "#102019" }}>
                        {formatPrice(pkg.price)}
                      </Typography>
                      <Typography sx={{ color: "#475569", mb: 1.2 }}>{pkg.period}</Typography>
                      <Typography sx={{ color: "#475569", lineHeight: 1.8, mb: 1.4 }}>{pkg.description}</Typography>
                      <Stack spacing={0.9}>
                        {pkg.highlights.map((item) => (
                          <Box key={item} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                            <CheckCircleOutlineIcon sx={{ color: course.accentColor, mt: "2px" }} />
                            <Typography sx={{ color: "#475569", lineHeight: 1.75 }}>{item}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : null}

          {course.idealFor?.length ? (
            <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#fff", border: `1px solid ${course.surfaceTint}` }}>
              <Typography variant="h4" fontWeight={900} sx={{ color: "#102019", mb: 2 }}>
                This course is ideal for
              </Typography>
              <Grid container spacing={2}>
                {course.idealFor.map((item) => (
                  <Grid item xs={12} sm={6} key={item}>
                    <Box sx={{ p: 2.1, borderRadius: 1, bgcolor: "#f8fbfd", border: `1px solid ${course.surfaceTint}`, height: "100%" }}>
                      <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>{item}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : null}

          {course.relatedPathways?.length ? (
            <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#fff", border: `1px solid ${course.surfaceTint}` }}>
              <Typography variant="h4" fontWeight={900} sx={{ color: "#102019", mb: 1.4 }}>
                Related learning pathway
              </Typography>
              <Grid container spacing={2}>
                {course.relatedPathways.map((pathway) => (
                  <Grid item xs={12} md={6} key={pathway.label}>
                    <Box sx={{ p: 2.4, borderRadius: 1, bgcolor: course.surfaceTint, border: `1px solid ${course.surfaceTint}`, height: "100%" }}>
                      <Typography sx={{ fontWeight: 900, color: course.accentColor, mb: 0.8 }}>
                        {pathway.label}
                      </Typography>
                      <Typography sx={{ color: "#475569", lineHeight: 1.8, mb: 1.6 }}>
                        {pathway.note}
                      </Typography>
                      <Button
                        component={RouterLink}
                        to={pathway.to}
                        variant="contained"
                        sx={{ textTransform: "none", fontWeight: 900, borderRadius: 1, bgcolor: course.accentColor, "&:hover": { bgcolor: course.accentColor } }}
                      >
                        Open {pathway.label}
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : null}

          <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, bgcolor: "#102019", color: "#fff" }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" fontWeight={900}>
                  Need help choosing the right language path?
                </Typography>
                <Typography sx={{ mt: 1.5, lineHeight: 1.85, color: "rgba(255,255,255,0.82)" }}>
                  Share the learner's age, current level, target language, study purpose, and preferred class mode.
                  A Plus Academy can help you move to the right teacher or course direction.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction={{ xs: "column", sm: "row", md: "column" }} spacing={1.3} justifyContent="flex-end">
                  <Button
                    component={RouterLink}
                    to="/teachers"
                    variant="contained"
                    sx={{ bgcolor: course.accentColor, textTransform: "none", fontWeight: 900, borderRadius: 1, "&:hover": { bgcolor: course.accentColor } }}
                  >
                    Find Tutors
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/about"
                    variant="outlined"
                    sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.34)", textTransform: "none", fontWeight: 900, borderRadius: 1 }}
                  >
                    Contact A Plus Academy
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
