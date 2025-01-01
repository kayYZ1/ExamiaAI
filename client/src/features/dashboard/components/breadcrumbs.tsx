import { useLocation, useNavigate } from 'react-router';
import { ChevronRight, LucideHome } from 'lucide-react';

import { colors } from '@/styles/theme';

export default function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  const paths = location.pathname
    .split('/')
    .filter((path) => /^[a-zA-Z]+$/.test(path));

  return (
    <div className="py-4">
      <nav className={`${colors.text.muted}`} aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <LucideHome className="h-4 w-4" />
          {paths.map((path, index) => (
            <li className="inline-flex items-center gap-1" key={index}>
              {index !== 0 && <ChevronRight className="h-4 w-4" />}
              <span
                className="inline-flex cursor-pointer items-center text-sm hover:text-indigo-400"
                onClick={() => navigate(`/${path}`)}
              >
                <span className="capitalize">{path}</span>
              </span>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
