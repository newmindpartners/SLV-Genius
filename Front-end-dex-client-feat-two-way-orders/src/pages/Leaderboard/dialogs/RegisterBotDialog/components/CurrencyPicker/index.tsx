import { alpha, Autocomplete, Avatar, styled, Typography } from '@mui/material';
import { forwardRef } from 'react';
import { Card } from '~/components/Card';
import TextField, { TextFieldProps } from '~/components/TextField/TextField';

export interface ICurrency {
  id: string;
  icon: string;
  name: string;
}

export interface CurrencyPickerProps
  extends Omit<TextFieldProps, 'value' | 'ref' | 'onChange'> {
  value?: ICurrency | null;
  readOnly?: boolean;
  options?: ICurrency[];
  onChange?: (currency: ICurrency | null) => void;
}

export const CurrencyPicker = forwardRef<HTMLInputElement, CurrencyPickerProps>(
  ({ value, options, disabled, bgcolor, readOnly, onChange, ...inputProps }, ref) => (
    <Autocomplete
      value={value}
      options={options ?? []}
      readOnly={readOnly}
      disabled={disabled}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionKey={(option) => (typeof option !== 'string' ? option.id : option)}
      getOptionLabel={(option) => (typeof option !== 'string' ? option.name : option)}
      PaperComponent={(props) => <Card {...props} color={bgcolor} />}
      ListboxComponent={CurrencyPickerListbox}
      renderOption={(props, option, state) => (
        <CurrencyPickerOption
          {...props}
          $color={inputProps.color}
          $selected={state.selected}
        >
          <Avatar src={option.icon} sx={{ width: '1.5rem', height: '1.5rem' }} />
          <Typography variant="body1">{option.name}</Typography>
        </CurrencyPickerOption>
      )}
      renderInput={(props) => (
        <TextField
          {...props}
          {...inputProps}
          ref={ref}
          bgcolor={bgcolor}
          InputProps={{
            ...props.InputProps,
            startAdornment: value && (
              <Avatar src={value.icon} sx={{ width: '1.5rem', height: '1.5rem' }} />
            ),
          }}
        />
      )}
      onChange={(_, value) => onChange?.(value)}
    />
  ),
);

CurrencyPicker.displayName = 'CurrencyPicker';

const CurrencyPickerListbox = styled('ul')({
  padding: '0 !important',
});

const CurrencyPickerOption = styled('li', {
  shouldForwardProp: (propName: string) => !propName.startsWith('$'),
})<{ $color: TextFieldProps['color']; $selected: boolean }>(
  ({ theme, $color, $selected }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderRadius: theme.borderRadius.xs,
    margin: theme.spacing(1) + ' !important',
    padding: theme.spacing(1) + ' !important',

    '&.Mui-focused': {
      ...($color === 'secondary' && {
        background: `${alpha(theme.palette.chip.info.color, 0.5)} !important`,
      }),
    },

    ...($selected &&
      $color === 'secondary' && {
        background: `${alpha(theme.palette.chip.info.color, 0.1)} !important`,
      }),
  }),
);
