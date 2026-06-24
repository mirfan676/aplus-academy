import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { askSiteAiTutor, logSiteAiTutorQuestion } from "../services/siteAiTutor";

const quickActions = [
  { label: "Find Tutors", to: "/teachers", icon: SearchIcon },
  { label: "Free PTE Practice", to: "/pte", icon: SchoolIcon },
  { label: "Find Me Best Tutor", href: "https://wa.me/923197659491", icon: WhatsAppIcon },
  { label: "Gmail Contact", href: "mailto:aplusacademylahore@gmail.com", icon: EmailIcon },
];

const SiteAiTutor = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      answer: "Hi, I can help you find tutors, PTE practice, jobs, registration, English help, or contact options on A Plus Academy.",
      links: [
        { label: "Find Tutors", url: "/teachers" },
        { label: "Free PTE Practice", url: "/pte" },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ask = async () => {
    const text = question.trim();
    if (!text || loading) return;
    setQuestion("");
    setError("");
    setMessages((current) => [...current, { role: "user", answer: text }]);
    setLoading(true);
    try {
      const result = await askSiteAiTutor(text);
      setMessages((current) => [...current, { role: "assistant", ...result }]);
      logSiteAiTutorQuestion({ question: text, result }).catch(console.warn);
    } catch (askError) {
      setError(askError.message || "AI helper is unavailable.");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          answer: "We are working to improve our systems. This will be available soon.",
          links: [{ label: "Contact A Plus Academy", url: "https://wa.me/923197659491" }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper
        elevation={4}
        sx={{
          position: "fixed",
          left: { xs: 8, md: 16 },
          bottom: { xs: 12, md: 24 },
          zIndex: 1200,
          width: { xs: "calc(100vw - 16px)", sm: 244 },
          maxWidth: 320,
          p: 1.2,
          borderRadius: 1,
          border: "1px solid #d4dbe3",
          bgcolor: "#fff",
        }}
      >
        <Stack spacing={0.8}>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            fullWidth
            sx={{ borderRadius: 1, textTransform: "none", fontWeight: 950, bgcolor: "#111827", "&:hover": { bgcolor: "#263142" } }}
          >
            Get Help From AI
          </Button>
          {quickActions.slice(0, 3).map((action) => {
            const Icon = action.icon;
            const common = {
              startIcon: <Icon />,
              variant: "outlined",
              size: "small",
              fullWidth: true,
              sx: { justifyContent: "flex-start", borderRadius: 1, textTransform: "none", fontWeight: 850, bgcolor: "#fff" },
            };
            return action.to ? (
              <Button key={action.label} {...common} component={RouterLink} to={action.to}>{action.label}</Button>
            ) : (
              <Button key={action.label} {...common} component="a" href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined}>{action.label}</Button>
            );
          })}
        </Stack>
      </Paper>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: { xs: "100%", sm: 390 }, bgcolor: "#f8fafc" } }}>
        <Box sx={{ p: 2.2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Box>
              <Typography component="h2" variant="h5" fontWeight={950}>A Plus AI Tutor</Typography>
              <Typography variant="body2" color="text.secondary">Website help, tutors, PTE, jobs and contact</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} aria-label="Close AI tutor"><CloseIcon /></IconButton>
          </Stack>

          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return action.to ? (
                <Button key={action.label} component={RouterLink} to={action.to} onClick={() => setOpen(false)} size="small" startIcon={<Icon />} sx={{ borderRadius: 1, textTransform: "none", fontWeight: 850 }}>
                  {action.label}
                </Button>
              ) : (
                <Button key={action.label} component="a" href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} size="small" startIcon={<Icon />} sx={{ borderRadius: 1, textTransform: "none", fontWeight: 850 }}>
                  {action.label}
                </Button>
              );
            })}
          </Stack>

          {error && <Alert severity="warning" sx={{ mb: 1.5 }}>{error}</Alert>}
          <Stack spacing={1.2} sx={{ mb: 2, maxHeight: "52vh", overflowY: "auto", pr: 0.5 }}>
            {messages.map((message, index) => (
              <Paper
                key={`${message.role}-${index}`}
                elevation={0}
                sx={{
                  p: 1.4,
                  borderRadius: 1,
                  border: "1px solid #d4dbe3",
                  bgcolor: message.role === "user" ? "#111827" : "#fff",
                  color: message.role === "user" ? "#fff" : "#111827",
                  ml: message.role === "user" ? 4 : 0,
                  mr: message.role === "user" ? 0 : 4,
                }}
              >
                <Typography sx={{ lineHeight: 1.65 }}>{message.answer}</Typography>
                {Boolean(message.links?.length) && (
                  <Stack spacing={0.7} sx={{ mt: 1 }}>
                    {message.links.map((link) => (
                      <Button key={link.url} component="a" href={link.url} target={link.url.startsWith("http") ? "_blank" : undefined} size="small" variant="outlined" sx={{ justifyContent: "flex-start", borderRadius: 1, textTransform: "none", fontWeight: 850 }}>
                        {link.label}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Paper>
            ))}
            {loading && <CircularProgress size={24} />}
          </Stack>

          <Stack spacing={1}>
            <TextField
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  ask();
                }
              }}
              multiline
              minRows={3}
              fullWidth
              placeholder="Ask about tutors, PTE practice, jobs or registration..."
            />
            <Button onClick={ask} disabled={loading || !question.trim()} variant="contained" endIcon={loading ? <CircularProgress color="inherit" size={16} /> : <AutoAwesomeIcon />} sx={{ borderRadius: 1, textTransform: "none", fontWeight: 950 }}>
              Ask AI Tutor
            </Button>
            <Typography variant="caption" color="text.secondary">
              This helper gives website guidance only. It does not solve complex tasks or create images.
            </Typography>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default SiteAiTutor;
