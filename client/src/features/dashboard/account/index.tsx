import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { getUser } from '@/lib/queries';
import { colors } from '@/styles/theme';
import { Plan } from '@/shared/ts/enums';
import api from '@/lib/api';
import Spinner from '@/shared/components/ui/spinner';

const schema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address.')
    .max(30, 'Ayy thats too big'),
  alias: z.string().min(5).max(25),
});

type Update = z.infer<typeof schema>;

export default function Account() {
  const navigate = useNavigate();
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });

  const { mutate: updateMutate, isPending: updatePending } = useMutation({
    mutationKey: ['user'],
    mutationFn: async (data: Update) => {
      await api.patch('/user', data);
    },
  });

  const { mutate: logoutMutate, isPending: logoutPending } = useMutation({
    mutationKey: ['auth'],
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
  });

  const logoutHandler = () => {
    logoutMutate();
    navigate('/', { replace: true });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Update>({
    values: {
      email: user && user.email,
      alias: user && user.alias ? user.alias : '',
    },
    resolver: zodResolver(schema),
  });

  return (
    <div className="mx-auto py-6">
      <div className="flex justify-between">
        <h2 className={`${colors.text.primary} mb-6 text-3xl font-bold`}>
          Account Settings
        </h2>
        <button
          onClick={logoutHandler}
          disabled={logoutPending}
          className={`${colors.primary.main} ${colors.text.primary} ml-auto h-12 w-24 rounded-md`}
        >
          {logoutPending ? <Spinner /> : 'Logout'}
        </button>
      </div>
      <form
        className="space-y-4"
        onSubmit={handleSubmit((data: Update) => updateMutate(data))}
      >
        <div className="space-y-4">
          <h3 className={`${colors.text.secondary} text-xl font-medium`}>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex-col space-y-2">
              <input
                type="text"
                id="alias"
                placeholder="Your Alias"
                {...register('alias')}
                className={`w-full rounded-lg border p-4 ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
              />
              {errors.alias && (
                <p className={`text-sm ${colors.text.danger} mt-1`}>
                  {errors.alias.message}
                </p>
              )}
              <input
                type="email"
                id="email"
                disabled
                placeholder="you@example.com"
                {...register('email')}
                className={`w-full rounded-lg border p-4 ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
              />
              {errors.email && (
                <p className={`text-sm ${colors.text.danger} mt-1`}>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex-col space-y-8">
              <select
                name="plan"
                className={`w-full rounded-lg border p-4 ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
              >
                <option value={Plan.Basic}>{Plan.Basic}</option>
                <option value={Plan.Premium} disabled>
                  {Plan.Premium}
                </option>
                <option value={Plan.Enterprise} disabled>
                  {Plan.Enterprise}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty || updatePending}
            className={`ml-auto ${colors.primary.main} rounded-md px-4 py-2 ${colors.text.primary} focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              !isDirty || updatePending
                ? 'cursor-not-allowed opacity-50'
                : ''
            }`}
          >
            {updatePending ? <Spinner /> : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}
