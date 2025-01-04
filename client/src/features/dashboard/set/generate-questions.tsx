import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import { Send } from 'lucide-react';

import { colors } from '@/styles/theme';
import Button from '@/shared/components/ui/button';

const schema = z.object({
  prompt: z
    .string()
    .min(5, 'Please be more specific')
    .max(400, "That's a lot of words"),
  numberOfQuestions: z.enum(['1', '5', '10']),
  level: z.enum(['elementary', 'high school', 'college']),
});

type Prompt = z.infer<typeof schema>;

export default function GenerateQuestions() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Prompt>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="flex justify-between pt-4">
      <form
        onSubmit={handleSubmit((data: Prompt) => console.log(data))}
        className="w-full"
      >
        <div className="flex justify-center space-x-2 sm:flex-col md:flex-row">
          <input
            type="text"
            id="prompt"
            placeholder="Questions theme"
            {...register('prompt')}
            className={`flex-grow rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
          />
          <select
            id="numberOfQuestions"
            {...register('numberOfQuestions')}
            className={`rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
          >
            <option value="1">1 question</option>
            <option value="5">5 questions</option>
            <option value="10" disabled>
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
            <Send className="size-4" />
          </Button>
        </div>
        {errors.prompt && (
          <p className={`text-sm ${colors.text.danger} mt-1`}>
            {errors.prompt.message}
          </p>
        )}
        {errors.numberOfQuestions && (
          <p className={`text-sm ${colors.text.danger} mt-1`}>
            {errors.numberOfQuestions.message}
          </p>
        )}
      </form>
    </div>
  );
}
