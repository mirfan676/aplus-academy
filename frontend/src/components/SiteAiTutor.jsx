import { useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  Collapse,
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
import { useAuth } from "../contexts/useAuth";
import { askSiteAiTutor, logSiteAiTutorQuestion } from "../services/siteAiTutor";
import { fetchTeachersFromFirestore } from "../services/teacherData";

const quickActions = [
  { label: "Find Tutors", to: "/teachers", icon: SearchIcon },
  { label: "Free PTE Practice", to: "/pte", icon: SchoolIcon },
  { label: "Find Me Best Tutor", prompt: "Find me best tutor", icon: WhatsAppIcon },
  { label: "Gmail Contact", href: "mailto:aplusacademylahore@gmail.com", icon: EmailIcon },
];

const historyKey = "aplus-site-ai-tutor-history-v1";
const historyLife = 24 * 60 * 60 * 1000;
const suggestionKey = "aplus-site-ai-tutor-suggestion-v1";
const defaultMessages = [
  {
    role: "assistant",
    answer: "Hi, I can help you find tutors, PTE practice, jobs, registration, English help, or contact options on A Plus Academy.",
    links: [
      { label: "Find Tutors", url: "/teachers" },
      { label: "Free PTE Practice", url: "/pte" },
    ],
  },
];

const loadHistory = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(historyKey) || "null");
    if (saved?.expiresAt > Date.now() && Array.isArray(saved.messages)) return saved.messages;
  } catch {
    localStorage.removeItem(historyKey);
  }
  return defaultMessages;
};

const isBestTutorQuestion = (text) => /\b(best|find|recommend|suggest|need|want)\b.*\b(tutor|teacher)\b|\b(tutor|teacher)\b.*\b(best|recommend|suggest)\b/i.test(text);

const termsFrom = (text) => String(text || "").toLowerCase().match(/[a-z0-9]+/g) || [];

const scoreTeacher = (teacher, terms) => {
  const haystack = [
    teacher.name,
    teacher.city,
    teacher.Area1,
    teacher.Area2,
    teacher.Area3,
    teacher.qualification,
    ...(teacher.subjects || []),
  ].join(" ").toLowerCase();
  const termScore = terms.reduce((score, term) => score + (haystack.includes(term) ? 8 : 0), 0);
  const experienceScore = Math.min(Number(teacher.experience || 0), 15);
  const featuredScore = teacher.Featured || teacher.featured ? 12 : 0;
  return termScore + experienceScore + featuredScore;
};

const teacherLocation = (teacher) => [teacher.Area1, teacher.Area2, teacher.Area3, teacher.city].filter(Boolean).slice(0, 3).join(", ") || teacher.city || "Pakistan";

const SiteAiTutor = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState(loadHistory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState(() => {
    try {
      return localStorage.getItem(suggestionKey) || "";
    } catch {
      return "";
    }
  });
  const [suggestionName, setSuggestionName] = useState("");
  const [suggestionEmail, setSuggestionEmail] = useState("");
  const [suggestionStatus, setSuggestionStatus] = useState("");
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const messageListRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    setSuggestionName((current) => current || user?.displayName || "");
    setSuggestionEmail((current) => current || user?.email || "");
  }, [user]);

  useEffect(() => {
    localStorage.setItem(historyKey, JSON.stringify({ messages, expiresAt: Date.now() + historyLife }));
  }, [messages]);

  useEffect(() => {
    if (suggestion) {
      localStorage.setItem(suggestionKey, suggestion);
    } else {
      localStorage.removeItem(suggestionKey);
    }
  }, [suggestion]);

  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(() => {
      const list = messageListRef.current;
      if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
      bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [messages, loading, open]);

  const appendAssistant = (result) => {
    setMessages((current) => [...current, { role: "assistant", ...result }]);
  };

  const findBestTeachers = async (text) => {
    const teachers = await fetchTeachersFromFirestore();
    const terms = termsFrom(text).filter((term) => !["find", "best", "teacher", "tutor", "me", "a", "the", "for", "in"].includes(term));
    const ranked = teachers
      .map((teacher) => ({ teacher, score: scoreTeacher(teacher, terms) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ teacher }) => ({
        id: teacher.id,
        name: teacher.name,
        location: teacherLocation(teacher),
        subjects: (teacher.subjects || []).slice(0, 3),
        experience: Number(teacher.experience || 0),
        photoURL: teacher.thumbnail || teacher.photoURL || teacher.Thumbnail || "",
        hireUrl: `/hire/${teacher.id}`,
        profileUrl: `/teacher/${teacher.id}`,
      }));

    if (!ranked.length) {
      return {
        answer: "I could not find matching tutor profiles right now. You can still open the tutor directory or contact A Plus Academy directly.",
        links: [
          { label: "Find Tutors", url: "/teachers" },
          { label: "Contact on WhatsApp", url: "https://wa.me/923197659491" },
        ],
      };
    }

    return {
      answer: "Here are suitable verified tutors from A Plus Academy. You can view the profile or send a hire request directly.",
      teachers: ranked,
      links: [{ label: "View All Tutors", url: "/teachers" }],
      topic: "teacher recommendation",
    };
  };

  const askText = async (text) => {
    if (!text || loading) return;
    setQuestion("");
    setError("");
    setMessages((current) => [...current, { role: "user", answer: text }]);
    setLoading(true);
    try {
      if (isBestTutorQuestion(text)) {
        const result = await findBestTeachers(text);
        appendAssistant(result);
        logSiteAiTutorQuestion({ question: text, result }).catch(console.warn);
        return;
      }
      const result = await askSiteAiTutor(text);
      appendAssistant(result);
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

  const ask = () => askText(question.trim());

  const sendSuggestion = async () => {
    const message = suggestion.trim();
    if (!message || suggestionLoading) return;

    setSuggestionStatus("");
    setSuggestionLoading(true);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_SUGGESTION_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        const subject = encodeURIComponent("A Plus Academy suggestion from the website");
        const body = encodeURIComponent(
          `Name: ${suggestionName || user?.displayName || "Website visitor"}\n` +
          `Email: ${suggestionEmail || user?.email || "not provided"}\n` +
          `Page: ${window.location.href}\n\n` +
          `${message}`,
        );
        window.location.href = `mailto:aplusacademylahore@gmail.com?subject=${subject}&body=${body}`;
        setSuggestionStatus("Your email app has been opened.");
        return;
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: "aplusacademylahore@gmail.com",
          from_name: suggestionName || user?.displayName || "Website visitor",
          from_email: suggestionEmail || user?.email || "no-reply@aplusacademy.pk",
          message,
          page_url: window.location.href,
          chat_summary: messages.slice(-8).map((item) => `${item.role}: ${item.answer}`).join("\n"),
        },
        publicKey,
      );

      setSuggestion("");
      setSuggestionStatus("Suggestion sent to A Plus Academy.");
      localStorage.removeItem(suggestionKey);
    } catch (sendError) {
      setSuggestionStatus(sendError.message || "Could not send suggestion right now.");
    } finally {
      setSuggestionLoading(false);
    }
  };

  const visibleMessages = useMemo(() => messages.slice(-30), [messages]);

  return (
    <>
      <Box
        elevation={4}
        sx={{
          position: "fixed",
          left: { xs: 12, md: 16 },
          bottom: { xs: 12, md: 24 },
          zIndex: 1200,
        }}
      >
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          aria-label="Open AI tutor"
          sx={{
            width: { xs: 58, md: 64 },
            height: { xs: 58, md: 64 },
            minWidth: 0,
            borderRadius: "50%",
            p: 0,
            bgcolor: "#111827",
            color: "#fff",
            boxShadow: "0 10px 24px rgba(17,24,39,0.25)",
            border: "1px solid rgba(255,255,255,0.08)",
            textTransform: "none",
            fontWeight: 950,
            "&:hover": { bgcolor: "#263142" },
          }}
        >
          <Stack spacing={0} alignItems="center" justifyContent="center" sx={{ lineHeight: 1, textAlign: "center" }}>
            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            <Typography component="span" sx={{ fontSize: 13, fontWeight: 950, lineHeight: 1 }}>
              AI+
            </Typography>
          </Stack>
        </Button>
      </Box>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 390 }, maxWidth: "100vw", bgcolor: "#f8fafc", height: "100dvh", left: 0 } }}
      >
        <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column", p: 2 }}>
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
              ) : action.prompt ? (
                <Button key={action.label} onClick={() => askText(action.prompt)} size="small" startIcon={<Icon />} sx={{ borderRadius: 1, textTransform: "none", fontWeight: 850 }}>
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
          <Stack ref={messageListRef} spacing={1.2} sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 0.5, pb: 1.5 }}>
            {visibleMessages.map((message, index) => (
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
                {Boolean(message.teachers?.length) && (
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {message.teachers.map((teacher) => (
                      <Paper key={teacher.id} elevation={0} sx={{ p: 1, border: "1px solid #d4dbe3", borderRadius: 1, bgcolor: "#f8fafc" }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar src={teacher.photoURL || undefined} alt={teacher.name}>{teacher.name?.[0] || "T"}</Avatar>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography fontWeight={950} noWrap>{teacher.name}</Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>{teacher.location}</Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" gap={0.6} flexWrap="wrap" sx={{ mt: 0.8 }}>
                          {teacher.subjects.map((subject) => <Chip key={subject} size="small" label={subject} sx={{ borderRadius: 1 }} />)}
                          {teacher.experience > 0 && <Chip size="small" label={`${teacher.experience} yrs`} sx={{ borderRadius: 1 }} />}
                        </Stack>
                        <Stack direction="row" gap={0.8} sx={{ mt: 1 }}>
                          <Button component={RouterLink} to={teacher.profileUrl} onClick={() => setOpen(false)} size="small" variant="outlined" sx={{ borderRadius: 1, textTransform: "none", fontWeight: 850 }}>Profile</Button>
                          <Button component={RouterLink} to={teacher.hireUrl} onClick={() => setOpen(false)} size="small" variant="contained" sx={{ borderRadius: 1, textTransform: "none", fontWeight: 850 }}>Hire Tutor</Button>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}
                {Boolean(message.links?.length) && (
                  <Stack spacing={0.7} sx={{ mt: 1 }}>
                    {message.links.map((link) => (
                      link.url.startsWith("/") ? (
                        <Button key={link.url} component={RouterLink} to={link.url} onClick={() => setOpen(false)} size="small" variant="outlined" sx={{ justifyContent: "flex-start", borderRadius: 1, textTransform: "none", fontWeight: 850 }}>{link.label}</Button>
                      ) : (
                        <Button key={link.url} component="a" href={link.url} target={link.url.startsWith("http") ? "_blank" : undefined} size="small" variant="outlined" sx={{ justifyContent: "flex-start", borderRadius: 1, textTransform: "none", fontWeight: 850 }}>{link.label}</Button>
                      )
                    ))}
                  </Stack>
                )}
              </Paper>
            ))}
            {loading && <CircularProgress size={24} />}
            <Box ref={bottomRef} />
          </Stack>

          <Stack spacing={1} sx={{ pt: 1.2, borderTop: "1px solid #d4dbe3" }}>
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
              minRows={2}
              fullWidth
              placeholder="Ask about tutors, PTE practice, jobs or registration..."
            />
            <Button onClick={ask} disabled={loading || !question.trim()} variant="contained" endIcon={loading ? <CircularProgress color="inherit" size={16} /> : <AutoAwesomeIcon />} sx={{ borderRadius: 1, textTransform: "none", fontWeight: 950 }}>
              Ask AI Tutor
            </Button>
            <Button
              onClick={() => setSuggestionOpen((current) => !current)}
              variant="text"
              size="small"
              sx={{ alignSelf: "flex-start", px: 0.5, textTransform: "none", fontWeight: 800, color: "text.secondary" }}
            >
              {suggestionOpen ? "Hide feedback" : "Send feedback"}
            </Button>
            <Collapse in={suggestionOpen} timeout="auto" unmountOnExit>
              <Paper elevation={0} sx={{ mt: 0.5, p: 1.25, borderRadius: 1, border: "1px solid #d4dbe3", bgcolor: "#fafbfc" }}>
                <Stack spacing={0.9}>
                  <Typography fontWeight={900} sx={{ fontSize: 14 }}>Feedback</Typography>
                  <TextField
                    label="Your name"
                    value={suggestionName}
                    onChange={(event) => setSuggestionName(event.target.value)}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Your email"
                    type="email"
                    value={suggestionEmail}
                    onChange={(event) => setSuggestionEmail(event.target.value)}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Your suggestion"
                    value={suggestion}
                    onChange={(event) => setSuggestion(event.target.value)}
                    multiline
                    minRows={2}
                    fullWidth
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      onClick={sendSuggestion}
                      disabled={suggestionLoading || !suggestion.trim()}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}
                    >
                      {suggestionLoading ? "Sending..." : "Send"}
                    </Button>
                    {suggestionStatus && (
                      <Typography variant="caption" color={suggestionStatus.includes("sent") ? "success.main" : "text.secondary"}>
                        {suggestionStatus}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            </Collapse>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default SiteAiTutor;
