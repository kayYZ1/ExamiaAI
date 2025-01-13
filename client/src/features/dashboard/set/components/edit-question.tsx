import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XIcon, EditIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';

import { colors } from '@/styles/theme';
import api from '@/lib/api';
import Spinner from '@/shared/components/ui/spinner';
import Button from '@/shared/components/ui/button';
import { Question } from '@/shared/ts/types';

const schema = z.object({
  question: z.string().min(3).max(90),
  answers: z
    .string()
    .regex(
      /^([^,]+,){0,3}[^,]+$/,
      'Answers must be a list of up to 4 values separated by commas'
    )
    .min(3)
    .max(60),
  answer: z.string().max(60),
});

type EditQuestion = z.infer<typeof schema>;

export default function EditQuestionModal({
  setId,
  questionId,
  question,
}: {
  setId: string;
  questionId: string;
  question: Question;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ['questions', setId, questionId],
    mutationFn: async (values: EditQuestion) => {
      await api.patch(`/question/${setId}/${questionId}`, values);
    },
  });

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['questions'] });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditQuestion>({
    defaultValues: {
      question: question.question,
      answers: question.answers,
      answer: question.answer,
    },
    resolver: zodResolver(schema),
  });

  return (
    <>
      <div
        key="placeholder"
        className={`flex cursor-pointer items-center justify-center rounded-lg bg-slate-800 text-indigo-400`}
        onClick={() => setIsOpen(true)}
      >
        <EditIcon />
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div
            className={`relative mx-auto w-full max-w-md space-y-4 rounded-lg p-6 shadow-lg ${colors.background.secondary} ${colors.border} border`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-medium ${colors.text.primary}`}>
                Edit question
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
                Feel free to change what you want to
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <form
                onSubmit={handleSubmit((data: EditQuestion) =>
                  mutate(data)
                )}
                className="w-full"
              >
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      id="question"
                      {...register('question')}
                      className={`w-full rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
                    />
                    {errors.question && (
                      <p className={`text-sm ${colors.text.danger} mt-1`}>
                        {errors.question.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      id="answers"
                      {...register('answers')}
                      className={`w-full rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
                    />
                    {errors.answers && (
                      <p className={`text-sm ${colors.text.danger} mt-1`}>
                        {errors.answers.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      id="answer"
                      {...register('answer')}
                      className={`w-full rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
                    />
                    {errors.answer && (
                      <p className={`text-sm ${colors.text.danger} mt-1`}>
                        {errors.answer.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Spinner /> : 'Update'}
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
