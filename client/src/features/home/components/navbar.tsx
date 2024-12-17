import { useNavigate } from 'react-router';
import { GraduationCap } from 'lucide-react';

import Button from '../../../shared/components/ui/button';
import { colors } from '../../../styles/theme';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className={`fixed w-full top-0 z-50 border-b ${colors.border} ${colors.background.secondary}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <GraduationCap className={`h-8 w-8 ${colors.primary.text}`} />
            <span
              className={`ml-2 text-xl font-bold ${colors.text.primary}`}
            >
              EXAMIA
            </span>
          </div>

          <Button variant="primary" onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      </div>
    </nav>
  );
}
