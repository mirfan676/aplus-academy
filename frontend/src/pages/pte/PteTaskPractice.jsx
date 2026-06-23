import React, { useState } from "react";
import { Link as RouterLink, Navigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import GoogleIcon from "@mui/icons-material/Google";
import SendIcon from "@mui/icons-material/Send";
import PteCoachResult from "../../components/pte/PteCoachResult";
import { useAuth } from "../../contexts/useAuth";
import useSEO from "../../hooks/useSEO";
import { requestAiPteTaskScore } from "../../services/pteTaskAiScoring";
import { getPteTask, pteSections } from "./ptePracticeData";

const siteUrl = "https://www.aplusacademy.pk";
const analysisSteps = [
  "Reading your PTE response",
  "Checking task form and content",
  "Reviewing grammar and vocabulary",
  "Preparing improvement tips",
];

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

const localScore = (task, responseText) => {
  const words = countWords(responseText);
  const min = task.minWords || 1;
  const max = task.maxWords || 500;
  const formScore = words >= min && words <= max ? 15 : Math.max(5, 15 - Math.abs(words - Math.min(Math.max(words, min), max)));
  const sampleWords = new Set(String(task.sample).toLowerCase().match(/[a-z]+/g) || []);
  const responseWords = String(responseText).toLowerCase().match(/[a-z]+/g) || [];
  const overlap = responseWords.filter((word) => sampleWords.has(word)).length;
  const contentScore = Math.min(15, Math.max(4, Math.round((overlap / Math.max(1, sampleWords.size)) * 18)));
  const grammarScore = /[.!?]$/.test(responseText.trim()) || words < 12 ? 12 : 9;
  const vocabularyScore = new Set(responseWords).size > Math.max(5, responseWords.length * 0.55) ? 13 : 10;
  const criteria = [
    { label: "Content", score: contentScore, maximum: 15 },
    { label: "Form", score: formScore, maximum: 15 },
    { label: "Grammar", score: grammarScore, maximum: 15 },
    { label: "Vocabulary", score: vocabularyScore, maximum: 15 },
  ];
  const total = Math.min(90, Math.round((criteria.reduce((sum, item) => sum + item.score, 0) / 60) * 90));
  return {
    mode: "adaptive",
    total,
    maximum: 90,
    criteria,
    narrative: `Your response is estimated at ${total}/90 for practice. Use this as learning feedback, not an official Pearson score.`,
    guidance: [
      words < min ? `Write at least ${min} words for this task.` : `Your word count is within the basic range for this task.`,
      "Keep the answer directly connected to the prompt.",
      "Check grammar, spelling, and academic word choice before submitting.",
    ],
    annotations: [],
    analysis: {
      wordCount: words,
      advancedTerms: [],
      complexSentenceCount: 0,
      paragraphCount: 1,
      contractionCount: /\b(can't|don't|won't|isn't|aren't|didn't|doesn't|haven't|hasn't)\b/i.test(responseText) ? 1 : 0,
      informalCount: /\b(kids|stuff|things|okay|ok)\b/i.test(responseText) ? 1 : 0,
    },
  };
};

export default function PteTaskPractice() {
  const { slug } = useParams();
  const task = getPteTask(slug);
  const { authError, hasFirebaseConfig, loading: authLoading, signInWithGoogle, user } = useAuth();
  const [responseText, setResponseText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [analysisStep, setAnalysisStep] = useState(-1);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  const section = pteSections.find((item) => item.id === task?.section);
  const wordCount = countWords(responseText);
  const Icon = task?.icon;

  useSEO({
    title: task?.seoTitle || "PTE Practice | A Plus Academy",
    description: task?.description || "Free PTE practice with AI scoring for text-based tasks.",
    canonical: `${siteUrl}/pte/${task?.slug || ""}`,
    ogUrl: `${siteUrl}/pte/${task?.slug || ""}`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  if (!task) return <Navigate to="/pte" replace />;
  if (task.slug === "write-essay") return <Navigate to="/pte/write-essay" replace />;

  const submit = async () => {
    setError("");
    setNotice("");
    if (!user) return setError("Login with Google to use AI scoring.");
    const localResult = localScore(task, responseText);
    setSubmitting(true);
    setAnalysisStep(0);
    const stageTimer = window.setInterval(() => setAnalysisStep((current) => Math.min(current + 1, analysisSteps.length - 1)), 700);
    try {
      const minimumTime = new Promise((resolve) => window.setTimeout(resolve, 2800));
      let scored = localResult;
      try {
        [scored] = await Promise.all([requestAiPteTaskScore({ user, task, responseText, localResult }), minimumTime]);
      } catch (aiError) {
        console.warn(aiError);
        await minimumTime;
        setNotice("AI scoring is unavailable right now, so the adaptive educational scorer was used.");
      }
      setResult({
        ...scored,
        essayText: responseText,
        vocabularyRange: scored.vocabularyRange ?? 0,
        argumentQuality: scored.argumentQuality ?? 0,
        analysis: { ...localResult.analysis, ...(scored.analysis || {}), wordCount },
      });
    } catch (submitError) {
      setError(submitError.message || "This response could not be scored.");
    } finally {
      window.clearInterval(stageTimer);
      setSubmitting(false);
      setAnalysisStep(-1);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6fbf9" }}>
      <Box component="section" sx={{ color: "#fff", background: `linear-gradient(135deg, ${section?.color || "#0f766e"}, #111827)` }}>
        <Container sx={{ py: { xs: 3.5, md: 5 } }}>
          <Stack spacing={2.2} sx={{ maxWidth: 900 }}>
            <Button component={RouterLink} to="/pte" startIcon={<ArrowBackIcon />} sx={{ alignSelf: "flex-start", borderRadius: 1, textTransform: "none", color: "#fff", fontWeight: 900, border: "1px solid rgba(255,255,255,0.28)" }}>
              PTE Practice
            </Button>
            <Stack direction="row" spacing={1.2} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip label={section?.title || "PTE"} sx={{ borderRadius: 1, bgcolor: "rgba(255,255,255,0.16)", color: "#fff", fontWeight: 900 }} />
              <Chip label={task.textScoring ? "Free AI scoring" : "Practice guide"} sx={{ borderRadius: 1, bgcolor: task.textScoring ? "#ecfdf5" : "rgba(255,255,255,0.16)", color: task.textScoring ? "#047857" : "#fff", fontWeight: 900 }} />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 64, height: 64, display: "grid", placeItems: "center", borderRadius: 1, bgcolor: "rgba(255,255,255,0.16)" }}>
                <Icon sx={{ fontSize: 38 }} />
              </Box>
              <Box>
                <Typography component="h1" variant="h2" sx={{ fontWeight: 900, lineHeight: 1.1, fontSize: { xs: "1.9rem", md: "2.8rem" } }}>
                  {task.title}
                </Typography>
                <Typography sx={{ mt: 1, opacity: 0.8 }}>{task.time}</Typography>
              </Box>
            </Stack>
            <Typography variant="h6" sx={{ lineHeight: 1.75, opacity: 0.9 }}>
              {task.description}
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container component="main" sx={{ py: { xs: 3, md: 4.5 } }}>
        <Stack spacing={3}>
          <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 1, border: "1px solid #dfe9e4", bgcolor: "#fff" }}>
            <Stack spacing={2.5}>
              <Typography component="h2" variant="h4" fontWeight={900}>
                Practice question
              </Typography>
              <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.85, p: 2, borderLeft: `4px solid ${section?.color || "#0f766e"}`, bgcolor: "#f8fafc" }}>
                {task.prompt}
              </Typography>
              <Box>
                <Typography component="h3" variant="h6" fontWeight={900} gutterBottom>
                  Tips
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {task.tips.map((tip) => (
                    <Chip key={tip} label={tip} sx={{ borderRadius: 1, fontWeight: 800 }} />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {task.textScoring ? (
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 1, border: "1px solid #dfe9e4", bgcolor: "#fff" }}>
              <Stack spacing={2.2}>
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
                  <Box>
                    <Typography component="h2" variant="h4" fontWeight={900}>
                      Free AI scoring
                    </Typography>
                    <Typography color="text.secondary">
                      Type your answer below. This page only sends typed text for scoring.
                    </Typography>
                  </Box>
                  <Chip label={`${wordCount} words`} sx={{ alignSelf: { xs: "flex-start", md: "center" }, borderRadius: 1, fontWeight: 900 }} />
                </Stack>
                {!user && (
                  <Alert
                    severity="info"
                    action={
                      <Button color="inherit" startIcon={authLoading ? <CircularProgress size={16} /> : <GoogleIcon />} disabled={authLoading || !hasFirebaseConfig} onClick={signInWithGoogle}>
                        Login
                      </Button>
                    }
                  >
                    Login with Google to practise this PTE question and use AI scoring.
                  </Alert>
                )}
                {(authError || error) && <Alert severity="warning">{error || authError}</Alert>}
                {notice && <Alert severity="info">{notice}</Alert>}
                <TextField
                  value={responseText}
                  onChange={(event) => {
                    setResponseText(event.target.value);
                    setResult(null);
                    setError("");
                  }}
                  multiline
                  minRows={8}
                  fullWidth
                  placeholder="Type your PTE response here..."
                  sx={{ "& .MuiInputBase-root": { alignItems: "flex-start", lineHeight: 1.8 } }}
                />
                {submitting && analysisStep >= 0 && (
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <AutoAwesomeIcon color="primary" />
                      <Typography fontWeight={900}>{analysisSteps[analysisStep]}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={((analysisStep + 1) / analysisSteps.length) * 100} />
                  </Box>
                )}
                <Button
                  variant="contained"
                  size="large"
                  startIcon={submitting ? <CircularProgress color="inherit" size={18} /> : <SendIcon />}
                  disabled={submitting || !user || wordCount < (task.minWords || 1)}
                  onClick={submit}
                  sx={{ alignSelf: "flex-start", borderRadius: 1, textTransform: "none", fontWeight: 900, bgcolor: section?.color || "#0f766e", "&:hover": { bgcolor: section?.color || "#0f766e", filter: "brightness(0.95)" } }}
                >
                  Score my answer
                </Button>
              </Stack>
            </Paper>
          ) : (
            <Alert severity="info">
              This task is not opened for AI scoring yet because real scoring depends on audio, pronunciation, or interactive choices. For now, this page gives practice guidance and original sample material.
            </Alert>
          )}

          {result && <PteCoachResult result={result} />}

          <Paper elevation={0} sx={{ p: 3, borderRadius: 1, border: "1px solid #dfe9e4", bgcolor: "#fff" }}>
            <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>
              Sample answer or model direction
            </Typography>
            <Typography sx={{ lineHeight: 1.85, color: "text.secondary", whiteSpace: "pre-line" }}>
              {task.sample}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button component={RouterLink} to="/pte" variant="outlined" sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}>
              View all PTE sections
            </Button>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
