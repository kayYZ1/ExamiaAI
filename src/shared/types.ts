export type ExamQuestions = {
  questions: {
    id: string;
    question: string;
    answers: string;
    answer: string;
  }[];
  duration: number;
};

export type LLMResponse = {
  question: string;
  answer: string;
  answers: string;
};
