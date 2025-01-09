import { useNavigate, useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import api from '@/lib/api';
import { colors } from '@/styles/theme';

export default function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { isSuccess, isLoading, error } = useQuery({
    queryKey: ['auth', token],
    queryFn: async () => {
      const response = await api.get(`/auth/verify?token=${token}`);
      return response.data;
    },
  });

  if (isSuccess) {
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      navigate('/dashboard');
    }, 1000);
  }

  return (
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
  );
}
