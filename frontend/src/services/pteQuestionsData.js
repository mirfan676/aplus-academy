import { collection, getDocs, query, where } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase";
import { getTaskQuestions, getTotalQuestionCount } from "../pages/pte/pteQuestionBank";

const normalizeOptionId = (index) => String.fromCharCode(97 + index);
const clean = (value) => String(value || "").trim().toLowerCase();
const prefer = (primary, fallback) => {
  if (primary == null) return fallback;
  if (typeof primary === "string") return primary.trim() ? primary : fallback;
  if (Array.isArray(primary)) return primary.length ? primary : fallback;
  if (typeof primary === "object") return Object.keys(primary).length ? primary : fallback;
  return primary;
};

const normalizeQuestion = (record, index = 0) => {
  const options = Array.isArray(record.options)
    ? record.options.map((option, optionIndex) =>
        typeof option === "string"
          ? { id: normalizeOptionId(optionIndex), text: option }
          : { id: option.id || normalizeOptionId(optionIndex), text: option.text || "" },
      )
    : [];
  const correctAnswers = Array.isArray(record.correctAnswers) ? record.correctAnswers.map(String) : [];
  const correctOptionIds = options
    .filter((option) => correctAnswers.includes(option.id) || correctAnswers.some((answer) => clean(answer) === clean(option.text)))
    .map((option) => option.id);

  return {
    id: String(record.id || `pte-question-${index + 1}`),
    title: String(record.title || `PTE Question ${index + 1}`),
    taskSlug: String(record.taskSlug || ""),
    section: String(record.section || ""),
    practiceMode: String(record.questionType || record.practiceMode || "text"),
    prompt: String(record.prompt || ""),
    transcript: String(record.transcript || ""),
    audioText: String(record.audioText || ""),
    audioUrl: String(record.audioUrl || ""),
    imageUrl: String(record.imageUrl || ""),
    imageAlt: String(record.imageAlt || ""),
    imageSpec: typeof record.imageSpec === "object" && record.imageSpec ? record.imageSpec : null,
    sample: String(record.sample || ""),
    explanation: String(record.explanation || ""),
    notes: String(record.notes || ""),
    difficulty: String(record.difficulty || "medium"),
    source: String(record.source || "A Plus Academy original"),
    options,
    correctAnswers,
    correctOptionIds,
    acceptableAnswers: Array.isArray(record.acceptableAnswers) ? record.acceptableAnswers.map(String) : [],
    tips: Array.isArray(record.tips) ? record.tips.map(String) : [],
    minWords: Number.isFinite(Number(record.minWords)) ? Number(record.minWords) : null,
    maxWords: Number.isFinite(Number(record.maxWords)) ? Number(record.maxWords) : null,
    order: Number(record.order) || index,
    published: record.published !== false,
  };
};

export const fetchPublishedPteQuestions = async (taskSlug) => {
  const fallback = getTaskQuestions(taskSlug);
  if (!hasFirebaseConfig || !db || !taskSlug) return fallback;

  try {
    const snapshot = await getDocs(
      query(
        collection(db, "pteQuestions"),
        where("published", "==", true),
        where("taskSlug", "==", String(taskSlug)),
      ),
    );
    const bundledById = new Map(fallback.map((question) => [String(question.id), question]));
    const records = snapshot.docs
      .map((item, index) => {
        const normalized = normalizeQuestion({ id: item.id, ...item.data() }, index);
        const bundled = bundledById.get(normalized.id);
        if (!bundled) return normalized;
        return {
          ...bundled,
          ...normalized,
          transcript: prefer(normalized.transcript, bundled.transcript || ""),
          audioText: prefer(normalized.audioText, bundled.audioText || ""),
          audioUrl: prefer(normalized.audioUrl, bundled.audioUrl || ""),
          imageUrl: prefer(normalized.imageUrl, bundled.imageUrl || ""),
          imageAlt: prefer(normalized.imageAlt, bundled.imageAlt || ""),
          imageSpec: prefer(normalized.imageSpec, bundled.imageSpec || null),
          sample: prefer(normalized.sample, bundled.sample || ""),
          explanation: prefer(normalized.explanation, bundled.explanation || ""),
          notes: prefer(normalized.notes, bundled.notes || ""),
          options: prefer(normalized.options, bundled.options || []),
          correctAnswers: prefer(normalized.correctAnswers, bundled.correctAnswers || []),
          correctOptionIds: prefer(normalized.correctOptionIds, bundled.correctOptionIds || []),
          acceptableAnswers: prefer(normalized.acceptableAnswers, bundled.acceptableAnswers || []),
          tips: prefer(normalized.tips, bundled.tips || []),
        };
      })
      .filter((question) => question.prompt);
    return records.length ? records.sort((a, b) => (a.order || 0) - (b.order || 0)) : fallback;
  } catch (error) {
    console.warn(`Firestore PTE questions unavailable for ${taskSlug}; using bundled questions.`, error);
    return fallback;
  }
};

export const fetchPublishedPteQuestionCounts = async () => {
  const bundledCounts = {};
  [
    "read-aloud",
    "repeat-sentence",
    "describe-image",
    "retell-lecture",
    "answer-short-question",
    "respond-to-a-situation",
    "summarize-written-text",
    "write-essay",
    "reading-writing-fill-blanks",
    "multiple-choice-multiple-answers",
    "reorder-paragraphs",
    "reading-fill-blanks",
    "reading-multiple-choice-single-answer",
    "summarize-spoken-text",
    "listening-fill-blanks",
    "highlight-correct-summary",
    "select-missing-word",
    "highlight-incorrect-words",
    "write-from-dictation",
  ].forEach((slug) => {
    bundledCounts[slug] = getTaskQuestions(slug).length;
  });
  const bundledTotal = getTotalQuestionCount();

  if (!hasFirebaseConfig || !db) {
    return { countsByTask: bundledCounts, total: bundledTotal };
  }

  try {
    const snapshot = await getDocs(
      query(collection(db, "pteQuestions"), where("published", "==", true)),
    );
    const countsByTask = {};
    snapshot.docs.forEach((item) => {
      const taskSlug = String(item.data().taskSlug || "");
      if (!taskSlug) return;
      countsByTask[taskSlug] = (countsByTask[taskSlug] || 0) + 1;
    });
    const mergedCounts = { ...bundledCounts, ...countsByTask };
    const total = Object.values(mergedCounts).reduce((sum, count) => sum + count, 0);
    return { countsByTask: mergedCounts, total: total || bundledTotal };
  } catch (error) {
    console.warn("Firestore PTE question counts unavailable; using bundled totals.", error);
    return { countsByTask: bundledCounts, total: bundledTotal };
  }
};
