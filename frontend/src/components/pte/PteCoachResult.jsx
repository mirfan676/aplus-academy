import { Alert, Box, Chip, LinearProgress, Paper, Stack, Tooltip, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const annotationColors = { replace: "#fee2e2", delete: "#dbeafe", insert: "#ede9fe" };

const summaryTasks = new Set(["summarize-written-text", "summarize-spoken-text"]);
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
]);
const speakingTasks = new Set(["read-aloud", "repeat-sentence", "describe-image", "retell-lecture", "answer-short-question"]);

const getTaskMode = (taskSlug) => {
  if (taskSlug === "write-essay") return "essay";
  if (summaryTasks.has(taskSlug)) return "summary";
  if (taskSlug === "respond-to-a-situation") return "situation";
  if (objectiveTasks.has(taskSlug)) return "objective";
  if (speakingTasks.has(taskSlug)) return "speaking";
  return "general";
};

const buildChecks = (taskSlug, analysis = {}) => {
  if (taskSlug === "write-essay") {
    return [
      { label: "270-290 words (ideal PTE range)", passed: analysis.wordCount >= 270 && analysis.wordCount <= 290 },
      { label: "Advanced vocabulary throughout", passed: (analysis.advancedTerms || []).length >= 6 },
      { label: "At least 3 complex sentence structures", passed: analysis.complexSentenceCount >= 3 },
      { label: "Clear 4-5 paragraph organization", passed: analysis.paragraphCount >= 4 && analysis.paragraphCount <= 5 },
      { label: "No contractions", passed: analysis.contractionCount === 0 },
      { label: "Formal academic tone", passed: analysis.informalCount === 0 },
    ];
  }

  if (taskSlug === "summarize-written-text") {
    return [
      { label: "5-75 words", passed: analysis.wordCount >= 5 && analysis.wordCount <= 75 },
      { label: "Single-sentence response", passed: analysis.sentenceCount <= 1 },
      { label: "No contractions", passed: analysis.contractionCount === 0 },
      { label: "Academic wording", passed: analysis.informalCount === 0 },
    ];
  }

  if (taskSlug === "summarize-spoken-text") {
    return [
      { label: "50-70 words target", passed: analysis.wordCount >= 50 && analysis.wordCount <= 70 },
      { label: "Clear summary focus", passed: (analysis.paragraphCount || 1) <= 2 },
      { label: "No contractions", passed: analysis.contractionCount === 0 },
      { label: "Academic wording", passed: analysis.informalCount === 0 },
    ];
  }

  if (taskSlug === "respond-to-a-situation") {
    return [
      { label: "25-90 words", passed: analysis.wordCount >= 25 && analysis.wordCount <= 90 },
      { label: "Polite and complete response", passed: (analysis.sentenceCount || 0) >= 2 },
      { label: "No contractions", passed: analysis.contractionCount === 0 },
      { label: "Natural formal tone", passed: analysis.informalCount === 0 },
    ];
  }

  if (speakingTasks.has(taskSlug)) {
    return [
      { label: "Clear task response", passed: analysis.wordCount >= 8 },
      { label: "Complete spoken answer", passed: (analysis.sentenceCount || 0) >= 1 },
      { label: "Natural academic wording", passed: analysis.informalCount === 0 },
    ];
  }

  return [];
};

const buildAnnotatedSegments = (result) => {
  const text = result.essayText || result.responseText || "";
  if (!text || !Array.isArray(result.annotations) || !result.annotations.length) return [];
  const segments = [];
  let cursor = 0;
  result.annotations.forEach((annotation) => {
    const index = text.indexOf(annotation.original, cursor);
    if (index < 0) return;
    if (index > cursor) segments.push({ text: text.slice(cursor, index) });
    segments.push({ text: annotation.original, annotation });
    cursor = index + annotation.original.length;
  });
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
};

const CorrectionLegend = () => (
  <Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ mb: 1.5 }}>
    <Typography variant="body2" color="text.secondary">Corrections:</Typography>
    {Object.entries({ replace: "Substitute", delete: "Delete", insert: "Insert" }).map(([type, label]) => (
      <Stack key={type} direction="row" spacing={0.6} alignItems="center">
        <Box sx={{ width: 11, height: 11, bgcolor: annotationColors[type], border: "1px solid #94a3b8", borderRadius: "50%" }} />
        <Typography variant="body2">{label}</Typography>
      </Stack>
    ))}
  </Stack>
);

const AnnotatedResponse = ({ segments }) => {
  if (!segments.length) return null;
  return (
    <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid #dce8f1" }}>
      <CorrectionLegend />
      <Typography component="div" sx={{ whiteSpace: "pre-wrap", lineHeight: 2, color: "#26332d" }}>
        {segments.map((segment, index) => segment.annotation ? (
          <Tooltip key={`${segment.text}-${index}`} arrow title={`${segment.annotation.explanation}${segment.annotation.suggestion ? ` Suggested: ${segment.annotation.suggestion}` : ""}`}>
            <Box component="span" tabIndex={0} sx={{ bgcolor: annotationColors[segment.annotation.type], borderBottom: "2px solid #64748b", cursor: "help", px: 0.25 }}>{segment.text}</Box>
          </Tooltip>
        ) : <span key={`${segment.text}-${index}`}>{segment.text}</span>)}
      </Typography>
    </Box>
  );
};

const ObjectiveComparison = ({ result }) => {
  const expected = result.expectedAnswer || result.correctAnswer || "";
  const learner = result.responseText || result.essayText || "";

  return (
    <Box sx={{ mt: 2.5, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
      <Box sx={{ p: 2, border: "1px solid #dce8f1", borderRadius: 1 }}>
        <Typography fontWeight={900} sx={{ mb: 0.8 }}>Your answer</Typography>
        <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{learner || "No answer recorded."}</Typography>
      </Box>
      <Box sx={{ p: 2, border: "1px solid #dce8f1", borderRadius: 1, bgcolor: "#fbfefc" }}>
        <Typography fontWeight={900} sx={{ mb: 0.8 }}>Expected answer</Typography>
        <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{expected || "Check the explanation below for the expected answer."}</Typography>
      </Box>
    </Box>
  );
};

const PteCoachResult = ({ result }) => {
  if (!result) return null;

  const analysis = {
    wordCount: 0,
    sentenceCount: 0,
    advancedTerms: [],
    complexSentenceCount: 0,
    paragraphCount: 0,
    contractionCount: 0,
    informalCount: 0,
    ...(result.analysis || {}),
  };
  const taskMode = getTaskMode(result.taskSlug);
  const checks = buildChecks(result.taskSlug, analysis);
  const annotatedSegments = buildAnnotatedSegments(result);

  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, border: "1px solid #cfe4d5", borderRadius: 1, bgcolor: "#fbfefc" }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        <Box sx={{ minWidth: { md: 220 } }}>
          <Chip icon={<AutoAwesomeIcon />} label={result.mode === "ai" ? "AI PTE coach" : "Adaptive PTE coach"} sx={{ borderRadius: 1, bgcolor: "#102019", color: "#fff", fontWeight: 900, "& .MuiChip-icon": { color: "#29b554" } }} />
          <Typography variant="h2" fontWeight={900} color="primary.main" sx={{ mt: 1.5 }}>
            {result.total}<Typography component="span" variant="h5" color="text.secondary">/{result.maximum}</Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">Educational estimate, not an official Pearson score</Typography>
          {checks.length > 0 && (
            <Stack spacing={1} sx={{ mt: 2.5 }}>
              {checks.map((check) => {
                const Icon = check.passed ? CheckCircleIcon : RadioButtonUncheckedIcon;
                return (
                  <Stack key={check.label} direction="row" spacing={1} alignItems="flex-start">
                    <Icon sx={{ fontSize: 19, mt: 0.15, color: check.passed ? "#198754" : "#94a3b8" }} />
                    <Typography variant="body2" fontWeight={check.passed ? 800 : 500}>{check.label}</Typography>
                  </Stack>
                );
              })}
            </Stack>
          )}
          {taskMode === "objective" && (
            <Stack spacing={1} sx={{ mt: 2.5 }}>
              <Chip label={result.isCorrect ? "Correct answer" : "Needs revision"} color={result.isCorrect ? "success" : "warning"} sx={{ borderRadius: 1, fontWeight: 900 }} />
              <Typography variant="body2" color="text.secondary">
                Objective tasks use answer-key checking instead of essay-style scoring.
              </Typography>
            </Stack>
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Alert severity={result.total >= 75 ? "success" : "info"} sx={{ mb: 3, lineHeight: 1.7 }}>
            {result.narrative}
          </Alert>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
            {(result.criteria || []).map((criterion) => (
              <Box key={criterion.label}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight={800}>{criterion.label}</Typography>
                  <Typography>{criterion.score}/{criterion.maximum}</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={(criterion.score / criterion.maximum) * 100} sx={{ mt: 0.7, height: 7, borderRadius: 1 }} />
              </Box>
            ))}
          </Box>

          {taskMode === "essay" && (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1, mt: 2.5, p: 2, border: "1px solid #dce8f1", borderRadius: 1 }}>
              <Typography><strong>Vocabulary range:</strong> {result.vocabularyRange ?? 0}%</Typography>
              <Typography><strong>Argument quality:</strong> {result.argumentQuality ?? 0}%</Typography>
            </Box>
          )}

          {taskMode === "summary" && (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1, mt: 2.5, p: 2, border: "1px solid #dce8f1", borderRadius: 1 }}>
              <Typography><strong>Word count:</strong> {analysis.wordCount}</Typography>
              <Typography><strong>Sentence count:</strong> {analysis.sentenceCount || 1}</Typography>
            </Box>
          )}

          {taskMode === "objective" && <ObjectiveComparison result={result} />}

          {taskMode === "speaking" && (
            <Box sx={{ mt: 2.5, p: 2, border: "1px solid #dce8f1", borderRadius: 1 }}>
              {result.audioUrl ? (
                <Box sx={{ mb: 1.5 }}>
                  <Typography fontWeight={900} sx={{ mb: 0.8 }}>Audio replay</Typography>
                  <audio controls src={result.audioUrl} style={{ width: "100%" }} />
                </Box>
              ) : null}
              <Typography fontWeight={900} sx={{ mb: 0.8 }}>Transcript</Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                {result.transcript || result.responseText || "Transcript not available."}
              </Typography>
            </Box>
          )}

          <Typography component="h3" variant="h6" fontWeight={900} sx={{ mt: 3, mb: 1 }}>
            {taskMode === "objective" ? "What to improve next" : "Weaknesses and next improvements"}
          </Typography>
          <Stack component="ul" spacing={1} sx={{ pl: 2.5, my: 0 }}>
            {(result.guidance || []).map((item) => <Typography component="li" key={item}>{item}</Typography>)}
          </Stack>

          {taskMode === "essay" && (analysis.advancedTerms || []).length > 0 && (
            <Box sx={{ mt: 2.5 }}>
              <Typography fontWeight={900} sx={{ mb: 1 }}>Advanced vocabulary detected</Typography>
              <Stack direction="row" gap={0.8} flexWrap="wrap">
                {analysis.advancedTerms.slice(0, 12).map((term) => <Chip key={term} label={term} size="small" sx={{ borderRadius: 1 }} />)}
              </Stack>
            </Box>
          )}

          {(taskMode === "essay" || taskMode === "summary" || taskMode === "situation" || taskMode === "general") && (
            <AnnotatedResponse segments={annotatedSegments} />
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default PteCoachResult;
