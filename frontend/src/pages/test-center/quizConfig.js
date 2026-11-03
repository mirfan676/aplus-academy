export const QUIZZES = [
  { id: "ai-cyber-security-foundations-v1", label: "Quiz 1" },
  { id: "ai-cyber-security-lectures-04-07-v1", label: "Quiz 2" },
];

export const quizLabel = (testId) => QUIZZES.find((quiz) => quiz.id === testId)?.label || "Cyber Security Quiz";
export const quizStateId = (studentId, testId) => `${studentId}_${testId}`;
