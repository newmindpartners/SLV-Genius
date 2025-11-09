import { alpha, Autocomplete, styled, Typography } from '@mui/material';
import { Omit } from 'lodash';
import { forwardRef } from 'react';
import { Card } from '~/components/Card';
import TextField, { TextFieldProps } from '~/components/TextField/TextField';
import { SmartVaultStrategy } from '~/redux/api/core';

export type Strategy = {
  strategyLabel: string;
  strategyValue: string;
};

export interface AssetSelectorProps
  extends Omit<TextFieldProps, 'value' | 'ref' | 'onChange'> {
  value?: SmartVaultStrategy | null;
  readOnly?: boolean;
  options?: SmartVaultStrategy[];
  onChange?: (strategy: SmartVaultStrategy | null) => void;
}

const StrategySelector = forwardRef<HTMLInputElement, AssetSelectorProps>(
  ({ value, options, disabled, bgcolor, readOnly, onChange, ...inputProps }, ref) => (
    <Autocomplete
      value={value}
      options={options ?? []}
      readOnly={readOnly}
      disabled={disabled}
      isOptionEqualToValue={(option, value) =>
        option.smartVaultStrategyId === value.smartVaultStrategyId
      }
      getOptionKey={(option) =>
        typeof option !== 'string' ? option.smartVaultStrategyId : option
      }
      getOptionLabel={(option) => (typeof option !== 'string' ? option.name : option)}
      PaperComponent={(props) => <Card {...props} color={bgcolor} />}
      ListboxComponent={Listbox}
      renderOption={(props, option, state) => (
        <Option {...props} $color={inputProps.color} $selected={state.selected}>
          <Typography variant="body1">{option.name}</Typography>
        </Option>
      )}
      renderInput={(props) => (
        <TextField
          {...props}
          {...inputProps}
          ref={ref}
          bgcolor={bgcolor}
          InputProps={{
            ...props.InputProps,
          }}
        />
      )}
      onChange={(_, value) => onChange?.(value)}
    />
  ),
);

StrategySelector.displayName = 'StrategySelector';

const Listbox = styled('ul')({
  padding: '0 !important',
});

const Option = styled('li', {
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

export default StrategySelector;
