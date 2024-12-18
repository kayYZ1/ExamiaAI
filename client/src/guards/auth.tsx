import { JSX } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import api from '@/lib/api';
import { colors } from '@/styles/theme';

export default function AuthGuard({
  children,
}: {
  children?: JSX.Element;
}) {
  const location = useLocation();
  const { isLoading, isError } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await api.get('/auth/validate-cookie');
      return response.data;
    },
  });

  const isAuthPathname = location.pathname.includes('auth');

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
  //Think of a better solution to handle fallbacks here

  if (isError)
    return isAuthPathname ? children : <Navigate to="/auth" replace />;

  return isAuthPathname ? <Navigate to="/dashboard" replace /> : children;
}
