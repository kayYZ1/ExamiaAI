import { useQuery } from '@tanstack/react-query';

import { getUser } from '@/lib/queries';
import { colors } from '@/styles/theme';

export default function UserPanel() {
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
    </div>
  );
}
