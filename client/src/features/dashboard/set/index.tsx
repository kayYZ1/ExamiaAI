import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { getSet } from '@/lib/queries';
import Spinner from '@/shared/components/ui/spinner';
import type { Set } from '@/shared/ts/types';
import { colors } from '@/styles/theme';

import Questions from './questions';
import GenerateQuestions from './generate-questions';

export default function Set() {
  const { setId } = useParams<{ setId: string }>();

  if (!setId) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className={`${colors.text.muted} text-center`}>
          Set ID could not be found
        </p>
      </div>
    );
  }

  const {
    data: set,
    isPending,
    error,
  } = useQuery<Set>({
    queryKey: ['set', setId],
    queryFn: () => getSet(setId),
  });

  if (isPending) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className={`${colors.text.danger} text-center`}>
          Something went wrong, please try again
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg ${colors.background.secondary} my-4 p-8 shadow-lg ${colors.text.primary}`}
    >
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">{set.name}</h1>
        <div className={`${colors.text.muted} text-md`}>
          {set.createdAt.slice(0, 10)}
        </div>
      </div>
      <div className="space-y-4">
        <Questions />
        <GenerateQuestions />
      </div>
    </div>
  );
}
