import { useQuery } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';

import { getUser } from '@/lib/queries';
import { colors } from '@/styles/theme';
import Sets from './sets';

export default function Panel() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });

  return (
    <div className="space-y-2 pt-4">
      <h1 className={`text-xl font-bold ${colors.text.primary}`}>
        Welcome, {isLoading ? '...' : user.alias ? user.alias : user.email}
      </h1>
      <p className={`text-md ${colors.text.muted}`}>
        Here is a quick onboarding
      </p>
      <ul
        className={`animate-fadeIn list-none space-y-2 pl-0 ${colors.text.muted}`}
      >
        <li className="text-md flex items-center">
          <CheckCircle className="text-primary mr-2 mt-1" />
          <span className={colors.text.primary}>
            You can create up to 3 sets.
          </span>
        </li>
        <li className="text-md flex items-center">
          <CheckCircle className="text-primary mr-2 mt-1" />
          <span className={colors.text.primary}>
            Generate questions for each with the help of AI.
          </span>
        </li>
        <li className="text-md flex items-center">
          <CheckCircle className="text-primary mr-2 mt-1" />
          <span className={colors.text.primary}>
            You can use 15 tokens to generate questions in the basic plan.
          </span>
        </li>
      </ul>
      <Sets />
    </div>
  );
}
