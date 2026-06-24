/* global process */

const siteLinks = [
  { label: "Find Tutors", url: "https://www.aplusacademy.pk/teachers", keywords: ["teacher", "tutor", "home tutor", "online tutor", "female tutor"] },
  { label: "Free PTE Practice", url: "https://www.aplusacademy.pk/pte", keywords: ["pte", "essay", "summarize", "dictation", "english test"] },
  { label: "Teacher Registration", url: "https://www.aplusacademy.pk/register/teacher", keywords: ["register teacher", "become tutor", "teacher job"] },
  { label: "Tutor Jobs", url: "https://www.aplusacademy.pk/jobs", keywords: ["job", "tuition job", "vacancy"] },
  { label: "Career Roadmap", url: "https://www.aplusacademy.pk/career-roadmap", keywords: ["career", "roadmap", "after matric", "study abroad"] },
  { label: "English Language", url: "https://www.aplusacademy.pk/english-language", keywords: ["english", "spoken english", "grammar"] },
  { label: "Contact on WhatsApp", url: "https://wa.me/923197659491", keywords: ["whatsapp", "contact", "phone", "best tutor"] },
  { label: "Email A Plus Academy", url: "mailto:aplusacademylahore@gmail.com", keywords: ["email", "gmail", "contact"] },
];

const fallback = {
  answer: "We are working to improve our systems. This will be available soon. You can still use the quick links below for tutors, PTE practice, jobs, and contact.",
  links: siteLinks.slice(0, 4).map(({ label, url }) => ({ label, url })),
  topic: "unavailable",
};

const send = (response, status, body) => response.status(status).json(body);

const localAnswer = (message) => {
  const lower = String(message || "").toLowerCase();
  const matches = siteLinks.filter((link) => link.keywords.some((keyword) => lower.includes(keyword))).slice(0, 4);
  if (!matches.length) return fallback;
  return {
    answer: "Here are the most relevant A Plus Academy options for your question. Open the matching page and continue from there.",
    links: matches.map(({ label, url }) => ({ label, url })),
    topic: matches[0].label,
  };
};

export default async function handler(request, response) {
  if (request.method !== "POST") return send(response, 405, { error: "Method not allowed." });
  const { message } = request.body || {};
  if (!message || String(message).trim().length < 2) return send(response, 400, { error: "Question is required." });
  if (String(message).length > 800) return send(response, 400, { error: "Please keep the question short." });

  if (!process.env.OPENAI_API_KEY) return send(response, 200, localAnswer(message));

  try {
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        temperature: 0.2,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "aplus_site_tutor",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["answer", "topic", "linkLabels"],
              properties: {
                answer: { type: "string" },
                topic: { type: "string" },
                linkLabels: { type: "array", minItems: 1, maxItems: 4, items: { type: "string" } },
              },
            },
          },
        },
        messages: [
          {
            role: "system",
            content:
              "You are A Plus Academy's website helper. Stay inside aplusacademy.pk services: find tutors, free PTE practice, career roadmap, tutor jobs, teacher registration, English learning, study support, WhatsApp/email contact. Do not solve complex homework, do not generate images, do not provide medical/legal/visa guarantees, and do not pretend to browse live Google. If the requested feature is missing, say: We are working to improve our systems. This will be available soon. Prefer short explanations and recommend relevant website links by label only.",
          },
          {
            role: "user",
            content: `Available link labels: ${siteLinks.map((link) => link.label).join(", ")}\n\nUser question: ${String(message).slice(0, 800)}`,
          },
        ],
      }),
    });
    if (!aiResponse.ok) return send(response, 200, localAnswer(message));
    const payload = await aiResponse.json();
    const content = payload.choices?.[0]?.message?.content;
    if (!content) return send(response, 200, localAnswer(message));
    const parsed = JSON.parse(content);
    const labels = new Set(parsed.linkLabels || []);
    const links = siteLinks
      .filter((link) => labels.has(link.label))
      .slice(0, 4)
      .map(({ label, url }) => ({ label, url }));
    return send(response, 200, {
      answer: parsed.answer || fallback.answer,
      topic: parsed.topic || "A Plus Academy",
      links: links.length ? links : localAnswer(message).links,
    });
  } catch (error) {
    console.error(error);
    return send(response, 200, localAnswer(message));
  }
}
