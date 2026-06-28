/* global process */

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["total", "criteria", "narrative", "guidance", "annotations"],
  properties: {
    total: { type: "integer", minimum: 0, maximum: 90 },
    criteria: {
      type: "array",
      minItems: 4,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "score", "maximum"],
        properties: {
          label: { type: "string" },
          score: { type: "integer", minimum: 0, maximum: 15 },
          maximum: { type: "integer", enum: [15] },
        },
      },
    },
    narrative: { type: "string" },
    guidance: { type: "array", minItems: 2, maxItems: 8, items: { type: "string" } },
    annotations: {
      type: "array",
      maxItems: 20,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["original", "type", "suggestion", "explanation"],
        properties: {
          original: { type: "string" },
          type: { type: "string", enum: ["replace", "delete", "insert"] },
          suggestion: { type: "string" },
          explanation: { type: "string" },
        },
      },
    },
  },
};

const userWindows = new Map();
const globalWindows = new Map();

const send = (response, status, body) => response.status(status).json(body);

const consumeQuota = (userId) => {
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;
  const monthKey = new Date().toISOString().slice(0, 7);
  const userRecent = (userWindows.get(userId) || []).filter((time) => now - time < tenMinutes);
  if (userRecent.length >= 5) return "Please wait before requesting another AI score.";
  userWindows.set(userId, [...userRecent, now]);

  const globalRecent = (globalWindows.get(monthKey) || []).filter((time) => now - time < 31 * 24 * 60 * 60 * 1000);
  const monthlyLimit = Number(process.env.PTE_AI_MONTHLY_FREE_LIMIT || 900);
  if (globalRecent.length >= monthlyLimit) return "This month's free AI scoring pool has been used. Please try again later.";
  globalWindows.set(monthKey, [...globalRecent, now]);
  return "";
};

const taskPrompts = {
  "respond-to-a-situation":
    "Score this as a short practical response. Use criteria: Task Accuracy, Content, Form, Grammar, Vocabulary, Coherence. Reward polite tone, relevance, completion of the situation, and natural phrasing. Do not use essay-only ideas such as paragraph count or argument quality.",
  "summarize-written-text":
    "Score this as Summarize Written Text. Use criteria: Content, Form, Grammar, Vocabulary, Coherence. Reward a single-sentence summary, accurate main idea coverage, concise wording, and grammatical control. Do not use essay-only ideas such as argument quality, paragraph count, or advanced vocabulary checklists.",
  "summarize-spoken-text":
    "Score this as Summarize Spoken Text. Use criteria: Content, Form, Grammar, Vocabulary, Coherence. Reward accurate summary of the lecture, concise academic wording, and clear sentence control. Do not use essay-only ideas such as paragraph count, argument quality, or counterarguments.",
};

export default async function handler(request, response) {
  if (request.method !== "POST") return send(response, 405, { error: "Method not allowed." });
  const { idToken, taskSlug, taskTitle, prompt, responseText, minWords = 1, maxWords = 500 } = request.body || {};
  if (!idToken || !taskTitle || !prompt || !responseText) return send(response, 400, { error: "Authentication, task, prompt, and response text are required." });
  const wordCount = String(responseText).trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < Number(minWords) || wordCount > Number(maxWords)) return send(response, 400, { error: `Response must contain ${minWords}-${maxWords} words.` });

  const firebaseKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY;
  if (!firebaseKey) return send(response, 503, { error: "Firebase verification is not configured." });
  const identityResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!identityResponse.ok) return send(response, 401, { error: "Google sign-in session is invalid." });
  const identity = await identityResponse.json();
  const userId = identity.users?.[0]?.localId;
  if (!userId) return send(response, 401, { error: "Google sign-in session is invalid." });

  const quotaError = consumeQuota(userId);
  if (quotaError) return send(response, 429, { error: quotaError });
  if (!process.env.OPENAI_API_KEY) return send(response, 503, { error: "AI scoring is not configured." });

  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      temperature: 0.2,
      response_format: { type: "json_schema", json_schema: { name: "pte_task_score", strict: true, schema } },
      messages: [
        {
          role: "system",
          content:
            `You are a PTE Academic practice coach for text-based tasks. Score educationally, never claim to be Pearson, and avoid official-score guarantees. Use only task-appropriate criteria out of 15 each. Annotation original text must be an exact short substring from the learner response. ${taskPrompts[taskSlug] || "Use criteria such as Content, Form, Grammar, Vocabulary, Coherence, and Task Accuracy only when they truly fit the task."}`,
        },
        {
          role: "user",
          content: `TASK:\n${String(taskTitle).slice(0, 300)}\n\nPROMPT:\n${String(prompt).slice(0, 2500)}\n\nLEARNER RESPONSE:\n${String(responseText).slice(0, 5000)}`,
        },
      ],
    }),
  });
  if (!aiResponse.ok) return send(response, 502, { error: "AI scoring service is temporarily unavailable." });
  const payload = await aiResponse.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return send(response, 502, { error: "AI scoring returned no result." });
  return send(response, 200, { ...JSON.parse(content), mode: "ai" });
}
