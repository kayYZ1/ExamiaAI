import { GraduationCap } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router';

import { colors } from '@/styles/theme';
import StatCards from './components/stat-cards';
import Breadcrumbs from './components/breadcrumbs';

export default function Index() {
  const navigate = useNavigate();
  return (
    <div className={`min-h-screen ${colors.background.main}`}>
      <nav
        className={`fixed top-0 z-50 w-full border-b ${colors.border} ${colors.background.secondary}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <GraduationCap
                className={`h-8 w-8 ${colors.primary.text}`}
              />
              <span
                className={`ml-2 text-xl font-bold ${colors.text.primary}`}
              >
                EXAMIA
              </span>
            </div>
            <div
              className={`inline-block ${colors.text.primary} hover:${colors.text.muted} cursor-pointer 
              border-b-4 border-transparent hover:border-indigo-700`}
              onClick={() => navigate('/dashboard/account')}
            >
              Account
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="px-8 py-2">
          <Breadcrumbs />
          <StatCards />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
