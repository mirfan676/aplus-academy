import React, { useEffect, useMemo, useRef, useState } from "react";
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
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import StopIcon from "@mui/icons-material/Stop";
import PteCoachResult from "../../components/pte/PteCoachResult";
import { useAuth } from "../../contexts/useAuth";
import useSEO from "../../hooks/useSEO";
import { fetchPublishedPteQuestions } from "../../services/pteQuestionsData";
import { submitPteTaskResponse } from "../../services/pteTaskResponseData";
import { requestAiPteTaskScore } from "../../services/pteTaskAiScoring";
import { getPteTask, pteSections } from "./ptePracticeData";

const siteUrl = "https://www.aplusacademy.pk";
const freeformAiTasks = new Set(["respond-to-a-situation", "summarize-written-text", "summarize-spoken-text"]);
const objectiveTasks = new Set([
  "reading-writing-fill-blanks",
  "reading-fill-blanks",
  "listening-fill-blanks",
  "reorder-paragraphs",
  "write-from-dictation",
  "highlight-incorrect-words",
  "multiple-choice-multiple-answers",
  "reading-multiple-choice-single-answer",
  "highlight-correct-summary",
  "select-missing-word",
  "answer-short-question",
  "repeat-sentence",
]);
const speakingRecorderTasks = new Set(["read-aloud", "repeat-sentence", "describe-image", "retell-lecture"]);
const analysisSteps = [
  "Reading your PTE response",
  "Checking task form and content",
  "Reviewing grammar and vocabulary",
  "Preparing improvement tips",
];

const countWords = (text) => String(text || "").trim().split(/\s+/).filter(Boolean).length;
const countSentences = (text) => String(text || "").split(/[.!?]+/).map((item) => item.trim()).filter(Boolean).length;
const clean = (value) => String(value || "").toLowerCase().replace(/\s+/g, " ").replace(/[^\w\s>,-]/g, "").trim();
const normalizedTokens = (value) => clean(value).split(/[\s,]+/).filter(Boolean);

const buildAnalysis = (responseText) => ({
  wordCount: countWords(responseText),
  sentenceCount: countSentences(responseText),
  advancedTerms: [],
  complexSentenceCount: (String(responseText || "").match(/\b(although|whereas|however|therefore|while|because|which|that)\b/gi) || []).length,
  paragraphCount: String(responseText || "").split(/\n\s*\n/).filter((item) => item.trim()).length || 1,
  contractionCount: (String(responseText || "").match(/\b(can't|don't|won't|isn't|aren't|didn't|doesn't|haven't|hasn't|i'm|it's)\b/gi) || []).length,
  informalCount: (String(responseText || "").match(/\b(kids|stuff|things|okay|ok|gonna|wanna)\b/gi) || []).length,
});

const buildCriteria = (pairs) => pairs.map(([label, score]) => ({ label, score, maximum: 15 }));

const exactMatch = (responseText, answers) => {
  const normalized = clean(responseText);
  return answers.map(clean).filter(Boolean).some((answer) => normalized === answer);
};

const tokensMatch = (responseText, answers) => {
  const learner = normalizedTokens(responseText).join(" ");
  return answers.map((answer) => normalizedTokens(answer).join(" ")).some((answer) => learner === answer);
};

const compareTokenOverlap = (responseText, expectedText) => {
  const response = normalizedTokens(responseText);
  const expected = normalizedTokens(expectedText);
  if (!expected.length) return 0;
  let matches = 0;
  expected.forEach((token, index) => {
    if (response[index] === token) matches += 1;
  });
  return matches / expected.length;
};

const getExpectedAnswer = (question) => {
  if (Array.isArray(question.acceptableAnswers) && question.acceptableAnswers.length) {
    return question.acceptableAnswers[0];
  }
  if (Array.isArray(question.correctOptionIds) && question.correctOptionIds.length) {
    return question.correctOptionIds
      .map((id) => question.options?.find((option) => option.id === id)?.text || id)
      .join(", ");
  }
  return question.sample || question.explanation || "";
};

const evaluateObjectiveTask = ({ task, question, responseText, selectedOptions }) => {
  const expectedAnswer = getExpectedAnswer(question);
  const practiceMode = question.practiceMode || "text";
  const answers = Array.isArray(question.acceptableAnswers) ? question.acceptableAnswers : [];
  const selected = [...selectedOptions].sort();
  const correctIds = [...(question.correctOptionIds || [])].sort();
  let isCorrect = false;
  let accuracyRatio = 0;

  if (practiceMode === "choice") {
    isCorrect = JSON.stringify(selected) === JSON.stringify(correctIds);
    const overlap = selected.filter((item) => correctIds.includes(item)).length;
    accuracyRatio = correctIds.length ? overlap / correctIds.length : 0;
  } else if (task.slug === "write-from-dictation") {
    accuracyRatio = compareTokenOverlap(responseText, expectedAnswer);
    isCorrect = accuracyRatio === 1;
  } else if (task.slug === "highlight-incorrect-words") {
    const learner = clean(responseText).replace(/\s*to\s*/g, " -> ");
    const expected = clean(expectedAnswer).replace(/\s*to\s*/g, " -> ");
    isCorrect = learner === expected;
    accuracyRatio = isCorrect ? 1 : 0;
  } else if (task.slug === "reorder-paragraphs") {
    isCorrect = tokensMatch(responseText, answers);
    accuracyRatio = isCorrect ? 1 : compareTokenOverlap(responseText, expectedAnswer);
  } else {
    isCorrect = exactMatch(responseText, answers) || tokensMatch(responseText, answers);
    accuracyRatio = isCorrect ? 1 : compareTokenOverlap(responseText, expectedAnswer);
  }

  const accuracyScore = Math.max(2, Math.round(accuracyRatio * 15));
  const formScore = Math.max(4, task.slug === "write-from-dictation" ? Math.round(Math.min(1, accuracyRatio + 0.15) * 15) : 15);
  const controlScore = Math.max(3, Math.round((practiceMode === "choice" ? accuracyRatio : Math.min(1, accuracyRatio + 0.1)) * 15));
  const reviewScore = isCorrect ? 15 : Math.max(4, Math.round((0.35 + accuracyRatio * 0.5) * 15));
  const criteria = buildCriteria([
    ["Task Accuracy", accuracyScore],
    ["Content", accuracyScore],
    ["Form", formScore],
    [task.slug === "write-from-dictation" ? "Spelling" : "Control", controlScore],
    ["Review", reviewScore],
  ]);
  const total = Math.min(90, Math.round((criteria.reduce((sum, item) => sum + item.score, 0) / (criteria.length * 15)) * 90));

  return {
    mode: "adaptive",
    resultType: "objective",
    taskSlug: task.slug,
    total,
    maximum: 90,
    isCorrect,
    expectedAnswer,
    responseText: practiceMode === "choice"
      ? selected.map((id) => question.options?.find((option) => option.id === id)?.text || id).join(", ")
      : responseText,
    criteria,
    narrative: isCorrect
      ? "Correct. Your answer matches the expected response for this practice question."
      : "This answer does not match the expected response yet. Review the exact word choice, order, or option logic.",
    guidance: [
      question.explanation || "Check the model answer and compare each missing or incorrect part.",
      task.slug.includes("fill") ? "Read the whole sentence again after filling the blank so grammar and meaning both fit." : "Match the exact meaning and form expected by the task.",
      task.slug === "write-from-dictation" ? "For dictation, check every word, plural ending, and article." : "Use another question to reinforce the same pattern.",
    ],
    annotations: [],
    analysis: buildAnalysis(responseText),
  };
};

const localFreeformScore = (task, responseText) => {
  const words = countWords(responseText);
  const min = task.minWords || 1;
  const max = task.maxWords || 500;
  const inRange = words >= min && words <= max;
  const analysis = buildAnalysis(responseText);

  let criteria = [];
  if (task.slug === "summarize-written-text" || task.slug === "summarize-spoken-text") {
    criteria = buildCriteria([
      ["Content", 11],
      ["Form", inRange ? 15 : 7],
      ["Grammar", analysis.contractionCount === 0 ? 12 : 9],
      ["Vocabulary", 11],
      ["Coherence", analysis.sentenceCount <= 2 ? 12 : 9],
    ]);
  } else {
    criteria = buildCriteria([
      ["Task Accuracy", 11],
      ["Content", 12],
      ["Form", inRange ? 15 : 7],
      ["Grammar", analysis.contractionCount === 0 ? 12 : 9],
      ["Vocabulary", 11],
      ["Coherence", 12],
    ]);
  }

  const total = Math.min(90, Math.round((criteria.reduce((sum, item) => sum + item.score, 0) / (criteria.length * 15)) * 90));

  return {
    mode: "adaptive",
    taskSlug: task.slug,
    total,
    maximum: 90,
    criteria,
    narrative: `Your response has been checked as practice feedback for ${task.title}. This is an educational estimate, not an official Pearson score.`,
    guidance: [
      inRange ? `Your word count is within the practice range for ${task.title}.` : `Keep your response between ${min} and ${max} words.`,
      task.slug === "respond-to-a-situation" ? "Stay polite, practical, and complete the situation clearly." : "Keep the answer directly focused on the prompt.",
      "Tighten grammar, wording, and sentence control before submitting another attempt.",
    ],
    annotations: [],
    analysis,
  };
};

const DescribeImagePreview = ({ question, sectionColor }) => {
  if (question.imageUrl) {
    return (
      <Box sx={{ p: 2, border: "1px solid #dfe9e4", borderRadius: 1, bgcolor: "#fff" }}>
        <Box component="img" src={question.imageUrl} alt={question.imageAlt || question.title || "Describe image prompt"} sx={{ width: "100%", maxHeight: 320, objectFit: "contain", display: "block" }} />
      </Box>
    );
  }

  const spec = question.imageSpec;
  if (!spec || spec.type !== "bar-chart") return null;
  const max = Math.max(...(spec.values || [100]), 100);
  const barColors = ["#0f766e", "#2563eb", "#f97316"];

  return (
    <Box sx={{ p: 2, border: "1px solid #dfe9e4", borderRadius: 1, bgcolor: "#fff" }}>
      <Typography fontWeight={900} sx={{ mb: 1.2 }}>{spec.title}</Typography>
      <Box component="svg" viewBox="0 0 520 260" sx={{ width: "100%", height: "auto", display: "block" }}>
        <line x1="60" y1="20" x2="60" y2="210" stroke="#94a3b8" strokeWidth="2" />
        <line x1="60" y1="210" x2="480" y2="210" stroke="#94a3b8" strokeWidth="2" />
        {(spec.values || []).map((value, index) => {
          const barHeight = (value / max) * 150;
          const x = 95 + index * 125;
          const y = 210 - barHeight;
          return (
            <g key={`${spec.labels[index]}-${value}`}>
              <rect x={x} y={y} width="72" height={barHeight} rx="8" fill={barColors[index % barColors.length]} opacity="0.9" />
              <text x={x + 36} y={y - 10} textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="700">{value}{spec.unit || ""}</text>
              <text x={x + 36} y="232" textAnchor="middle" fill="#334155" fontSize="13">{spec.labels[index]}</text>
            </g>
          );
        })}
        <text x="20" y="28" fill={sectionColor} fontSize="14" fontWeight="700">{spec.unit || "%"}</text>
      </Box>
    </Box>
  );
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
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [savingAttempt, setSavingAttempt] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const currentQuestion = questions[questionIndex] || null;
  const section = pteSections.find((item) => item.id === task?.section);
  const wordCount = countWords(responseText);
  const Icon = task?.icon;
  const requiresAi = freeformAiTasks.has(task?.slug);
  const isSpeakingPractice = speakingRecorderTasks.has(task?.slug);
  const supportsObjectiveCheck = objectiveTasks.has(task?.slug) || currentQuestion?.practiceMode === "choice" || currentQuestion?.practiceMode === "short-answer";
  const effectiveTask = useMemo(() => ({
    ...task,
    prompt: currentQuestion?.prompt || task?.prompt,
    sample: currentQuestion?.sample || currentQuestion?.explanation || task?.sample,
    tips: currentQuestion?.tips || task?.tips || [],
    minWords: currentQuestion?.minWords ?? task?.minWords,
    maxWords: currentQuestion?.maxWords ?? task?.maxWords,
  }), [currentQuestion, task]);

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
    setRecording(false);
    setRecordingSeconds(0);
    setRecordedUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return "";
    });
  }, [slug]);

  useEffect(() => () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
  }, [recordedUrl]);

  useEffect(() => {
    if (!recording) return undefined;
    const timer = window.setInterval(() => setRecordingSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  useSEO({
    title: task?.seoTitle || "PTE Practice | A Plus Academy",
    description: task?.description || "Free PTE practice with AI scoring for text-based tasks.",
    canonical: `${siteUrl}/pte/${task?.slug || ""}`,
    ogUrl: `${siteUrl}/pte/${task?.slug || ""}`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  if (!task) return <Navigate to="/pte" replace />;
  if (task.slug === "write-essay") return <Navigate to="/pte/write-essay" replace />;

  const resetForNextQuestion = (nextIndex) => {
    setQuestionIndex(nextIndex);
    setResponseText("");
    setSelectedOptions([]);
    setResult(null);
    setError("");
    setNotice("");
    setRecording(false);
    setRecordingSeconds(0);
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl("");
  };

  const toggleOption = (optionIdValue) => {
    const isMulti = (currentQuestion?.correctOptionIds || []).length > 1;
    setSelectedOptions((current) => {
      if (!isMulti) return current.includes(optionIdValue) ? [] : [optionIdValue];
      return current.includes(optionIdValue) ? current.filter((item) => item !== optionIdValue) : [...current, optionIdValue];
    });
  };

  const nextQuestion = () => resetForNextQuestion(questions.length ? (questionIndex + 1) % questions.length : 0);

  const randomQuestion = () => {
    if (!questions.length) return;
    let next = questionIndex;
    while (questions.length > 1 && next === questionIndex) next = Math.floor(Math.random() * questions.length);
    resetForNextQuestion(next);
  };

  const playAudio = () => {
    if (currentQuestion?.audioUrl) {
      const audio = new Audio(currentQuestion.audioUrl);
      audio.play().catch(() => setNotice("Audio playback could not start on this device."));
      return;
    }
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

  const startRecording = async () => {
    setError("");
    setNotice("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (recordedUrl) URL.revokeObjectURL(recordedUrl);
        setRecordedUrl(URL.createObjectURL(blob));
        setNotice("Speaking attempt recorded. Play it back, then save the attempt to your account if needed.");
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current = recorder;
      setRecordingSeconds(0);
      setRecordedUrl("");
      recorder.start();
      setRecording(true);
    } catch (recordError) {
      setError(recordError.message || "Microphone access was not granted.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") return;
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const saveSpeakingAttempt = async () => {
    if (!user) {
      setError("Login with Google to save this speaking attempt in your account.");
      return;
    }
    if (!recordedUrl) {
      setError("Record your speaking response first.");
      return;
    }
    setSavingAttempt(true);
    setError("");
    try {
      await submitPteTaskResponse({
        user,
        task,
        question: currentQuestion || effectiveTask,
        responseText,
        result: {
          total: null,
          maximum: 90,
          criteria: [],
          mode: "adaptive",
          resultType: "speaking-attempt",
        },
        attemptKind: "speaking",
        durationSeconds: recordingSeconds,
      });
      setNotice("Speaking attempt saved to your account history.");
    } catch (saveError) {
      setError(saveError.message || "Speaking attempt could not be saved.");
    } finally {
      setSavingAttempt(false);
    }
  };

  const submit = async () => {
    setError("");
    setNotice("");

    if (requiresAi && !user) {
      setError("Login with Google to use AI scoring.");
      return;
    }

    if (supportsObjectiveCheck && currentQuestion?.practiceMode === "choice" && !selectedOptions.length) {
      setError("Select at least one answer before checking the question.");
      return;
    }

    if ((requiresAi || supportsObjectiveCheck) && currentQuestion?.practiceMode !== "choice" && !responseText.trim()) {
      setError("Write your response before checking the question.");
      return;
    }

    if (isSpeakingPractice && !requiresAi && !supportsObjectiveCheck) {
      if (!user) {
        setError("Login with Google to save your speaking practice.");
        return;
      }
      if (!recordedUrl) {
        setError("Record your speaking attempt first.");
        return;
      }
      await saveSpeakingAttempt();
      return;
    }

    const localResult = requiresAi ? localFreeformScore(effectiveTask, responseText) : evaluateObjectiveTask({
      task: effectiveTask,
      question: currentQuestion || effectiveTask,
      responseText,
      selectedOptions,
    });

    setSubmitting(true);
    setAnalysisStep(0);
    const stageTimer = window.setInterval(() => setAnalysisStep((current) => Math.min(current + 1, analysisSteps.length - 1)), 700);

    try {
      const minimumTime = new Promise((resolve) => window.setTimeout(resolve, 2400));
      let scored = localResult;

      if (requiresAi) {
        try {
          [scored] = await Promise.all([
            requestAiPteTaskScore({ user, task: effectiveTask, responseText, localResult }),
            minimumTime,
          ]);
        } catch (aiError) {
          console.warn(aiError);
          await minimumTime;
          setNotice("AI scoring is unavailable right now, so adaptive practice scoring was used.");
        }
      } else {
        await minimumTime;
        setNotice("This task uses direct answer-key checking rather than essay-style AI scoring.");
      }

      const finalResult = {
        ...scored,
        taskSlug: task.slug,
        responseText,
        vocabularyRange: scored.vocabularyRange ?? 0,
        argumentQuality: scored.argumentQuality ?? 0,
        analysis: { ...buildAnalysis(responseText), ...(scored.analysis || {}) },
      };
      setResult(finalResult);

      if (user) {
        await submitPteTaskResponse({
          user,
          task,
          question: currentQuestion || effectiveTask,
          responseText,
          result: finalResult,
          attemptKind: requiresAi ? "ai-score" : "objective-check",
        });
      } else if (!requiresAi) {
        setNotice("Checked successfully. Login with Google if you want this practice saved to your account.");
      }
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
              <Chip label={requiresAi ? "Free AI scoring" : supportsObjectiveCheck ? "Instant answer checking" : "Speaking practice"} sx={{ borderRadius: 1, bgcolor: "#ecfdf5", color: "#047857", fontWeight: 900 }} />
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
                  {questions.length ? <Typography color="text.secondary">Question {questionIndex + 1} of {questions.length}</Typography> : null}
                </Box>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {(currentQuestion?.audioUrl || currentQuestion?.audioText || currentQuestion?.transcript) ? (
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
              {task.slug === "describe-image" && currentQuestion ? <DescribeImagePreview question={currentQuestion} sectionColor={section?.color || "#0f766e"} /> : null}
              {questionsLoading ? <LinearProgress /> : null}
              <Box>
                <Typography component="h3" variant="h6" fontWeight={900} gutterBottom>
                  Tips
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {effectiveTask.tips.map((tip) => <Chip key={tip} label={tip} sx={{ borderRadius: 1, fontWeight: 800 }} />)}
                </Stack>
              </Box>
              {currentQuestion?.transcript ? <Alert severity="info">Transcript available for review: {currentQuestion.transcript}</Alert> : null}
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 1, border: "1px solid #dfe9e4", bgcolor: "#fff" }}>
            <Stack spacing={2.2}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
                <Box>
                  <Typography component="h2" variant="h4" fontWeight={900}>
                    {requiresAi ? "Free AI scoring" : supportsObjectiveCheck ? "Practice response" : "Speaking practice"}
                  </Typography>
                  <Typography color="text.secondary">
                    {requiresAi
                      ? "Type your answer below. Only typed text is sent for scoring."
                      : supportsObjectiveCheck
                        ? "Check your answer instantly against the starter answer key."
                        : "Record your answer, play it back, and save the attempt to your account."}
                  </Typography>
                </Box>
                {currentQuestion?.practiceMode !== "choice" ? <Chip label={`${wordCount} words`} sx={{ alignSelf: { xs: "flex-start", md: "center" }, borderRadius: 1, fontWeight: 900 }} /> : null}
              </Stack>

              {isSpeakingPractice && (
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1, bgcolor: "#fbfefc" }}>
                  <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2} alignItems={{ xs: "stretch", md: "center" }}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <GraphicEqIcon color="primary" />
                      <Box>
                        <Typography fontWeight={900}>Speaking recorder</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {recording ? `Recording live: ${recordingSeconds}s` : recordedUrl ? `Recorded length: ${recordingSeconds}s` : "Use the microphone to practise this speaking task."}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {!recording ? (
                        <Button variant="contained" startIcon={<MicIcon />} onClick={startRecording} sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}>
                          Start recording
                        </Button>
                      ) : (
                        <Button color="error" variant="contained" startIcon={<StopIcon />} onClick={stopRecording} sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}>
                          Stop
                        </Button>
                      )}
                      {recordedUrl ? (
                        <Button variant="outlined" component="a" href={recordedUrl} target="_blank" rel="noreferrer" sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}>
                          Play recording
                        </Button>
                      ) : null}
                      <Button variant="outlined" startIcon={savingAttempt ? <CircularProgress size={16} /> : <SaveIcon />} onClick={saveSpeakingAttempt} disabled={savingAttempt || !recordedUrl} sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}>
                        Save attempt
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              )}

              {((requiresAi || !supportsObjectiveCheck || isSpeakingPractice) && !user) && (
                <Alert
                  severity="info"
                  action={(
                    <Button color="inherit" startIcon={authLoading ? <CircularProgress size={16} /> : <GoogleIcon />} disabled={authLoading || !hasFirebaseConfig} onClick={signInWithGoogle}>
                      Login
                    </Button>
                  )}
                >
                  Login with Google to save PTE practice in your account{requiresAi ? " and use AI scoring" : ""}.
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
                        sx={{ justifyContent: "flex-start", borderRadius: 1, textTransform: "none", fontWeight: 800, py: 1.2 }}
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
                  minRows={isSpeakingPractice && !supportsObjectiveCheck && !requiresAi ? 5 : 8}
                  fullWidth
                  placeholder={isSpeakingPractice && !supportsObjectiveCheck && !requiresAi ? "Optional speaking notes or self-transcript..." : "Type your PTE response here..."}
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
                startIcon={submitting ? <CircularProgress color="inherit" size={18} /> : requiresAi || supportsObjectiveCheck ? <SendIcon /> : <SaveIcon />}
                disabled={
                  submitting ||
                  (requiresAi && (!user || wordCount < (effectiveTask.minWords || 1))) ||
                  (!requiresAi && supportsObjectiveCheck && currentQuestion?.practiceMode !== "choice" && !responseText.trim()) ||
                  (!requiresAi && supportsObjectiveCheck && currentQuestion?.practiceMode === "choice" && !selectedOptions.length) ||
                  (!requiresAi && !supportsObjectiveCheck && isSpeakingPractice && !recordedUrl)
                }
                onClick={submit}
                sx={{ alignSelf: "flex-start", borderRadius: 1, textTransform: "none", fontWeight: 900, bgcolor: section?.color || "#0f766e", "&:hover": { bgcolor: section?.color || "#0f766e", filter: "brightness(0.95)" } }}
              >
                {requiresAi ? "Score my answer" : supportsObjectiveCheck ? "Check my answer" : "Save speaking attempt"}
              </Button>
            </Stack>
          </Paper>

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
