import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, useCallback } from 'react';

export interface PercentageButtonCallbacks {
  onClick: (percentageValue: number) => void;
}

export interface PercentageButtonProps {
  value: number;

  isActive: boolean;
  isDisabled: boolean;
}

const PercentageButton: FC<PercentageButtonProps & PercentageButtonCallbacks> = ({
  value,

  isActive,
  isDisabled,

  onClick,
}) => {
  const handleButtonClick = useCallback(() => {
    onClick(value);
  }, [value, onClick]);

  const Wrapper =
    isActive && !isDisabled ? PercentageButtonWrapperActive : PercentageButtonWrapper;

  return (
    <Wrapper
      size={'small'}
      variant="contained"
      onClick={handleButtonClick}
      disabled={isDisabled}
    >
      <Typography
        variant="statusCard"
        fontFamily="secondaryFont"
      >{`${value}%`}</Typography>
    </Wrapper>
  );
};

const PercentageButtonWrapper = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  border: `1px solid ${theme.palette.highlightedFrames.main}`,
  borderRadius: '8px',
  width: 'fit-content',
  minWidth: 'fit-content',
  padding: '3px 7px',
  color: theme.palette.buttonsInactive.main,

  '&:hover': {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.textColor.light,
  },

  '&:disabled': {
    backgroundColor: 'transparent',
  },

  '& > .MuiTypography-root': {
    lineHeight: '14px',
    marginBottom: '1.5px',
  },
}));

const PercentageButtonWrapperActive = styled(PercentageButtonWrapper)(({ theme }) => ({
  backgroundColor: theme.palette.bgPrimaryGradient.contrastText,
  color: theme.palette.textColor.light,
  border: `1px solid ${theme.palette.primary.main}`,

  '&:hover': {
    backgroundColor: theme.palette.bgPrimaryGradient.contrastText,
  },
}));

export default PercentageButton;
