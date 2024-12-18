import { colors } from '@/styles/theme';

export default function UserPanel() {
  return (
    <div className="space-y-2 pt-4">
      <h1 className={`text-xl font-bold ${colors.text.primary}`}>
        Welcome, user alias
      </h1>
      <p className={`text-md ${colors.text.muted}`}>
        Here is a quick onboarding
      </p>
    </div>
  );
}
