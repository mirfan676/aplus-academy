import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import useSEO from "../../hooks/useSEO";
import { getSectionTasks, pteSections, pteTasks, textScoredTasks } from "./ptePracticeData";

const siteUrl = "https://www.aplusacademy.pk";

function TaskCard({ task, color }) {
  const Icon = task.icon;
  const href = task.slug === "write-essay" ? "/pte/write-essay" : `/pte/${task.slug}`;

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        p: 2.5,
        borderRadius: 1,
        border: "1px solid #dfe9e4",
        bgcolor: "#fff",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 16px 38px rgba(17,24,39,0.12)",
          borderColor: color,
        },
      }}
    >
      <Stack spacing={1.8}>
        <Stack direction="row" justifyContent="space-between" gap={1} alignItems="flex-start">
          <Box
            sx={{
              width: 48,
              height: 48,
              display: "grid",
              placeItems: "center",
              borderRadius: 1,
              bgcolor: `${color}18`,
              color,
            }}
          >
            <Icon />
          </Box>
          <Chip
            size="small"
            label={task.textScoring ? "Free AI scoring" : "Practice guide"}
            sx={{
              borderRadius: 1,
              fontWeight: 900,
              bgcolor: task.textScoring ? "#ecfdf5" : "#f8fafc",
              color: task.textScoring ? "#047857" : "#475569",
            }}
          />
        </Stack>
        <Box>
          <Typography component="h3" variant="h6" fontWeight={900}>
            {task.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.8, lineHeight: 1.65 }}>
            {task.description}
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to={href}
          variant={task.textScoring ? "contained" : "outlined"}
          endIcon={<ArrowForwardIcon />}
          sx={{
            alignSelf: "flex-start",
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 900,
            bgcolor: task.textScoring ? color : "transparent",
            borderColor: color,
            color: task.textScoring ? "#fff" : color,
            "&:hover": {
              bgcolor: task.textScoring ? color : `${color}18`,
              borderColor: color,
              filter: task.textScoring ? "brightness(0.96)" : "none",
            },
          }}
        >
          {task.textScoring ? "Start free scoring" : "View practice"}
        </Button>
      </Stack>
    </Paper>
  );
}

export default function PtePracticeHome() {
  useSEO({
    title: "Free PTE Practice with AI Scoring | A Plus Academy",
    description:
      "Free PTE practice for essay writing, summarize written text, summarize spoken text, dictation, fill blanks, reading, listening, and speaking task guides.",
    canonical: `${siteUrl}/pte`,
    ogUrl: `${siteUrl}/pte`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6fbf9" }}>
      <Box
        component="section"
        sx={{
          color: "#fff",
          background: "linear-gradient(135deg, #0f766e 0%, #2563eb 52%, #be123c 100%)",
          borderBottom: "8px solid #f59e0b",
        }}
      >
        <Container sx={{ py: { xs: 4, md: 5.5 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={2.3}>
                <Chip
                  icon={<AutoAwesomeIcon />}
                  label="Free PTE Practice"
                  sx={{
                    alignSelf: "flex-start",
                    borderRadius: 1,
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.16)",
                    fontWeight: 900,
                    "& .MuiChip-icon": { color: "#fff" },
                  }}
                />
                <Typography component="h1" variant="h2" sx={{ fontWeight: 900, lineHeight: 1.1, fontSize: { xs: "1.95rem", md: "3rem" } }}>
                  Free PTE practice with AI scoring for text-based tasks
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.75, opacity: 0.92, maxWidth: 850 }}>
                  Practise PTE Academic writing, reading, and listening tasks with original
                  A Plus Academy questions. Use free AI scoring where a typed answer can be
                  checked, and use strategy guides for speaking and audio-first tasks.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    component={RouterLink}
                    to="/pte/write-essay"
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900, bgcolor: "#fff", color: "#0f766e", "&:hover": { bgcolor: "rgba(255,255,255,0.92)" } }}
                  >
                    Start PTE Essay Scoring
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/pte/summarize-written-text"
                    variant="outlined"
                    sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900, color: "#fff", borderColor: "rgba(255,255,255,0.55)", "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.12)" } }}
                  >
                    Try Summarize Written Text
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 2.2, borderRadius: 1, bgcolor: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.22)" }}>
                <Stack spacing={1.4}>
                  {[
                    `${pteTasks.length} PTE task pages`,
                    `${textScoredTasks.length} text-based scoring tasks`,
                    "Google login for scored writing",
                    "No image generation usage",
                  ].map((item) => (
                    <Stack key={item} direction="row" spacing={1.2} alignItems="center" sx={{ p: 1.2, bgcolor: "rgba(255,255,255,0.12)", borderRadius: 1 }}>
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
        <Stack spacing={4.5}>
          <Alert severity="info">
            This is an independent practice tool for learners. It is not an official Pearson scoring report, but it helps students improve grammar, form, vocabulary, and written accuracy.
          </Alert>

          {pteSections.map((section) => (
            <Box component="section" id={section.id} key={section.id} sx={{ scrollMarginTop: 96 }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} sx={{ mb: 2.5 }}>
                <Box>
                  <Typography component="h2" variant="h4" fontWeight={900}>
                    {section.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.7, lineHeight: 1.7, maxWidth: 760 }}>
                    {section.description}
                  </Typography>
                </Box>
                <Chip
                  label={`${getSectionTasks(section.id).filter((task) => task.textScoring).length} AI scoring tasks`}
                  sx={{ borderRadius: 1, bgcolor: `${section.color}18`, color: section.color, fontWeight: 900 }}
                />
              </Stack>
              <Grid container spacing={2.5}>
                {getSectionTasks(section.id).map((task) => (
                  <Grid item xs={12} md={6} lg={4} key={task.slug}>
                    <TaskCard task={task} color={section.color} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, color: "#fff", background: "linear-gradient(135deg, #111827, #7c2d12)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack spacing={1.5}>
                  <Chip icon={<WorkspacePremiumIcon />} label="Premium student plan" sx={{ alignSelf: "flex-start", borderRadius: 1, bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 900, "& .MuiChip-icon": { color: "#fff" } }} />
                  <Typography component="h2" variant="h4" fontWeight={900}>
                    Premium PTE support can be added for serious learners
                  </Typography>
                  <Typography sx={{ lineHeight: 1.75, opacity: 0.9 }}>
                    Add paid offers for checked writing practice, teacher feedback, speaking
                    sessions, weekly targets, mock test planning, and personal study support.
                    Free users can continue using limited AI scoring for text-based tasks.
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1.2}>
                  {["Teacher feedback add-on", "Weekly PTE writing plan", "Speaking and pronunciation class", "Study abroad English guidance"].map((item) => (
                    <Stack key={item} direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon sx={{ color: "#fbbf24" }} />
                      <Typography fontWeight={900}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
