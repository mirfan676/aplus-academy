import { Link as RouterLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditNoteIcon from "@mui/icons-material/EditNote";
import GoogleIcon from "@mui/icons-material/Google";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SendIcon from "@mui/icons-material/Send";
import PteCoachResult from "../../components/pte/PteCoachResult";
import PteResponseList from "../../components/pte/PteResponseList";
import PteWritingGuidance from "../../components/pte/PteWritingGuidance";
import { useAuth } from "../../contexts/useAuth";
import useSEO from "../../hooks/useSEO";
import {
  fetchPteEssayResponses,
  fetchPteEssays,
  submitPteEssayResponse,
} from "../../services/pteEssayData";
import { getWordCount, scorePteEssay } from "../../services/pteEssayScoring";
import { requestAiPteScore } from "../../services/pteAiScoring";
import { pteSections, textScoredTasks } from "../pte/ptePracticeData";

const siteUrl = "https://www.aplusacademy.pk";
const practiceSeconds = 20 * 60;
const analysisSteps = [
  "Reading your argument and checking relevance",
  "Analysing grammar and sentence control",
  "Reviewing vocabulary and academic tone",
  "Comparing structure, coherence, and development",
  "Preparing corrections and your score",
];

const structureTemplates = [
  `Introduction\nThe question of [topic] has attracted considerable debate. While some people argue that [view one], others believe [view two]. This essay will examine both perspectives before explaining why [your position].\n\nBody paragraph 1\nThe first important point is that [main reason one]. This is significant because [explanation]. For example, [specific example]. Therefore, [link the example back to the prompt].\n\nBody paragraph 2\nAnother relevant consideration is [main reason two or opposing view]. Although [brief concession], [your response]. For instance, [specific example or consequence]. Consequently, [result].\n\nConclusion\nIn conclusion, both sides present valid concerns; however, [restate your position]. A balanced approach should [recommendation or final implication].`,
  `Introduction\nIn recent years, [topic] has become increasingly important. This essay argues that [your direct answer] because [reason one] and [reason two].\n\nBody paragraph 1\nTo begin with, [reason one]. In practical terms, [explain how or why]. A clear example is [example]. This demonstrates that [connection to your argument].\n\nBody paragraph 2\nFurthermore, [reason two]. Some may claim that [counterargument], but this overlooks [response]. As a result, [consequence or benefit].\n\nConclusion\nTo conclude, [short answer to the prompt]. Although [acknowledge limitation], the evidence suggests that [final judgement].`,
  `Introduction\nPeople hold different opinions about [topic]. Supporters of [position A] emphasise [benefit], whereas critics point to [risk]. In my view, [thesis].\n\nBody paragraph 1\nOn the one hand, [explain position A]. This can lead to [result]. For example, [evidence or scenario].\n\nBody paragraph 2\nOn the other hand, [explain position B]. Nevertheless, [evaluation or preferred view]. The strongest reason is [reason], as illustrated by [example].\n\nConclusion\nOverall, [summarise both perspectives]. I therefore believe [final position] because [decisive reason].`,
];

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
};

const PteEssayPractice = () => {
  const { authError, hasFirebaseConfig, loading: authLoading, signInWithGoogle, user } = useAuth();
  const [tab, setTab] = useState(0);
  const [essays, setEssays] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [responses, setResponses] = useState([]);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [draft, setDraft] = useState("");
  const [score, setScore] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(practiceSeconds);
  const [timerRunning, setTimerRunning] = useState(false);
  const [structure, setStructure] = useState(structureTemplates[0]);
  const [copied, setCopied] = useState(false);
  const [shareConsent, setShareConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [signInError, setSignInError] = useState("");
  const [analysisStep, setAnalysisStep] = useState(-1);
  const [analysisNotice, setAnalysisNotice] = useState("");
  const [pasteNotice, setPasteNotice] = useState("");

  useSEO({
    title: "Free PTE Essay Practice with AI Scoring | A Plus Academy",
    description:
      "Free PTE essay practice with AI scoring, 20-minute timer, Google login, writing corrections, and student response examples.",
    canonical: `${siteUrl}/pte/write-essay`,
    ogUrl: `${siteUrl}/pte/write-essay`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  useEffect(() => {
    fetchPteEssays()
      .then((records) => {
        setEssays(records);
        setSelectedId(records[0]?.id || "");
      })
      .catch((error) => setLoadError(error.message || "PTE samples could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setDraft("");
      setScore(null);
      setSubmittedResponse(null);
      setTimerRunning(false);
      return;
    }
    setDraft(localStorage.getItem(`aplus-pte-essay-draft-${user.uid}`) || "");
  }, [user]);

  useEffect(() => {
    if (user?.uid && !submittedResponse) {
      localStorage.setItem(`aplus-pte-essay-draft-${user.uid}`, draft);
    }
  }, [draft, submittedResponse, user]);

  useEffect(() => {
    if (!selectedId) return;
    setResponsesLoading(true);
    setResponseError("");
    fetchPteEssayResponses(selectedId)
      .then(setResponses)
      .catch((error) => {
        console.error(error);
        setResponses([]);
        setResponseError("Student responses are unavailable until Firestore access is configured.");
      })
      .finally(() => setResponsesLoading(false));
  }, [selectedId]);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  const selectedEssay = useMemo(
    () => essays.find((essay) => essay.id === selectedId) || essays[0],
    [essays, selectedId],
  );
  const wordCount = getWordCount(draft);
  const benchmarkTexts = useMemo(
    () => [...essays.map((essay) => essay.sampleEssay), ...responses.slice(0, 20).map((response) => response.essayText)],
    [essays, responses],
  );

  const resetPractice = () => {
    setDraft("");
    setScore(null);
    setSubmittedResponse(null);
    setSubmitError("");
    setShareConsent(false);
    setSecondsLeft(practiceSeconds);
    setTimerRunning(false);
    setAnalysisStep(-1);
    setAnalysisNotice("");
    setPasteNotice("");
    if (user?.uid) localStorage.removeItem(`aplus-pte-essay-draft-${user.uid}`);
  };

  const selectPrompt = (event) => {
    setSelectedId(event.target.value);
    setDraft("");
    setScore(null);
    setSubmittedResponse(null);
    setSubmitError("");
    setShareConsent(false);
    setSecondsLeft(practiceSeconds);
    setTimerRunning(false);
    if (user?.uid) localStorage.removeItem(`aplus-pte-essay-draft-${user.uid}`);
  };

  const submitEssay = async () => {
    setTimerRunning(false);
    setSubmitError("");
    if (!user || !selectedEssay) return setSubmitError("Login with Google to submit your essay.");
    if (!shareConsent) return setSubmitError("Allow your essay response to appear in student examples before submitting.");

    setSubmitting(true);
    setAnalysisStep(0);
    setAnalysisNotice("");
    const stageTimer = window.setInterval(() => setAnalysisStep((current) => Math.min(current + 1, analysisSteps.length - 1)), 850);
    try {
      const localResult = { ...scorePteEssay(draft, benchmarkTexts), essayText: draft };
      const minimumAnalysisTime = new Promise((resolve) => window.setTimeout(resolve, 3600));
      let result = localResult;
      try {
        [result] = await Promise.all([
          requestAiPteScore({ user, essay: selectedEssay, text: draft, localResult }),
          minimumAnalysisTime,
        ]);
        result.essayText = draft;
      } catch (aiError) {
        console.warn("AI scoring unavailable; adaptive scoring used.", aiError);
        await minimumAnalysisTime;
        setAnalysisNotice("AI scoring is not configured for this deployment, so the adaptive educational scorer was used.");
      }
      setScore(result);
      const saved = await submitPteEssayResponse({ user, essay: selectedEssay, text: draft, result });
      setSubmittedResponse(saved);
      setResponses((current) => [saved, ...current.filter((item) => item.id !== saved.id)].sort((a, b) => b.score - a.score));
      localStorage.removeItem(`aplus-pte-essay-draft-${user.uid}`);
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Your essay could not be published. Check Firestore access and try again.");
    } finally {
      window.clearInterval(stageTimer);
      setAnalysisStep(-1);
      setSubmitting(false);
    }
  };

  const blockPaste = (event) => {
    event.preventDefault();
    setPasteNotice("Pasting is disabled in timed practice. Type your response to build genuine exam fluency.");
  };

  const randomizeStructure = () => {
    const candidates = structureTemplates.filter((template) => template !== structure);
    setStructure(candidates[Math.floor(Math.random() * candidates.length)] || structureTemplates[0]);
  };

  const copyStructure = async () => {
    await navigator.clipboard.writeText(structure);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const startGoogleSignIn = async () => {
    setSignInError("");
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      setSignInError(error.message || "Google sign-in could not be started.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f8f6" }}>
      <Box component="header" sx={{ bgcolor: "#102019", color: "#fff", borderBottom: "4px solid #29b554" }}>
        <Container sx={{ py: { xs: 3.5, md: 4.5 } }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "flex-end" }} gap={3}>
            <Stack spacing={2} sx={{ maxWidth: 860 }}>
              <Chip icon={<EditNoteIcon />} label="PTE Writing Practice" sx={{ alignSelf: "flex-start", borderRadius: 1, bgcolor: "#29b554", color: "#fff", fontWeight: 800, "& .MuiChip-icon": { color: "#fff" } }} />
              <Typography component="h1" variant="h2" sx={{ fontWeight: 900, fontSize: { xs: "1.9rem", md: "2.75rem" }, lineHeight: 1.12 }}>
                Build a clear PTE essay in 20 minutes
              </Typography>
              <Typography variant="h6" sx={{ maxWidth: 760, opacity: 0.86, lineHeight: 1.7 }}>
                Study original samples, sign in to submit a timed response, receive adaptive feedback, and compare scored student essays.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.3}>
                <Button component={RouterLink} to="/pte" variant="contained" sx={{ alignSelf: "flex-start", borderRadius: 1, textTransform: "none", fontWeight: 900, bgcolor: "#fff", color: "#102019", "&:hover": { bgcolor: "rgba(255,255,255,0.9)" } }}>
                  View all PTE sections
                </Button>
                <Button component={RouterLink} to="/pte/summarize-written-text" variant="outlined" sx={{ alignSelf: "flex-start", borderRadius: 1, textTransform: "none", fontWeight: 900, color: "#fff", borderColor: "rgba(255,255,255,0.45)", "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" } }}>
                  Try another AI task
                </Button>
              </Stack>
            </Stack>
            {user && (
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ bgcolor: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)", p: 1.2, pr: 2, borderRadius: 1 }}>
                <Avatar src={user.photoURL || undefined} alt={user.displayName || "Student"}>{user.displayName?.[0] || "S"}</Avatar>
                <Box><Typography fontWeight={900}>{user.displayName}</Typography><Typography variant="body2" sx={{ opacity: 0.7 }}>Ready to practise</Typography></Box>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

      <Container component="main" sx={{ py: { xs: 2.5, md: 4 } }}>
        <Paper elevation={0} sx={{ mb: 3, p: { xs: 2.2, md: 3 }, border: "1px solid #d8e6dd", borderRadius: 1, bgcolor: "#fff" }}>
          <Stack spacing={2}>
            <Box>
              <Typography component="h2" variant="h5" fontWeight={900}>
                PTE practice sections
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                You are currently inside Write Essay. Open the full PTE module to practise other question types.
              </Typography>
            </Box>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {pteSections.map((section) => (
                <Button
                  key={section.id}
                  component={RouterLink}
                  to={`/pte#${section.id}`}
                  variant="outlined"
                  sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900, borderColor: section.color, color: section.color }}
                >
                  {section.title}
                </Button>
              ))}
              <Button component={RouterLink} to="/pte" variant="contained" sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}>
                All PTE questions
              </Button>
            </Stack>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {textScoredTasks.slice(0, 7).map((task) => (
                <Chip
                  key={task.slug}
                  component={RouterLink}
                  to={task.slug === "write-essay" ? "/pte/write-essay" : `/pte/${task.slug}`}
                  clickable
                  label={task.shortTitle}
                  sx={{ borderRadius: 1, fontWeight: 800, bgcolor: task.slug === "write-essay" ? "#e8f7ee" : "#f8fafc" }}
                />
              ))}
            </Stack>
          </Stack>
        </Paper>
        <Paper elevation={0} sx={{ border: "1px solid #d8e6dd", borderRadius: 1, overflow: "hidden" }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" aria-label="PTE essay practice modes" sx={{ px: { xs: 1, md: 2 }, borderBottom: "1px solid #d8e6dd", bgcolor: "#fff" }}>
            <Tab icon={<MenuBookIcon />} iconPosition="start" label="Sample Essays" />
            <Tab icon={<EditNoteIcon />} iconPosition="start" label="Write Essay" />
            <Tab icon={<AutoAwesomeIcon />} iconPosition="start" label="Structure Builder" />
          </Tabs>

          {tab === 0 && (
            <Box sx={{ p: { xs: 2.5, md: 4 } }}>
              {loadError && <Alert severity="warning" sx={{ mb: 3 }}>{loadError}</Alert>}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "300px minmax(0, 1fr)" }, gap: 4 }}>
                <Stack spacing={2}>
                  <Typography component="h2" variant="h5" fontWeight={900}>Choose a sample</Typography>
                  <FormControl fullWidth>
                    <InputLabel id="pte-sample-label">Essay topic</InputLabel>
                    <Select labelId="pte-sample-label" value={selectedId} label="Essay topic" onChange={selectPrompt} disabled={loading || !essays.length}>
                      {essays.map((essay) => <MenuItem key={essay.id} value={essay.id}>{essay.title}</MenuItem>)}
                    </Select>
                  </FormControl>
                  {selectedEssay && (
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      <Chip label={selectedEssay.category} size="small" sx={{ borderRadius: 1 }} />
                      <Chip label={`${getWordCount(selectedEssay.sampleEssay)} words`} size="small" sx={{ borderRadius: 1 }} />
                      {selectedEssay.score && <Chip label={`Practice score ${selectedEssay.score}/90`} size="small" color="primary" sx={{ borderRadius: 1, color: "#fff" }} />}
                    </Stack>
                  )}
                  <Alert severity="info">Samples are original A Plus Academy learning material, not official Pearson responses.</Alert>
                </Stack>
                {selectedEssay ? (
                  <Box>
                    <Typography component="h2" variant="h4" fontWeight={900}>{selectedEssay.title}</Typography>
                    <Typography sx={{ mt: 2, p: 2, bgcolor: "#eef7f1", borderLeft: "4px solid #198754", lineHeight: 1.75 }}>{selectedEssay.prompt}</Typography>
                    <Divider sx={{ my: 3 }} />
                    <Typography component="h3" variant="h5" fontWeight={900} gutterBottom>Sample response</Typography>
                    <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.95, color: "text.secondary" }}>{selectedEssay.sampleEssay}</Typography>
                  </Box>
                ) : !loading && <Alert severity="info">No sample essays are available yet.</Alert>}
              </Box>
              <Divider sx={{ my: 5 }} />
              {responseError && <Alert severity="warning" sx={{ mb: 3 }}>{responseError}</Alert>}
              {responsesLoading ? <CircularProgress /> : <PteResponseList responses={responses} />}
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ p: { xs: 2.5, md: 4 } }}>
              {!user ? (
                <Paper elevation={0} sx={{ maxWidth: 720, mx: "auto", p: { xs: 3, md: 5 }, border: "1px solid #cfe4d5", borderRadius: 1, textAlign: "center" }}>
                  <GoogleIcon sx={{ fontSize: 48, color: "#198754" }} />
                  <Typography component="h2" variant="h4" fontWeight={900} sx={{ mt: 1 }}>Login to write essay</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3, lineHeight: 1.75 }}>
                    Use Google login to start PTE essay writing practice and receive your score.
                  </Typography>
                  {(signInError || authError) && <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>{signInError || authError}</Alert>}
                  {!hasFirebaseConfig && <Alert severity="warning" sx={{ mb: 2, textAlign: "left" }}>Google sign-in is unavailable until Firebase web app variables are configured.</Alert>}
                  <Button onClick={startGoogleSignIn} disabled={authLoading || !hasFirebaseConfig} variant="contained" size="large" startIcon={authLoading ? <CircularProgress size={18} color="inherit" /> : <GoogleIcon />} sx={{ fontWeight: 900 }}>
                    Login with Google
                  </Button>
                </Paper>
              ) : (
                <Stack spacing={4}>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 300px" }, gap: 3, alignItems: "start" }}>
                    <Stack spacing={3}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                        <Box>
                          <Typography component="h2" variant="h4" fontWeight={900}>Timed writing workspace</Typography>
                          <Typography color="text.secondary">Draft saved privately to this browser for {user.displayName || "your account"}.</Typography>
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip icon={<AccessTimeIcon />} label={formatTime(secondsLeft)} color={secondsLeft < 180 ? "warning" : "default"} sx={{ borderRadius: 1, fontWeight: 900, fontSize: "1rem" }} />
                          <Button variant="outlined" disabled={Boolean(submittedResponse)} onClick={() => setTimerRunning((current) => !current)}>{timerRunning ? "Pause" : secondsLeft === practiceSeconds ? "Start" : "Resume"}</Button>
                          <Tooltip title="Reset practice"><IconButton onClick={resetPractice} aria-label="Reset practice"><RestartAltIcon /></IconButton></Tooltip>
                        </Stack>
                      </Box>

                      <FormControl fullWidth disabled={Boolean(submittedResponse)}>
                        <InputLabel id="pte-writing-prompt-label">Practice prompt</InputLabel>
                        <Select labelId="pte-writing-prompt-label" value={selectedId} label="Practice prompt" onChange={selectPrompt}>
                          {essays.map((essay) => <MenuItem key={essay.id} value={essay.id}>{essay.title}</MenuItem>)}
                        </Select>
                      </FormControl>
                      {selectedEssay && <Typography sx={{ p: 2, bgcolor: "#eef7f1", borderLeft: "4px solid #198754", lineHeight: 1.75 }}>{selectedEssay.prompt}</Typography>}
                      <TextField
                        value={draft}
                        onChange={(event) => { setDraft(event.target.value); setScore(null); setSubmitError(""); }}
                        disabled={Boolean(submittedResponse)}
                        multiline
                        minRows={16}
                        fullWidth
                        placeholder="Write your essay here..."
                        inputProps={{
                          "aria-label": "PTE essay draft",
                          onPaste: blockPaste,
                          onDrop: blockPaste,
                          onKeyDown: (event) => {
                            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") blockPaste(event);
                          },
                        }}
                        sx={{ "& .MuiInputBase-root": { alignItems: "flex-start", bgcolor: "#fff", lineHeight: 1.8 } }}
                      />
                      {pasteNotice && <Alert severity="info" onClose={() => setPasteNotice("")}>{pasteNotice}</Alert>}
                      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={2}>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip label={`${wordCount} words`} color={wordCount >= 250 && wordCount <= 300 ? "success" : "default"} sx={{ borderRadius: 1, fontWeight: 800 }} />
                          <Chip label="Ideal target: 250-300" variant="outlined" sx={{ borderRadius: 1 }} />
                        </Stack>
                        {submittedResponse ? (
                          <Button variant="contained" onClick={resetPractice} startIcon={<RestartAltIcon />} sx={{ fontWeight: 900 }}>Write another essay</Button>
                        ) : null}
                      </Stack>

                      {!submittedResponse && (
                        <Paper elevation={0} sx={{ p: 2.2, border: "1px solid #d8e6dd", borderRadius: 1 }}>
                          <FormControlLabel
                            control={<Checkbox checked={shareConsent} onChange={(event) => setShareConsent(event.target.checked)} />}
                            label="Allow my essay response and practice score to appear in student examples."
                          />
                          {wordCount > 0 && wordCount < 120 && <Alert severity="info" sx={{ mt: 1.5 }}>Write at least 120 words before submitting. The ideal target is 250-300.</Alert>}
                          {submitError && <Alert severity="warning" sx={{ mt: 1.5 }}>{submitError}</Alert>}
                          {submitting && analysisStep >= 0 && <Box sx={{ mt: 2 }}><Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}><AutoAwesomeIcon color="primary" /><Typography fontWeight={800}>{analysisSteps[analysisStep]}</Typography></Stack><LinearProgress variant="determinate" value={((analysisStep + 1) / analysisSteps.length) * 100} /></Box>}
                          <Button variant="contained" size="large" startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />} disabled={submitting || wordCount < 120 || !shareConsent} onClick={submitEssay} sx={{ mt: 2, fontWeight: 900 }}>
                            Submit essay and stop timer
                          </Button>
                        </Paper>
                      )}
                    </Stack>
                    <PteWritingGuidance />
                  </Box>

                  {submittedResponse && <Alert severity="success">Essay submitted. The timer stopped at {formatTime(secondsLeft)}, and your scored response is now included below.</Alert>}
                  {analysisNotice && <Alert severity="info">{analysisNotice}</Alert>}
                  {score && <PteCoachResult result={score} />}
                  {responseError && <Alert severity="warning">{responseError}</Alert>}
                  {responsesLoading ? <CircularProgress /> : <PteResponseList responses={responses} />}
                </Stack>
              )}
            </Box>
          )}

          {tab === 2 && (
            <Box sx={{ p: { xs: 2.5, md: 4 } }}>
              <Stack spacing={3}>
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 2 }}>
                  <Box>
                    <Typography component="h2" variant="h4" fontWeight={900}>Editable essay structure</Typography>
                    <Typography color="text.secondary">Replace each bracketed instruction with your own argument and evidence.</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Try another structure"><IconButton onClick={randomizeStructure} aria-label="Try another essay structure"><RefreshIcon /></IconButton></Tooltip>
                    <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={copyStructure}>{copied ? "Copied" : "Copy"}</Button>
                  </Stack>
                </Box>
                <TextField value={structure} onChange={(event) => setStructure(event.target.value)} multiline minRows={18} fullWidth inputProps={{ "aria-label": "Editable PTE essay structure" }} sx={{ "& .MuiInputBase-root": { alignItems: "flex-start", bgcolor: "#fff", lineHeight: 1.8, fontFamily: "inherit" } }} />
                <Alert severity="success">Use the structure as a planning guide. Memorised wording without relevant ideas can weaken a real exam response.</Alert>
              </Stack>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default PteEssayPractice;
