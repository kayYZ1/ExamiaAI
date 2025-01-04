import { Plan } from './enums';

export type User = {
  id: string;
  email: string;
  sets: string;
  alias?: string;
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
