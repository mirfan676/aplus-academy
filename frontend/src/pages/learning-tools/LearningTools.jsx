import React from "react";
import { Link as RouterLink } from "react-router-dom";
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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SchoolIcon from "@mui/icons-material/School";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import TranslateIcon from "@mui/icons-material/Translate";
import useSEO from "../../hooks/useSEO";

const siteUrl = "https://www.aplusacademy.pk";

const tools = [
  {
    title: "Learn English Vocabulary",
    description:
      "Type a word or full sentence in any language and translate it into English, Arabic, Spanish, French, Hindi, and Urdu.",
    icon: TranslateIcon,
    to: "/learning-tools/learn-english-vocabulary",
    button: "Open vocabulary tool",
    accent: "#198754",
    bg: "#eef8f1",
    features: ["6 languages", "Words and sentences", "Copy answers"],
  },
  {
    title: "Improve English Grammar",
    description:
      "Check English writing, see what may be wrong, review suggestions, and learn how to improve each sentence.",
    icon: SpellcheckIcon,
    to: "/learning-tools/improve-english-grammar",
    button: "Open grammar tool",
    accent: "#2563eb",
    bg: "#eef4ff",
    features: ["Mistake notes", "Better wording", "Grammar links"],
  },
  {
    title: "Text to Summary, Questions and MCQs",
    description:
      "Paste long study text and create a short summary, keywords, short questions, MCQs, blanks, and true/false statements.",
    icon: QuizIcon,
    to: "/learning-tools/text-to-mcqs-short-questions",
    button: "Open study generator",
    accent: "#7c3aed",
    bg: "#f4efff",
    features: ["Summary", "MCQs", "Short questions"],
  },
  {
    title: "PTE Essay Practice",
    description:
      "Study original sample essays, write under a 20-minute timer, receive instant practice feedback, and build an editable response structure.",
    icon: RateReviewIcon,
    to: "/pte/write-essay",
    button: "Open PTE essay practice",
    accent: "#c2410c",
    bg: "#fff3ed",
    features: ["Sample essays", "20-minute timer", "Writing feedback"],
  },
];

const highlights = [
  { label: "Free to use", icon: CheckCircleIcon },
  { label: "No login needed", icon: SchoolIcon },
  { label: "Made for revision", icon: MenuBookIcon },
];

const LearningTools = () => {
  useSEO({
    title: "Free Learning Tools for Students | A Plus Academy",
    description:
      "Use free student learning tools from A Plus Academy, including English vocabulary translation, grammar improvement, summaries, questions, and MCQs.",
    canonical: `${siteUrl}/learning-tools`,
    ogUrl: `${siteUrl}/learning-tools`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  return (
    <Box sx={{ bgcolor: "#f7fbf8", minHeight: "100vh" }}>
      <Box
        component="section"
        sx={{
          bgcolor: "#102019",
          color: "#fff",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Container sx={{ py: { xs: 7, md: 9 }, position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={2.5} sx={{ maxWidth: 820 }}>
                <Chip
                  icon={<AutoStoriesIcon />}
                  label="Student Practice Tools"
                  sx={{
                    alignSelf: "flex-start",
                    borderRadius: 1,
                    color: "#fff",
                    bgcolor: "rgba(38, 182, 87, 0.95)",
                    fontWeight: 800,
                    "& .MuiChip-icon": { color: "#fff" },
                  }}
                />
                <Typography
                  component="h1"
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1.08,
                    fontSize: { xs: "2.2rem", md: "3.8rem" },
                  }}
                >
                  Learning tools for better daily study
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.7, opacity: 0.88 }}>
                  Practice vocabulary, improve grammar, and turn long notes into quick
                  revision questions with simple tools for school, college, IELTS, and
                  everyday learning.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  {tools.slice(0, 2).map((tool) => (
                    <Button
                      key={tool.title}
                      component={RouterLink}
                      to={tool.to}
                      variant={tool.title.includes("Vocabulary") ? "contained" : "outlined"}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: 900,
                        color: tool.title.includes("Vocabulary") ? "#fff" : "#fff",
                        borderColor: "rgba(255,255,255,0.42)",
                        px: 2.5,
                        "&:hover": {
                          borderColor: "#29b554",
                          bgcolor: tool.title.includes("Vocabulary")
                            ? "#198754"
                            : "rgba(41,181,84,0.14)",
                        },
                      }}
                    >
                      {tool.button}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1.5,
                  maxWidth: 420,
                  ml: { md: "auto" },
                }}
              >
                {tools.map((tool, index) => {
                  const ToolIcon = tool.icon;
                  return (
                    <Paper
                      key={tool.title}
                      elevation={0}
                      sx={{
                        p: 2.2,
                        minHeight: 138,
                        borderRadius: 1,
                        bgcolor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        color: "#fff",
                        backdropFilter: "blur(10px)",
                        animation: `toolFloat 4s ease-in-out ${index * 0.35}s infinite`,
                        "@keyframes toolFloat": {
                          "0%, 100%": { transform: "translateY(0)" },
                          "50%": { transform: "translateY(-8px)" },
                        },
                      }}
                    >
                      <ToolIcon sx={{ color: "#29b554", fontSize: 34, mb: 1 }} />
                      <Typography fontWeight={900} sx={{ lineHeight: 1.25 }}>
                        {tool.title.replace("Text to ", "")}
                      </Typography>
                    </Paper>
                  );
                })}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.2,
                    minHeight: 138,
                    borderRadius: 1,
                    bgcolor: "rgba(41,181,84,0.14)",
                    border: "1px solid rgba(41,181,84,0.34)",
                    color: "#fff",
                  }}
                >
                  <CheckCircleIcon sx={{ color: "#29b554", fontSize: 34, mb: 1 }} />
                  <Typography fontWeight={900} sx={{ lineHeight: 1.25 }}>
                    Instant practice, better revision
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container component="main" sx={{ py: { xs: 5, md: 7 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mb: 3 }}
          useFlexGap
          flexWrap="wrap"
        >
          {highlights.map((item) => {
            const HighlightIcon = item.icon;
            return (
              <Chip
                key={item.label}
                icon={<HighlightIcon />}
                label={item.label}
                sx={{
                  borderRadius: 1,
                  bgcolor: "#fff",
                  border: "1px solid #dcebe2",
                  fontWeight: 900,
                  py: 2.2,
                  "& .MuiChip-icon": { color: "#198754" },
                }}
              />
            );
          })}
        </Stack>

        <Grid container spacing={3}>
          {tools.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <Grid item xs={12} md={6} lg={3} key={tool.title}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: { xs: 3, md: 4 },
                    borderRadius: 1,
                    border: "1px solid #dcebe2",
                    bgcolor: "#fff",
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                    "&:hover": {
                      transform: "translateY(-7px)",
                      boxShadow: "0 18px 42px rgba(16,32,25,0.12)",
                      borderColor: tool.accent,
                    },
                    "&:hover .tool-icon": {
                      transform: "rotate(-4deg) scale(1.08)",
                    },
                  }}
                >
                  <Stack spacing={2.5}>
                    <Box
                      className="tool-icon"
                      sx={{
                        width: 64,
                        height: 64,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 1,
                        bgcolor: tool.bg,
                        color: tool.accent,
                        transition: "transform 0.22s ease",
                      }}
                    >
                      <ToolIcon sx={{ fontSize: 38 }} />
                    </Box>
                    <Box>
                      <Typography component="h2" variant="h4" fontWeight={900} gutterBottom>
                        {tool.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {tool.description}
                      </Typography>
                    </Box>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {tool.features.map((feature) => (
                        <Chip
                          key={feature}
                          size="small"
                          label={feature}
                          sx={{
                            borderRadius: 1,
                            bgcolor: tool.bg,
                            color: "#102019",
                            fontWeight: 800,
                          }}
                        />
                      ))}
                    </Stack>
                    <Divider />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button
                        component={RouterLink}
                        to={tool.to}
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          borderRadius: 1,
                          textTransform: "none",
                          fontWeight: 900,
                          bgcolor: tool.accent,
                          "&:hover": { bgcolor: tool.accent, filter: "brightness(0.94)" },
                        }}
                      >
                        {tool.button}
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/english-language"
                        variant="outlined"
                        size="large"
                        sx={{ borderRadius: 1, textTransform: "none", fontWeight: 800 }}
                      >
                        English classes
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}

        </Grid>
      </Container>
    </Box>
  );
};

export default LearningTools;
