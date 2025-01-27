import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XIcon } from 'lucide-react';

import { colors } from '@/styles/theme';
import { Exam } from '@/shared/ts/types';
import Button from '@/shared/components/ui/button';
import { convertDurationToReadable } from '@/lib/utils';
import api from '@/lib/api';
import Spinner from '@/shared/components/ui/spinner';

export default function ShowExam({
  exam,
  setId,
}: {
  exam: Exam;
  setId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ['exams', exam.id],
    mutationFn: async () => {
      await api.delete(`/exam/${exam.id}/${setId}`);
    },
  });

  const {
    data,
    mutate: startExam,
    isPending: isStarting,
    error: examStartErr,
  } = useMutation({
    mutationKey: ['exam'],
    mutationFn: async () => {
      const response = await api.post(`/ws/${exam.id}/start`);
      return response.data;
    },
  });

  if (isSuccess) {
    queryClient.invalidateQueries({
      queryKey: ['exams', setId],
      exact: true,
    });
  }

  return (
    <>
      <div
        key={exam.id}
        className={`${
          colors.background.secondary
        } ${colors.text.primary} transform cursor-pointer rounded-lg p-6 shadow-lg transition-transform duration-200 hover:scale-105`}
        onClick={() => setIsOpen(true)}
      >
        <h3 className="text-lg font-semibold">{exam.title}</h3>
        <div className="flex items-center justify-between pt-4">
          <p className={`${colors.text.muted} text-sm`}>
            Max. participants: {exam.participants}
          </p>
          <span
            className={`${exam.status === 'started' ? colors.text.success : colors.text.muted} text-sm`}
          >
            {exam.status}
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div
            className={`relative mx-auto w-full max-w-md space-y-4 rounded-lg p-6 shadow-lg ${colors.background.secondary} ${colors.border} border`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-medium ${colors.text.primary}`}>
                {exam.title}
              </h2>
              <button
                className={`${colors.text.muted} hover:${colors.text.primary}`}
                onClick={() => setIsOpen(false)}
              >
                <XIcon />
              </button>
            </div>
            <div className="space-y-2">
              <p className={`${colors.text.secondary}`}>
                <strong>Duration:</strong>{' '}
                {convertDurationToReadable(exam.duration)}
              </p>
              <p className={`${colors.text.secondary}`}>
                <strong>Participants:</strong> {exam.participants}
              </p>
              <p className={`${colors.text.secondary}`}>
                <strong>Status:</strong> {exam.status}
              </p>
              <p
                className={`${colors.text.muted} cursor-pointer underline`}
                onClick={() => navigate(`/exam/history/${exam.id}`)}
              >
                Show history
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <Button onClick={() => startExam()} disabled={isStarting}>
                {isStarting ? <Spinner /> : 'Start exam'}
              </Button>
              <Button onClick={() => mutate()} disabled={isPending}>
                {isPending ? <Spinner /> : 'Delete'}
              </Button>
            </div>
            {data && (
              <p className={`${colors.text.muted} text-wrap`}>
                http://localhost:5173/exam/
                {data.connectionCode}
              </p>
            )}
            {error && (
              <p className={`${colors.text.danger}`}>
                Could not delete exam, please try again
              </p>
            )}
            {examStartErr && (
              <p className={`${colors.text.danger}`}>
                Could not start an exam, please try again
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
