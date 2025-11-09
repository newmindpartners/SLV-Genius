import {
  Grid,
  MenuItem,
  FormControl as MuiFormControl,
  Select as MuiSelect,
  SelectChangeEvent,
  SelectProps,
  styled,
  Typography,
} from '@mui/material';
import React, { ReactNode } from 'react';
import { DropdownIcon } from '~/components/Icons/DropdownIcon';

type DropdownCustomProps = {
  label: ReactNode;
  handleChange: (e: SelectChangeEvent<unknown>) => void;
  options: {
    title: string;
    icon?: ReactNode;
  }[];
  icon?: boolean;
};

export type DropDownProps = DropdownCustomProps & SelectProps;

const Dropdown = ({
  value,
  options,
  handleChange,
  icon = true,
  ...props
}: DropDownProps) => {
  return (
    <FormControl>
      <Select
        displayEmpty
        value={value}
        onChange={handleChange}
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
        IconComponent={() => {
          return icon ? (
            <Grid right="25px" alignItems="center" position="absolute">
              <DropdownIcon />
            </Grid>
          ) : (
            <></>
          );
        }}
        {...props}
      >
        {options.map(({ title, icon }) => (
          <ListItem value={title} key={title}>
            <Grid alignItems="center" container width="100px" gap="8px">
              {icon}
              <Typography>{title}</Typography>
            </Grid>
          </ListItem>
        ))}
      </Select>
    </FormControl>
  );
};

const ListItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: '#151D2E',
  borderRadius: theme.borderRadius.xs,
  margin: '8px',
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

const FormControl = styled(MuiFormControl)({
  '.MuiInputLabel-shrink': {
    '& .MuiTypography-root': {
      color: 'blue',
    },
  },
  '.MuiSelect-outlined': {
    '& .MuiTypography-root': {
      color: '#fff',
    },
  },
});

const Select = styled(MuiSelect)(({ theme }) => ({
  borderRadius: theme.borderRadius.sm,
  cursor: 'pointer',
  '& .MuiSelect-select': {
    backgroundColor: 'transparent',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

export default Dropdown;
