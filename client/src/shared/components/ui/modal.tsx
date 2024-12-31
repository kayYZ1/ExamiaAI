import { useState } from 'react';
import { Plus } from 'lucide-react';

import { colors } from '@/styles/theme';

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);

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
            className={`relative mx-auto w-full max-w-md rounded-lg p-6 shadow-lg ${colors.background.secondary} ${colors.border} border`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-medium ${colors.text.primary}`}>
                Modal Title
              </h2>
              <button
                className={`${colors.text.muted} hover:${colors.text.primary}`}
                onClick={() => setIsOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <p className={`${colors.text.secondary}`}>
                This is a modal component styled using the custom theme.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className={`rounded px-4 py-2 text-white ${colors.primary.main}`}
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
