import { Outlet, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import { colors } from '@/styles/theme';

export default function Index() {
  const navigate = useNavigate();
  return (
    <div
      className={`${colors.background.main} ${colors.text.primary} flex min-h-screen items-center justify-center p-4`}
    >
      <button
        onClick={() => navigate(-1)}
        className={`absolute left-4 top-4 flex items-center gap-2 text-sm font-medium ${colors.primary.text}`}
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>
      <Outlet />
    </div>
  );
}
