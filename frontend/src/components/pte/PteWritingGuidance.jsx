import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";

const requirements = [
  "250-300 words",
  "4-5 paragraphs",
  "2 advanced vocabulary items per paragraph",
  "At least 3 complex sentences",
  "No contractions (do not, cannot)",
  "Formal academic tone throughout",
];

const PteWritingGuidance = () => (
  <Paper component="aside" elevation={0} sx={{ p: 2.5, border: "1px solid #d8e6dd", borderRadius: 1, position: { lg: "sticky" }, top: { lg: 96 } }}>
    <Chip icon={<SchoolIcon />} label="PTE writing guide" color="primary" sx={{ borderRadius: 1, color: "#fff", fontWeight: 900, "& .MuiChip-icon": { color: "#fff" } }} />
    <Typography component="h3" variant="h5" fontWeight={900} sx={{ mt: 2 }}>High-score checklist</Typography>
    <Stack spacing={1.25} sx={{ mt: 2 }}>
      {requirements.map((requirement) => (
        <Stack key={requirement} direction="row" spacing={1.1} alignItems="flex-start">
          <CheckCircleIcon sx={{ color: "#198754", fontSize: 20, mt: 0.2 }} />
          <Typography variant="body2" sx={{ lineHeight: 1.55 }}>{requirement}</Typography>
        </Stack>
      ))}
    </Stack>
    <Box sx={{ borderTop: "1px solid #d8e6dd", mt: 2.5, pt: 2.5 }}>
      <Typography fontWeight={900}>Need personal English support?</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.7, mb: 2, lineHeight: 1.6 }}>
        Work with an English tutor on grammar, vocabulary, and academic writing.
      </Typography>
      <Button component={RouterLink} to="/english-language" variant="contained" fullWidth sx={{ fontWeight: 900 }}>
        Get Essay Help
      </Button>
    </Box>
  </Paper>
);

export default PteWritingGuidance;
