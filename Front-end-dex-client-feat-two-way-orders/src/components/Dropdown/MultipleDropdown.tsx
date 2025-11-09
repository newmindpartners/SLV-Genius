import {
  FormControl as MuiFormControl,
  MenuItem as MuiMenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
  SelectProps,
  styled,
  Typography,
} from '@mui/material';
import React, { ReactNode } from 'react';

const DropdownIcon = () => (
  <svg
    width="14"
    height="8"
    viewBox="0 0 14 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.50098 1L7.00098 7L12.501 1"
      stroke="#666666"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

type DropdownCustomProps = {
  value: string[];
  label: string;
  handleChange: (event: SelectChangeEvent<unknown>) => void;
  emptyResultsMessage?: ReactNode;
  options: {
    title: string;
    value: string;
    preview?: string;
    icon?: ReactNode;
    disabled?: boolean;
    endAdornment?: ReactNode;
  }[];
};

export type MultipleDropdownProps = DropdownCustomProps & SelectProps;

const MultipleDropdown = ({
  value,
  options,
  label,
  emptyResultsMessage = 'No Results',
  handleChange,
  ...props
}: MultipleDropdownProps) => {
  const getById = (id: string) => {
    const option = options.find((option) => option.value === id);
    return option?.preview || option?.title;
  };

  const renderValue = (selected: unknown) => {
    // Checking if selected is Array<string>

    if (Array.isArray(selected)) {
      const updated = selected
        .filter((element): element is string => {
          return typeof element === 'string';
        })
        .map((element) => getById(element));
      return updated.join(', ');
    }
    return '';
  };

  return (
    <MuiFormControl>
      <Select
        MenuProps={{
          sx: {
            '.MuiPaper-root': {
              background: 'transparent',
              boxShadow: 'none',
            },
            '.MuiList-root': {
              marginTop: '5px',
              borderRadius: '15px',
              background: '#151D2E',
              border: '1px solid #28304E',
              padding: 0,
            },
          },
        }}
        displayEmpty
        multiple
        value={value}
        onChange={handleChange}
        renderValue={(selected: unknown) => (
          <Typography>{value.length ? renderValue(selected) : label}</Typography>
        )}
        IconComponent={() => (
          <IconWrapper>
            <DropdownIcon />
          </IconWrapper>
        )}
        {...props}
      >
        {options.map(({ title, value: optionValue, icon, disabled, endAdornment }) => (
          <MenuItem value={optionValue} key={title} disabled={disabled}>
            {icon}
            <Typography>{title}</Typography>

            {endAdornment && <EndAdornment>{endAdornment}</EndAdornment>}
          </MenuItem>
        ))}
        {options.length === 0 && <MenuItem disabled>{emptyResultsMessage}</MenuItem>}
      </Select>
    </MuiFormControl>
  );
};

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  backgroundColor: '#151D2E',
  margin: '7px',
  padding: '5px 7px',
  borderRadius: theme.borderRadius.xs,
  gap: '17px',
  columnGap: '12px',

  '&:hover': {
    backgroundColor: '#28304E',
  },
  '&.Mui-selected': {
    backgroundColor: '#28304E',
    borderRadius: theme.borderRadius.xs,
  },
  '&.Mui-selected:hover': {
    backgroundColor: '#28304E',
  },
}));

const Select = styled(MuiSelect)(({ theme }) => ({
  width: '100%',
  '& .MuiSelect-select': {
    paddingLeft: '14px !important',
    borderRadius: `${theme.borderRadius.sm} !important`,
    background: '#151D2E',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const IconWrapper = styled('div')({
  position: 'absolute',
  pointerEvents: 'none',
  right: '25px',
  display: 'flex',
  alignItems: 'center',
});

const EndAdornment = styled('div')({
  marginLeft: 'auto',
});

export default MultipleDropdown;
