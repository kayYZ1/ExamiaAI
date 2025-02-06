import { colors } from '@/styles/theme';

export default function FeatureCard({ title, description, icon }) {
  return (
    <div
      className={`rounded-2xl p-8 ${colors.background.secondary} ${colors.border} border shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className={`${colors.primary.text} mb-6`}>{icon}</div>
      <h3 className={`text-2xl font-semibold ${colors.text.primary} mb-4`}>
        {title}
      </h3>
      <p className={`${colors.text.secondary} text-lg`}>{description}</p>
    </div>
  );
}
