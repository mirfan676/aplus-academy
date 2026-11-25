export const QUIZZES = [
  { id: "ai-cyber-security-foundations-v1", label: "Quiz 1" },
  { id: "ai-cyber-security-lectures-04-07-v1", label: "Quiz 2" },
  { id: "ai-cyber-security-lectures-07-09-v1", label: "Quiz 3" },
];

export const quizLabel = (testId) => QUIZZES.find((quiz) => quiz.id === testId)?.label || "Cyber Security Quiz";
export const quizStateId = (studentId, testId) => `${studentId}_${testId}`;

