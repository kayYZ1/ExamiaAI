import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import api from '@/shared/utils/api';
import { colors } from '@/styles/theme';

export default function Verify() {
  const { token } = useParams();
  const { isSuccess, isLoading, error } = useQuery({
    queryKey: ['auth', token],
    queryFn: async () => {
      const response = await api.get(`/auth/verify?token=${token}`);
      return response.data;
    },
  });

  return (
    <div
      className={`min-h-screen ${colors.background.main} flex items-center justify-center px-4 py-12`}
    >
      <div className="text-center">
        <h1 className={`text-4xl font-bold ${colors.primary.text} mb-4`}>
          {isLoading && 'Validating...'}
          {error && 'Auth failed'}
          {isSuccess &&
            'Your sign in attempt was succesfull. Redirecting to dashboard...'}
        </h1>
        {error && (
          <div className={`mt-12 ${colors.text.muted} text-sm`}>
            {(error as any).response.data.message}
          </div>
        )}
      </div>
    </div>
  );
}
