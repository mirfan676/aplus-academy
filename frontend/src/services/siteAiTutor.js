import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase";

export const askSiteAiTutor = async (message) => {
  const response = await fetch("/api/site-ai-tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "AI helper is unavailable.");
  return response.json();
};

export const logSiteAiTutorQuestion = async ({ question, result, source = "site-widget" }) => {
  if (!hasFirebaseConfig || !db) return;
  await addDoc(collection(db, "siteAiTutorLogs"), {
    question: String(question || "").slice(0, 800),
    answer: String(result?.answer || "").slice(0, 1600),
    topic: String(result?.topic || "A Plus Academy").slice(0, 120),
    links: (result?.links || []).slice(0, 4),
    source,
    createdAt: serverTimestamp(),
  });
};
