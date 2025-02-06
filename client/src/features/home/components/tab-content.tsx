import { colors } from '@/styles/theme';

export default function TabContent({ title, description }) {
  return (
    <div>
      <h3 className={`text-2xl font-semibold ${colors.text.primary} mb-4`}>
        {title}
      </h3>
      <p className={`${colors.text.secondary} text-lg`}>{description}</p>
    </div>
  );
}
