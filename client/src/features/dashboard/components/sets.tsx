import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { colors } from '@/styles/theme';
import { getSets } from '@/lib/queries';
import { Set } from '@/shared/ts/types';
import Spinner from '@/shared/components/ui/spinner';
import Modal from '@/shared/components/ui/modal';

export default function Sets() {
  const navigate = useNavigate();
  const {
    data: sets,
    isPending,
    error,
  } = useQuery<Set[]>({
    queryKey: ['sets'],
    queryFn: getSets,
  });

  if (isPending) {
    return (
      <div className="flex justify-center align-middle">
        <Spinner />
      </div>
    );
  }

  if (error)
    return (
      <div className="flex justify-center align-middle text-red-950">
        Something went wrong try again
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
      {sets.map((set) => (
        <div
          key={set.id}
          className={`cursor-pointer rounded-lg p-4 ${colors.primary.text} shadow-lg ${colors.background.secondary} text-center hover:rotate-2`}
          onClick={() => navigate(`/dashboard/set/${set.id}`)}
        >
          <h2 className="text-xl font-bold">{set.name}</h2>
        </div>
      ))}
      {sets.length !== 3 && <Modal />}
    </div>
  );
}
