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
            <CtaButton action={{ label: "WhatsApp", href: "https://wa.me/923066762289" }} variant="outlined" />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
