import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import Spinner from '@/shared/components/ui/spinner';
import { getQuestions } from '@/lib/queries';
import { colors } from '@/styles/theme';
import { Question } from '@/shared/ts/types';

import RemoveQuestionModal from './components/remove-question';

export default function Questions() {
  const { setId } = useParams();
  const {
    data: questions,
    isPending,
    error,
  } = useQuery<Question[]>({
    queryKey: ['questions', setId],
    queryFn: () => getQuestions(setId as string),
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
          {error.message
            ? error.message
            : 'Something went wrong please try again later'}
        </p>
      </div>
    );
  }

  return (
    <div className="scr h-96 overflow-y-auto pl-1 pr-4">
      <h1 className={`text-xl font-bold ${colors.text.primary} mb-4`}>
        Questions
      </h1>
      <ul>
        {questions.length !== 0 ? (
          questions.map((question) => (
            <li
              key={question.id}
              className={`mb-4 rounded p-4 ${colors.background.secondary} ${colors.border} border`}
            >
              <div className="flex justify-between">
                <h2
                  className={`text-lg font-semibold ${colors.text.primary}`}
                >
                  {question.question}
                </h2>
                <RemoveQuestionModal
                  setId={setId as string}
                  questionId={question.id}
                />
              </div>
              <p className={`mb-2 ${colors.text.secondary}`}>
                {question.answer}
              </p>
              <p className={`${colors.text.muted}`}>{question.answers}</p>
            </li>
          ))
        ) : (
          <p className={`${colors.text.muted}`}>
            No questions yet...Generate some!
          </p>
        )}
      </ul>
    </div>
  );
}
