import { Grid } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { isSameDay } from 'date-fns';
import { FC } from 'react';

import { generateCustomDayComponent } from './CustomDay';
import DateAndTimePicker from './DateAndTimePicker';
import { handleDateChange } from './utils';

export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export type DateRangePickerProps = {
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;

  hasStartDate?: boolean;
  hasEndDate?: boolean;

  startDateTooltipContent: string;
  endDateTooltipContent: string;
};

const DateRangePicker: FC<DateRangePickerProps> = ({
  dateRange,
  setDateRange,

  hasStartDate = true,
  hasEndDate = true,

  startDateTooltipContent,
  endDateTooltipContent,
}) => {
  const { startDate, endDate } = dateRange;
  const currentDate = new Date();

  const handleStartDateChange = handleDateChange(dateRange, setDateRange, 'startDate');
  const handleEndDateChange = handleDateChange(dateRange, setDateRange, 'endDate');
  const handleStartTimeChange = handleDateChange(dateRange, setDateRange, 'startTime');
  const handleEndTimeChange = handleDateChange(dateRange, setDateRange, 'endTime');

  const handleClearDate =
    (dateType: 'startDate' | 'endDate' | 'startTime' | 'endTime') => () => {
      const updatedDateRange = { ...dateRange, [dateType]: null };
      setDateRange(updatedDateRange);
    };

  const CustomDay = generateCustomDayComponent({ startDate, endDate });

  const getMaxTime = (forStartDate: boolean) => {
    if (!startDate || !endDate) return null;

    if (forStartDate && isSameDay(startDate, endDate)) {
      return endDate;
    } else if (!forStartDate && isSameDay(startDate, endDate)) {
      return startDate;
    }

    return null;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid display="flex" flexDirection="column" gap="10px">
        {hasStartDate && (
          <DateAndTimePicker
            label="Start date"
            tooltipContent={startDateTooltipContent}
            dateValue={startDate}
            onDateChange={handleStartDateChange}
            onTimeChange={handleStartTimeChange}
            onClearDate={handleClearDate('startDate')}
            CustomDay={CustomDay}
            allowedDateRange={{
              minDate: startDate || new Date(),
              maxDate: endDate,
            }}
            allowedTimeRange={{
              minTime:
                startDate && isSameDay(startDate, currentDate) ? currentDate : null,
              maxTime: getMaxTime(true),
            }}
          />
        )}

        {hasEndDate && (
          <DateAndTimePicker
            label="End date"
            tooltipContent={endDateTooltipContent}
            dateValue={endDate}
            onDateChange={handleEndDateChange}
            onTimeChange={handleEndTimeChange}
            onClearDate={handleClearDate('endDate')}
            CustomDay={CustomDay}
            allowedDateRange={{
              minDate: startDate || new Date(),
              maxDate: null,
            }}
            allowedTimeRange={{
              minTime: getMaxTime(false),
              maxTime: null,
            }}
          />
        )}
      </Grid>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
