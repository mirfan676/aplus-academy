import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase";

const fallbackUrl = "/pte/essays.json";

const normalizeEssay = (essay, index = 0) => ({
  id: String(essay.id || essay.sourceId || `pte-${index + 1}`),
  title: String(essay.title || `PTE Essay Practice ${index + 1}`),
  prompt: String(essay.prompt || ""),
  sampleEssay: String(essay.sampleEssay || essay.bestSampleEssay || ""),
  score: Number(essay.score || essay.bestScore) || null,
  category: String(essay.category || "General"),
  tags: Array.isArray(essay.tags) ? essay.tags.map(String) : [],
});

const loadFallbackEssays = async () => {
  const response = await fetch(fallbackUrl, { cache: "no-store" });
  if (!response.ok) throw new Error("PTE sample essays could not be loaded.");
  const data = await response.json();
  return (Array.isArray(data) ? data : []).map(normalizeEssay);
};

export const fetchPteEssays = async () => {
  if (hasFirebaseConfig && db) {
    try {
      const snapshot = await getDocs(
        query(collection(db, "pteEssays"), orderBy("createdAt", "desc"), limit(100)),
      );
      const records = snapshot.docs
        .map((item, index) => normalizeEssay({ id: item.id, ...item.data() }, index))
        .filter((essay) => essay.prompt && essay.sampleEssay);
      if (records.length) return records;
    } catch (error) {
      console.warn("Firestore PTE essays unavailable; using bundled samples.", error);
    }
  }

  return loadFallbackEssays();
};

const normalizeResponse = (response, index = 0) => ({
  id: String(response.id || `response-${index + 1}`),
  promptId: String(response.promptId || ""),
  promptTitle: String(response.promptTitle || "PTE Essay"),
  essayText: String(response.essayText || ""),
  score: Number(response.score) || 0,
  scoreMaximum: Number(response.scoreMaximum) || 90,
  wordCount: Number(response.wordCount) || 0,
  displayName: String(response.displayName || "A Plus learner"),
  photoURL: String(response.photoURL || ""),
  createdAt: response.createdAt?.toDate?.().toISOString?.() || response.createdAt || null,
});

export const fetchPteEssayResponses = async (promptId) => {
  if (!hasFirebaseConfig || !db || !promptId) return [];
  const snapshot = await getDocs(
    query(collection(db, "pteEssayResponses"), where("promptId", "==", String(promptId)), limit(100)),
  );
  return snapshot.docs
    .map((item, index) => normalizeResponse({ id: item.id, ...item.data() }, index))
    .filter((response) => response.essayText)
    .sort((a, b) => b.score - a.score);
};

export const submitPteEssayResponse = async ({ user, essay, text, result }) => {
  if (!hasFirebaseConfig || !db) throw new Error("Firebase is not configured for essay submissions.");
  if (!user?.uid) throw new Error("Google sign-in is required before submitting an essay.");

  const response = {
    promptId: essay.id,
    promptTitle: essay.title,
    promptText: essay.prompt,
    essayText: text.trim(),
    score: result.total,
    scoreMaximum: result.maximum,
    wordCount: result.analysis.wordCount,
    criteria: result.criteria.reduce((output, item) => ({ ...output, [item.label]: item.score }), {}),
    diagnostics: {
      paragraphCount: result.analysis.paragraphCount,
      complexSentenceCount: result.analysis.complexSentenceCount,
      advancedVocabularyCount: result.analysis.advancedTerms.length,
      contractionCount: result.analysis.contractionCount,
      scoringMode: result.mode || "adaptive",
      vocabularyRange: result.vocabularyRange || 0,
      argumentQuality: result.argumentQuality || 0,
    },
    annotations: (result.annotations || []).slice(0, 30),
    userId: user.uid,
    displayName: user.displayName || "A Plus learner",
    photoURL: user.photoURL || "",
    createdAt: serverTimestamp(),
  };

  const saved = await addDoc(collection(db, "pteEssayResponses"), response);
  return normalizeResponse({ ...response, id: saved.id, createdAt: new Date().toISOString() });
};

export { normalizeEssay, normalizeResponse };
