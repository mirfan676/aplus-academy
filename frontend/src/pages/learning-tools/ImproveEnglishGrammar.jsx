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
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SchoolIcon from "@mui/icons-material/School";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import useSEO from "../../hooks/useSEO";

const siteUrl = "https://www.aplusacademy.pk";

const examples = [
  "She go to school yesterday.",
  "I am agree with your opinion.",
  "He don't likes reading books.",
  "This is a important decision for students.",
];

const issueColor = {
  grammar: "#198754",
  misspelling: "#d97706",
  typography: "#2563eb",
  style: "#7c3aed",
};

const buildCorrectedText = (text, matches) => {
  const usableMatches = matches
    .filter((match) => match.replacements?.[0]?.value)
    .sort((a, b) => b.offset - a.offset);

  return usableMatches.reduce((currentText, match) => {
    const replacement = match.replacements[0].value;
    return (
      currentText.slice(0, match.offset) +
      replacement +
      currentText.slice(match.offset + match.length)
    );
  }, text);
};

const checkGrammar = async (text) => {
  const body = new URLSearchParams({
    text,
    language: "en-US",
    enabledOnly: "false",
  });

  const response = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Grammar checking service is not responding right now.");
  }

  return response.json();
};

const ImproveEnglishGrammar = () => {
  const [input, setInput] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);

  useSEO({
    title: "Improve English Grammar Online | Free Grammar Explanation Tool",
    description:
      "Check English grammar, spelling, and sentence mistakes online. Get explanations of what is wrong and suggestions to improve your writing.",
    canonical: `${siteUrl}/learning-tools/improve-english-grammar`,
    ogUrl: `${siteUrl}/learning-tools/improve-english-grammar`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  const trimmedInput = input.trim();

  const wordCount = useMemo(() => {
    if (!trimmedInput) return 0;
    return trimmedInput.split(/\s+/).length;
  }, [trimmedInput]);

  const correctedText = useMemo(() => buildCorrectedText(input, matches), [input, matches]);
  const hasCorrections = correctedText.trim() && correctedText !== input;

  const handleCheck = async () => {
    if (!trimmedInput) {
      setError("Please write a sentence or paragraph first.");
      return;
    }

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const data = await checkGrammar(trimmedInput);
      setMatches(data.matches || []);
      setChecked(true);
    } catch (grammarError) {
      setError(
        grammarError?.message ||
          "Grammar check failed. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!hasCorrections) return;
    await navigator.clipboard.writeText(correctedText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const handleReset = () => {
    setInput("");
    setMatches([]);
    setError("");
    setChecked(false);
    setCopied(false);
  };

  return (
    <Box sx={{ bgcolor: "#f7fbf8", minHeight: "100vh" }}>
      <Box component="section" sx={{ bgcolor: "#102019", color: "#fff" }}>
        <Container sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={2.2} sx={{ maxWidth: 880 }}>
            <Chip
              icon={<SpellcheckIcon />}
              label="Free English Grammar Tool"
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
              Improve English grammar with clear explanations
            </Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.7, opacity: 0.9 }}>
              Write a sentence or paragraph and see what may be wrong, why it matters,
              and how to improve it.
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
                    Check your writing
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Best for English sentences, homework paragraphs, IELTS practice,
                    emails, and speaking-script preparation.
                  </Typography>
                </Box>

                <TextField
                  label="Write English text here"
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    setChecked(false);
                  }}
                  multiline
                  minRows={8}
                  fullWidth
                  placeholder="Example: She go to school yesterday."
                  inputProps={{ maxLength: 1800 }}
                />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {wordCount} {wordCount === 1 ? "word" : "words"} typed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trimmedInput.length}/1800
                  </Typography>
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    onClick={handleCheck}
                    disabled={loading}
                    variant="contained"
                    size="large"
                    startIcon={
                      loading ? <CircularProgress color="inherit" size={18} /> : <AutoFixHighIcon />
                    }
                    sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}
                  >
                    {loading ? "Checking..." : "Check grammar"}
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
                    onClick={() => {
                      setInput(example);
                      setMatches([]);
                      setChecked(false);
                    }}
                    sx={{ borderRadius: 1, bgcolor: "#fff", fontWeight: 700 }}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 1,
                  border: "1px solid #dcebe2",
                  bgcolor: "#fff",
                }}
              >
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>
                      Improved version
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      This applies the first suggested correction for each detected issue.
                    </Typography>
                  </Box>
                  <Tooltip title={copied ? "Copied" : "Copy improved text"}>
                    <span>
                      <IconButton
                        onClick={handleCopy}
                        disabled={!hasCorrections}
                        aria-label="Copy improved text"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    minHeight: 120,
                    borderRadius: 1,
                    border: "1px solid #edf2ee",
                    bgcolor: hasCorrections ? "#f7fbf8" : "#fafafa",
                  }}
                >
                  <Typography sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                    {hasCorrections
                      ? correctedText
                      : checked
                        ? "No automatic correction was needed."
                        : "Your improved text will appear here."}
                  </Typography>
                </Box>
              </Paper>

              {checked && matches.length === 0 && (
                <Alert severity="success">
                  No grammar or spelling issues were found by the checker.
                </Alert>
              )}

              {matches.map((match, index) => {
                const issueType = match.rule?.issueType || "grammar";
                const color = issueColor[issueType] || "#198754";
                const suggestions = (match.replacements || []).slice(0, 5);

                return (
                  <Paper
                    key={`${match.offset}-${match.length}-${index}`}
                    elevation={0}
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      borderRadius: 1,
                      border: "1px solid #dcebe2",
                      bgcolor: "#fff",
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        <Chip
                          label={match.rule?.category?.name || "Grammar"}
                          size="small"
                          sx={{
                            borderRadius: 1,
                            bgcolor: color,
                            color: "#fff",
                            fontWeight: 800,
                          }}
                        />
                        {match.shortMessage && (
                          <Chip
                            label={match.shortMessage}
                            size="small"
                            sx={{ borderRadius: 1, fontWeight: 700 }}
                          />
                        )}
                      </Stack>

                      <Box>
                        <Typography component="h3" variant="h6" fontWeight={900}>
                          What may be wrong
                        </Typography>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                          {match.message}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          bgcolor: "#f7fbf8",
                          border: "1px solid #edf2ee",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Sentence context
                        </Typography>
                        <Typography sx={{ lineHeight: 1.8 }}>
                          {match.context?.text || match.sentence || input}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography component="h4" variant="subtitle1" fontWeight={900}>
                          How to improve it
                        </Typography>
                        {suggestions.length > 0 ? (
                          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                            {suggestions.map((suggestion) => (
                              <Chip
                                key={suggestion.value}
                                label={suggestion.value}
                                sx={{ borderRadius: 1, bgcolor: "#edf8f1", fontWeight: 800 }}
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                            Rewrite this part more clearly and check the sentence structure.
                          </Typography>
                        )}
                      </Box>

                      {match.rule?.urls?.[0]?.value && (
                        <Button
                          href={match.rule.urls[0].value}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="text"
                          sx={{
                            alignSelf: "flex-start",
                            textTransform: "none",
                            fontWeight: 800,
                            px: 0,
                          }}
                        >
                          Read grammar explanation
                        </Button>
                      )}
                    </Stack>
                  </Paper>
                );
              })}

              {!checked && (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 1,
                    border: "1px solid #dcebe2",
                    bgcolor: "#fff",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <SchoolIcon color="primary" />
                    <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      Grammar explanations will appear here after checking your text.
                      Students can use this to understand mistakes instead of only copying
                      corrected sentences.
                    </Typography>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ImproveEnglishGrammar;
