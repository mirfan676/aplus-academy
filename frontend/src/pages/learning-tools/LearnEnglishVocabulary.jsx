import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SchoolIcon from "@mui/icons-material/School";
import TranslateIcon from "@mui/icons-material/Translate";
import useSEO from "../../hooks/useSEO";

const siteUrl = "https://www.aplusacademy.pk";

const targetLanguages = [
  { code: "en", label: "English", helper: "Use this for vocabulary building" },
  { code: "ar", label: "Arabic", helper: "Useful for Quran and Arabic learners" },
  { code: "es", label: "Spanish", helper: "Common international language" },
  { code: "fr", label: "French", helper: "Helpful for study abroad basics" },
  { code: "hi", label: "Hindi", helper: "Useful for regional understanding" },
  { code: "ur", label: "Urdu", helper: "Helpful for native explanation" },
];

const sourceLanguages = [
  { code: "auto", label: "Auto detect" },
  { code: "en", label: "English" },
  { code: "ur", label: "Urdu" },
  { code: "hi", label: "Hindi" },
  { code: "ar", label: "Arabic" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
];

const examples = [
  "hardworking student",
  "مجھے English vocabulary سیکھنی ہے",
  "تعلیم کامیابی کی بنیاد ہے",
  "How can I improve my spoken English?",
];

const parseGoogleTranslateResponse = (data) => {
  if (!Array.isArray(data?.[0])) return "";
  return data[0].map((part) => part?.[0]).filter(Boolean).join("");
};

const translateText = async ({ text, sourceLanguage, targetLanguage }) => {
  const params = new URLSearchParams({
    client: "gtx",
    sl: sourceLanguage,
    tl: targetLanguage,
    dt: "t",
    q: text,
  });

  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Translation service is not responding right now.");
  }

  const data = await response.json();
  return parseGoogleTranslateResponse(data);
};

const LearnEnglishVocabulary = () => {
  const [input, setInput] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useSEO({
    title: "Learn English Vocabulary Online | Free Student Translation Tool",
    description:
      "Type any word or sentence and translate it into English, Arabic, Spanish, French, Hindi, and Urdu with A Plus Academy's free vocabulary learning tool.",
    canonical: `${siteUrl}/learning-tools/learn-english-vocabulary`,
    ogUrl: `${siteUrl}/learning-tools/learn-english-vocabulary`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  const trimmedInput = input.trim();

  const wordCount = useMemo(() => {
    if (!trimmedInput) return 0;
    return trimmedInput.split(/\s+/).length;
  }, [trimmedInput]);

  const handleTranslate = async () => {
    if (!trimmedInput) {
      setError("Please type a word or sentence first.");
      return;
    }

    setLoading(true);
    setError("");
    setCopied("");

    try {
      const results = await Promise.all(
        targetLanguages.map(async (language) => {
          const translated = await translateText({
            text: trimmedInput,
            sourceLanguage,
            targetLanguage: language.code,
          });
          return [language.code, translated];
        })
      );

      setTranslations(Object.fromEntries(results));
    } catch (translationError) {
      setError(
        translationError?.message ||
          "Translation failed. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (languageCode, value) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(languageCode);
    window.setTimeout(() => setCopied(""), 1400);
  };

  const handleReset = () => {
    setInput("");
    setTranslations({});
    setError("");
    setCopied("");
    setSourceLanguage("auto");
  };

  return (
    <Box sx={{ bgcolor: "#f7fbf8", minHeight: "100vh" }}>
      <Box component="section" sx={{ bgcolor: "#102019", color: "#fff" }}>
        <Container sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={2.2} sx={{ maxWidth: 880 }}>
            <Chip
              icon={<SchoolIcon />}
              label="Free English Vocabulary Tool"
              sx={{
                alignSelf: "flex-start",
                borderRadius: 1,
                color: "#fff",
                bgcolor: "rgba(38, 182, 87, 0.95)",
                fontWeight: 800,
              }}
            />
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 900,
                lineHeight: 1.08,
                fontSize: { xs: "2.15rem", md: "3.7rem" },
              }}
            >
              Learn English vocabulary from any language
            </Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.7, opacity: 0.9 }}>
              Type a word or sentence once and compare translations in English, Arabic,
              Spanish, French, Hindi, and Urdu.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container component="main" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 1,
                border: "1px solid #dcebe2",
                bgcolor: "#fff",
              }}
            >
              <Stack spacing={2.5}>
                <Box>
                  <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>
                    Translate a word or sentence
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Use short words for vocabulary practice or full sentences for meaning
                    and context.
                  </Typography>
                </Box>

                <TextField
                  select
                  label="Input language"
                  value={sourceLanguage}
                  onChange={(event) => setSourceLanguage(event.target.value)}
                  fullWidth
                >
                  {sourceLanguages.map((language) => (
                    <MenuItem key={language.code} value={language.code}>
                      {language.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Type here"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  multiline
                  minRows={6}
                  fullWidth
                  placeholder="Example: I want to improve my vocabulary"
                  inputProps={{ maxLength: 900 }}
                />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {wordCount} {wordCount === 1 ? "word" : "words"} typed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trimmedInput.length}/900
                  </Typography>
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    onClick={handleTranslate}
                    disabled={loading}
                    variant="contained"
                    size="large"
                    startIcon={
                      loading ? <CircularProgress color="inherit" size={18} /> : <TranslateIcon />
                    }
                    sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}
                  >
                    {loading ? "Translating..." : "Translate now"}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outlined"
                    size="large"
                    startIcon={<RestartAltIcon />}
                    sx={{ borderRadius: 1, textTransform: "none", fontWeight: 800 }}
                  >
                    Clear
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 1,
                border: "1px solid #dcebe2",
                bgcolor: "#edf8f1",
              }}
            >
              <Typography component="h2" variant="h6" fontWeight={900} gutterBottom>
                Try examples
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {examples.map((example) => (
                  <Chip
                    key={example}
                    label={example}
                    onClick={() => setInput(example)}
                    sx={{ borderRadius: 1, bgcolor: "#fff", fontWeight: 700 }}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
              {targetLanguages.map((language) => {
                const value = translations[language.code] || "";
                return (
                  <Grid item xs={12} sm={6} key={language.code}>
                    <Paper
                      elevation={0}
                      sx={{
                        minHeight: 190,
                        height: "100%",
                        p: 2.5,
                        borderRadius: 1,
                        border: "1px solid #dcebe2",
                        bgcolor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" spacing={1}>
                        <Box>
                          <Typography component="h3" variant="h6" fontWeight={900}>
                            {language.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {language.helper}
                          </Typography>
                        </Box>
                        <Tooltip title={copied === language.code ? "Copied" : "Copy"}>
                          <span>
                            <IconButton
                              onClick={() => handleCopy(language.code, value)}
                              disabled={!value}
                              aria-label={`Copy ${language.label} translation`}
                              size="small"
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          flex: 1,
                          borderRadius: 1,
                          bgcolor: value ? "#f7fbf8" : "#fafafa",
                          border: "1px solid #edf2ee",
                          display: "flex",
                          alignItems: value ? "flex-start" : "center",
                        }}
                      >
                        <Typography
                          sx={{
                            width: "100%",
                            color: value ? "text.primary" : "text.secondary",
                            lineHeight: 1.8,
                            wordBreak: "break-word",
                            direction: ["ar", "ur"].includes(language.code) ? "rtl" : "ltr",
                            textAlign: ["ar", "ur"].includes(language.code) ? "right" : "left",
                            fontFamily: ["ar", "ur"].includes(language.code)
                              ? '"Gulzar", "Noto Naskh Arabic", serif'
                              : "inherit",
                          }}
                        >
                          {value || "Translation will appear here."}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LearnEnglishVocabulary;
