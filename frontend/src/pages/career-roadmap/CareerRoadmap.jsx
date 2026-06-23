import React from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ExploreIcon from "@mui/icons-material/Explore";
import LanguageIcon from "@mui/icons-material/Language";
import TimelineIcon from "@mui/icons-material/Timeline";
import useSEO from "../../hooks/useSEO";
import { getRoadmapPage, roadmapGroups } from "./careerRoadmaps";
import NotFound from "../NotFound";

const siteUrl = "https://www.aplusacademy.pk";

function PteAction({ color = "#0f766e" }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 1,
        color: "#fff",
        background: `linear-gradient(135deg, ${color}, #111827)`,
        border: "1px solid rgba(255,255,255,0.14)",
      }}
    >
      <Stack spacing={2}>
        <Chip
          icon={<EditNoteIcon />}
          label="PTE is included in this roadmap"
          sx={{
            alignSelf: "flex-start",
            borderRadius: 1,
            bgcolor: "rgba(255,255,255,0.16)",
            color: "#fff",
            fontWeight: 900,
            "& .MuiChip-icon": { color: "#fff" },
          }}
        />
        <Typography variant="h5" component="h2" fontWeight={900}>
          Practise essays before you apply
        </Typography>
        <Typography sx={{ lineHeight: 1.8, opacity: 0.9 }}>
          Use the timed PTE essay tool to type your response, stop the timer on
          submission, get AI-powered feedback, and compare similar student essays.
        </Typography>
        <Button
          component={RouterLink}
          to="/pte/write-essay"
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{
            alignSelf: "flex-start",
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 900,
            bgcolor: "#fff",
            color,
            "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
          }}
        >
          Open PTE Practice
        </Button>
      </Stack>
    </Paper>
  );
}

function RoadmapCard({ card, color, accent }) {
  const Icon = card.icon || ExploreIcon;

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        p: { xs: 2.5, md: 3 },
        borderRadius: 1,
        border: "1px solid #dfe9e4",
        bgcolor: "#fff",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 42px rgba(17,24,39,0.12)",
          borderColor: accent,
        },
        "&:before": {
          content: '""',
          position: "absolute",
          inset: "0 auto 0 0",
          width: 6,
          bgcolor: accent,
        },
      }}
    >
      <Stack spacing={2.2} sx={{ pl: 1 }}>
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: 1,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            bgcolor: color,
          }}
        >
          <Icon sx={{ fontSize: 34 }} />
        </Box>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="h5" component="h3" fontWeight={900}>
              {card.title}
            </Typography>
            {card.pte && (
              <Chip
                icon={<LanguageIcon />}
                label="PTE"
                size="small"
                sx={{
                  borderRadius: 1,
                  bgcolor: `${accent}22`,
                  color,
                  fontWeight: 900,
                  "& .MuiChip-icon": { color },
                }}
              />
            )}
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 1.2, lineHeight: 1.75 }}>
            {card.description}
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to={card.to}
          variant={card.pte ? "contained" : "outlined"}
          endIcon={<ArrowForwardIcon />}
          sx={{
            alignSelf: "flex-start",
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 900,
            bgcolor: card.pte ? color : "transparent",
            borderColor: color,
            color: card.pte ? "#fff" : color,
            "&:hover": {
              bgcolor: card.pte ? color : `${accent}1f`,
              borderColor: color,
              filter: card.pte ? "brightness(0.96)" : "none",
            },
          }}
        >
          {card.cta || "View roadmap"}
        </Button>
      </Stack>
    </Paper>
  );
}

function CareerRoadmapHub() {
  useSEO({
    title: "Career Roadmap for Students in Pakistan | A Plus Academy",
    description:
      "Explore career roadmaps after matric, after graduation, BS degrees, study abroad, healthcare abroad, IT abroad, and PTE practice.",
    canonical: `${siteUrl}/career-roadmap`,
    ogUrl: `${siteUrl}/career-roadmap`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  return (
    <Box sx={{ bgcolor: "#f6fbf9", minHeight: "100vh" }}>
      <Box
        component="section"
        sx={{
          color: "#fff",
          background:
            "linear-gradient(135deg, #0f766e 0%, #1d4ed8 48%, #be123c 100%)",
          overflow: "hidden",
          position: "relative",
          "&:after": {
            content: '""',
            position: "absolute",
            inset: "auto 0 0",
            height: 10,
            background: "linear-gradient(90deg, #14b8a6, #f59e0b, #fb7185, #38bdf8)",
          },
        }}
      >
        <Container sx={{ py: { xs: 4, md: 5.5 }, position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={2.2}>
                <Chip
                  icon={<TimelineIcon />}
                  label="Career Roadmap"
                  sx={{
                    alignSelf: "flex-start",
                    borderRadius: 1,
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.16)",
                    fontWeight: 900,
                    "& .MuiChip-icon": { color: "#fff" },
                  }}
                />
                <Typography
                  component="h1"
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1.06,
                    fontSize: { xs: "1.95rem", md: "3rem" },
                  }}
                >
                  Choose the right path, then practise what the path requires
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.75, opacity: 0.92, maxWidth: 900 }}>
                  Start with the main roadmap, then open the detailed pages for study
                  abroad, healthcare, IT, engineering, after graduation, after matric,
                  and BS degrees. PTE Practice appears inside the roadmaps where English
                  testing is useful.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    component={RouterLink}
                    to="/pte/write-essay"
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 900,
                      bgcolor: "#fff",
                      color: "#0f766e",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
                    }}
                  >
                    Open PTE Practice
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/teachers"
                    variant="outlined"
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 900,
                      color: "#fff",
                      borderColor: "rgba(255,255,255,0.55)",
                      "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.12)" },
                    }}
                  >
                    Find a Guide
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  color: "#fff",
                }}
              >
                <Stack spacing={1.4}>
                  {["After Matric", "After Graduation", "Study Abroad & PTE", "Healthcare Abroad"].map((item) => (
                    <Stack
                      key={item}
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                      sx={{ p: 1.2, bgcolor: "rgba(255,255,255,0.12)", borderRadius: 1 }}
                    >
                      <CheckCircleIcon sx={{ color: "#fef08a" }} />
                      <Typography fontWeight={900}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container component="main" sx={{ py: { xs: 3, md: 4.5 } }}>
        <Stack spacing={4}>
          {roadmapGroups.map((group) => {
            const GroupIcon = group.icon || ExploreIcon;
            return (
              <Box component="section" id={group.id} key={group.id} sx={{ scrollMarginTop: 96 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "flex-end" }}
                  sx={{ mb: 2.5 }}
                >
                  <Box>
                    <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 1,
                          display: "grid",
                          placeItems: "center",
                          color: "#fff",
                          bgcolor: group.color,
                        }}
                      >
                        <GroupIcon />
                      </Box>
                      <Typography component="h2" variant="h4" fontWeight={900}>
                        {group.title}
                      </Typography>
                    </Stack>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7, maxWidth: 820 }}>
                      {group.subtitle}
                    </Typography>
                  </Box>
                  {group.pte && (
                    <Chip
                      icon={<LanguageIcon />}
                      label="PTE Practice available"
                      sx={{
                        borderRadius: 1,
                        bgcolor: `${group.accent}22`,
                        color: group.color,
                        fontWeight: 900,
                        "& .MuiChip-icon": { color: group.color },
                      }}
                    />
                  )}
                </Stack>
                <Grid container spacing={2.5}>
                  {group.cards.map((card) => (
                    <Grid item xs={12} md={4} key={card.title}>
                      <RoadmapCard card={card} color={group.color} accent={group.accent} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}

function CareerRoadmapDetail() {
  const { "*": slug } = useParams();
  const page = getRoadmapPage(slug);

  useSEO({
    title: page ? `${page.title} | A Plus Academy` : "Career Roadmap | A Plus Academy",
    description: page?.intro || "Explore student career roadmaps from A Plus Academy.",
    canonical: `${siteUrl}/career-roadmap/${slug || ""}`,
    ogUrl: `${siteUrl}/career-roadmap/${slug || ""}`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  if (!page) return <NotFound />;

  return (
    <Box sx={{ bgcolor: "#f6fbf9", minHeight: "100vh" }}>
      <Box
        component="section"
        sx={{
          color: "#fff",
          background: `linear-gradient(135deg, ${page.color} 0%, #111827 100%)`,
        }}
      >
        <Container sx={{ py: { xs: 3.5, md: 5 } }}>
          <Stack spacing={2.2} sx={{ maxWidth: 920 }}>
            <Button
              component={RouterLink}
              to="/career-roadmap"
              startIcon={<ArrowBackIcon />}
              sx={{
                alignSelf: "flex-start",
                borderRadius: 1,
                textTransform: "none",
                color: "#fff",
                fontWeight: 900,
                border: "1px solid rgba(255,255,255,0.28)",
              }}
            >
              Career Roadmap
            </Button>
            <Chip
              label={page.group}
              sx={{
                alignSelf: "flex-start",
                borderRadius: 1,
                bgcolor: "rgba(255,255,255,0.16)",
                color: "#fff",
                fontWeight: 900,
              }}
            />
            <Typography
              component="h1"
              variant="h2"
              sx={{ fontWeight: 900, lineHeight: 1.1, fontSize: { xs: "1.9rem", md: "2.8rem" } }}
            >
              {page.title}
            </Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.75, opacity: 0.9 }}>
              {page.intro}
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container component="main" sx={{ py: { xs: 3, md: 4.5 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 1, border: "1px solid #dfe9e4" }}>
              <Stack spacing={3}>
                <Box>
                  <Typography component="h2" variant="h4" fontWeight={900} gutterBottom>
                    Step-by-step roadmap
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    Use this as a starting checklist. A counselor or subject teacher can
                    adjust the plan according to your marks, city, budget, and target country.
                  </Typography>
                </Box>
                <Stack spacing={1.5}>
                  {page.steps.map((step, index) => (
                    <Stack
                      key={step}
                      direction="row"
                      spacing={1.6}
                      alignItems="flex-start"
                      sx={{ p: 1.6, borderRadius: 1, bgcolor: "#f8fafc", border: "1px solid #e5e7eb" }}
                    >
                      <Box
                        sx={{
                          minWidth: 34,
                          height: 34,
                          borderRadius: 1,
                          display: "grid",
                          placeItems: "center",
                          color: "#fff",
                          bgcolor: page.color,
                          fontWeight: 900,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography sx={{ lineHeight: 1.75 }}>{step}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={2.5}>
              {page.pte && <PteAction color={page.color} />}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 1, border: "1px solid #dfe9e4", bgcolor: "#fff" }}>
                <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>
                  What you should finish
                </Typography>
                <Stack spacing={1.2}>
                  {page.outcomes.map((outcome) => (
                    <Stack key={outcome} direction="row" spacing={1.1} alignItems="center">
                      <CheckCircleIcon sx={{ color: page.color }} />
                      <Typography fontWeight={800}>{outcome}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 1, border: "1px solid #dfe9e4", bgcolor: "#fff" }}>
                <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>
                  Need personal guidance?
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.75, mb: 2 }}>
                  Find a tutor or academic guide who can help with English, admission
                  planning, subject selection, or test preparation.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/teachers"
                  variant="outlined"
                  fullWidth
                  sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}
                >
                  Find Teachers
                </Button>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default function CareerRoadmap() {
  const params = useParams();
  return params["*"] ? <CareerRoadmapDetail /> : <CareerRoadmapHub />;
}
