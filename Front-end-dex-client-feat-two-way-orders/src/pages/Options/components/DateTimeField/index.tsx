import {
  DateTimeField as MuiDateTimeField,
  DateTimeFieldProps as MuiDateTimeFieldProps,
} from '@mui/x-date-pickers';
import TextField, { TextFieldProps } from '~/components/TextField/TextField';

export type DateTimeFieldProps = MuiDateTimeFieldProps<Date> &
  Omit<TextFieldProps, 'value' | 'onChange'>;

export const DateTimeField = ({ value, onChange, ...props }: DateTimeFieldProps) => (
  <MuiDateTimeField
    {...props}
    value={value}
    slots={{ textField: TextField }}
    slotProps={{ textField: props }}
    onChange={onChange}
  />
);
