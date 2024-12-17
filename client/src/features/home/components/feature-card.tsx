import { LucideIcon } from 'lucide-react';
import { colors } from '../../../styles/theme';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div
      className={`p-6 rounded-xl ${colors.background.secondary} shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <Icon className={`h-12 w-12 ${colors.primary.text} mb-4`} />
      <h3 className={`text-xl font-semibold ${colors.text.primary} mb-2`}>
        {title}
      </h3>
      <p className={colors.text.secondary}>{description}</p>
    </div>
  );
}
