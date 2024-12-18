import { ArrowLeft, Home } from 'lucide-react';

import { colors } from '@/styles/theme';
import Button from '@/shared/components/ui/button';

export default function Index() {
  return (
    <div
      className={`min-h-screen ${colors.background.main} flex items-center justify-center px-4 py-12`}
    >
      <div className="text-center">
        <h1 className={`text-9xl font-bold ${colors.primary.text} mb-4`}>
          404
        </h1>
        <div
          className={`${colors.text.primary} mb-6 text-3xl font-semibold`}
        >
          Page Not Found
        </div>
        <p
          className={`${colors.text.secondary} mx-auto mb-8 max-w-md text-lg`}
        >
          Oops! It seems like you've ventured into uncharted territory. The
          page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => (window.location.href = '/')}
          >
            <Home className="h-5 w-5" />
            Return Home
          </Button>
        </div>
        <div className={`mt-12 ${colors.text.muted} text-sm`}>
          Error Code: 404 | Page Not Found
        </div>
      </div>
    </div>
  );
}
