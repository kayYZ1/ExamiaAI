import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { colors } from '@/styles/theme';
import { getExamsHistory } from '@/lib/queries';
import { ExamResult } from '@/shared/ts/types';
import Spinner from '@/shared/components/ui/spinner';

export default function ExamHistory() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const {
    data: exams,
    isPending,
    error,
  } = useQuery<ExamResult[]>({
    queryKey: ['exam-history', examId],
    queryFn: () => getExamsHistory(examId as string),
    enabled: !!examId,
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <p className={`${colors.text.danger} text-center`}>
          Something went wrong, please try again
        </p>
      </div>
    );
  }

  const groupedExamResults = Object.groupBy(
    exams,
    (exam) => exam.sessionCode
  );

  const toggleAccordion = (sessionCode: string) => {
    setOpenAccordion(openAccordion === sessionCode ? null : sessionCode);
  };

  return (
    <div className={`p-6 ${colors.background.main} gap-4`}>
      <h4
        className={`${colors.text.secondary} cursor-pointer underline`}
        onClick={() => navigate(-1)}
      >
        Go back
      </h4>
      <h1 className={`mb-4 text-2xl font-bold ${colors.text.primary}`}>
        Exam's History
      </h1>
      {Object.entries(groupedExamResults).map(
        ([sessionCode, examsInSession]) => (
          <div
            key={sessionCode}
            className={`${colors.border} rounded-lg border`}
          >
            <button
              className={`w-full p-4 text-left ${colors.background.secondary} hover:${colors.background.tertiary} focus:outline-none`}
              onClick={() => toggleAccordion(sessionCode)}
            >
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${colors.text.primary}`}>
                  Session: {sessionCode}
                </span>
                <span className={`text-sm ${colors.text.muted}`}>
                  {examsInSession?.length} participant(s)
                </span>
              </div>
            </button>
            <div className={`${colors.background.tertiary}`}>
              {openAccordion === sessionCode && (
                <div
                  className={`p-4 ${colors.background.tertiary} overflow-hidden transition-all duration-300 ease-in-out`}
                >
                  {examsInSession?.map((exam) => (
                    <div key={exam.id} className="mb-4">
                      <p className={`${colors.text.secondary}`}>
                        <strong>Exam ID:</strong> {exam.examId}
                      </p>
                      <p className={`${colors.text.secondary}`}>
                        <strong>Full Name:</strong> {exam.fullName}
                      </p>
                      <p className={`${colors.text.secondary}`}>
                        <strong>Score:</strong> {exam.score}
                      </p>
                      <hr className={`my-2 ${colors.border}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
