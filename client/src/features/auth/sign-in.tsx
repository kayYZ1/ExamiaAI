import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { colors } from '@/styles/theme';
import Button from '@/shared/components/ui/button';
import api from '@/lib/api';
import Spinner from '@/shared/components/ui/spinner';

const schema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address.')
    .max(30, 'Ayy thats too big'),
});

type SignIn = z.infer<typeof schema>;

export default function SignIn() {
  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationKey: ['auth'],
    mutationFn: async (data: SignIn) => {
      await api.post('/auth/magic-link', data);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignIn>({
    resolver: zodResolver(schema),
  });

  return (
    <div
      className={`${colors.background.secondary} ${colors.border} w-full max-w-md rounded-lg border p-6 shadow-md`}
    >
      <h1 className="mb-2 text-center text-2xl font-semibold">
        Sign In with email
      </h1>
      <form
        onSubmit={handleSubmit((data: SignIn) => mutate(data))}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="email"
            className={`block text-sm font-medium ${colors.text.secondary} py-1`}
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            {...register('email')}
            className={`mt-1 w-full px-3 py-2 ${colors.background.tertiary} ${colors.text.primary} ${colors.border} rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.email && (
            <p className={`text-sm ${colors.text.danger} mt-1`}>
              {errors.email.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full py-2" disabled={isPending}>
          {isPending ? <Spinner /> : 'Send'}
        </Button>
      </form>
      {isError && (
        <p className={`text-sm ${colors.text.danger} pt-4`}>
          {error && (error as any).response.data.message}
        </p>
      )}
      {isSuccess && (
        <p className={`text-sm ${colors.text.success} pt-4`}>
          Magic link has been sent. Check your email.
        </p>
      )}
    </div>
  );
}
