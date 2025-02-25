import { Plan } from './enums';

export type User = {
  id: string;
  email: string;
  sets: string;
  alias?: string;
  exams: number;
  tokens: number;
  plan: Plan;
};

export type Set = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
};

export type Question = {
  id: string;
  question: string;
  answers: string;
  answer: string;
};

export type Exam = {
  id: string;
  title: string;
  participants: number;
  status: string;
  duration: number;
  setId: string;
};

export type ExamResult = {
  id: string;
  examId: string;
  fullName: string;
  score: number;
  sessionCode: string;
};
