import { CircularProgress, styled, Typography } from '@mui/material';
import { FC } from 'react';

import Button, { ButtonProps } from './Button';

export type GreenGradientButtonProps = ButtonProps & {
  isLoading?: boolean;
  isDisabled?: boolean;
};

const GreenGradientButton: FC<GreenGradientButtonProps> = ({
  isLoading,
  isDisabled = false,
  children,
  onClick,
  ...props
}) => (
  <ButtonWrapper variant="contained" onClick={onClick} disabled={isDisabled} {...props}>
    {isLoading && (
      <CircularProgress color="info" size={20} sx={{ marginRight: '10px' }} />
    )}
    <Typography
      variant="body3"
      color="bgPrimaryGradient.contrastText"
      textAlign="center"
      component="span"
    >
      {children}
    </Typography>
  </ButtonWrapper>
);

const ButtonWrapper = styled(Button)(() => ({
  width: '100%',
  background: 'linear-gradient(90deg, #59EECA 0%, #59D3EE 100%)',
  borderRadius: '14px !important',
  padding: '13px 0',

  '& span': {
    lineHeight: '22px',
    fontWeight: 800,
    fontSize: '14px',
    color: '#151D2E',
  },

  '&:disabled': {
    pointerEvents: 'all !important',
    cursor: 'not-allowed !important',
    boxShadow: 'none !important',
    opacity: 0.5,
  },

  '&:hover': {
    boxShadow: '0px 5px 30px 0px #5ECEFE7D',
    background: 'linear-gradient(90deg, #59EECA 0%, #59D3EE 100%)',
  },
}));

export default GreenGradientButton;
