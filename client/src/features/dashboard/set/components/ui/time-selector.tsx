import { Ref, useRef } from 'react';

import { colors } from '@/styles/theme';

export default function TimeSelector({
  durationRef,
}: {
  durationRef: Ref<HTMLInputElement> | undefined;
}) {
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);

  const totalDurationInMs = () => {
    const hours = parseInt(hoursRef.current?.value || '0', 10);
    const minutes = parseInt(minutesRef.current?.value || '0', 10);
    return (hours * 60 + minutes) * 60000;
  };

  const handleInputChange = () => {
    const duration = totalDurationInMs();
    if (hoursRef.current && minutesRef.current) {
      const form = hoursRef.current?.form;
      if (form) {
        const durationInput = form.elements.namedItem(
          'duration'
        ) as HTMLInputElement;
        durationInput.value = duration.toString();
      }
    }
  };

  return (
    <div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label
            className={`block text-sm font-medium ${colors.text.secondary}`}
          >
            Hour(s)
          </label>
          <input
            type="number"
            min={0}
            defaultValue={0}
            ref={hoursRef}
            className={`w-full rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
            onChange={handleInputChange}
            onKeyDown={(e) => e.preventDefault()}
          />
        </div>
        <div className="flex-1">
          <label
            className={`block text-sm font-medium ${colors.text.secondary}`}
          >
            Minute(s)
          </label>
          <input
            type="number"
            min={0}
            defaultValue={5}
            ref={minutesRef}
            className={`w-full rounded-lg border p-4 text-sm ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
            onChange={handleInputChange}
            onKeyDown={(e) => e.preventDefault()}
          />
        </div>
      </div>
      <input type="hidden" name="duration" ref={durationRef} />
    </div>
  );
}
