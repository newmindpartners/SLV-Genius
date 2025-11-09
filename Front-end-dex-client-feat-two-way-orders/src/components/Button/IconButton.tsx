import {
  IconButton as MuiIconButton,
  IconButtonProps as MUIIconButtonProps,
  Theme,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FC } from 'react';

export interface CustomButtonProps {
  children: React.ReactElement;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'transparent';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export type IconButtonProps = Omit<MUIIconButtonProps, 'color' | 'size'> &
  CustomButtonProps;

const IconButton: FC<IconButtonProps> = ({
  children,
  size = 'small',
  color = 'primary',
  onClick,
  ...props
}) => {
  const theme = useTheme();

  const ButtonStyled = styled(MuiIconButton)(() => ({
    padding: 0,
    ...getCustomSize(theme)[size],
    ...getCustomColor(theme)[color],
  }));
  return (
    <ButtonStyled {...props} onClick={onClick}>
      {children}
    </ButtonStyled>
  );
};

const getCustomColor = (theme: Theme) => ({
  transparent: {
    backgroundColor: 'transparent',
    '&: hover': {
      backgroundColor: 'transparent',
    },
    '& svg': {
      fill: theme.palette.buttonsInactive.main,
    },
  },
  secondary: {
    border: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: 'transparent',
    '&: hover': {
      backgroundColor: 'transparent',
    },
    '& svg': {
      fill: theme.palette.primary.main,
    },
  },
  primary: {
    border: 'none',
    backgroundColor: theme.palette.bgCardRoundColor.main,
    '&: hover': {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0 0px 10px ${theme.palette.primary.main}`,
    },
    '& svg': {
      fill: theme.palette.buttonsInactive.main,

      '&:hover': {
        fill: theme.palette.textColor.main,
      },
    },
  },
});

const getCustomSize = (theme: Theme) => ({
  large: {
    height: '47px',
    width: '47px',
    borderRadius: theme.borderRadius.lg,
    '&:hover': {
      background: theme.palette.primary.main,
    },
  },
  medium: {
    height: '34px',
    width: '34px',
    borderRadius: theme.borderRadius.xs,
    '&:hover': {
      background: theme.palette.primary.main,
    },
  },
  small: {
    padding: '4px',
    height: '27px',
    width: '27px',
    borderRadius: theme.borderRadius.xs,
  },
});

export default IconButton;
