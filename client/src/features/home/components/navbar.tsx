import { useNavigate } from 'react-router';
import { GraduationCap } from 'lucide-react';

import { colors } from '@/styles/theme';
import Button from '@/shared/components/ui/button';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b ${colors.border} ${colors.background.secondary}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <GraduationCap className={`h-8 w-8 ${colors.primary.text}`} />
            <span
              className={`ml-2 text-xl font-bold ${colors.text.primary}`}
            >
              EXAMIA
            </span>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
}
