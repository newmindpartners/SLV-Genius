import { Button, styled, Typography } from '@mui/material';
import { FC, useCallback } from 'react';

type SelectorButtonProps = {
  value: string;
  width: string;
  isActive: boolean;
  isDisabled?: boolean;

  onClick: (value: string) => void;
};

const SelectorButton: FC<SelectorButtonProps> = ({
  value,
  width,
  isActive,
  isDisabled,

  onClick,
}) => {
  const handleClick = useCallback(() => {
    onClick(value);
  }, [value, onClick]);

  return (
    <Wrapper
      active={isActive}
      buttonWidth={width}
      size={'small'}
      variant="contained"
      onClick={handleClick}
      disabled={isDisabled}
    >
      <Typography variant="statusCard" fontFamily="secondaryFont" fontWeight="500">
        {value}
      </Typography>
    </Wrapper>
  );
};

const Wrapper = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'buttonWidth',
})<{ active: boolean; buttonWidth: string }>(({ theme, active, buttonWidth }) => ({
  backgroundColor: active ? '#4C54F5' : theme.palette.highlightedFrames.main,
  border: 'none',
  borderRadius: theme.borderRadius.xs,
  padding: '13px 0',
  minWidth: `${buttonWidth}px`,
  color: active ? theme.palette.textColor.light : theme.palette.buttonsInactive.main,
  boxShadow: 'none',
  transition: '0.2s',

  '&:hover': {
    backgroundColor: active ? '#4C54F5' : 'rgba(50, 63, 98, 0.5)',
    border: 'none',
    color: theme.palette.textColor.light,
  },

  '&:disabled': {
    backgroundColor: 'transparent',
  },

  '& > .MuiTypography-root': {
    lineHeight: '14px',
  },
}));

export default SelectorButton;
