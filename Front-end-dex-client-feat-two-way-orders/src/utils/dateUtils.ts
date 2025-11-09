import {
  addMonths,
  addYears,
  differenceInDays,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
  format,
  intervalToDuration,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { padStart } from 'lodash';
import { TimeInterval } from '~/pages/Swap/components/MarketData/utils';

import { IntervalType } from './interval';

const formatOffset = (offset: number): string => {
  const absoluteOffset = Math.abs(offset);
  const hours = Math.floor(absoluteOffset / 60);
  const minutes = absoluteOffset % 60;

  return `${padStart(hours.toString(), 2, '0')}:${padStart(minutes.toString(), 2, '0')}`;
};

const getOffsetSign = (offset: number): string => (offset > 0 ? '-' : '+');

// Returns the user's local timezone offset in "GMT±HH:MM" format
export const displayUserTimezone = (): string => {
  const offset = new Date().getTimezoneOffset();
  return `GMT${getOffsetSign(offset)}${formatOffset(offset)}`;
};

const createFormatter =
  (formats: Record<string, string>) =>
  (date: Date): string => {
    const getFormatForLocale = (locale: string): string =>
      formats[locale] || formats.default;

    const getUserLocale = (): string => navigator.language;

    return format(
      date,
      getFormatForLocale(getUserLocale()),
      getUserLocale() === 'en-US' ? { locale: enUS } : {},
    );
  };

export const formatDate = createFormatter({
  'en-US': 'MM/dd/yyyy',
  default: 'dd/MM/yyyy',
});

export const formatDateWithTime = createFormatter({
  'en-US': 'MM-dd-yyyy HH:mm',
  default: 'dd-MM-yyyy HH:mm',
});

export const getFormattedDurationUntilDate = (targetDate: Date): string => {
  const currentDate = new Date();
  const timeDifference = differenceInMinutes(targetDate, currentDate);

  const duration = intervalToDuration({ start: currentDate, end: targetDate });

  if (timeDifference <= 0) {
    return 'Expired';
  }

  if (duration.months && duration.months >= 1) {
    return `${duration.months}m ${duration.days}d ${duration.hours}h left`;
  }

  if (duration.days && duration.days >= 1) {
    return `${duration.days}d ${duration.hours}h ${duration.minutes}m left`;
  }

  if (duration.hours && duration.hours >= 1) {
    return `${duration.hours}h ${duration.minutes}m left`;
  }

  return `${duration.minutes}m left`;
};

export const formatDuration = (startDate: Date, endDate: Date): string => {
  let duration = '';

  const years = differenceInYears(endDate, startDate);
  startDate = addYears(startDate, years);

  const months = differenceInMonths(endDate, startDate);
  startDate = addMonths(startDate, months);

  const days = differenceInDays(endDate, startDate);

  if (years > 0) {
    duration += `${years}y `;
  }
  if (months > 0 || (years > 0 && days > 0)) {
    duration += `${months}m `;
  }
  if (days > 0 || (years === 0 && months === 0)) {
    duration += `${days}d`;
  }

  return duration.trim();
};

export const calculateStartEndTime = (
  timeFrame: TimeInterval | IntervalType,
): { startTime: string; endTime: string } => {
  const endTime = new Date();

  const timeIntervalToStartTime: Record<TimeInterval, () => Date> = {
    [TimeInterval.OneDay]: () => subDays(new Date(endTime), 1),
    [TimeInterval.SevenDays]: () => subDays(new Date(endTime), 7),
    [TimeInterval.OneMonth]: () => subMonths(new Date(endTime), 1),
    [TimeInterval.ThreeMonths]: () => subMonths(new Date(endTime), 3),
    [TimeInterval.SixMonths]: () => subMonths(new Date(endTime), 6),
    [TimeInterval.OneYear]: () => subYears(new Date(endTime), 1),
  };

  const startTimeCalculation = timeIntervalToStartTime[timeFrame];

  const startTime = startTimeCalculation();

  return {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };
};
