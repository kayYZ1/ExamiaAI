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
};
