import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Bell,
} from 'lucide-react';
import { colors } from '@/styles/theme';
import { Outlet } from 'react-router';

const statCards = [
  {
    title: 'Sets created',
    icon: GraduationCap,
    value: '1/3',
  },
  {
    title: 'Tokens available',
    icon: BookOpen,
    value: '11/15',
  },
  {
    title: 'Current model',
    icon: Users,
    value: 'Ollama 3.5',
  },
  {
    title: 'Current plan',
    icon: Calendar,
    value: 'Basic',
  },
];

export default function Index() {
  return (
    <div className={`min-h-screen ${colors.background.main}`}>
      {/* Navbar */}
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
            <div className="flex items-center gap-4">
              <button className="relative p-2">
                <Bell className={`h-6 w-6 ${colors.text.secondary}`} />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/64"
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-xl ${colors.background.secondary} p-6`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-lg ${colors.background.tertiary} p-3`}
                  >
                    <card.icon
                      className={`h-6 w-6 ${colors.primary.text}`}
                    />
                  </div>
                  <div>
                    <p className={`text-sm ${colors.text.muted}`}>
                      {card.title}
                    </p>
                    <p
                      className={`text-2xl font-semibold ${colors.text.primary}`}
                    >
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
