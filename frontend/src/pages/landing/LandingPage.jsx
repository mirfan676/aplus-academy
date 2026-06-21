import React, { useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowForward,
  CheckCircle,
  LocationOn,
  QuestionAnswer,
  School,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import useSEO from "../../hooks/useSEO";

const siteUrl = "https://www.aplusacademy.pk";

const plainTitle = (title = "") => title.replace(/\s*\|\s*/g, " and ");

const buildSeoParagraphs = (page) => {
  const topic = plainTitle(page.title);
  const focus = page.eyebrow || page.heading || topic;
  const sectionTopics = page.sections.map((section) => section.title.toLowerCase()).join(", ");
  const relatedLinks = page.popularLinks.map((link) => link.label).join(", ");

  return [
    `This page focuses on ${topic}. ${page.heading} is written for students, parents, and working learners who want a practical way to choose support instead of guessing from generic course lists. A Plus Academy looks at the learner's class level, subject gaps, target exam or skill goal, preferred timing, city, and whether home tuition or online tutoring will fit the routine better.`,
    `For ${focus} requests, the right tutor match usually depends on more than subject knowledge. Families often need someone who can explain concepts patiently, set a realistic study pace, notice weak areas early, and keep lessons consistent. Students may need help with homework, exam preparation, speaking confidence, coding practice, Quran reading, university topics, or a short course plan, so the learning path should stay flexible.`,
    `The sections on this page cover ${sectionTopics}. These details help searchers understand what the service includes before contacting the team. Instead of using the same message for every learner, A Plus Academy encourages students to share their current level, syllabus, book or exam board, recent marks, available days, and the outcome they want from classes.`,
    `A useful tutoring plan also considers accountability. Regular lessons, revision targets, practice questions, feedback after mistakes, and parent or student updates make it easier to see whether progress is happening. This matters for school children, O Level and A Level students, IELTS learners, Quran students, university learners, and people building technology or communication skills.`,
    `Before starting classes, it helps to write down the learner's strongest topics, weakest topics, recent test results, preferred language of explanation, and whether the goal is long-term improvement or urgent exam preparation. Clear details make the first conversation more useful and help the tutor plan lessons with less delay.`,
    `This extra context also helps avoid mismatched expectations about fees, lesson frequency, travel, online class setup, and the amount of practice needed between sessions.`,
    `If this is not the exact page you need, related searches such as ${relatedLinks} can help you move to a closer option. You can also contact A Plus Academy on WhatsApp with the subject, class, city, area, timing, learning goal, and preferred tutor type so the team can suggest the next practical step.`,
  ];
};

const CtaButton = ({ action, variant = "contained" }) => {
  if (!action) return null;

  const sharedSx = {
    borderRadius: 1,
    px: 3,
    textTransform: "none",
    fontWeight: 700,
  };

  if (action.href) {
    return (
      <Button
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        variant={variant}
        size="large"
        endIcon={<ArrowForward />}
        sx={sharedSx}
      >
        {action.label}
      </Button>
    );
  }

  return (
    <Button
      component={RouterLink}
      to={action.to}
      variant={variant}
      size="large"
      endIcon={<ArrowForward />}
      sx={sharedSx}
    >
      {action.label}
    </Button>
  );
};

const LandingPage = ({ page }) => {
  const canonical = `${siteUrl}/${page.slug}`;
  const seoParagraphs = buildSeoParagraphs(page);

  useSEO({
    title: page.title,
    description: page.description,
    canonical,
    ogImage: page.image,
    ogUrl: canonical,
  });

  useEffect(() => {
    const id = `structured-data-${page.slug}`;
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    });
    document.head.appendChild(script);

    return () => script.remove();
  }, [page]);

  return (
    <Box>
      <Box
        component="section"
        sx={{
          minHeight: { xs: 500, md: 560 },
          display: "flex",
          alignItems: "center",
          color: "#fff",
          backgroundImage: `linear-gradient(90deg, rgba(4, 20, 16, 0.9), rgba(4, 20, 16, 0.62), rgba(4, 20, 16, 0.25)), url(${page.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container sx={{ py: { xs: 8, md: 10 } }}>
          <Box sx={{ maxWidth: 800 }}>
            <Chip
              label={page.eyebrow}
              color="primary"
              sx={{
                mb: 2,
                borderRadius: 1,
                color: "#fff",
                fontWeight: 700,
                backgroundColor: "rgba(25, 135, 84, 0.95)",
              }}
            />
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 800,
                lineHeight: 1.08,
                mb: 2,
                fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem" },
              }}
            >
              {page.heading}
            </Typography>
            <Typography
              component="p"
              variant="h6"
              sx={{ maxWidth: 720, lineHeight: 1.6, mb: 4, opacity: 0.94 }}
            >
              {page.intro}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <CtaButton action={page.primaryCta} />
              <CtaButton action={page.secondaryCta} variant="outlined" />
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#f7fbf8", borderBottom: "1px solid #e3eee7" }}>
        <Container sx={{ py: 3 }}>
          <Grid container spacing={2}>
            {page.highlights.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Stack direction="row" spacing={1.25} alignItems="flex-start">
                  <CheckCircle color="primary" fontSize="small" sx={{ mt: 0.3 }} />
                  <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
                    {item}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container component="main" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4} alignItems="stretch">
          {page.sections.map((section) => (
            <Grid item xs={12} md={6} key={section.title}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: { xs: 3, md: 4 },
                  borderRadius: 1,
                  border: "1px solid #dde9e1",
                  background: "#fff",
                }}
              >
                <School color="primary" sx={{ mb: 2 }} />
                <Typography component="h2" variant="h5" fontWeight={800} gutterBottom>
                  {section.title}
                </Typography>
                <Typography component="p" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {section.body}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ py: { xs: 6, md: 8 } }}>
          <Typography component="h2" variant="h4" fontWeight={800} gutterBottom>
            {page.eyebrow} learning guide
          </Typography>
          <Box sx={{ maxWidth: 980 }}>
            {seoParagraphs.map((paragraph) => (
              <Typography
                key={paragraph}
                component="p"
                color="text.secondary"
                sx={{ lineHeight: 1.85, mb: 2 }}
              >
                {paragraph}
              </Typography>
            ))}
          </Box>
        </Box>

        <Box sx={{ py: { xs: 6, md: 8 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                <LocationOn color="primary" />
                <Typography component="h2" variant="h4" fontWeight={800}>
                  Popular Searches
                </Typography>
              </Stack>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Explore related A Plus Academy pages that help students, parents, and
                teachers find the right support faster.
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Stack direction="row" useFlexGap flexWrap="wrap" gap={1.5}>
                {page.popularLinks.map((link) => (
                  <Button
                    key={link.label}
                    component={RouterLink}
                    to={link.to}
                    variant="outlined"
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 700,
                      py: 1.1,
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <Box sx={{ py: { xs: 6, md: 8 } }}>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 3 }}>
            <QuestionAnswer color="primary" />
            <Typography component="h2" variant="h4" fontWeight={800}>
              Questions Families Ask
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            {page.faqs.map(([question, answer]) => (
              <Grid item xs={12} md={6} key={question}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    bgcolor: "#f7fbf8",
                    border: "1px solid #e3eee7",
                    height: "100%",
                  }}
                >
                  <Typography component="h3" variant="h6" fontWeight={800} gutterBottom>
                    {question}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {answer}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 1,
            bgcolor: "#102019",
            color: "#fff",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 3,
          }}
        >
          <Box>
            <Typography component="h2" variant="h4" fontWeight={800} gutterBottom>
              Ready to find the right learning support?
            </Typography>
            <Typography sx={{ opacity: 0.86, maxWidth: 680 }}>
              Share the class, subject, city, preferred timing, and learning goal.
              A Plus Academy will guide you toward the next practical step.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <CtaButton action={page.primaryCta} />
            <CtaButton action={{ label: "WhatsApp", href: "https://wa.me/923197659491" }} variant="outlined" />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
