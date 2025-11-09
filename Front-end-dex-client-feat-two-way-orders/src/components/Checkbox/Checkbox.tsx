import { Checkbox as CheckboxMui } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, ReactElement } from 'react';

export interface CheckboxProps {
  checked: boolean;
  handleCheckedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  icon: ReactElement;
  checkedIcon: ReactElement;
}

const Checkbox: FC<CheckboxProps> = ({
  checked,
  handleCheckedChange,
  checkedIcon,
  icon,
}): ReactElement => (
  <CheckboxIcon
    checked={checked}
    onChange={handleCheckedChange}
    checkedIcon={checkedIcon}
    icon={icon}
  />
);

const CheckboxIcon = styled(CheckboxMui)(({ theme }) => ({
  ':hover': {
    backgroundColor: 'transparent',
    rect: {
      stroke: theme.palette.secondary.main,
    },
  },
}));

export default Checkbox;
