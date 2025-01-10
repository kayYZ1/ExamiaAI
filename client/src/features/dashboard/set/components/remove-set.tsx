import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XIcon, TrashIcon } from 'lucide-react';

import { colors } from '@/styles/theme';
import api from '@/lib/api';
import Spinner from '@/shared/components/ui/spinner';

export default function RemoveSetModal({ setId }: { setId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationKey: ['sets', setId],
    mutationFn: async () => {
      await api.delete(`/set/${setId}`);
    },
  });

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['sets'] });
    navigate('/dashboard');
  }

  return (
    <>
      <div
        key="placeholder"
        className={`cursor-pointer rounded-sm bg-slate-800 text-indigo-400`}
        onClick={() => setIsOpen(true)}
      >
        <TrashIcon />
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div
            className={`relative mx-auto w-full max-w-md space-y-4 rounded-lg p-6 shadow-lg ${colors.background.secondary} ${colors.border} border`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-medium ${colors.text.primary}`}>
                Remove set
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
                Are you sure you want to delete this set? This is a
                destructive action.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className={`rounded px-4 py-2 ${colors.text.danger} border-2 border-red-600`}
                onClick={() => {
                  mutate();
                  setIsOpen(false);
                }}
              >
                {isPending ? <Spinner /> : 'Delete'}
              </button>
              <button
                className={`rounded px-4 py-2 ${colors.text.muted} border-2 border-slate-400`}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
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
