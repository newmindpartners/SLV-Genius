import { addHours, isAfter, isSameDay } from 'date-fns';
import { adjustTime } from '~/utils/date';

import { DateRange } from './DateRangePicker';

// Determines the updated time for a date based on selected dates and the current time:
// Sets time to current/next day if no start/end date.
// Ensures endTime isn't earlier than startTime.
const computeUpdatedTime = (
  dateType: 'startTime' | 'endTime',
  currentDate: Date,
  value: Date,
  dateRange: DateRange,
) => {
  if (!dateRange.startDate && !dateRange.endDate) {
    return isAfter(value, currentDate)
      ? adjustTime(currentDate, value)
      : adjustTime(addHours(currentDate, 24), value);
  }

  if (dateType === 'startTime') {
    return value;
  }

  if (dateType === 'endTime' && dateRange.startDate) {
    return isAfter(dateRange.startDate, adjustTime(dateRange.startDate, value))
      ? adjustTime(addHours(dateRange.startDate, 24), value)
      : adjustTime(dateRange.startDate, value);
  }

  return value;
};

// Handling time change logic
export const handleTimeChange = (
  dateType: 'startTime' | 'endTime',
  currentDate: Date,
  value: Date,
  dateRange: DateRange,
): Date => computeUpdatedTime(dateType, currentDate, value, dateRange);

// Adjusts the startDate if the chosen date is the same as the current date
const adjustStartDate = (value: Date, currentDate: Date) =>
  isSameDay(value, currentDate) ? adjustTime(value, currentDate) : value;

// Adjusts the endDate based on certain conditions
const adjustEndDate = (value: Date, currentDate: Date, startDate: Date | null) => {
  if (isSameDay(value, currentDate) && !startDate) {
    return addHours(currentDate, 1);
  }

  if (startDate && isSameDay(value, startDate) && isAfter(startDate, value)) {
    return addHours(startDate, 1);
  }

  return value;
};

// Function to get updated date range
const getUpdatedDateRange = (
  dateRange: DateRange,
  newDate: Date,
  dateType: 'startDate' | 'endDate' | 'startTime' | 'endTime',
): DateRange => {
  const currentDate = new Date();

  switch (dateType) {
    case 'startDate':
      return {
        ...dateRange,
        startDate: adjustStartDate(newDate, currentDate),
      };
    case 'endDate':
      return {
        ...dateRange,
        endDate: adjustEndDate(newDate, currentDate, dateRange.startDate),
      };
    case 'startTime':
      return {
        ...dateRange,
        startDate: handleTimeChange('startTime', currentDate, newDate, dateRange),
      };
    case 'endTime':
      return {
        ...dateRange,
        endDate: handleTimeChange('endTime', currentDate, newDate, dateRange),
      };
    default:
      return dateRange;
  }
};

// Main function to handle date changes
export const handleDateChange =
  (
    dateRange: DateRange,
    setDateRange: (value: DateRange) => void,
    dateType: 'startDate' | 'endDate' | 'startTime' | 'endTime',
  ) =>
  (value: Date | null): void => {
    if (!value) return;

    const updatedDateRange: DateRange = getUpdatedDateRange(dateRange, value, dateType);

    setDateRange(updatedDateRange);
  };
