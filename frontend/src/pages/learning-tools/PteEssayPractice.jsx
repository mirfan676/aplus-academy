import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
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
import MenuBookIcon from "@mui/icons-material/MenuBook";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import useSEO from "../../hooks/useSEO";
import { fetchPteEssays } from "../../services/pteEssayData";
import { getWordCount, scorePteEssay } from "../../services/pteEssayScoring";

const siteUrl = "https://www.aplusacademy.pk";
const practiceSeconds = 20 * 60;
const draftKey = "aplus-pte-essay-draft";

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
  const [tab, setTab] = useState(0);
  const [essays, setEssays] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [draft, setDraft] = useState(() => localStorage.getItem(draftKey) || "");
  const [score, setScore] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(practiceSeconds);
  const [timerRunning, setTimerRunning] = useState(false);
  const [structure, setStructure] = useState(structureTemplates[0]);
  const [copied, setCopied] = useState(false);

  useSEO({
    title: "Free PTE Essay Practice and Writing Scorer | A Plus Academy",
    description:
      "Practice PTE essay writing with sample answers, a 20-minute writing workspace, an editable structure builder, word count, and instant formative feedback.",
    canonical: `${siteUrl}/learning-tools/pte-essay-practice`,
    ogUrl: `${siteUrl}/learning-tools/pte-essay-practice`,
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
    localStorage.setItem(draftKey, draft);
  }, [draft]);

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

  const resetPractice = () => {
    setDraft("");
    setScore(null);
    setSecondsLeft(practiceSeconds);
    setTimerRunning(false);
    localStorage.removeItem(draftKey);
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f8f6" }}>
      <Box component="header" sx={{ bgcolor: "#102019", color: "#fff", borderBottom: "4px solid #29b554" }}>
        <Container sx={{ py: { xs: 5, md: 7 } }}>
          <Stack spacing={2} sx={{ maxWidth: 860 }}>
            <Chip
              icon={<EditNoteIcon />}
              label="PTE Writing Practice"
              sx={{ alignSelf: "flex-start", borderRadius: 1, bgcolor: "#29b554", color: "#fff", fontWeight: 800, "& .MuiChip-icon": { color: "#fff" } }}
            />
            <Typography component="h1" variant="h2" sx={{ fontWeight: 900, fontSize: { xs: "2.2rem", md: "3.7rem" }, lineHeight: 1.08 }}>
              Build a clear PTE essay in 20 minutes
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 760, opacity: 0.86, lineHeight: 1.7 }}>
              Study original sample answers, practise under a timer, and shape your response with an editable four-paragraph structure.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container component="main" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper elevation={0} sx={{ border: "1px solid #d8e6dd", borderRadius: 1, overflow: "hidden" }}>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="PTE essay practice modes"
            sx={{ px: { xs: 1, md: 2 }, borderBottom: "1px solid #d8e6dd", bgcolor: "#fff" }}
          >
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
                    <Select
                      labelId="pte-sample-label"
                      value={selectedId}
                      label="Essay topic"
                      onChange={(event) => setSelectedId(event.target.value)}
                      disabled={loading || !essays.length}
                    >
                      {essays.map((essay) => <MenuItem key={essay.id} value={essay.id}>{essay.title}</MenuItem>)}
                    </Select>
                  </FormControl>
                  {selectedEssay && (
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      <Chip label={selectedEssay.category} size="small" sx={{ borderRadius: 1 }} />
                      <Chip label={`${getWordCount(selectedEssay.sampleEssay)} words`} size="small" sx={{ borderRadius: 1 }} />
                      {selectedEssay.score && <Chip label={`Practice score ${selectedEssay.score}/60`} size="small" color="primary" sx={{ borderRadius: 1, color: "#fff" }} />}
                    </Stack>
                  )}
                  <Alert severity="info">Samples are original A Plus Academy learning material, not official Pearson responses.</Alert>
                </Stack>

                {selectedEssay ? (
                  <Box>
                    <Typography component="h2" variant="h4" fontWeight={900}>{selectedEssay.title}</Typography>
                    <Typography sx={{ mt: 2, p: 2, bgcolor: "#eef7f1", borderLeft: "4px solid #198754", lineHeight: 1.75 }}>
                      {selectedEssay.prompt}
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    <Typography component="h3" variant="h5" fontWeight={900} gutterBottom>Sample response</Typography>
                    <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.95, color: "text.secondary" }}>
                      {selectedEssay.sampleEssay}
                    </Typography>
                  </Box>
                ) : !loading && <Alert severity="info">No sample essays are available yet.</Alert>}
              </Box>
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ p: { xs: 2.5, md: 4 } }}>
              <Stack spacing={3}>
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                  <Box>
                    <Typography component="h2" variant="h4" fontWeight={900}>Timed writing workspace</Typography>
                    <Typography color="text.secondary">Your draft is saved automatically on this device.</Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip icon={<AccessTimeIcon />} label={formatTime(secondsLeft)} color={secondsLeft < 180 ? "warning" : "default"} sx={{ borderRadius: 1, fontWeight: 900, fontSize: "1rem" }} />
                    <Button variant="outlined" onClick={() => setTimerRunning((current) => !current)}>{timerRunning ? "Pause" : secondsLeft === practiceSeconds ? "Start" : "Resume"}</Button>
                    <Tooltip title="Reset practice"><IconButton onClick={resetPractice} aria-label="Reset practice"><RestartAltIcon /></IconButton></Tooltip>
                  </Stack>
                </Box>

                <FormControl fullWidth>
                  <InputLabel id="pte-writing-prompt-label">Practice prompt</InputLabel>
                  <Select
                    labelId="pte-writing-prompt-label"
                    value={selectedId}
                    label="Practice prompt"
                    onChange={(event) => { setSelectedId(event.target.value); setScore(null); }}
                  >
                    {essays.map((essay) => <MenuItem key={essay.id} value={essay.id}>{essay.title}</MenuItem>)}
                  </Select>
                </FormControl>
                {selectedEssay && <Typography sx={{ p: 2, bgcolor: "#eef7f1", borderLeft: "4px solid #198754", lineHeight: 1.75 }}>{selectedEssay.prompt}</Typography>}

                <TextField
                  value={draft}
                  onChange={(event) => { setDraft(event.target.value); setScore(null); }}
                  multiline
                  minRows={16}
                  fullWidth
                  placeholder="Write your essay here..."
                  inputProps={{ "aria-label": "PTE essay draft" }}
                  sx={{ "& .MuiInputBase-root": { alignItems: "flex-start", bgcolor: "#fff", lineHeight: 1.8 } }}
                />

                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={2}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label={`${wordCount} words`} color={wordCount >= 200 && wordCount <= 300 ? "success" : "default"} sx={{ borderRadius: 1, fontWeight: 800 }} />
                    <Chip label="Target: 200-300" variant="outlined" sx={{ borderRadius: 1 }} />
                  </Stack>
                  <Button variant="contained" size="large" disabled={wordCount < 40} onClick={() => setScore(scorePteEssay(draft))} sx={{ fontWeight: 900 }}>
                    Check my practice essay
                  </Button>
                </Stack>

                {score && (
                  <Box sx={{ borderTop: "1px solid #d8e6dd", pt: 3 }}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                      <Box sx={{ minWidth: { md: 220 } }}>
                        <Typography variant="overline" color="text.secondary">Practice estimate</Typography>
                        <Typography variant="h2" fontWeight={900} color="primary.main">{score.total}<Typography component="span" variant="h5" color="text.secondary">/{score.maximum}</Typography></Typography>
                        <Typography variant="body2" color="text.secondary">Not an official Pearson score</Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                          {score.criteria.map((criterion) => (
                            <Box key={criterion.label}>
                              <Stack direction="row" justifyContent="space-between"><Typography fontWeight={800}>{criterion.label}</Typography><Typography>{criterion.score}/{criterion.maximum}</Typography></Stack>
                              <LinearProgress variant="determinate" value={(criterion.score / criterion.maximum) * 100} sx={{ mt: 0.7, height: 7, borderRadius: 1 }} />
                            </Box>
                          ))}
                        </Box>
                        <Typography component="h3" variant="h6" fontWeight={900} sx={{ mt: 3, mb: 1 }}>Next improvements</Typography>
                        <Stack component="ul" spacing={1} sx={{ pl: 2.5, my: 0 }}>
                          {score.feedback.map((item) => <Typography component="li" key={item}>{item}</Typography>)}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </Stack>
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
                <TextField
                  value={structure}
                  onChange={(event) => setStructure(event.target.value)}
                  multiline
                  minRows={18}
                  fullWidth
                  inputProps={{ "aria-label": "Editable PTE essay structure" }}
                  sx={{ "& .MuiInputBase-root": { alignItems: "flex-start", bgcolor: "#fff", lineHeight: 1.8, fontFamily: "inherit" } }}
                />
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
