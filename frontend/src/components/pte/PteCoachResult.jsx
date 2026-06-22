import { Alert, Box, Chip, LinearProgress, Paper, Stack, Tooltip, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const PteCoachResult = ({ result }) => {
  if (!result) return null;

  const checks = [
    { label: "270-290 words (ideal PTE range)", passed: result.analysis.wordCount >= 270 && result.analysis.wordCount <= 290 },
    { label: "Advanced vocabulary throughout", passed: result.analysis.advancedTerms.length >= 6 },
    { label: "At least 3 complex sentence structures", passed: result.analysis.complexSentenceCount >= 3 },
    { label: "Clear 4-5 paragraph organization", passed: result.analysis.paragraphCount >= 4 && result.analysis.paragraphCount <= 5 },
    { label: "No contractions", passed: result.analysis.contractionCount === 0 },
    { label: "Formal academic tone", passed: result.analysis.informalCount === 0 },
  ];

  const annotationColors = { replace: "#fee2e2", delete: "#dbeafe", insert: "#ede9fe" };
  const annotatedSegments = [];
  let cursor = 0;
  (result.annotations || []).forEach((annotation) => {
    const index = result.essayText?.indexOf(annotation.original, cursor) ?? -1;
    if (index < 0) return;
    if (index > cursor) annotatedSegments.push({ text: result.essayText.slice(cursor, index) });
    annotatedSegments.push({ text: annotation.original, annotation });
    cursor = index + annotation.original.length;
  });
  if (result.essayText && cursor < result.essayText.length) annotatedSegments.push({ text: result.essayText.slice(cursor) });

  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, border: "1px solid #cfe4d5", borderRadius: 1, bgcolor: "#fbfefc" }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        <Box sx={{ minWidth: { md: 220 } }}>
          <Chip icon={<AutoAwesomeIcon />} label={result.mode === "ai" ? "AI essay coach" : "Adaptive essay coach"} sx={{ borderRadius: 1, bgcolor: "#102019", color: "#fff", fontWeight: 900, "& .MuiChip-icon": { color: "#29b554" } }} />
          <Typography variant="h2" fontWeight={900} color="primary.main" sx={{ mt: 1.5 }}>
            {result.total}<Typography component="span" variant="h5" color="text.secondary">/{result.maximum}</Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">Educational estimate, not an official Pearson score</Typography>
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
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Alert severity={result.total >= 75 ? "success" : "info"} sx={{ mb: 3, lineHeight: 1.7 }}>
            {result.narrative}
          </Alert>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
            {result.criteria.map((criterion) => (
              <Box key={criterion.label}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight={800}>{criterion.label}</Typography>
                  <Typography>{criterion.score}/{criterion.maximum}</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={(criterion.score / criterion.maximum) * 100} sx={{ mt: 0.7, height: 7, borderRadius: 1 }} />
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1, mt: 2.5, p: 2, border: "1px solid #dce8f1", borderRadius: 1 }}>
            <Typography><strong>Vocabulary range:</strong> {result.vocabularyRange ?? 0}%</Typography>
            <Typography><strong>Argument quality:</strong> {result.argumentQuality ?? 0}%</Typography>
          </Box>
          <Typography component="h3" variant="h6" fontWeight={900} sx={{ mt: 3, mb: 1 }}>Weaknesses and next improvements</Typography>
          <Stack component="ul" spacing={1} sx={{ pl: 2.5, my: 0 }}>
            {result.guidance.map((item) => <Typography component="li" key={item}>{item}</Typography>)}
          </Stack>
          {result.analysis.advancedTerms.length > 0 && (
            <Box sx={{ mt: 2.5 }}>
              <Typography fontWeight={900} sx={{ mb: 1 }}>Advanced vocabulary detected</Typography>
              <Stack direction="row" gap={0.8} flexWrap="wrap">
                {result.analysis.advancedTerms.slice(0, 12).map((term) => <Chip key={term} label={term} size="small" sx={{ borderRadius: 1 }} />)}
              </Stack>
            </Box>
          )}
          {annotatedSegments.length > 0 && (
            <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid #dce8f1" }}>
              <Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">Corrections:</Typography>
                {Object.entries({ replace: "Substitute", delete: "Delete", insert: "Insert" }).map(([type, label]) => <Stack key={type} direction="row" spacing={0.6} alignItems="center"><Box sx={{ width: 11, height: 11, bgcolor: annotationColors[type], border: "1px solid #94a3b8", borderRadius: "50%" }} /><Typography variant="body2">{label}</Typography></Stack>)}
              </Stack>
              <Typography component="div" sx={{ whiteSpace: "pre-wrap", lineHeight: 2, color: "#26332d" }}>
                {annotatedSegments.map((segment, index) => segment.annotation ? (
                  <Tooltip key={`${segment.text}-${index}`} arrow title={`${segment.annotation.explanation}${segment.annotation.suggestion ? ` Suggested: ${segment.annotation.suggestion}` : ""}`}>
                    <Box component="span" tabIndex={0} sx={{ bgcolor: annotationColors[segment.annotation.type], borderBottom: "2px solid #64748b", cursor: "help", px: 0.25 }}>{segment.text}</Box>
                  </Tooltip>
                ) : <span key={`${segment.text}-${index}`}>{segment.text}</span>)}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default PteCoachResult;
