const transitions = [
  "however",
  "therefore",
  "moreover",
  "furthermore",
  "consequently",
  "for example",
  "for instance",
  "in addition",
  "on the other hand",
  "in conclusion",
  "to conclude",
];

const cleanWords = (text) => text.trim().match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g) || [];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getWordCount = (text) => cleanWords(text).length;

export const scorePteEssay = (text) => {
  const trimmed = text.trim();
  const words = cleanWords(trimmed);
  const wordCount = words.length;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean) : [];
  const sentences = trimmed.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean);
  const lower = trimmed.toLowerCase();
  const transitionCount = transitions.filter((term) => lower.includes(term)).length;
  const uniqueRatio = wordCount ? new Set(words.map((word) => word.toLowerCase())).size / wordCount : 0;
  const sentenceLengths = sentences.map((sentence) => cleanWords(sentence).length).filter(Boolean);
  const averageSentenceLength = sentenceLengths.length
    ? sentenceLengths.reduce((sum, length) => sum + length, 0) / sentenceLengths.length
    : 0;
  const startsWithCapital = sentences.filter((sentence) => /^[A-Z]/.test(sentence)).length;
  const capitalizationRatio = sentences.length ? startsWithCapital / sentences.length : 0;

  let form = 0;
  if (wordCount >= 200 && wordCount <= 300) form = 15;
  else if (wordCount >= 170 && wordCount <= 330) form = 11;
  else if (wordCount >= 120 && wordCount <= 380) form = 7;
  else if (wordCount >= 60) form = 3;

  const organization = clamp(
    (paragraphs.length >= 4 ? 6 : paragraphs.length >= 2 ? 3 : 0) +
      Math.min(transitionCount, 4) * 1.5 +
      (/\b(in conclusion|to conclude|overall)\b/.test(lower) ? 3 : 0),
    0,
    15,
  );

  const development = clamp(
    (sentences.length >= 10 ? 5 : sentences.length >= 6 ? 3 : 1) +
      (uniqueRatio >= 0.55 ? 5 : uniqueRatio >= 0.42 ? 3 : 1) +
      (/\b(for example|for instance|such as)\b/.test(lower) ? 3 : 0) +
      (wordCount >= 180 ? 2 : 0),
    0,
    15,
  );

  const mechanics = clamp(
    (capitalizationRatio >= 0.9 ? 5 : capitalizationRatio >= 0.7 ? 3 : 1) +
      (averageSentenceLength >= 10 && averageSentenceLength <= 28 ? 5 : 2) +
      (/[,:;]/.test(trimmed) ? 3 : 1) +
      (sentences.length >= 6 ? 2 : 0),
    0,
    15,
  );

  const total = Math.round(form + organization + development + mechanics);
  const feedback = [];
  if (wordCount < 200) feedback.push("Develop the response toward the usual 200-300 word target.");
  if (wordCount > 300) feedback.push("Edit repeated ideas and bring the response closer to 300 words.");
  if (paragraphs.length < 4) feedback.push("Use a clear introduction, two body paragraphs, and a conclusion.");
  if (transitionCount < 3) feedback.push("Connect ideas with a few precise transition phrases.");
  if (!/\b(for example|for instance|such as)\b/.test(lower)) {
    feedback.push("Support one main claim with a specific example.");
  }
  if (averageSentenceLength > 28) feedback.push("Split long sentences to improve clarity and control.");
  if (!feedback.length) feedback.push("Strong practice response. Proofread once for accuracy and repetition.");

  return {
    total,
    maximum: 60,
    wordCount,
    paragraphCount: paragraphs.length,
    sentenceCount: sentences.length,
    criteria: [
      { label: "Form", score: Math.round(form), maximum: 15 },
      { label: "Organization", score: Math.round(organization), maximum: 15 },
      { label: "Development", score: Math.round(development), maximum: 15 },
      { label: "Mechanics", score: Math.round(mechanics), maximum: 15 },
    ],
    feedback,
  };
};
