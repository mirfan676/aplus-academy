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
  "nevertheless",
  "whereas",
];

const advancedVocabulary = [
  "academic achievement",
  "cognitive development",
  "digital dependency",
  "pedagogical effectiveness",
  "technological integration",
  "consequently",
  "considerable",
  "detrimental",
  "facilitate",
  "fundamental",
  "inevitably",
  "nevertheless",
  "predominantly",
  "significant",
  "sustainable",
  "substantial",
  "undermine",
];

const complexMarkers = [
  "although",
  "because",
  "despite",
  "even though",
  "if",
  "since",
  "unless",
  "when",
  "whereas",
  "which",
  "while",
  "who",
];

const informalTerms = ["a lot", "bad", "good", "kids", "really", "stuff", "things", "very", "you", "your"];
const longWordExclusions = new Set(["everything", "information", "something", "themselves"]);

const contractionPattern = /\b(?:aren't|can't|couldn't|didn't|doesn't|don't|hasn't|haven't|isn't|it's|shouldn't|wasn't|weren't|won't|wouldn't|i'm|they're|we're|you're)\b/gi;
const wordPattern = /[A-Za-z]+(?:['-][A-Za-z]+)*/g;

const cleanWords = (text) => text.trim().match(wordPattern) || [];
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const containsTerm = (text, term) => new RegExp(`\\b${term.replace(/\s+/g, "\\s+")}\\b`, "i").test(text);
const detectAdvancedTerms = (text) => {
  const listed = advancedVocabulary.filter((term) => containsTerm(text.toLowerCase(), term));
  const longAcademicWords = cleanWords(text)
    .map((word) => word.toLowerCase())
    .filter((word) => word.length >= 10 && !longWordExclusions.has(word));
  return [...new Set([...listed, ...longAcademicWords])];
};

export const getWordCount = (text) => cleanWords(text).length;

export const analyzePteEssay = (text) => {
  const trimmed = text.trim();
  const words = cleanWords(trimmed);
  const wordCount = words.length;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean) : [];
  const sentences = trimmed.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean);
  const lower = trimmed.toLowerCase();
  const transitionCount = transitions.filter((term) => containsTerm(lower, term)).length;
  const advancedTerms = detectAdvancedTerms(trimmed);
  const advancedByParagraph = paragraphs.map((paragraph) => detectAdvancedTerms(paragraph).length);
  const complexSentenceCount = sentences.filter((sentence) =>
    complexMarkers.some((marker) => containsTerm(sentence.toLowerCase(), marker)),
  ).length;
  const contractions = trimmed.match(contractionPattern) || [];
  const informalCount = informalTerms.filter((term) => containsTerm(lower, term)).length;
  const uniqueRatio = wordCount ? new Set(words.map((word) => word.toLowerCase())).size / wordCount : 0;
  const sentenceLengths = sentences.map((sentence) => cleanWords(sentence).length).filter(Boolean);
  const averageSentenceLength = sentenceLengths.length
    ? sentenceLengths.reduce((sum, length) => sum + length, 0) / sentenceLengths.length
    : 0;
  const sentenceVariation = sentenceLengths.length
    ? Math.max(...sentenceLengths) - Math.min(...sentenceLengths)
    : 0;
  const capitalizationRatio = sentences.length
    ? sentences.filter((sentence) => /^[A-Z]/.test(sentence)).length / sentences.length
    : 0;

  return {
    wordCount,
    paragraphCount: paragraphs.length,
    sentenceCount: sentences.length,
    transitionCount,
    advancedTerms,
    advancedByParagraph,
    complexSentenceCount,
    contractionCount: contractions.length,
    informalCount,
    uniqueRatio,
    averageSentenceLength,
    sentenceVariation,
    hasExample: /\b(for example|for instance|such as)\b/i.test(trimmed),
    hasConclusion: /\b(in conclusion|to conclude|overall)\b/i.test(trimmed),
    capitalizationRatio,
  };
};

const average = (values) => {
  const usable = values.filter((value) => Number.isFinite(value));
  return usable.length ? usable.reduce((sum, value) => sum + value, 0) / usable.length : 0;
};

export const buildPteBenchmarks = (texts = []) => {
  const analyses = texts.filter(Boolean).map(analyzePteEssay).filter((item) => item.wordCount >= 100);
  return {
    responseCount: analyses.length,
    averageWords: Math.round(average(analyses.map((item) => item.wordCount))) || 275,
    averageComplexSentences: Math.round(average(analyses.map((item) => item.complexSentenceCount))) || 3,
    averageAdvancedTerms: Math.round(average(analyses.map((item) => item.advancedTerms.length))) || 6,
  };
};

export const scorePteEssay = (text, benchmarkTexts = []) => {
  const analysis = analyzePteEssay(text);
  const benchmark = buildPteBenchmarks(benchmarkTexts);

  let form = 0;
  if (analysis.wordCount >= 250 && analysis.wordCount <= 300) form = 15;
  else if (analysis.wordCount >= 200 && analysis.wordCount <= 320) form = 12;
  else if (analysis.wordCount >= 170 && analysis.wordCount <= 350) form = 8;
  else if (analysis.wordCount >= 120) form = 4;

  const organization = clamp(
    (analysis.paragraphCount >= 4 && analysis.paragraphCount <= 5 ? 6 : analysis.paragraphCount >= 3 ? 3 : 0) +
      Math.min(analysis.transitionCount, 4) * 1.5 +
      (analysis.hasConclusion ? 3 : 0),
    0,
    15,
  );

  const development = clamp(
    (analysis.sentenceCount >= 10 ? 5 : analysis.sentenceCount >= 7 ? 3 : 1) +
      (analysis.hasExample ? 4 : 0) +
      (analysis.wordCount >= 220 ? 3 : 1) +
      (analysis.paragraphCount >= 4 ? 3 : 1),
    0,
    15,
  );

  const grammar = clamp(
    (analysis.capitalizationRatio >= 0.9 ? 5 : analysis.capitalizationRatio >= 0.7 ? 3 : 1) +
      (analysis.contractionCount === 0 ? 4 : analysis.contractionCount === 1 ? 2 : 0) +
      (analysis.averageSentenceLength >= 12 && analysis.averageSentenceLength <= 27 ? 4 : 2) +
      (analysis.sentenceCount >= 8 ? 2 : 1),
    0,
    15,
  );

  const vocabulary = clamp(
    (analysis.uniqueRatio >= 0.55 ? 5 : analysis.uniqueRatio >= 0.43 ? 3 : 1) +
      Math.min(analysis.advancedTerms.length, 6) * 1.25 +
      (analysis.informalCount === 0 ? 2.5 : 0),
    0,
    15,
  );

  const linguisticRange = clamp(
    Math.min(analysis.complexSentenceCount, 5) * 2 +
      (analysis.sentenceVariation >= 12 ? 3 : analysis.sentenceVariation >= 7 ? 2 : 0) +
      (analysis.transitionCount >= 3 ? 2 : 1),
    0,
    15,
  );

  const total = Math.round(form + organization + development + grammar + vocabulary + linguisticRange);
  const guidance = [];
  if (analysis.wordCount < 250) guidance.push(`Expand the response from ${analysis.wordCount} words toward the 250-300 word target.`);
  if (analysis.wordCount > 300) guidance.push(`Remove repetition and bring the response down from ${analysis.wordCount} words toward 300.`);
  if (analysis.paragraphCount < 4 || analysis.paragraphCount > 5) guidance.push("Use 4-5 purposeful paragraphs: introduction, developed body, counterargument, and conclusion.");
  if (analysis.advancedByParagraph.some((count) => count < 2)) guidance.push("Aim for two precise advanced vocabulary items in each body paragraph.");
  if (analysis.complexSentenceCount < 3) guidance.push("Add at least three controlled complex sentences using clauses such as although, while, which, or because.");
  if (analysis.contractionCount) guidance.push("Remove contractions and use full forms such as 'do not' and 'cannot'.");
  if (analysis.informalCount) guidance.push("Replace conversational wording with a consistent formal academic tone.");
  if (!analysis.hasExample) guidance.push("Support one main claim with a specific example or consequence.");
  if (!analysis.hasConclusion) guidance.push("Finish with a clear conclusion that reinforces the central judgement.");
  if (!guidance.length) guidance.push("Strong practice response. Proofread once for precision, spelling, and repeated wording.");

  const level = total >= 78 ? "strong" : total >= 60 ? "developing well" : "still developing";
  const narrative = `Your essay is ${level} for PTE practice, with an estimated ${total}/90. ${
    total < 86
      ? "It is unlikely to reach a full practice score yet because high-scoring responses combine controlled length, sophisticated vocabulary, varied complex grammar, specific argumentation, and consistent academic tone."
      : "It demonstrates most high-scoring writing features, although this remains an educational estimate rather than an official Pearson score."
  } Your response contains ${analysis.wordCount} words and ${analysis.complexSentenceCount} detected complex sentence${analysis.complexSentenceCount === 1 ? "" : "s"}. The current comparison benchmark is based on ${benchmark.responseCount || "the bundled"} strong sample${benchmark.responseCount === 1 ? "" : "s"}.`;

  return {
    total,
    maximum: 90,
    analysis,
    benchmark,
    narrative,
    guidance,
    criteria: [
      { label: "Form", score: Math.round(form), maximum: 15 },
      { label: "Organization", score: Math.round(organization), maximum: 15 },
      { label: "Development", score: Math.round(development), maximum: 15 },
      { label: "Grammar", score: Math.round(grammar), maximum: 15 },
      { label: "Vocabulary", score: Math.round(vocabulary), maximum: 15 },
      { label: "Linguistic range", score: Math.round(linguisticRange), maximum: 15 },
    ],
  };
};
