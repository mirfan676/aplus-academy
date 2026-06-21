import { Alert, Box, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
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

  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, border: "1px solid #cfe4d5", borderRadius: 1, bgcolor: "#fbfefc" }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        <Box sx={{ minWidth: { md: 220 } }}>
          <Chip icon={<AutoAwesomeIcon />} label="Adaptive essay coach" sx={{ borderRadius: 1, bgcolor: "#102019", color: "#fff", fontWeight: 900, "& .MuiChip-icon": { color: "#29b554" } }} />
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
        </Box>
      </Stack>
    </Paper>
  );
};

export default PteCoachResult;
