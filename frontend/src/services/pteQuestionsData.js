import { collection, getDocs, query, where } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase";
import { getTaskQuestions, getTotalQuestionCount } from "../pages/pte/pteQuestionBank";

const normalizeOptionId = (index) => String.fromCharCode(97 + index);
const clean = (value) => String(value || "").trim().toLowerCase();

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
    const records = snapshot.docs
      .map((item, index) => normalizeQuestion({ id: item.id, ...item.data() }, index))
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
