import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { colors } from '../../styles/theme';
import Button from '../../shared/components/ui/button';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type SignIn = z.infer<typeof schema>;

export default function Index() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignIn>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: SignIn) => {
    console.log('Magic link sent to:', data.email);
    alert('A magic link has been sent to your email!');
  };

  return (
    <div
      className={`${colors.background.main} ${colors.text.primary} flex min-h-screen items-center justify-center p-4`}
    >
      <div
        className={`${colors.background.secondary} ${colors.border} w-full max-w-md rounded-lg border p-6 shadow-md`}
      >
        <h1 className="mb-4 text-center text-2xl font-semibold">
          Sign In with Magic Link
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${colors.text.secondary}`}
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
          <Button
            type="submit"
            className="w-full py-2"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
