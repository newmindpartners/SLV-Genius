import { Grid, styled } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { endOfDay, isSameDay, isWithinInterval } from 'date-fns';
import { FC } from 'react';

import { DAYS_WITHIN_INTERVAL, SELECTED_START_END_DAY } from './DateAndTimePicker';

const setDayAccentColor = (
  currentDay: Date,
  intervalStartDate: Date | null,
  intervalEndDate: Date | null,
) => {
  if (
    // color of selected start and end dates
    (intervalStartDate && isSameDay(currentDay, intervalStartDate)) ||
    (intervalEndDate && isSameDay(currentDay, intervalEndDate))
  ) {
    return SELECTED_START_END_DAY;
  } else if (
    // color of days between start and end dates
    intervalStartDate &&
    intervalEndDate &&
    isWithinInterval(currentDay, {
      start: intervalStartDate,
      end: endOfDay(intervalEndDate),
    })
  ) {
    return DAYS_WITHIN_INTERVAL;
  } else {
    return 'transparent';
  }
};

interface CustomDayComponentProps {
  startDate: Date | null;
  endDate: Date | null;
}

type CustomDayComponent = (
  extraProps: CustomDayComponentProps,
) => FC<PickersDayProps<Date>>;

export const generateCustomDayComponent: CustomDayComponent = (extraProps) => {
  const { startDate, endDate } = extraProps;

  const CustomDay: FC<PickersDayProps<Date>> = ({ children, ...otherProps }) => {
    const color =
      startDate || endDate
        ? setDayAccentColor(otherProps.day, startDate, endDate)
        : 'transparent';

    return (
      <PickersDayWrapper>
        <PickersDay {...otherProps} style={{ backgroundColor: color }}>
          {children}
        </PickersDay>
      </PickersDayWrapper>
    );
  };

  CustomDay.displayName = 'CustomDay';

  return CustomDay;
};

const PickersDayWrapper = styled(Grid)(({ theme }) => ({
  '& > .MuiPickersDay-root': {
    fontSize: theme.typography.body3.fontSize,
    fontWeight: 300,
    color: theme.palette.textColor.main,

    '& > .Mui-disabled:not(.Mui-selected)': {
      backgroundColor: 'transparent',
      color: '#414A70',
      opacity: 1,
    },

    '& .Mui-selected': {
      backgroundColor: SELECTED_START_END_DAY,
    },
  },

  '& > .MuiButtonBase-root:hover': {
    backgroundColor: 'transparent',
    border: `1px solid ${SELECTED_START_END_DAY}`,
  },
}));
