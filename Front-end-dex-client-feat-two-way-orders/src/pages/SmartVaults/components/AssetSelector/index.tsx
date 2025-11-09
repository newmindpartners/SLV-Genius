import { alpha, Autocomplete, Avatar, styled, Typography } from '@mui/material';
import { forwardRef } from 'react';
import { Card } from '~/components/Card';
import TextField, { TextFieldProps } from '~/components/TextField/TextField';
import { Asset } from '~/redux/api';

export interface AssetSelectorProps
  extends Omit<TextFieldProps, 'value' | 'ref' | 'onChange'> {
  value?: Asset | null;
  readOnly?: boolean;
  options?: Asset[];
  onChange?: (currency: Asset | null) => void;
}

const AssetSelector = forwardRef<HTMLInputElement, AssetSelectorProps>(
  ({ value, options, disabled, bgcolor, readOnly, onChange, ...inputProps }, ref) => (
    <Autocomplete
      value={value}
      options={options ?? []}
      readOnly={readOnly}
      disabled={disabled}
      isOptionEqualToValue={(option, value) => option.assetId === value.assetId}
      getOptionKey={(option) => (typeof option !== 'string' ? option.assetId : option)}
      getOptionLabel={(option) =>
        typeof option !== 'string' ? option.shortName : option
      }
      PaperComponent={(props) => <Card {...props} color={bgcolor} />}
      ListboxComponent={Listbox}
      renderOption={(props, option, state) => (
        <Option {...props} $color={inputProps.color} $selected={state.selected}>
          <Avatar src={option.iconUrl} sx={{ width: '1.5rem', height: '1.5rem' }} />
          <Typography variant="body1">{option.shortName}</Typography>
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
            startAdornment: value && (
              <Avatar src={value.iconUrl} sx={{ width: '1.5rem', height: '1.5rem' }} />
            ),
          }}
        />
      )}
      onChange={(_, value) => onChange?.(value)}
    />
  ),
);

AssetSelector.displayName = 'AssetSelector';

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

export default AssetSelector;
