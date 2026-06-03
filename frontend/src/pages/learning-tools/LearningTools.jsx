import React from "react";
import { Link as RouterLink } from "react-router-dom";
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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import QuizIcon from "@mui/icons-material/Quiz";
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
  },
  {
    title: "Improve English Grammar",
    description:
      "Check English writing, see what may be wrong, review suggestions, and learn how to improve each sentence.",
    icon: SpellcheckIcon,
    to: "/learning-tools/improve-english-grammar",
    button: "Open grammar tool",
  },
  {
    title: "Text to Summary, Questions and MCQs",
    description:
      "Paste long study text and create a short summary, keywords, short questions, MCQs, blanks, and true/false statements.",
    icon: QuizIcon,
    to: "/learning-tools/text-to-mcqs-short-questions",
    button: "Open study generator",
  },
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
        }}
      >
        <Container sx={{ py: { xs: 7, md: 9 } }}>
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
              Practice vocabulary, translate sentences, and build stronger language habits
              with simple tools designed for school, college, IELTS, and everyday learning.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container component="main" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={3}>
          {tools.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <Grid item xs={12} md={6} key={tool.title}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: { xs: 3, md: 4 },
                    borderRadius: 1,
                    border: "1px solid #dcebe2",
                    bgcolor: "#fff",
                  }}
                >
                  <Stack spacing={2.5}>
                    <ToolIcon color="primary" sx={{ fontSize: 38 }} />
                    <Box>
                      <Typography component="h2" variant="h4" fontWeight={900} gutterBottom>
                        {tool.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {tool.description}
                      </Typography>
                    </Box>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button
                        component={RouterLink}
                        to={tool.to}
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ borderRadius: 1, textTransform: "none", fontWeight: 800 }}
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

          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 1,
                border: "1px solid #dcebe2",
                bgcolor: "#edf8f1",
              }}
            >
              <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>
                More tools can be added here
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                This section is ready for more student utilities like spelling quizzes,
                math formula sheets, IELTS word lists, exam timers, and reading practice.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LearningTools;
