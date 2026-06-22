/* global process */

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["total", "criteria", "narrative", "guidance", "annotations", "vocabularyRange", "argumentQuality"],
  properties: {
    total: { type: "integer", minimum: 0, maximum: 90 },
    criteria: {
      type: "array", minItems: 6, maxItems: 6,
      items: {
        type: "object", additionalProperties: false, required: ["label", "score", "maximum"],
        properties: { label: { type: "string" }, score: { type: "integer", minimum: 0, maximum: 15 }, maximum: { type: "integer", enum: [15] } },
      },
    },
    narrative: { type: "string" },
    guidance: { type: "array", minItems: 2, maxItems: 8, items: { type: "string" } },
    annotations: {
      type: "array", maxItems: 30,
      items: {
        type: "object", additionalProperties: false, required: ["original", "type", "suggestion", "explanation"],
        properties: {
          original: { type: "string" },
          type: { type: "string", enum: ["replace", "delete", "insert"] },
          suggestion: { type: "string" },
          explanation: { type: "string" },
        },
      },
    },
    vocabularyRange: { type: "integer", minimum: 0, maximum: 100 },
    argumentQuality: { type: "integer", minimum: 0, maximum: 100 },
  },
};
const rateLimits = new Map();

const send = (response, status, body) => response.status(status).json(body);

export default async function handler(request, response) {
  if (request.method !== "POST") return send(response, 405, { error: "Method not allowed." });
  const { essayText, prompt, idToken } = request.body || {};
  if (!idToken || !essayText || !prompt) return send(response, 400, { error: "Authentication, prompt, and essay text are required." });
  const wordCount = String(essayText).trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 120 || wordCount > 500) return send(response, 400, { error: "Essay must contain 120-500 words." });

  const firebaseKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY;
  if (!firebaseKey) return send(response, 503, { error: "Firebase verification is not configured." });
  const identityResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseKey}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }),
  });
  if (!identityResponse.ok) return send(response, 401, { error: "Google sign-in session is invalid." });
  const identity = await identityResponse.json();
  const userId = identity.users?.[0]?.localId;
  if (!userId) return send(response, 401, { error: "Google sign-in session is invalid." });
  const now = Date.now();
  const recentRequests = (rateLimits.get(userId) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (recentRequests.length >= 5) return send(response, 429, { error: "Please wait before requesting another AI score." });
  rateLimits.set(userId, [...recentRequests, now]);

  if (!process.env.OPENAI_API_KEY) return send(response, 503, { error: "AI scoring is not configured." });
  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      temperature: 0.2,
      response_format: { type: "json_schema", json_schema: { name: "pte_essay_score", strict: true, schema } },
      messages: [
        { role: "system", content: "You are a rigorous PTE Academic essay coach. Score educationally, never claim to be Pearson, and identify only genuine errors. Criteria are Form, Organization, Development, Grammar, Vocabulary, and Linguistic range, each out of 15. Annotation original text must be an exact, short substring from the submitted essay. Use replace for incorrect wording, delete for unnecessary text, and insert when text is missing near the exact original anchor. Do not reward memorized templates, fabricated research, repetition, or irrelevant content." },
        { role: "user", content: `PROMPT:\n${String(prompt).slice(0, 1800)}\n\nESSAY:\n${String(essayText).slice(0, 8000)}` },
      ],
    }),
  });
  if (!aiResponse.ok) return send(response, 502, { error: "AI scoring service is temporarily unavailable." });
  const payload = await aiResponse.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return send(response, 502, { error: "AI scoring returned no result." });
  return send(response, 200, { ...JSON.parse(content), mode: "ai" });
}
