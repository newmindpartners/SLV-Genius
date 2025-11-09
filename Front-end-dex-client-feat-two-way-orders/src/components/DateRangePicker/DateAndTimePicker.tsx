import { Grid, styled, Theme, Typography } from '@mui/material';
import { DatePicker, PickersDayProps, TimePicker } from '@mui/x-date-pickers';
import { FC, useState } from 'react';
import { getDateFormat, getUserLocale } from '~/utils/date';

import Button from '../Button/Button';
import CalendarSVG from '../Icons/CalendarSVG';
import ClockSVG from '../Icons/ClockSVG';
import { InfoIcon } from '../Icons/Info';
import Tooltip from '../Tooltip';
import { CustomPickerButton } from './CustomPickerButton';

export const SELECTED_START_END_DAY = '#4C54F5';
export const DAYS_WITHIN_INTERVAL = '#2E3276';

type AllowedDateRange = {
  minDate: Date | null;
  maxDate: Date | null;
};

type AllowedTimeRange = {
  minTime: Date | null;
  maxTime: Date | null;
};

type DateAndTimePickerProps = {
  label: string;
  tooltipContent: string;
  dateValue: Date | null;

  onDateChange: (value: Date | null) => void;
  onTimeChange: (value: Date | null) => void;
  onClearDate: () => void;
  CustomDay?: FC<PickersDayProps<Date>>;

  allowedDateRange: AllowedDateRange;
  allowedTimeRange: AllowedTimeRange;
};

const DateAndTimePicker: FC<DateAndTimePickerProps> = ({
  label,
  tooltipContent,
  dateValue,

  onDateChange,
  onTimeChange,
  onClearDate,
  CustomDay,

  allowedDateRange,
  allowedTimeRange,
}) => {
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [openTimeDialog, setOpenTimeDialog] = useState(false);

  const toggleDatePicker = () => setOpenDateDialog(!openDateDialog);
  const toggleTimePicker = () => setOpenTimeDialog(!openTimeDialog);

  const { minDate, maxDate } = allowedDateRange;
  const { minTime, maxTime } = allowedTimeRange;

  return (
    <Grid display="flex" flexDirection="column" gap="3px">
      {/* Header */}
      <Grid display="flex" justifyContent="space-between">
        <Grid display="flex" gap="5px">
          <Typography
            variant="statusCard"
            color="buttonsInactive.main"
            fontWeight="500px"
          >
            {label}:
          </Typography>
          <Tooltip title={tooltipContent} placement="right">
            <Grid>
              <InfoIcon />
            </Grid>
          </Tooltip>
        </Grid>

        <ClearButton onClick={onClearDate} disableRipple>
          <Typography
            variant="poweredBy"
            color="buttonsInactive.main"
            fontWeight="500px"
            textAlign="right"
          >
            Clear
          </Typography>
        </ClearButton>
      </Grid>

      {/* Date and Time Picker */}
      <PickersContainer display="flex" gap="2px">
        <DatePickerWrapper>
          <RoundedLeftBorderDatePicker
            value={dateValue}
            maxDate={maxDate || undefined}
            minDate={minDate || undefined}
            format={getDateFormat(getUserLocale())}
            onChange={onDateChange}
            open={openDateDialog}
            onOpen={toggleDatePicker}
            onClose={toggleDatePicker}
            disablePast
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: { disableUnderline: true, readOnly: true },
                onClick: toggleDatePicker,
              },
              // Render the dropdown within their parent DOM hierarchy
              popper: { disablePortal: true },
            }}
            slots={{
              // Replaces the default day component
              day: CustomDay,
              // Replaces the default Calendar Button
              openPickerButton: () => (
                <CustomPickerButton onButtonClick={toggleDatePicker} Icon={CalendarSVG} />
              ),
            }}
          />
        </DatePickerWrapper>

        <TimePickerWrapper>
          <RoundedRightBorderTimePicker
            value={dateValue}
            maxTime={maxTime || undefined}
            minTime={minTime || undefined}
            ampm={false}
            onChange={onTimeChange}
            open={openTimeDialog}
            onOpen={toggleTimePicker}
            onClose={toggleTimePicker}
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: { disableUnderline: true, readOnly: true },
                onClick: toggleTimePicker,
              },
              // Render the dropdown within their parent DOM hierarchy
              popper: { disablePortal: true },
            }}
            slots={{
              // Replaces the default Clock Button
              openPickerButton: () => (
                <CustomPickerButton onButtonClick={toggleTimePicker} Icon={ClockSVG} />
              ),
            }}
          />
        </TimePickerWrapper>
      </PickersContainer>
    </Grid>
  );
};

const PickersContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const DatePickerWrapper = styled(Grid)(({ theme }) => ({
  '& > .MuiPickersPopper-root': {
    '& > .MuiPaper-root': {
      backgroundColor: '#182031',
      border: '1px solid #28304E',
      boxShadow: 'none',
      backgroundImage: 'none',
      borderRadius: theme.borderRadius.sm,
      marginTop: '5px',

      '& .MuiPickersCalendarHeader-root': {
        '& .MuiPickersCalendarHeader-label': {
          fontFamily: theme.typography.secondaryFont,
          fontSize: theme.typography.teamUserTitle.fontSize,
          lineHeight: theme.typography.teamUserTitle.lineHeight,
          fontWeight: 700,
          width: '100%',
        },
      },

      '& .MuiDayCalendar-header': {
        '& > .MuiTypography-root': {
          fontFamily: theme.typography.secondaryFont,
          fontSize: theme.typography.poweredBy.fontSize,
          lineHeight: theme.typography.poweredBy.lineHeight,
          fontWeight: 600,
          color: theme.palette.action.disabled,
        },
      },

      '& .MuiPickersFadeTransitionGroup-root': {
        '& .MuiPickersYear-yearButton': {
          fontFamily: theme.typography.secondaryFont,
          fontSize: theme.typography.teamUserTitle.fontSize,
          lineHeight: theme.typography.teamUserTitle.lineHeight,
          fontWeight: 700,
        },
      },
    },
  },
}));

const TimePickerWrapper = styled(Grid)(({ theme }) => ({
  '& > .MuiPickersPopper-root': {
    '& > .MuiPaper-root': {
      backgroundColor: '#182031',
      border: '1px solid #28304E',
      boxShadow: 'none',
      backgroundImage: 'none',
      borderRadius: theme.borderRadius.sm,
      marginTop: '5px',

      '& .MuiList-root': {
        width: '48px',

        '& > .MuiButtonBase-root': {
          borderRadius: theme.borderRadius.sm,
          fontFamily: theme.typography.secondaryFont,
          fontSize: theme.typography.roundWrapperCardDesc.fontSize,
          lineHeight: theme.typography.roundWrapperCardDesc.lineHeight,
          fontWeight: theme.typography.roundWrapperCardDesc.fontWeight,
          minHeight: '40px',
          minWidth: '40px',
          width: '40px',
          height: '40px',
        },

        '& > .MuiButtonBase-root:hover': {
          backgroundColor: 'transparent',
          border: `1px solid ${SELECTED_START_END_DAY}`,
        },

        '& > .Mui-disabled': {
          opacity: 1,
          color: '#414A70',
        },

        '& > .Mui-selected': {
          backgroundColor: SELECTED_START_END_DAY,
        },
      },

      '& .MuiDialogActions-root': {
        justifyContent: 'center',

        '& > .MuiButtonBase-root': {
          border: `1px solid ${theme.palette.action.disabled}`,
          borderRadius: theme.borderRadius.xs,
          color: '#7787B1',
          minWidth: '50px',
          width: '50px',
          padding: '0px 6px',
          fontFamily: theme.typography.secondaryFont,
          fontSize: theme.typography.roundWrapperCardDesc.fontSize,
          lineHeight: theme.typography.roundWrapperCardDesc.lineHeight,
          fontWeight: theme.typography.roundWrapperCardDesc.fontWeight,
        },

        '& > .MuiButtonBase-root:hover': {
          color: theme.palette.textColor.main,
          backgroundColor: 'transparent',
        },
      },
    },
  },
}));

// Common styles of DatePicker and TimePicker
const pickerStyles = ({ theme }: { theme: Theme }) => ({
  '& > label': {
    display: 'none',
  },

  '& > .MuiInputBase-root': {
    backgroundColor: theme.palette.bgPrimaryGradient.contrastText,
    padding: '4px 14px',
    marginTop: '0px',
    height: '48px',

    '& > .MuiInputBase-input': {
      textAlign: 'left',
      fontFamily: theme.typography.secondaryFont,
      fontSize: theme.typography.description.fontSize,
      fontStyle: theme.typography.description.fontStyle,
      fontWeight: 500,
      lineHeight: theme.typography.description.lineHeight,
      color: theme.palette.social.main,
    },
    '& > .MuiInputAdornment-root': {
      '& > .MuiButtonBase-root': {
        '& > .MuiSvgIcon-root': {
          width: '16px',
          height: '16px',
          color: theme.palette.social.main,
        },
      },
      '& > .MuiButtonBase-root:hover': {
        backgroundColor: 'transparent',
        '& > .MuiSvgIcon-root': {
          width: '16px',
          height: '16px',
          color: theme.palette.textColor.main,
        },
      },
    },
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',

    '& > .MuiInputBase-root': {
      borderTopLeftRadius: theme.borderRadius.sm,
      borderBottomLeftRadius: theme.borderRadius.sm,
      borderTopRightRadius: theme.borderRadius.sm,
      borderBottomRightRadius: theme.borderRadius.sm,
    },
  },
});

const CustomDatePicker = styled(DatePicker<Date>)(pickerStyles);
const CustomTimePicker = styled(TimePicker<Date>)(pickerStyles);

const RoundedLeftBorderDatePicker = styled(CustomDatePicker)(({ theme }) => ({
  '& > .MuiInputBase-root': {
    borderTopLeftRadius: theme.borderRadius.sm,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
}));

const RoundedRightBorderTimePicker = styled(CustomTimePicker)(({ theme }) => ({
  '& > .MuiInputBase-root': {
    borderTopRightRadius: theme.borderRadius.sm,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
}));

const ClearButton = styled(Button)(({ theme }) => ({
  background: 'transparent',
  padding: '0px',
  margin: '0px',
  minWidth: 'fit-content',

  '&:hover': {
    background: 'transparent',
    boxShadow: 'none',
    '& > .MuiTypography-root': {
      color: theme.palette.textColor.main,
    },
  },

  [theme.breakpoints.down('lg')]: {
    padding: '0px',
  },
}));

export default DateAndTimePicker;
