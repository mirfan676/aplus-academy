import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import QuizIcon from "@mui/icons-material/Quiz";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import useSEO from "../../hooks/useSEO";

const siteUrl = "https://www.aplusacademy.pk";

const stopWords = new Set([
  "about",
  "after",
  "also",
  "and",
  "because",
  "been",
  "before",
  "between",
  "from",
  "have",
  "into",
  "more",
  "that",
  "their",
  "there",
  "these",
  "this",
  "through",
  "when",
  "where",
  "which",
  "with",
  "would",
]);

const examples = [
  "Photosynthesis is the process by which green plants make food using sunlight, carbon dioxide, and water. Chlorophyll in the leaves absorbs light energy. The process produces glucose and oxygen. Photosynthesis is important because it provides food for plants and oxygen for living organisms.",
  "The Indus Valley Civilization was one of the earliest urban civilizations in the world. It developed along the Indus River and had planned cities, drainage systems, trade networks, and skilled craftspeople. Archaeologists have found seals, pottery, and tools that show the culture was highly organized.",
];

const splitSentences = (text) =>
  text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 20);

const wordsFrom = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 3 && !stopWords.has(word));

const titleCase = (value) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const topKeywords = (text, limit = 8) => {
  const counts = new Map();
  wordsFrom(text).forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word]) => word);
};

const makeSummary = (sentences, keywords) => {
  if (sentences.length <= 3) return sentences;
  const scored = sentences.map((sentence, index) => {
    const lower = sentence.toLowerCase();
    const score =
      keywords.reduce((total, keyword) => total + (lower.includes(keyword) ? 1 : 0), 0) -
      index * 0.05;
    return { sentence, score, index };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);
};

const pickAnswer = (sentence, keywords) => {
  const lower = sentence.toLowerCase();
  return (
    keywords.find((keyword) => lower.includes(keyword)) ||
    wordsFrom(sentence).sort((a, b) => b.length - a.length)[0] ||
    ""
  );
};

const makeQuestionStem = (sentence, answer) => {
  if (!answer) return `What is the main idea of: "${sentence}"?`;
  const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blanked = sentence.replace(new RegExp(escaped, "i"), "_____");
  return `Which word best completes this statement: ${blanked}`;
};

const makeDistractors = (answer, keywords) => {
  const options = keywords
    .filter((keyword) => keyword !== answer)
    .slice(0, 8)
    .map(titleCase);
  while (options.length < 3) {
    options.push(["Learning", "Process", "System", "Method"][options.length]);
  }
  return options.slice(0, 3);
};

const generateStudyPack = (text) => {
  const sentences = splitSentences(text);
  const keywords = topKeywords(text, 10);
  const summary = makeSummary(sentences, keywords);
  const questionSentences = sentences.slice(0, 8);

  const shortQuestions = questionSentences.slice(0, 6).map((sentence, index) => ({
    question: `Q${index + 1}. What does this sentence explain?`,
    answer: sentence,
  }));

  const mcqs = questionSentences.slice(0, 6).map((sentence, index) => {
    const answer = pickAnswer(sentence, keywords);
    const options = [titleCase(answer), ...makeDistractors(answer, keywords)];
    return {
      question: `Q${index + 1}. ${makeQuestionStem(sentence, answer)}`,
      options,
      answer: titleCase(answer),
      explanation: sentence,
    };
  });

  const blanks = questionSentences.slice(0, 6).map((sentence, index) => {
    const answer = pickAnswer(sentence, keywords);
    const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return {
      prompt: `${index + 1}. ${sentence.replace(new RegExp(escaped, "i"), "_____")}`,
      answer: titleCase(answer),
    };
  });

  const trueFalse = questionSentences.slice(0, 6).map((sentence, index) => ({
    statement: `${index + 1}. ${sentence}`,
    answer: "True",
  }));

  return { keywords, summary, shortQuestions, mcqs, blanks, trueFalse };
};

const TextToStudyQuestions = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useSEO({
    title: "Text to Summary, Short Questions and MCQs | Free Study Tool",
    description:
      "Paste long study text and create a short summary, key points, short questions, MCQs, fill in the blanks, and true/false questions for quick revision.",
    canonical: `${siteUrl}/learning-tools/text-to-mcqs-short-questions`,
    ogUrl: `${siteUrl}/learning-tools/text-to-mcqs-short-questions`,
    ogImage: `${siteUrl}/aplus-logo.png`,
  });

  const trimmedInput = input.trim();
  const wordCount = useMemo(
    () => (trimmedInput ? trimmedInput.split(/\s+/).length : 0),
    [trimmedInput]
  );

  const handleGenerate = () => {
    if (wordCount < 25) {
      setError("Please paste at least 25 words so the tool can create useful questions.");
      return;
    }
    setError("");
    setResult(generateStudyPack(trimmedInput));
  };

  const handleReset = () => {
    setInput("");
    setResult(null);
    setError("");
  };

  return (
    <Box sx={{ bgcolor: "#f7fbf8", minHeight: "100vh" }}>
      <Box component="section" sx={{ bgcolor: "#102019", color: "#fff" }}>
        <Container sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={2.2} sx={{ maxWidth: 900 }}>
            <Chip
              icon={<QuizIcon />}
              label="Free Revision Generator"
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
                fontSize: { xs: "2.1rem", md: "3.7rem" },
              }}
            >
              Turn long text into summaries, short questions and MCQs
            </Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.7, opacity: 0.9 }}>
              Paste a paragraph, chapter note, or assignment text and create quick
              revision material for easier learning.
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
                    Paste study text
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    This free version works best with factual English paragraphs from
                    textbooks, notes, articles, or handouts.
                  </Typography>
                </Box>

                <TextField
                  label="Long text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  multiline
                  minRows={10}
                  fullWidth
                  placeholder="Paste a long paragraph or chapter section here..."
                  inputProps={{ maxLength: 5000 }}
                />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {wordCount} {wordCount === 1 ? "word" : "words"} typed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trimmedInput.length}/5000
                  </Typography>
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    onClick={handleGenerate}
                    variant="contained"
                    size="large"
                    startIcon={<AutoStoriesIcon />}
                    sx={{ borderRadius: 1, textTransform: "none", fontWeight: 900 }}
                  >
                    Generate study pack
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
              <Stack spacing={1}>
                {examples.map((example, index) => (
                  <Button
                    key={example}
                    onClick={() => {
                      setInput(example);
                      setResult(null);
                    }}
                    variant="outlined"
                    sx={{
                      justifyContent: "flex-start",
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 800,
                      bgcolor: "#fff",
                    }}
                  >
                    Example {index + 1}
                  </Button>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            {!result ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 1,
                  border: "1px solid #dcebe2",
                  bgcolor: "#fff",
                }}
              >
                <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>
                  Your study pack will appear here
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  The tool will create a summary, keywords, short questions, MCQs,
                  fill-in-the-blanks, and true/false statements from your text.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={2.5}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 1, border: "1px solid #dcebe2" }}>
                  <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>
                    Short summary
                  </Typography>
                  <Stack component="ul" spacing={1} sx={{ pl: 3, mb: 0 }}>
                    {result.summary.map((sentence) => (
                      <Typography component="li" key={sentence} sx={{ lineHeight: 1.8 }}>
                        {sentence}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: 3, borderRadius: 1, border: "1px solid #dcebe2" }}>
                  <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>
                    Important keywords
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {result.keywords.map((keyword) => (
                      <Chip key={keyword} label={titleCase(keyword)} sx={{ borderRadius: 1 }} />
                    ))}
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: 3, borderRadius: 1, border: "1px solid #dcebe2" }}>
                  <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>
                    Short questions
                  </Typography>
                  <Stack spacing={1.6}>
                    {result.shortQuestions.map((item) => (
                      <Box key={item.answer}>
                        <Typography fontWeight={900}>{item.question}</Typography>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                          {item.answer}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: 3, borderRadius: 1, border: "1px solid #dcebe2" }}>
                  <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>
                    MCQs
                  </Typography>
                  <Stack spacing={2}>
                    {result.mcqs.map((item) => (
                      <Box key={item.question}>
                        <Typography fontWeight={900}>{item.question}</Typography>
                        <Stack component="ol" sx={{ pl: 3, mt: 1, mb: 1 }}>
                          {item.options.map((option) => (
                            <Typography component="li" key={option}>
                              {option}
                            </Typography>
                          ))}
                        </Stack>
                        <Typography color="primary" fontWeight={900}>
                          Answer: {item.answer}
                        </Typography>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {item.explanation}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 1, border: "1px solid #dcebe2", height: "100%" }}>
                      <Typography component="h2" variant="h6" fontWeight={900} gutterBottom>
                        Fill in the blanks
                      </Typography>
                      <Stack spacing={1.5}>
                        {result.blanks.map((item) => (
                          <Box key={item.prompt}>
                            <Typography sx={{ lineHeight: 1.7 }}>{item.prompt}</Typography>
                            <Typography color="primary" fontWeight={900}>
                              Answer: {item.answer}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 1, border: "1px solid #dcebe2", height: "100%" }}>
                      <Typography component="h2" variant="h6" fontWeight={900} gutterBottom>
                        True / false
                      </Typography>
                      <Stack spacing={1.5}>
                        {result.trueFalse.map((item) => (
                          <Box key={item.statement}>
                            <Typography sx={{ lineHeight: 1.7 }}>{item.statement}</Typography>
                            <Typography color="primary" fontWeight={900}>
                              Answer: {item.answer}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>

              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TextToStudyQuestions;
