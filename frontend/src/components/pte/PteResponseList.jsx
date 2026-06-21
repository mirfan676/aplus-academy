import { Avatar, Box, Chip, Paper, Stack, Typography } from "@mui/material";

const formatDate = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-PK", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

const PteResponseList = ({ responses }) => (
  <Box component="section" aria-labelledby="community-responses-heading">
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={1} sx={{ mb: 2 }}>
      <Box>
        <Typography id="community-responses-heading" component="h2" variant="h4" fontWeight={900}>Scored student responses</Typography>
        <Typography color="text.secondary">Higher practice scores appear first for this essay prompt.</Typography>
      </Box>
      <Chip label={`${responses.length} response${responses.length === 1 ? "" : "s"}`} sx={{ alignSelf: "flex-start", borderRadius: 1, fontWeight: 800 }} />
    </Stack>
    <Stack spacing={2}>
      {responses.map((response) => (
        <Paper key={response.id} elevation={0} sx={{ p: { xs: 2.2, md: 3 }, border: "1px solid #d8e6dd", borderRadius: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Stack direction="row" spacing={1.4} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar src={response.photoURL || undefined} alt={response.displayName}>{response.displayName?.[0] || "A"}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={900} noWrap>{response.displayName}</Typography>
                <Typography variant="body2" color="text.secondary">{formatDate(response.createdAt)} · {response.wordCount} words</Typography>
              </Box>
            </Stack>
            <Chip label={`${response.score}/${response.scoreMaximum}`} color="primary" sx={{ borderRadius: 1, color: "#fff", fontWeight: 900 }} />
          </Stack>
          <Typography sx={{ mt: 2.2, whiteSpace: "pre-line", lineHeight: 1.85, color: "text.secondary" }}>{response.essayText}</Typography>
        </Paper>
      ))}
      {!responses.length && (
        <Paper elevation={0} sx={{ p: 3, border: "1px dashed #b9cfc0", borderRadius: 1, textAlign: "center" }}>
          <Typography fontWeight={900}>No published responses for this prompt yet.</Typography>
          <Typography color="text.secondary">Sign in and submit the first practice essay.</Typography>
        </Paper>
      )}
    </Stack>
  </Box>
);

export default PteResponseList;
