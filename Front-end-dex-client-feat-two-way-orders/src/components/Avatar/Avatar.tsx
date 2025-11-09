import { Theme } from '@mui/material';
import { Avatar as MuiAvatar, AvatarProps as MUIAvatarProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

export interface CustomAvatarProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'square' | 'rounded' | 'circle';
  src: string;
}

export type AvatarProps = Omit<MUIAvatarProps, 'size' | 'variant'> & CustomAvatarProps;

const Avatar: FC<AvatarProps> = ({
  size = 'small',
  variant = 'rounded',
  src,
  ...props
}) => {
  const AvatarStyled = styled(MuiAvatar)(({ theme }) => ({
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    ...sizes[size],
    ...getVariants(theme)[variant],
  }));

  return <AvatarStyled {...props} src={src} />;
};

const small = 78;
const medium = 143;
const large = 150;

const sizes = {
  small: {
    width: small,
    height: small,
  },
  medium: {
    width: medium,
    height: medium,
  },
  large: {
    width: large,
    height: large,
  },
};

const getVariants = (theme: Theme) => ({
  square: {
    borderRadius: 0,
  },
  rounded: {
    borderRadius: theme.borderRadius.md,
  },
  circle: {
    borderRadius: theme.borderRadius.xl,
  },
});

export default Avatar;
