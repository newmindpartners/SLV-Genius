import { intervalToDuration } from 'date-fns';

export const formatDuration = (value: number): string => {
  const interval = intervalToDuration({ start: 0, end: value });
  return [`${interval.months}m`, `${interval.days}d`, `${interval.hours}h`].join(' ');
};
