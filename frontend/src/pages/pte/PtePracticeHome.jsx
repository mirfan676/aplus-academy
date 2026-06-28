import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GoogleIcon from "@mui/icons-material/Google";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useAuth } from "../../contexts/useAuth";
import { db, hasFirebaseConfig } from "../../firebase";
import useSEO from "../../hooks/useSEO";
import { fetchPublishedPteQuestionCounts } from "../../services/pteQuestionsData";
import { fetchUserPteTaskResponses } from "../../services/pteTaskResponseData";
import { getSectionTasks, pteSections, pteTasks, textScoredTasks } from "./ptePracticeData";
import { getSectionQuestionCount, getTaskQuestions, getTotalQuestionCount } from "./pteQuestionBank";

const siteUrl = "https://www.aplusacademy.pk";

const quickFilters = [
  { label: "Writing", href: "#speaking-writing" },
  { label: "Reading", href: "#reading" },
  { label: "Listening", href: "#listening" },
  { label: "AI Scoring", href: "#free-ai-scoring" },
  { label: "Premium Help", href: "#premium-pte" },
];

const popularTaskSlugs = [
  "write-essay",
  "summarize-written-text",
  "summarize-spoken-text",
  "write-from-dictation",
  "reading-writing-fill-blanks",
  "describe-image",
];

const taskHref = (task) => (task.slug === "write-essay" ? "/pte/write-essay" : `/pte/${task.slug}`);

const criteriaToSections = {
  Form: "Writing form",
  Organization: "Essay structure",
  Development: "Idea development",
  Grammar: "Grammar",
  Vocabulary: "Vocabulary",
  "Linguistic range": "Sentence variety",
  Content: "Content accuracy",
  Coherence: "Coherence",
  "Task Accuracy": "Task accuracy",
};

const getImprovementAreas = (responses) => {
  const totals = new Map();
  responses.forEach((response) => {
    Object.entries(response.criteria || {}).forEach(([label, score]) => {
      if (!Number.isFinite(Number(score))) return;
      const current = totals.get(label) || { total: 0, count: 0 };
      totals.set(label, { total: current.total + Number(score), count: current.count + 1 });
    });
  });

  const weakAreas = [...totals.entries()]
    .map(([label, value]) => ({ label: criteriaToSections[label] || label, average: value.total / value.count }))
    .sort((a, b) => a.average - b.average)
    .slice(0, 3)
    .map((item) => item.label);

  if (weakAreas.length) return weakAreas;
  if (responses.length) return ["Vocabulary", "Grammar", "Writing structure"];
  return ["Start with essay writing", "Try summarize text", "Build dictation accuracy"];
};

function TaskPill({ task, color = "#111827", questionCount }) {
  const Icon = task.icon;
  const starterCount = questionCount ?? getTaskQuestions(task.slug).length;

  return (
    <Button
      component={RouterLink}
      to={taskHref(task)}
      variant="outlined"
      startIcon={<Icon />}
      sx={{
        justifyContent: "space-between",
        borderRadius: 1,
        minHeight: 48,
        px: 1.4,
        py: 1,
        textTransform: "none",
        fontWeight: 850,
        color: "#111827",
        borderColor: "#d4dbe3",
        bgcolor: task.textScoring ? "#f0fdf4" : "#fff",
        "& .MuiButton-startIcon": { color },
        "&:hover": {
          bgcolor: task.textScoring ? "#dcfce7" : "#f8fafc",
          borderColor: color,
        },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%", justifyContent: "space-between" }}>
        <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", textAlign: "left" }}>
          {task.shortTitle || task.title}
        </Box>
        <Chip size="small" label={`${starterCount}`} sx={{ borderRadius: 1, fontWeight: 900, bgcolor: "#fff" }} />
      </Stack>
    </Button>
  );
}

function PopularTaskCard({ task, questionCount }) {
  const Icon = task.icon;
  const starterCount = questionCount ?? getTaskQuestions(task.slug).length;

  return (
    <Paper
      component={RouterLink}
      to={taskHref(task)}
      elevation={0}
      sx={{
        display: "block",
        height: "100%",
        p: 2,
        borderRadius: 1,
        textDecoration: "none",
        color: "inherit",
        border: "1px solid #d4dbe3",
        bgcolor: "#fff",
        transition: "border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
        "&:hover": {
          borderColor: "#111827",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.10)",
          transform: "translateY(-3px)",
        },
      }}
    >
      <Stack spacing={1.3}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 1,
              bgcolor: task.textScoring ? "#dcfce7" : "#f1f5f9",
              color: task.textScoring ? "#047857" : "#334155",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography component="h3" fontWeight={950} sx={{ lineHeight: 1.25 }}>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {starterCount} starter questions
            </Typography>
          </Box>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {task.description}
        </Typography>
      </Stack>
    </Paper>
  );
}

function LearnerProgressPanel() {
  const { hasFirebaseConfig: authConfigReady, loading: authLoading, signInWithGoogle, user } = useAuth();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid || !hasFirebaseConfig || !db) {
      setResponses([]);
      return undefined;
    }
    let active = true;
    setLoading(true);
    Promise.all([
      getDocs(query(collection(db, "pteEssayResponses"), where("userId", "==", user.uid), limit(100))),
      fetchUserPteTaskResponses(user.uid),
    ])
      .then(([essaySnapshot, taskResponses]) => {
        if (!active) return;
        const essayResponses = essaySnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        setResponses([...essayResponses, ...taskResponses]);
      })
      .catch((error) => {
        console.warn("PTE learner progress unavailable.", error);
        if (active) setResponses([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.uid]);

  const progress = useMemo(() => {
    const practised = responses.length;
    const scoredResponses = responses.filter((response) => Number.isFinite(Number(response.score)));
    const averageScore = scoredResponses.length
      ? Math.round(scoredResponses.reduce((sum, response) => sum + (Number(response.score) || 0), 0) / scoredResponses.length)
      : 0;
    const improvementAreas = getImprovementAreas(responses);
    return { practised, averageScore, improvementAreas };
  }, [responses]);

  return (
    <Paper
      elevation={0}
      sx={{
        mx: "auto",
        width: "100%",
        maxWidth: 980,
        p: { xs: 2, md: 2.5 },
        borderRadius: 1,
        border: "1px solid #d4dbe3",
        bgcolor: "#fff",
      }}
    >
      <Grid container spacing={2.5} alignItems="center">
        <Grid item xs={12} md={4}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={user?.photoURL || undefined} alt={user?.displayName || "PTE learner"} sx={{ width: 54, height: 54 }}>
              {user?.displayName?.[0] || "P"}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={950}>{user ? user.displayName || "PTE learner" : "Your PTE progress"}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user ? "Track your practice and weak areas" : "Login to track practice progress"}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1 }}>
            <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: "#f8fafc", textAlign: "center" }}>
              <Typography fontWeight={950} sx={{ fontSize: "1.65rem", lineHeight: 1 }}>
                {loading ? "..." : progress.practised}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={800}>
                questions practised
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: "#f0fdf4", textAlign: "center" }}>
              <Typography fontWeight={950} sx={{ fontSize: "1.65rem", lineHeight: 1 }}>
                {progress.averageScore || "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={800}>
                average score
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={1.2}>
            <Typography variant="body2" color="text.secondary" fontWeight={900}>
              Improve next
            </Typography>
            <Stack direction="row" gap={0.8} flexWrap="wrap">
              {progress.improvementAreas.map((area) => (
                <Chip key={area} label={area} size="small" sx={{ borderRadius: 1, bgcolor: "#eef2ff", color: "#3730a3", fontWeight: 900 }} />
              ))}
            </Stack>
            {user ? (
              <Button
                component="a"
                href="#premium-pte"
                variant="contained"
                startIcon={<WorkspacePremiumIcon />}
                sx={{ alignSelf: "flex-start", borderRadius: 1, textTransform: "none", fontWeight: 950, bgcolor: "#111827", "&:hover": { bgcolor: "#263142" } }}
              >
                Go premium and get expert level help from top instructors
              </Button>
            ) : (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  onClick={signInWithGoogle}
                  disabled={authLoading || !authConfigReady}
                  variant="contained"
                  startIcon={<GoogleIcon />}
                  sx={{ borderRadius: 1, textTransform: "none", fontWeight: 950, bgcolor: "#111827", "&:hover": { bgcolor: "#263142" } }}
                >
                  Login with Google
                </Button>
                <Button
                  component="a"
                  href="#premium-pte"
                  variant="outlined"
                  startIcon={<WorkspacePremiumIcon />}
                  sx={{ borderRadius: 1, textTransform: "none", fontWeight: 950, color: "#111827", borderColor: "#111827" }}
                >
                  Go premium
                </Button>
              </Stack>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

function SectionRoadmap({ section, questionCounts }) {
  const tasks = getSectionTasks(section.id);
  const starterCount = getSectionQuestionCount(tasks.map((task) => ({ ...task, slug: task.slug })));
  const effectiveCount = tasks.reduce((sum, task) => sum + (questionCounts[task.slug] ?? getTaskQuestions(task.slug).length), 0) || starterCount;

  return (
    <Box component="section" id={section.id} sx={{ scrollMarginTop: 96 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        sx={{ mb: 1.4 }}
      >
        <Box>
          <Typography component="h2" variant="h5" fontWeight={950}>
            {section.title}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
            {section.description}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={`${effectiveCount} starter questions`}
            sx={{
              borderRadius: 1,
              bgcolor: `${section.color}18`,
              color: section.color,
              fontWeight: 950,
            }}
          />
          <Chip label={`${tasks.filter((task) => task.textScoring).length} AI tasks`} sx={{ borderRadius: 1, bgcolor: "#f8fafc", fontWeight: 900 }} />
        </Stack>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
          gap: 1,
        }}
      >
        {tasks.map((task) => (
          <TaskPill key={task.slug} task={task} color={section.color} questionCount={questionCounts[task.slug]} />
        ))}
      </Box>
    </Box>
  );
}

export default function PtePracticeHome() {
  const popularTasks = popularTaskSlugs.map((slug) => pteTasks.find((task) => task.slug === slug)).filter(Boolean);
  const [questionCounts, setQuestionCounts] = useState({});
  const [totalStarterQuestions, setTotalStarterQuestions] = useState(getTotalQuestionCount());

  useEffect(() => {
    let active = true;
    fetchPublishedPteQuestionCounts()
      .then((data) => {
        if (!active) return;
        setQuestionCounts(data.countsByTask || {});
        setTotalStarterQuestions(data.total || getTotalQuestionCount());
      })
      .catch(() => {
        if (!active) return;
        setQuestionCounts({});
        setTotalStarterQuestions(getTotalQuestionCount());
      });
    return () => {
      active = false;
    };
  }, []);

  useSEO({
    title: "Free PTE Practice with AI Scoring | A Plus Academy",
    description:
      "Free PTE practice for essay writing, summarize written text, summarize spoken text, dictation, fill blanks, reading, listening, and speaking task guides.",
    canonical: `${siteUrl}/pte`,
    ogUrl: `${siteUrl}/pte`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", color: "#111827" }}>
      <Container sx={{ py: { xs: 3, md: 4 }, maxWidth: "1100px !important" }}>
        <Stack spacing={3.5}>
          <Box component="section" sx={{ textAlign: "center", maxWidth: 920, mx: "auto" }}>
            <Chip
              icon={<AutoAwesomeIcon />}
              label="Free PTE Practice"
              sx={{
                mb: 1.5,
                borderRadius: 1,
                bgcolor: "#111827",
                color: "#fff",
                fontWeight: 950,
                "& .MuiChip-icon": { color: "#22c55e" },
              }}
            />
            <Typography
              component="h1"
              sx={{
                fontWeight: 950,
                letterSpacing: 0,
                lineHeight: 1.08,
                fontSize: { xs: "2rem", md: "3.15rem" },
              }}
            >
              PTE practice questions with free starter sets in every task
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                mx: "auto",
                maxWidth: 760,
                color: "#475569",
                lineHeight: 1.7,
                fontSize: { xs: "1rem", md: "1.08rem" },
              }}
            >
              Choose a PTE task, practise with bundled A Plus Academy starter questions, use AI scoring for text-based answers, and keep moving through a larger day-one practice library.
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mt: 2.2 }}>
              <Button
                component={RouterLink}
                to="/pte/write-essay"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 1, textTransform: "none", fontWeight: 950, bgcolor: "#111827", "&:hover": { bgcolor: "#263142" } }}
              >
                Start Essay Scoring
              </Button>
              <Button
                component={RouterLink}
                to="/pte/describe-image"
                variant="outlined"
                sx={{ borderRadius: 1, textTransform: "none", fontWeight: 950, color: "#111827", borderColor: "#111827" }}
              >
                Try Describe Image
              </Button>
            </Stack>
          </Box>

          <Paper elevation={0} sx={{ p: { xs: 1.3, md: 1.5 }, borderRadius: 1, border: "1px solid #d4dbe3", bgcolor: "#fff" }}>
            <Stack direction="row" gap={1} justifyContent="center" flexWrap="wrap">
              {quickFilters.map((filter) => (
                <Button
                  key={filter.label}
                  component="a"
                  href={filter.href}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    textTransform: "none",
                    fontWeight: 900,
                    color: "#334155",
                    bgcolor: "#f8fafc",
                    px: 1.4,
                    "&:hover": { bgcolor: "#e2e8f0" },
                  }}
                >
                  {filter.label}
                </Button>
              ))}
            </Stack>
          </Paper>

          <LearnerProgressPanel />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
              gap: 2,
              maxWidth: 760,
              mx: "auto",
              width: "100%",
            }}
          >
            {[
              [`${pteTasks.length}+`, "PTE task pages"],
              [`${textScoredTasks.length}`, "AI-scored text tasks"],
              [`${totalStarterQuestions}+`, "starter questions"],
              ["20 min", "timed essay practice"],
            ].map(([value, label]) => (
              <Paper key={label} elevation={0} sx={{ p: 2, borderRadius: 1, border: "1px solid #d4dbe3", bgcolor: "#fff", textAlign: "center" }}>
                <Typography fontWeight={950} sx={{ fontSize: { xs: "1.55rem", md: "2.1rem" }, lineHeight: 1 }}>
                  {value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.7, fontWeight: 800 }}>
                  {label}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Box component="section" id="free-ai-scoring" sx={{ scrollMarginTop: 96 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} justifyContent="center" alignItems="center" sx={{ mb: 1.6, textAlign: "center" }}>
              <Box sx={{ maxWidth: 700 }}>
                <Typography component="h2" variant="h5" fontWeight={950}>
                  Popular free PTE practice tasks
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  Start with the most searched areas, then move task by task through the bundled question sets.
                </Typography>
              </Box>
              <Chip label="15 starter questions per task" sx={{ borderRadius: 1, bgcolor: "#dcfce7", color: "#047857", fontWeight: 950 }} />
            </Stack>
            <Grid container spacing={1.5}>
              {popularTasks.map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task.slug}>
                  <PopularTaskCard task={task} questionCount={questionCounts[task.slug]} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 1, border: "1px solid #d4dbe3", bgcolor: "#fff" }}>
            <Stack spacing={3}>
              {pteSections.map((section) => (
                <React.Fragment key={section.id}>
                  <SectionRoadmap section={section} questionCounts={questionCounts} />
                  {section.id !== pteSections[pteSections.length - 1].id && <Divider />}
                </React.Fragment>
              ))}
            </Stack>
          </Paper>

          <Paper
            id="premium-pte"
            elevation={0}
            sx={{
              scrollMarginTop: 96,
              p: { xs: 2.5, md: 3 },
              borderRadius: 1,
              border: "1px solid #111827",
              bgcolor: "#111827",
              color: "#fff",
            }}
          >
            <Grid container spacing={2.5} alignItems="center">
              <Grid item xs={12} md={7}>
                <Stack spacing={1.2}>
                  <Chip
                    icon={<WorkspacePremiumIcon />}
                    label="Premium student plan"
                    sx={{ alignSelf: "flex-start", borderRadius: 1, bgcolor: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 950, "& .MuiChip-icon": { color: "#fbbf24" } }}
                  />
                  <Typography component="h2" variant="h5" fontWeight={950}>
                    Get personal PTE help when practice is not enough
                  </Typography>
                  <Typography sx={{ lineHeight: 1.75, color: "#cbd5e1" }}>
                    Keep the free practice open for everyone, then offer paid support for writing review, speaking correction, weekly targets, and study abroad English guidance.
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Stack spacing={1}>
                  {["Teacher feedback", "Speaking sessions", "Weekly writing plan", "Study abroad English guide"].map((item) => (
                    <Stack key={item} direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon sx={{ color: "#22c55e" }} />
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
