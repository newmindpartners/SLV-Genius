import {
  addDays,
  addSeconds,
  isValid,
  parseISO,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import * as Private from '~/domain/models/private';

export const now = (): Date => new Date();

export const epochInSecondsToDate = (epochInSeconds: number): Date =>
  new Date(epochInSeconds * 1000);

export const secondsFromNow = (secOffset: number): Date => {
  return addSeconds(new Date(), secOffset);
};

export const daysFromNow = (dayOffset: number): Date => {
  return addDays(new Date(), dayOffset);
};

export const tomorrow = (): Date => {
  return daysFromNow(1);
};

export const stringToDate = (s: string): Date | null => {
  const epochMilliseconds = Date.parse(s);
  return Number.isNaN(epochMilliseconds) ? null : new Date(epochMilliseconds);
};

/**
 * return an ordered list of date (in natural order)
 *
 * @param dates an unordered list of Date
 */
export function sortDates(dates: Date[]): Date[] {
  return dates.sort((a, b) => a.getTime() - b.getTime());
}

export const dateOrNull = (timeStamp: number | string | undefined) =>
  timeStamp ? new Date(timeStamp) : null;

export const isValidIsoDateString = (dateString: string): boolean => {
  const date = parseISO(dateString);
  return isValid(date);
};

const windowIntervalToStartDate = (interval: Private.WindowInterval): Date => {
  switch (interval) {
    case '1d':
      return subDays(new Date(), 1);
    case '1w':
      return subWeeks(new Date(), 1);
    case '1mo':
      return subMonths(new Date(), 1);
    case '3mo':
      return subMonths(new Date(), 3);
    case '6mo':
      return subMonths(new Date(), 6);
    case '1y':
      return subYears(new Date(), 1);
  }
};

export const windowIntervalToDateInterval = (
  interval: Private.WindowInterval
) => ({
  startDate: windowIntervalToStartDate(interval),
  endDate: new Date(),
});
