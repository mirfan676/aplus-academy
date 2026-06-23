export const requestAiPteTaskScore = async ({ user, task, responseText, localResult }) => {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/pte-task-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idToken,
      taskSlug: task.slug,
      taskTitle: task.title,
      prompt: task.prompt,
      responseText,
      minWords: task.minWords,
      maxWords: task.maxWords,
    }),
  });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "AI scoring is unavailable.");
  const ai = await response.json();
  return { ...localResult, ...ai, mode: "ai", maximum: 90 };
};
