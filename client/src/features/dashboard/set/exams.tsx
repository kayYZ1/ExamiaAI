import { useQuery } from '@tanstack/react-query';

import { getExams } from '@/lib/queries';
import { Exam } from '@/shared/ts/types';
import { colors } from '@/styles/theme';

import Spinner from '@/shared/components/ui/spinner';
import ShowExam from './components/show-exam';

export default function Exams({ setId }: { setId: string }) {
  const {
    data: exams,
    isPending,
    error,
  } = useQuery<Exam[]>({
    queryKey: ['exams', setId],
    queryFn: () => getExams(setId),
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
      className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ${colors.background.main}`}
    >
      {exams.map((exam) => (
        <ShowExam exam={exam} key={exam.id} />
      ))}
    </div>
  );
}