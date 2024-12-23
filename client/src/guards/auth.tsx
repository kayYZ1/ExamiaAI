import { JSX } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import api from '@/lib/api';
import { colors } from '@/styles/theme';
import Spinner from '@/shared/components/ui/spinner';

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
        <Spinner />
      </div>
    );
  //Think of a better solution to handle fallbacks here

  if (isError)
    return isAuthPathname ? children : <Navigate to="/auth" replace />;

  return isAuthPathname ? <Navigate to="/dashboard" replace /> : children;
}
