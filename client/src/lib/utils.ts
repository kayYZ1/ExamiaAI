export const convertDurationToReadable = (durationInMs: number) => {
  if (durationInMs <= 0) {
    return '0 minutes';
  }

  const toSeconds = durationInMs / 1000;
  const toMinutes = toSeconds / 60;
  const toHours = toMinutes / 60;

  if (toHours >= 1) {
    const hours = Math.floor(toHours);
    const minutes = Math.floor(toMinutes % 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${Math.floor(toMinutes)} minute${toMinutes > 1 ? 's' : ''}`;
  }
};
