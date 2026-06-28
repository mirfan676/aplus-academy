import React, { useEffect, useMemo, useState } from "react";
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
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SendIcon from "@mui/icons-material/Send";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import PteCoachResult from "../../components/pte/PteCoachResult";
import { useAuth } from "../../contexts/useAuth";
import useSEO from "../../hooks/useSEO";
import { fetchPublishedPteQuestions } from "../../services/pteQuestionsData";
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
const clean = (value) => String(value || "").toLowerCase().replace(/\s+/g, " ").replace(/[^\w\s>,-]/g, "").trim();

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

const evaluateNonAiResponse = ({ question, responseText, selectedOptions }) => {
  const choiceMode = question.practiceMode === "choice";
  const answerMode = question.practiceMode === "short-answer";
  const exactAnswers = (question.acceptableAnswers || []).map(clean).filter(Boolean);
  const selected = [...selectedOptions].sort();
  const correctIds = [...(question.correctOptionIds || [])].sort();
  const normalizedText = clean(responseText);
  const choiceCorrect = choiceMode && JSON.stringify(selected) === JSON.stringify(correctIds);
  const answerCorrect = answerMode && exactAnswers.some((item) => normalizedText === item);
  const textLikeCorrect = !choiceMode && !answerMode;
  const total = choiceMode ? (choiceCorrect ? 90 : 35) : answerMode ? (answerCorrect ? 90 : 42) : 68;

  return {
    mode: "adaptive",
    total,
    maximum: 90,
    criteria: [
      { label: "Task Accuracy", score: choiceMode ? (choiceCorrect ? 15 : 6) : answerMode ? (answerCorrect ? 15 : 7) : 12, maximum: 15 },
      { label: "Content", score: choiceMode ? (choiceCorrect ? 15 : 5) : answerMode ? (answerCorrect ? 15 : 6) : 12, maximum: 15 },
      { label: "Form", score: textLikeCorrect ? 12 : 15, maximum: 15 },
      { label: "Vocabulary", score: 12, maximum: 15 },
    ],
    narrative: choiceMode
      ? choiceCorrect
        ? "Correct. Your selected option set matches the expected answer."
        : "Your selected option set does not match the expected answer yet."
      : answerMode
        ? answerCorrect
          ? "Correct. Your typed answer matches an accepted answer."
          : "Your typed answer does not match the accepted answer yet."
        : "This practice task uses local educational feedback rather than official scoring.",
    guidance: [
      question.explanation || "Review the model answer and try the question again.",
      choiceMode ? "Read every option against the passage, not against one familiar keyword." : "Compare your response to the model direction and refine weak areas.",
      "Use the next question button to continue through the starter practice set.",
    ],
    annotations: [],
    analysis: {
      wordCount: countWords(responseText),
      advancedTerms: [],
      complexSentenceCount: 0,
      paragraphCount: 1,
      contractionCount: 0,
      informalCount: 0,
    },
    vocabularyRange: 0,
    argumentQuality: 0,
  };
};

export default function PteTaskPractice() {
  const { slug } = useParams();
  const task = getPteTask(slug);
  const { authError, hasFirebaseConfig, loading: authLoading, signInWithGoogle, user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responseText, setResponseText] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [analysisStep, setAnalysisStep] = useState(-1);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  const currentQuestion = questions[questionIndex] || null;
  const effectiveTask = useMemo(() => ({
    ...task,
    prompt: currentQuestion?.prompt || task?.prompt,
    sample: currentQuestion?.sample || currentQuestion?.explanation || task?.sample,
    tips: currentQuestion?.tips || task?.tips || [],
    minWords: currentQuestion?.minWords ?? task?.minWords,
    maxWords: currentQuestion?.maxWords ?? task?.maxWords,
  }), [currentQuestion, task]);
  const section = pteSections.find((item) => item.id === task?.section);
  const wordCount = countWords(responseText);
  const Icon = task?.icon;

  useEffect(() => {
    let active = true;
    setQuestionsLoading(true);
    fetchPublishedPteQuestions(slug)
      .then((records) => {
        if (active) setQuestions(records);
      })
      .catch(() => {
        if (active) setQuestions([]);
      })
      .finally(() => {
        if (active) setQuestionsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    setQuestionIndex(0);
    setResponseText("");
    setSelectedOptions([]);
    setResult(null);
    setError("");
    setNotice("");
  }, [slug]);

  useSEO({
    title: task?.seoTitle || "PTE Practice | A Plus Academy",
    description: task?.description || "Free PTE practice with AI scoring for text-based tasks.",
    canonical: `${siteUrl}/pte/${task?.slug || ""}`,
    ogUrl: `${siteUrl}/pte/${task?.slug || ""}`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  if (!task) return <Navigate to="/pte" replace />;
  if (task.slug === "write-essay") return <Navigate to="/pte/write-essay" replace />;

  const toggleOption = (optionIdValue) => {
    const isMulti = (currentQuestion?.correctOptionIds || []).length > 1;
    setSelectedOptions((current) => {
      if (!isMulti) return current.includes(optionIdValue) ? [] : [optionIdValue];
      return current.includes(optionIdValue) ? current.filter((item) => item !== optionIdValue) : [...current, optionIdValue];
    });
  };

  const nextQuestion = () => {
    setQuestionIndex((current) => (questions.length ? (current + 1) % questions.length : 0));
    setResponseText("");
    setSelectedOptions([]);
    setResult(null);
    setError("");
    setNotice("");
  };

  const randomQuestion = () => {
    if (!questions.length) return;
    let next = questionIndex;
    while (questions.length > 1 && next === questionIndex) {
      next = Math.floor(Math.random() * questions.length);
    }
    setQuestionIndex(next);
    setResponseText("");
    setSelectedOptions([]);
    setResult(null);
    setError("");
    setNotice("");
  };

  const playAudio = () => {
    const text = currentQuestion?.audioText || currentQuestion?.transcript;
    if (!text) {
      setNotice("No bundled audio text is attached to this question yet.");
      return;
    }
    if (!("speechSynthesis" in window)) {
      setNotice("Browser speech playback is not available on this device.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const submit = async () => {
    setError("");
    setNotice("");
    if (task.textScoring && !user) return setError("Login with Google to use AI scoring.");
    if (currentQuestion?.practiceMode === "choice" && !selectedOptions.length) return setError("Select at least one answer before checking the question.");
    if (currentQuestion?.practiceMode !== "choice" && !responseText.trim()) return setError("Write your response before checking the question.");
    const localResult = localScore(effectiveTask, responseText);
    setSubmitting(true);
    setAnalysisStep(0);
    const stageTimer = window.setInterval(() => setAnalysisStep((current) => Math.min(current + 1, analysisSteps.length - 1)), 700);
    try {
      const minimumTime = new Promise((resolve) => window.setTimeout(resolve, 2800));
      let scored = localResult;
      if (task.textScoring) {
        try {
          [scored] = await Promise.all([requestAiPteTaskScore({ user, task: effectiveTask, responseText, localResult }), minimumTime]);
        } catch (aiError) {
          console.warn(aiError);
          await minimumTime;
          setNotice("AI scoring is unavailable right now, so the adaptive educational scorer was used.");
        }
      } else {
        await minimumTime;
        scored = evaluateNonAiResponse({ question: currentQuestion || effectiveTask, responseText, selectedOptions });
        setNotice("This task currently uses free local practice feedback with bundled answer keys.");
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
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={1.5}>
                <Box>
                  <Typography component="h2" variant="h4" fontWeight={900}>
                    Practice question
                  </Typography>
                  {questions.length ? (
                    <Typography color="text.secondary">
                      Question {questionIndex + 1} of {questions.length}
                    </Typography>
                  ) : null}
                </Box>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {(currentQuestion?.audioText || currentQuestion?.transcript) ? (
                    <Button variant="outlined" startIcon={<PlayArrowIcon />} onClick={playAudio} sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}>
                      Play audio
                    </Button>
                  ) : null}
                  {questions.length > 1 ? (
                    <>
                      <Button variant="outlined" onClick={nextQuestion} sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}>
                        Next question
                      </Button>
                      <Button variant="text" startIcon={<ShuffleIcon />} onClick={randomQuestion} sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}>
                        Random
                      </Button>
                    </>
                  ) : null}
                </Stack>
              </Stack>
              <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.85, p: 2, borderLeft: `4px solid ${section?.color || "#0f766e"}`, bgcolor: "#f8fafc" }}>
                {effectiveTask.prompt}
              </Typography>
              {questionsLoading ? <LinearProgress /> : null}
              <Box>
                <Typography component="h3" variant="h6" fontWeight={900} gutterBottom>
                  Tips
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {effectiveTask.tips.map((tip) => (
                    <Chip key={tip} label={tip} sx={{ borderRadius: 1, fontWeight: 800 }} />
                  ))}
                </Stack>
              </Box>
              {currentQuestion?.transcript ? (
                <Alert severity="info">Transcript available after playback: {currentQuestion.transcript}</Alert>
              ) : null}
            </Stack>
          </Paper>

          {task.textScoring || currentQuestion?.practiceMode ? (
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 1, border: "1px solid #dfe9e4", bgcolor: "#fff" }}>
              <Stack spacing={2.2}>
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
                  <Box>
                    <Typography component="h2" variant="h4" fontWeight={900}>
                      {task.textScoring ? "Free AI scoring" : "Practice response"}
                    </Typography>
                    <Typography color="text.secondary">
                      {task.textScoring ? "Type your answer below. This page only sends typed text for scoring." : "Use the bundled starter question set to practise immediately."}
                    </Typography>
                  </Box>
                  {currentQuestion?.practiceMode !== "choice" ? <Chip label={`${wordCount} words`} sx={{ alignSelf: { xs: "flex-start", md: "center" }, borderRadius: 1, fontWeight: 900 }} /> : null}
                </Stack>
                {task.textScoring && !user && (
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
                {currentQuestion?.practiceMode === "choice" ? (
                  <Stack spacing={1.2}>
                    {(currentQuestion.options || []).map((option) => {
                      const selected = selectedOptions.includes(option.id);
                      return (
                        <Button
                          key={option.id}
                          onClick={() => toggleOption(option.id)}
                          variant={selected ? "contained" : "outlined"}
                          sx={{
                            justifyContent: "flex-start",
                            borderRadius: 1,
                            textTransform: "none",
                            fontWeight: 800,
                            py: 1.2,
                          }}
                        >
                          {option.text}
                        </Button>
                      );
                    })}
                  </Stack>
                ) : (
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
                )}
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
                  disabled={
                    submitting ||
                    (task.textScoring && (!user || wordCount < (effectiveTask.minWords || 1))) ||
                    (!task.textScoring && currentQuestion?.practiceMode !== "choice" && !responseText.trim()) ||
                    (!task.textScoring && currentQuestion?.practiceMode === "choice" && !selectedOptions.length)
                  }
                  onClick={submit}
                  sx={{ alignSelf: "flex-start", borderRadius: 1, textTransform: "none", fontWeight: 900, bgcolor: section?.color || "#0f766e", "&:hover": { bgcolor: section?.color || "#0f766e", filter: "brightness(0.95)" } }}
                >
                  {task.textScoring ? "Score my answer" : "Check my answer"}
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
              {effectiveTask.sample}
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
