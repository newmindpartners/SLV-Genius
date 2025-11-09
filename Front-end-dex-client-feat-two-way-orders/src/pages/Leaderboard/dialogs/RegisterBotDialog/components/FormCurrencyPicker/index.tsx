import { useController, UseControllerProps } from 'react-hook-form';

import { CurrencyPicker, CurrencyPickerProps } from '../CurrencyPicker';

export type FormCurrencyPickerProps<T extends object> = UseControllerProps<T> &
  Omit<CurrencyPickerProps, 'value'>;

export const FormCurrencyPicker = <T extends object>(
  props: FormCurrencyPickerProps<T>,
) => {
  const { field } = useController(props);

  return (
    <CurrencyPicker
      {...props}
      {...field}
      value={props.options?.find((option) => option.id === field.value) ?? null}
      onChange={(option) => {
        field.onChange(option ? option.id : null);
        props.onChange?.(option);
      }}
    />
  );
};
