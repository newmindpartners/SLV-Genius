import { useController, UseControllerProps } from 'react-hook-form';

import { DateTimeField, DateTimeFieldProps } from '../DateTimeField';

export type FormDateTimeFieldProps<T extends object> = Omit<
  DateTimeFieldProps,
  'value' | 'onChange'
> &
  UseControllerProps<T>;

export const FormDateTimeField = <T extends object>(props: FormDateTimeFieldProps<T>) => {
  const { field } = useController(props);
  return <DateTimeField {...props} {...field} />;
};
