import { Outlet } from 'react-router';

import { colors } from '@/styles/theme';

export default function Exam() {
  return (
    <div className={`min-h-screen ${colors.background.main}`}>
      <main className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="px-8 py-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
