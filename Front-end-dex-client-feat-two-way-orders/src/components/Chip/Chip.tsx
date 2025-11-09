import MuiChip, { ChipProps as MuiChipProps } from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

import DotSvg from '../Icons/DotSvg';

export interface CustomChipProps {
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'default' | 'filled';
  hideIcon?: boolean;
}

export type ChipProps = Omit<MuiChipProps, 'variant' | 'color'> & CustomChipProps;

const Chip: FC<ChipProps> = ({
  type = 'default',
  variant = 'filled',
  icon = <DotSvg type={type} />,
  hideIcon,
  ...props
}) => {
  const StyledChip = styled(MuiChip)(({ theme }) => {
    return {
      ...theme.palette.chip[type],
      ...(variant === 'default' && { background: 'none' }),
      paddingLeft: !hideIcon ? '5px' : undefined,
      '&:hover': {
        backgroundColor: theme.palette.chip[type].backgroundColor,
      },
    };
  });

  return <StyledChip icon={!hideIcon ? icon : undefined} {...props} />;
};

export default Chip;
