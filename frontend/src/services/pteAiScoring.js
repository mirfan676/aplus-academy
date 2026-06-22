export const requestAiPteScore = async ({ user, essay, text, localResult }) => {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/pte-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, prompt: essay.prompt, essayText: text }),
  });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "AI scoring is unavailable.");
  const ai = await response.json();
  return {
    ...localResult,
    ...ai,
    maximum: 90,
    mode: "ai",
    analysis: localResult.analysis,
    benchmark: localResult.benchmark,
    criteria: ai.criteria,
    guidance: ai.guidance,
    annotations: ai.annotations || [],
  };
};
