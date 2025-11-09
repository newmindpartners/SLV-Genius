import { IconButton, styled } from '@mui/material';
import { shouldForwardProp } from '@mui/system';
import { FC, useState } from 'react';
import SwitchIcon from '~/components/Icons/SwitchIcon';

type SwitchButtonProps = {
  onClick: () => void;
};

const SwitchButton: FC<SwitchButtonProps> = ({ onClick }) => {
  const [isRotated, setIsRotated] = useState(false);

  const handleClick = () => {
    setIsRotated(!isRotated);
    onClick();
  };

  return (
    <StyledSwitchButton isRotated={isRotated} onClick={handleClick} disableRipple>
      <SwitchIcon />
    </StyledSwitchButton>
  );
};

const StyledSwitchButton = styled(IconButton, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'isRotated',
})<{ isRotated?: boolean }>(({ theme, isRotated }) => ({
  background: theme.palette.bgPrimaryGradient.contrastText,
  border: '3px solid #202740',
  borderRadius: '50%',
  width: '36px',
  height: '36px',
  zIndex: '10',
  padding: 0,

  '& > svg': {
    width: '10px',
    height: '10px',
    path: {
      fill: 'none',
    },
    transform: isRotated ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.5s',
  },

  '&:hover': {
    backgroundColor: '#4C54F5',
  },
}));

export default SwitchButton;
