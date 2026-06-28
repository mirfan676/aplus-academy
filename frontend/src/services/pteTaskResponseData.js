import { addDoc, collection, getDocs, limit, query, serverTimestamp, where } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase";

const normalizeCriteria = (criteria) => {
  if (!Array.isArray(criteria)) return {};
  return criteria.reduce((output, item) => {
    if (!item?.label) return output;
    return { ...output, [String(item.label)]: Number(item.score) || 0 };
  }, {});
};

const normalizeResponse = (record, index = 0) => ({
  id: String(record.id || `pte-task-response-${index + 1}`),
  userId: String(record.userId || ""),
  taskSlug: String(record.taskSlug || ""),
  taskTitle: String(record.taskTitle || "PTE Task"),
  section: String(record.section || ""),
  questionId: String(record.questionId || ""),
  questionTitle: String(record.questionTitle || ""),
  promptText: String(record.promptText || ""),
  responseText: String(record.responseText || ""),
  practiceMode: String(record.practiceMode || "text"),
  score: Number.isFinite(Number(record.score)) ? Number(record.score) : null,
  scoreMaximum: Number(record.scoreMaximum) || 90,
  criteria: typeof record.criteria === "object" && record.criteria ? record.criteria : {},
  attemptKind: String(record.attemptKind || "practice"),
  durationSeconds: Number(record.durationSeconds) || 0,
  createdAt: record.createdAt?.toDate?.().toISOString?.() || record.createdAt || null,
});

export const fetchUserPteTaskResponses = async (userId) => {
  if (!hasFirebaseConfig || !db || !userId) return [];
  const snapshot = await getDocs(
    query(collection(db, "pteTaskResponses"), where("userId", "==", String(userId)), limit(250)),
  );
  return snapshot.docs
    .map((item, index) => normalizeResponse({ id: item.id, ...item.data() }, index))
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
};

export const submitPteTaskResponse = async ({
  user,
  task,
  question,
  responseText = "",
  result = null,
  attemptKind = "practice",
  durationSeconds = 0,
}) => {
  if (!hasFirebaseConfig || !db) throw new Error("Firebase is not configured for PTE practice history.");
  if (!user?.uid) throw new Error("Google sign-in is required before saving PTE practice.");

  const payload = {
    userId: user.uid,
    displayName: user.displayName || "A Plus learner",
    photoURL: user.photoURL || "",
    taskSlug: task.slug,
    taskTitle: task.title,
    section: task.section || "",
    questionId: String(question?.id || ""),
    questionTitle: String(question?.title || task.title),
    promptText: String(question?.prompt || task.prompt || ""),
    responseText: String(responseText || "").trim(),
    practiceMode: String(question?.practiceMode || "text"),
    score: Number.isFinite(Number(result?.total)) ? Number(result.total) : null,
    scoreMaximum: Number(result?.maximum) || 90,
    criteria: normalizeCriteria(result?.criteria),
    diagnostics: {
      mode: String(result?.mode || "adaptive"),
      resultType: String(result?.resultType || ""),
      isCorrect: Boolean(result?.isCorrect),
    },
    attemptKind,
    durationSeconds: Number(durationSeconds) || 0,
    createdAt: serverTimestamp(),
  };

  const saved = await addDoc(collection(db, "pteTaskResponses"), payload);
  return normalizeResponse({ ...payload, id: saved.id, createdAt: new Date().toISOString() });
};
