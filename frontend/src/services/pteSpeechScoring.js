const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Audio could not be prepared for scoring."));
    reader.readAsDataURL(blob);
  });

export const requestAiPteSpeechScore = async ({
  user,
  task,
  question,
  audioBlob,
  durationSeconds,
  notes = "",
}) => {
  const idToken = await user.getIdToken();
  const audioBase64 = await blobToBase64(audioBlob);
  const response = await fetch("/api/pte-speech-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idToken,
      taskSlug: task.slug,
      taskTitle: task.title,
      prompt: question?.prompt || task.prompt,
      sourceText: question?.audioText || question?.transcript || "",
      sample: question?.sample || task.sample || "",
      durationSeconds: Number(durationSeconds) || 0,
      notes: String(notes || ""),
      mimeType: audioBlob.type || "audio/webm",
      audioBase64,
    }),
  });

  if (!response.ok) {
    throw new Error((await response.json().catch(() => ({}))).error || "Speech scoring is unavailable.");
  }

  return response.json();
};
