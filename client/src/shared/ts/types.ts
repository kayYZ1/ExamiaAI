import { Plan } from './enums';

export type User = {
  id: string;
  email: string;
  alias?: string;
  tokens: number;
  plan: Plan;
};
