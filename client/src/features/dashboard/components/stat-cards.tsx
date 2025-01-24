import { useQuery } from '@tanstack/react-query';
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  LucideIcon,
} from 'lucide-react';

import { colors } from '@/styles/theme';
import { getUser } from '@/lib/queries';
import Spinner from '@/shared/components/ui/spinner';
import type { User } from '@/shared/ts/types';

function StatCard({
  icon: Icon,
  label,
  value,
  isPending,
}: {
  icon: LucideIcon;
  label: string;
  value: string | undefined;
  isPending: boolean;
}) {
  return (
    <div className={`rounded-md ${colors.background.secondary} p-4`}>
      <div className="flex items-center gap-2">
        <div className={`rounded-lg ${colors.background.tertiary} p-3`}>
          <Icon className={`h-8 w-8 ${colors.primary.text}`} />
        </div>
        <div>
          <p className={`text-sm ${colors.text.muted}`}>{label}</p>
          <span
            className={`text-xl font-semibold ${colors.text.primary} py-4`}
          >
            {isPending ? <Spinner /> : value}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StatCards() {
  const {
    data: user,
    isPending,
    error,
  } = useQuery<User>({
    queryKey: ['user'],
    queryFn: getUser,
  });

  const stats = [
    {
      icon: GraduationCap,
      label: 'Sets used',
      value: `${user?.sets}/3`,
    },
    {
      icon: BookOpen,
      label: 'Tokens available',
      value: `${user?.tokens}/15`,
    },
    {
      icon: BookOpen,
      label: 'Exams created',
      value: `${user?.exams}/4`,
    },
    {
      icon: Users,
      label: 'Current model',
      value: 'Free',
    },
    {
      icon: Calendar,
      label: 'Current plan',
      value: user?.plan,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          isPending={isPending}
        />
      ))}
      {error && (
        <p className={`${colors.text.danger}`}>
          Something went wrong please try again
        </p>
      )}
    </div>
  );
}
