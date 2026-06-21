import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
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

export { normalizeEssay };
