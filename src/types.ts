export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface TestResult {
  id: string;
  date: string; // ISO string
  duration: number; // in seconds, 0 if no limit
  timeSpent: number; // in seconds
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  answers: {
    questionId: number;
    selectedAnswerIndex: number | null;
    isCorrect: boolean;
  }[];
}
