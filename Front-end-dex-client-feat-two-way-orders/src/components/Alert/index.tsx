import { AlertColor, AlertProps, Alert as MUIAlert, styled, Theme } from '@mui/material';
import { CSSProperties } from 'react';

const Alert = ({ children, ...props }: AlertProps) => {
  return <StyledAlert {...props}>{children}</StyledAlert>;
};

const StyledAlert = styled(MUIAlert)(({ theme, severity }) => ({
  ...getCustomSize(theme)[severity || 'error'],
}));

const getCustomSize = (theme: Theme): Record<AlertColor, CSSProperties> => ({
  success: {},
  info: {},
  error: {
    backgroundColor: theme.palette.chip.error.backgroundColor,
    color: theme.palette.chip.error.color,
    borderRadius: '10px',
  },
  warning: {
    backgroundColor: theme.palette.chip.warning.backgroundColor,
    color: theme.palette.chip.warning.color,
    borderRadius: '10px',
  },
});

export default Alert;
