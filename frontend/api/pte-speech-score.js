/* global process */

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["transcript", "total", "criteria", "narrative", "guidance", "annotations"],
  properties: {
    transcript: { type: "string" },
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
      maxItems: 16,
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

const send = (response, status, body) => response.status(status).json(body);

const taskPrompts = {
  "read-aloud":
    "Score this as Read Aloud practice using the transcript against the source text. Use criteria such as Reading Accuracy, Delivery, Fluency, and Clarity. Do not pretend to measure official pronunciation acoustically; keep it as an educational estimate from transcript fidelity and timing.",
  "repeat-sentence":
    "Score this as Repeat Sentence practice using the transcript against the source sentence. Use criteria such as Recall Accuracy, Content, Delivery, and Fluency. Focus on how closely the learner repeated the original sentence.",
  "describe-image":
    "Score this as Describe Image practice using the learner transcript and the image prompt. Use criteria such as Content, Structure, Vocabulary, Fluency, and Task Completion. Reward description of trends, comparisons, and a clear summary.",
  "retell-lecture":
    "Score this as Retell Lecture practice using the learner transcript and the source lecture text. Use criteria such as Content, Organization, Vocabulary, Fluency, and Task Completion. Reward coverage of main points rather than memorizing every word.",
  "answer-short-question":
    "Score this as Answer Short Question practice. Use criteria such as Answer Accuracy, Word Precision, Delivery, and Clarity. The expected response is usually one short word or phrase, so reward exact correctness heavily.",
};

export default async function handler(request, response) {
  if (request.method !== "POST") return send(response, 405, { error: "Method not allowed." });

  const {
    idToken,
    taskSlug,
    taskTitle,
    prompt,
    sourceText = "",
    sample = "",
    durationSeconds = 0,
    notes = "",
    mimeType = "audio/webm",
    audioBase64,
  } = request.body || {};

  if (!idToken || !taskSlug || !taskTitle || !prompt || !audioBase64) {
    return send(response, 400, { error: "Authentication, task, prompt, and recorded audio are required." });
  }

  const firebaseKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY;
  if (!firebaseKey) return send(response, 503, { error: "Firebase verification is not configured." });
  const identityResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!identityResponse.ok) return send(response, 401, { error: "Google sign-in session is invalid." });

  if (!process.env.OPENAI_API_KEY) return send(response, 503, { error: "AI speech scoring is not configured." });

  const { Blob } = await import("node:buffer");
  const { Buffer } = await import("node:buffer");
  const audioBuffer = Buffer.from(String(audioBase64), "base64");
  const form = new FormData();
  form.append("model", process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe");
  form.append("file", new Blob([audioBuffer], { type: mimeType }), "pte-speaking.webm");
  form.append("language", "en");

  const transcriptionResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form,
  });

  if (!transcriptionResponse.ok) return send(response, 502, { error: "Speech transcription is temporarily unavailable." });
  const transcriptionPayload = await transcriptionResponse.json();
  const transcript = String(transcriptionPayload.text || "").trim();
  if (!transcript) return send(response, 502, { error: "The recording could not be transcribed clearly." });

  const scoreResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      temperature: 0.2,
      response_format: { type: "json_schema", json_schema: { name: "pte_speech_score", strict: true, schema } },
      messages: [
        {
          role: "system",
          content:
            `You are a PTE Academic speaking practice coach. Score educationally, never claim to be Pearson, and avoid official-score guarantees. Return a transcript-aware practice estimate only. ${taskPrompts[taskSlug] || "Use task-appropriate educational speaking criteria only."}`,
        },
        {
          role: "user",
          content:
            `TASK:\n${taskTitle}\n\nPROMPT:\n${prompt}\n\nSOURCE TEXT OR AUDIO SCRIPT:\n${String(sourceText).slice(0, 2500)}\n\nMODEL DIRECTION:\n${String(sample).slice(0, 1500)}\n\nRECORDED DURATION SECONDS:\n${Number(durationSeconds) || 0}\n\nOPTIONAL NOTES:\n${String(notes).slice(0, 1200)}\n\nTRANSCRIBED LEARNER RESPONSE:\n${transcript}`,
        },
      ],
    }),
  });

  if (!scoreResponse.ok) return send(response, 502, { error: "Speech scoring service is temporarily unavailable." });
  const scorePayload = await scoreResponse.json();
  const content = scorePayload.choices?.[0]?.message?.content;
  if (!content) return send(response, 502, { error: "Speech scoring returned no result." });

  return send(response, 200, { ...JSON.parse(content), transcript, mode: "ai", taskSlug, resultType: "speaking" });
}
