import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { getSets } from '@/lib/queries';
import { Set } from '@/shared/ts/types';
import Spinner from '@/shared/components/ui/spinner';

export default function Sets() {
  const { data: sets, isLoading } = useQuery<Set[]>({
    queryKey: ['sets'],
    queryFn: getSets,
  });

  const colors = useMemo(
    () => [
      'bg-red-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
    ],
    []
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
      {sets?.map((set, index) => (
        <div
          key={set.id}
          className={`rounded-lg p-4 text-white shadow-lg ${colors[index % colors.length]} text-center`}
        >
          <h2 className="text-xl font-bold">{set.name}</h2>
        </div>
      ))}
      <div
        key="placeholder"
        className="flex items-center justify-center rounded-lg bg-gray-700 p-4 text-white shadow-lg"
      >
        <Plus />
      </div>
    </div>
  );
}
