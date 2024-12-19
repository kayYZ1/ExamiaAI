import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/lib/queries';

import { colors } from '@/styles/theme';

enum Plan {
  Basic = 'Basic',
  Pro = 'Pro',
  Enterprise = 'Enterprise',
}

export default function Account() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });

  return (
    <div className="mx-auto py-6">
      <h2 className={`${colors.text.primary} mb-6 text-3xl font-bold`}>
        Account Settings
      </h2>
      <form className="space-y-4">
        <div className="space-y-4">
          <h3 className={`${colors.text.secondary} text-xl font-medium`}>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex-col space-y-8">
              <input
                type="text"
                id="fullName"
                placeholder="Alias"
                name="fullName"
                className={`w-full px-1 py-2 ${colors.background.main} ${colors.text.primary} border-b-2 border-slate-400 focus:outline-none`}
              />
              <input
                type="email"
                id="email"
                defaultValue={user && user.email}
                name="email"
                className={`w-full px-1 py-2 ${colors.background.main} ${colors.text.primary} border-b-2 border-slate-400 focus:outline-none`}
              />
            </div>
            <div className="flex-col space-y-8">
              <select
                name="plan"
                className={`w-full px-1 py-2 ${colors.background.main} ${colors.text.primary} border-b-2 border-slate-400 focus:outline-none`}
              >
                <option value={Plan.Basic}>{Plan.Basic}</option>
                <option value={Plan.Pro} disabled>
                  {Plan.Pro}
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
            className={`ml-auto ${colors.primary.main} rounded-md px-4 py-2 ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
