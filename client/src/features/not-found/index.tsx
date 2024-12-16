import { ArrowLeft, Home } from 'lucide-react';
import { colors } from '../../styles/theme';
import Button from '../../shared/components/ui/button';

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
          className={`${colors.text.primary} text-3xl font-semibold mb-6`}
        >
          Page Not Found
        </div>
        <p
          className={`${colors.text.secondary} text-lg max-w-md mx-auto mb-8`}
        >
          Oops! It seems like you've ventured into uncharted territory. The
          page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => window.location.href = '/'}
          >
            <Home className="w-5 h-5" />
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
