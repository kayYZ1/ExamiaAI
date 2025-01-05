import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import { Send } from 'lucide-react';

import { colors } from '@/styles/theme';
import Button from '@/shared/components/ui/button';
import api from '@/lib/api';
import Spinner from '@/shared/components/ui/spinner';

const schema = z.object({
  topic: z
    .string()
    .min(5, 'Please be more specific')
    .max(400, "That's a lot of words"),
  numOfQuestions: z.number(),
  level: z.enum(['elementary', 'high school', 'college']),
});

type Prompt = z.infer<typeof schema>;

export default function GenerateQuestions() {
  const { setId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Prompt>({
    values: {
      topic: '',
      numOfQuestions: 1,
      level: 'elementary',
    },
    resolver: zodResolver(schema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationKey: ['questions', setId as string],
    mutationFn: async (data: Prompt) => {
      await api.post(`/question/${setId}`, data);
    },
  });

  return (
    <div className="flex justify-between pt-4">
      <form
        onSubmit={handleSubmit((data: Prompt) => mutate(data))}
        className="w-full"
      >
        <div className="flex justify-center space-x-2 sm:flex-col md:flex-row">
          <input
            type="text"
            id="topic"
            placeholder="Questions theme"
            {...register('topic')}
            className={`flex-grow rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
          />
          <select
            id="numberOfQuestions"
            {...register('numOfQuestions')}
            defaultValue={1}
            className={`rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
          >
            <option value={1}>1 question</option>
            <option value={5}>5 questions</option>
            <option value={10} disabled>
              10 questions
            </option>
          </select>
          <select
            id="level"
            {...register('level')}
            className={`rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
          >
            <option value="elementary">Elementary</option>
            <option value="high school">High school</option>
            <option value="college">College</option>
          </select>
          <Button type="submit" className="rounded-lg">
            {isPending ? <Spinner /> : <Send className="size-4" />}
          </Button>
        </div>
        {errors.topic && (
          <p className={`text-sm ${colors.text.danger} mt-1`}>
            {errors.topic.message}
          </p>
        )}
        {error && (
          <p className={`text-sm ${colors.text.danger} mt-1`}>
            Error while generating questions please try again
          </p>
        )}
      </form>
    </div>
  );
}
