import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import { Plus, XIcon } from 'lucide-react';

import { colors } from '@/styles/theme';
import api from '@/lib/api';
import Spinner from '@/shared/components/ui/spinner';
import Button from '@/shared/components/ui/button';

const schema = z.object({
  name: z.string().min(3).max(25),
});

type CreateSet = z.infer<typeof schema>;

export default function CreateSetModal() {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ['sets'],
    mutationFn: async (data: CreateSet) => {
      await api.post('/set', data);
    },
  });

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['sets'] });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSet>({
    resolver: zodResolver(schema),
  });

  return (
    <>
      <div
        key="placeholder"
        className={`flex cursor-pointer items-center justify-center rounded-lg bg-slate-800 p-4 text-indigo-400`}
        onClick={() => setIsOpen(true)}
      >
        <Plus />
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div
            className={`relative mx-auto w-full max-w-md space-y-4 rounded-lg p-6 shadow-lg ${colors.background.secondary} ${colors.border} border`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-medium ${colors.text.primary}`}>
                Create new set
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
                Add your new set of questions here
              </p>
            </div>
            <div>
              <form
                onSubmit={handleSubmit((data: CreateSet) => mutate(data))}
              >
                <input
                  type="text"
                  id="name"
                  placeholder="Name of the set"
                  {...register('name')}
                  className={`w-full rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
                />
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Spinner /> : 'Create'}
                  </Button>
                </div>
              </form>
              {errors.name && (
                <p className={`text-sm ${colors.text.danger} mt-1`}>
                  {errors.name.message}
                </p>
              )}
            </div>
            {error && (
              <div className={`text-sm ${colors.text.danger}`}>
                Something went wrong please try again later
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
