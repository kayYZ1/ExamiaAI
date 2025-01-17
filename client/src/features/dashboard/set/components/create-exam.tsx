import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XIcon, PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';

import { colors } from '@/styles/theme';
import api from '@/lib/api';
import Spinner from '@/shared/components/ui/spinner';
import Button from '@/shared/components/ui/button';

import TimeSelector from './ui/time-selector';

const schema = z.object({
  title: z.string().min(3).max(60),
  participants: z.number().min(2).max(20),
});

type CreateExam = z.infer<typeof schema>;

interface CreateExamValues extends CreateExam {
  duration: number;
}

export default function CreateExam({ setId }: { setId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const durationRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ['exams', setId],
    mutationFn: async (values: CreateExamValues) => {
      await api.post(`/exam/${setId}`, values);
    },
  });

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['exams', setId] });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateExam>({
    resolver: zodResolver(schema),
  });

  return (
    <>
      <div
        className={`${colors.background.secondary} ${colors.text.muted} flex transform cursor-pointer items-center justify-center space-x-2 rounded-lg p-6 shadow-lg transition-transform duration-200 hover:scale-105`}
        onClick={() => setIsOpen(true)}
      >
        <span>Add new exam</span>
        <PlusIcon />
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div
            className={`relative mx-auto w-full max-w-md space-y-4 rounded-lg p-6 shadow-lg ${colors.background.secondary} ${colors.border} border`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-medium ${colors.text.primary}`}>
                Create Exam
              </h2>
              <button
                className={`${colors.text.muted} hover:${colors.text.primary}`}
                onClick={() => setIsOpen(false)}
              >
                <XIcon />
              </button>
            </div>
            <div>
              <p className={`${colors.text.secondary}`}>
                Fill in the details to create a new exam
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <form
                onSubmit={handleSubmit((data: CreateExam) => {
                  const values = {
                    title: data.title,
                    participants: data.participants,
                    duration: parseInt(
                      durationRef.current?.value as string
                    ),
                  };
                  mutate(values);
                })}
                className="w-full"
              >
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      id="title"
                      placeholder="Exam title..."
                      {...register('title')}
                      className={`w-full rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
                    />
                    {errors.title && (
                      <p className={`text-sm ${colors.text.danger} mt-1`}>
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      id="participants"
                      min={0}
                      placeholder="Number of participants"
                      {...register('participants', {
                        valueAsNumber: true,
                      })}
                      className={`w-full rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
                      onKeyDown={(e) => e.preventDefault()}
                    />
                    {errors.participants && (
                      <p className={`text-sm ${colors.text.danger} mt-1`}>
                        {errors.participants.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <TimeSelector durationRef={durationRef} />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Spinner /> : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
            {error && (
              <p className={`${colors.text.danger}`}>
                Something went wrong please try again
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
