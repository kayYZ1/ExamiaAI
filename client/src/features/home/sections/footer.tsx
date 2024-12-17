import { colors } from '@/styles/theme';

export default function Footer() {
  return (
    <footer
      className={`${colors.background.main} ${colors.border} border-t p-4`}
    >
      <div className="container mx-auto text-center">
        <p className={`${colors.text.secondary}`}>
          © {new Date().getFullYear()} ExamiaAI. All rights reserved.
        </p>
        <div className="mt-2">
          <a
            href="/privacy"
            className={`${colors.primary.text} hover:${colors.primary.main} px-2`}
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className={`${colors.primary.text} hover:${colors.primary.main} px-2`}
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
