import {
  LoadingButton as MuiButton,
  LoadingButtonProps as MuiButtonProps,
} from '@mui/lab';
import { CSSObject, styled, Theme } from '@mui/material';

export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large';

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'gradient'
  | 'transparent'
  | 'common'
  | 'default'
  | 'error';

export interface CustomButtonProps {
  size?: ButtonSize;
  color?: ButtonColor;
  loading?: boolean;
}

export type ButtonProps = Omit<MuiButtonProps, 'color' | 'size'> & CustomButtonProps;

export interface ButtonWrapperProps {
  $color: ButtonColor;
  $size: ButtonSize;
}

export const Button = ({
  children,
  size = 'medium',
  color = 'primary',
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <Button.Wrapper {...props} $color={color} $size={size} onClick={onClick}>
      {children}
    </Button.Wrapper>
  );
};

Button.Wrapper = styled(MuiButton)<ButtonWrapperProps>(
  ({ theme, $color, $size, loading }) => ({
    ...getCustomSize(theme)[$size],
    ...getCustomColor(theme, loading)[$color],
    textTransform: 'none',
    fontFamily: theme.typography.secondaryFont,
  }),
);

const getCustomColor = (
  theme: Theme,
  loading?: boolean,
): Record<ButtonColor, CSSObject> => ({
  primary: {
    border: 'none',
    background: theme.palette.primary.main,

    '&:hover': {
      background: theme.palette.primary.main,
      boxShadow: `0 0px 10px ${theme.palette.primary.main}`,
    },

    '&:disabled': {
      color: theme.palette.social.main,
      backgroundColor: theme.palette.soldOutColorStatus.main,

      '&:hover': {
        backgroundColor: theme.palette.soldOutColorStatus.main,
        boxShadow: `0 0px 10px ${theme.palette.soldOutColorStatus.main}`,
      },
    },
  },
  secondary: {
    border: 'none',
    background: theme.palette.bgCardRoundColor.main,
    '&:hover': {
      background: theme.palette.bgCardRoundColor.main,
      boxShadow: `0 0px 10px ${theme.palette.bgCardRoundColor.main}`,
    },
    '&:disabled': {
      color: theme.palette.social.main,
      backgroundColor: theme.palette.soldOutColorStatus.main,

      '&:hover': {
        backgroundColor: theme.palette.soldOutColorStatus.main,
        boxShadow: `0 0px 10px ${theme.palette.soldOutColorStatus.main}`,
      },
    },
  },
  gradient: {
    border: 'none',
    color: theme.palette.bgPrimaryGradient.contrastText,
    background: theme.palette.bgPrimaryGradient.gradient,
    '&:hover': {
      boxShadow: `0 0px 10px ${theme.palette.bgPrimaryGradient.main}`,
    },
    '&:disabled': {
      color: theme.palette.social.main,
      background: theme.palette.soldOutColorStatus.main,

      '&:hover': {
        backgroundColor: theme.palette.soldOutColorStatus.main,
        boxShadow: `0 0px 10px ${theme.palette.soldOutColorStatus.main}`,
      },
    },
  },
  transparent: {
    border: `1px solid ${theme.palette.bgCardRoundColor.main}`,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&:disabled': {
      color: !loading && theme.palette.social.main,

      '&:hover': {
        backgroundColor: theme.palette.soldOutColorStatus.main,
        boxShadow: `0 0px 10px ${theme.palette.soldOutColorStatus.main}`,
      },
    },
  },
  common: {
    border: `1px solid ${theme.palette.action.disabled}`,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&:disabled': {
      color: theme.palette.social.main,
      backgroundColor: theme.palette.soldOutColorStatus.main,

      '&:hover': {
        backgroundColor: theme.palette.soldOutColorStatus.main,
        boxShadow: `0 0px 10px ${theme.palette.soldOutColorStatus.main}`,
      },
    },
  },
  default: {
    border: 'none',
    color: theme.palette.textColor.main,
    backgroundColor: theme.palette.bgCardGray.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0 0px 10px ${theme.palette.bgCardGray.main}`,
    },
    '&:disabled': {
      color: theme.palette.social.main,
      backgroundColor: theme.palette.soldOutColorStatus.main,

      '&:hover': {
        backgroundColor: theme.palette.soldOutColorStatus.main,
        boxShadow: `0 0px 10px ${theme.palette.soldOutColorStatus.main}`,
      },
    },
  },
  error: {
    border: 'none',
    color: theme.palette.textColor.main,
    backgroundColor: theme.palette.chip.error.color,
    '&:hover': {
      backgroundColor: theme.palette.chip.error.color,
      boxShadow: `0 0px 10px ${theme.palette.bgCardGray.main}`,
    },
  },
});

const getCustomSize = (theme: Theme): Record<ButtonSize, CSSObject> => ({
  large: {
    padding: '23.5px 33px',
    borderRadius: theme.borderRadius.md,
    [theme.breakpoints.down(1200)]: {
      padding: '20px 30px',
    },
    [theme.breakpoints.down(1100)]: {
      borderRadius: theme.borderRadius.sm,
      padding: '15px 25px',
    },
  },
  medium: {
    padding: '15px 21px',
    borderRadius: theme.borderRadius.sm,
    position: 'relative',
    [theme.breakpoints.down(800)]: {
      padding: '12px 18px',
    },
  },
  small: {
    padding: '10px 14px',
    borderRadius: theme.borderRadius.xs,
    fontSize: '13px',
    lineHeight: '16px',
    fontWeight: 700,
  },
  xsmall: {
    padding: '6px 7px',
    borderRadius: theme.borderRadius.xs,
    width: 'fit-content',
  },
});

export default Button;
