import { addDoc, collection, getDocs, limit, query, serverTimestamp, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, hasFirebaseConfig, storage } from "../firebase";

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
  transcript: String(record.transcript || ""),
  practiceMode: String(record.practiceMode || "text"),
  score: Number.isFinite(Number(record.score)) ? Number(record.score) : null,
  scoreMaximum: Number(record.scoreMaximum) || 90,
  criteria: typeof record.criteria === "object" && record.criteria ? record.criteria : {},
  guidance: Array.isArray(record.guidance) ? record.guidance.map(String) : [],
  narrative: String(record.narrative || ""),
  audioUrl: String(record.audioUrl || ""),
  audioDurationSeconds: Number(record.audioDurationSeconds) || 0,
  resultType: String(record.resultType || record.diagnostics?.resultType || ""),
  mode: String(record.mode || record.diagnostics?.mode || ""),
  annotations: Array.isArray(record.annotations) ? record.annotations : [],
  attemptKind: String(record.attemptKind || "practice"),
  durationSeconds: Number(record.durationSeconds) || 0,
  createdAt: record.createdAt?.toDate?.().toISOString?.() || record.createdAt || null,
});

const uploadSpeakingAudio = async ({ userId, taskSlug, questionId, audioBlob }) => {
  if (!storage || !audioBlob) return "";
  const safeTask = String(taskSlug || "speaking").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const safeQuestion = String(questionId || "question").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const extension = (audioBlob.type || "audio/webm").split("/").pop()?.split(";")[0] || "webm";
  const fileRef = ref(
    storage,
    `pte-speaking-attempts/${userId}/${safeTask}/${safeQuestion}-${Date.now()}.${extension}`,
  );
  await uploadBytes(fileRef, audioBlob, { contentType: audioBlob.type || "audio/webm" });
  return getDownloadURL(fileRef);
};

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
  transcript = "",
  result = null,
  attemptKind = "practice",
  durationSeconds = 0,
  audioBlob = null,
}) => {
  if (!hasFirebaseConfig || !db) throw new Error("Firebase is not configured for PTE practice history.");
  if (!user?.uid) throw new Error("Google sign-in is required before saving PTE practice.");

  const audioUrl = await uploadSpeakingAudio({
    userId: user.uid,
    taskSlug: task.slug,
    questionId: question?.id,
    audioBlob,
  });

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
    transcript: String(transcript || responseText || "").trim(),
    practiceMode: String(question?.practiceMode || "text"),
    score: Number.isFinite(Number(result?.total)) ? Number(result.total) : null,
    scoreMaximum: Number(result?.maximum) || 90,
    criteria: normalizeCriteria(result?.criteria),
    guidance: Array.isArray(result?.guidance) ? result.guidance.map(String).slice(0, 12) : [],
    narrative: String(result?.narrative || ""),
    annotations: Array.isArray(result?.annotations) ? result.annotations.slice(0, 30) : [],
    audioUrl,
    audioDurationSeconds: Number(durationSeconds) || 0,
    diagnostics: {
      mode: String(result?.mode || "adaptive"),
      resultType: String(result?.resultType || ""),
      isCorrect: Boolean(result?.isCorrect),
    },
    resultType: String(result?.resultType || ""),
    mode: String(result?.mode || "adaptive"),
    attemptKind,
    durationSeconds: Number(durationSeconds) || 0,
    createdAt: serverTimestamp(),
  };

  const saved = await addDoc(collection(db, "pteTaskResponses"), payload);
  return normalizeResponse({ ...payload, id: saved.id, createdAt: new Date().toISOString() });
};
