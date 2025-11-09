import { format, setHours, setMinutes, startOfDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { padStart } from 'lodash';

// Adjusts the time for a given date using another date's hours and minutes.
export const adjustTime = (date: Date, time: Date): Date =>
  setMinutes(setHours(startOfDay(date), time.getHours()), time.getMinutes());

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

export const getUserLocale = (): string => navigator.language;

export type DateFormats = {
  'en-US': string;
  default: string;
};

export const dateFormats: DateFormats = {
  'en-US': 'MM/dd/yyyy',
  default: 'dd/MM/yyyy',
};

export const dateWithTimeFormats: DateFormats = {
  'en-US': 'MM-dd-yyyy HH:mm',
  default: 'dd-MM-yyyy HH:mm',
};

// Get the correct format based on user locale
const getFormatForLocale = (formats: DateFormats, locale: string): string =>
  formats[locale as keyof DateFormats] || formats.default;

const createFormatter =
  (formats: DateFormats) =>
  (date: Date, locale: string): string => {
    const dateLocale = locale === 'en-US' ? { locale: enUS } : {};
    return format(date, getFormatForLocale(formats, locale), dateLocale);
  };

// Returns a date string formatted according to the given locale.
export const getFormattedDate = (date: Date, locale: string): string =>
  createFormatter(dateFormats)(date, locale);

// Returns a date-time string formatted according to the given locale.
export const getFormattedDateAndTime = (date: Date, locale: string): string =>
  createFormatter(dateWithTimeFormats)(date, locale);

// Returns the appropriate date format string for the given locale.
export const getDateFormat = (locale: string): string =>
  getFormatForLocale(dateFormats, locale);

// Returns the appropriate date-time format string for the given locale.
export const getDateAndTimeFormat = (locale: string): string =>
  getFormatForLocale(dateWithTimeFormats, locale);
