import { useQuery } from '@tanstack/react-query';
import { GraduationCap, BookOpen, Users, Calendar } from 'lucide-react';

import { colors } from '@/styles/theme';
import { getUser } from '@/lib/queries';
import Spinner from '@/shared/components/ui/spinner';
import type { User } from '@/shared/ts/types';

export default function StatCards() {
  const {
    data: user,
    isPending,
    error,
  } = useQuery<User>({
    queryKey: ['user'],
    queryFn: getUser,
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className={`rounded-md ${colors.background.secondary} p-6`}>
        <div className="flex items-center gap-4">
          <div className={`rounded-lg ${colors.background.tertiary} p-3`}>
            <GraduationCap className={`h-6 w-6 ${colors.primary.text}`} />
          </div>
          <div>
            <p className={`text-sm ${colors.text.muted}`}>Sets used</p>
            <span
              className={`text-2xl font-semibold ${colors.text.primary}`}
            >
              {isPending ? <Spinner /> : user?.sets + '/3'}
            </span>
          </div>
        </div>
      </div>
      <div className={`rounded-md ${colors.background.secondary} p-6`}>
        <div className="flex items-center gap-4">
          <div className={`rounded-lg ${colors.background.tertiary} p-3`}>
            <BookOpen className={`h-6 w-6 ${colors.primary.text}`} />
          </div>
          <div>
            <p className={`text-sm ${colors.text.muted}`}>
              Tokens available
            </p>
            <span
              className={`text-2xl font-semibold ${colors.text.primary}`}
            >
              {isPending ? <Spinner /> : user?.tokens + '/15'}
            </span>
          </div>
        </div>
      </div>
      <div className={`rounded-md ${colors.background.secondary} p-6`}>
        <div className="flex items-center gap-4">
          <div className={`rounded-lg ${colors.background.tertiary} p-3`}>
            <Users className={`h-6 w-6 ${colors.primary.text}`} />
          </div>
          <div>
            <p className={`text-sm ${colors.text.muted}`}>Current model</p>
            <p className={`text-2xl font-semibold ${colors.text.primary}`}>
              Free
            </p>
          </div>
        </div>
      </div>
      <div className={`rounded-md ${colors.background.secondary} p-6`}>
        <div className="flex items-center gap-4">
          <div className={`rounded-lg ${colors.background.tertiary} p-3`}>
            <Calendar className={`h-6 w-6 ${colors.primary.text}`} />
          </div>
          <div>
            <p className={`text-sm ${colors.text.muted}`}>Current plan</p>
            <span
              className={`text-2xl font-semibold ${colors.text.primary}`}
            >
              {isPending ? <Spinner /> : user?.plan}
            </span>
          </div>
        </div>
      </div>
      {error && (
        <p className={`${colors.text.danger}`}>
          Something went wrong please try again
        </p>
      )}
    </div>
  );
}
