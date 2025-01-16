import { useState } from 'react';
import { XIcon } from 'lucide-react';

import { colors } from '@/styles/theme';
import { Exam } from '@/shared/ts/types';
import Button from '@/shared/components/ui/button';
import { convertDurationToReadable } from '@/lib/utils';

export default function ShowExam({ exam }: { exam: Exam }) {
  const [isOpen, setIsOpen] = useState(false);

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
            </div>
            <Button
              className="float-right"
              onClick={() => console.log('Starting an exam..')}
            >
              Start
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
