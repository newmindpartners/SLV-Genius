import { IconButton } from '@mui/material';
import { FC } from 'react';

type CustomPickerButtonProps = {
  onButtonClick: () => void;
  Icon: () => JSX.Element;
};

export const CustomPickerButton: FC<CustomPickerButtonProps> = ({
  onButtonClick,
  Icon,
}) => {
  return (
    <IconButton onClick={onButtonClick}>
      <Icon />
    </IconButton>
  );
};
