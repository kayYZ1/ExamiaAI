import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';

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
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });

  const {
    mutate: updateMutate,
    isPending: updatePending,
    isSuccess,
  } = useMutation({
    mutationKey: ['user'],
    mutationFn: async (data: Update) => {
      await api.patch('/user', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
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
    resolver: async (values, context, options) => {
      const result = await zodResolver(schema)(values, context, options);
      if (!result.errors) return result;

      const fixedErrors = Object.fromEntries(
        Object.entries(result.errors).map(([key, error]) => [
          key,
          error ? error : { message: 'Unknown error' }, // Ensure error exists
        ])
      );

      return { values: result.values, errors: fixedErrors };
    },
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
          className={`ml-auto ${colors.primary.main} rounded-md px-4 py-2 ${colors.text.primary} } focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
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
      {isSuccess && (
        <p className={`${colors.text.success}`}>Account updated</p>
      )}
    </div>
  );
}
