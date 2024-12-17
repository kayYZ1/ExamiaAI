import { useQuery } from '@tanstack/react-query';
import { Outlet, Navigate } from 'react-router';

import api from '@/shared/utils/api';
import { colors } from '@/styles/theme';

export default function AuthGuard() {
  const { isLoading, isError } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await api.get('/auth/validate-cookie');
      return response.data;
    },
  });

  if (isLoading)
    return (
      <div
        className={`${colors.background.main} flex h-screen items-center justify-center`}
      >
        <div className="flex items-center space-x-2">
          <div
            className={`${colors.text.muted} h-4 w-4 animate-bounce rounded-full`}
          />
          <div
            className={`${colors.text.muted} h-4 w-4 animate-bounce rounded-full delay-200`}
          />
          <div
            className={`${colors.text.muted} delay-400 h-4 w-4 animate-bounce rounded-full`}
          />
        </div>
      </div>
    );
  if (isError) return <Navigate to="/auth" replace />;
  //Think of a better solution to handle fallbacks here

  return <Outlet />;
}
