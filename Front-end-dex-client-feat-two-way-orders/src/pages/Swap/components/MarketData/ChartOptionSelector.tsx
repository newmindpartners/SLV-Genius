import { styled, Typography } from '@mui/material';
import { FC } from 'react';
import IconButton from '~/components/Button/IconButton';

import { ChartType, TimeInterval } from './utils';

type ChartOptionSelectorProps = {
  isActive: boolean;
  selector: ChartType | TimeInterval;

  onClick: (option: ChartType | TimeInterval) => void;
};

const ChartOptionSelector: FC<ChartOptionSelectorProps> = ({
  selector,
  isActive,
  onClick,
}) => (
  <ChartOptionSelectorWrapper
    isActive={isActive}
    size="medium"
    onClick={() => onClick(selector)}
    disableRipple
  >
    <Typography
      variant="statusCard"
      align="left"
      color={isActive ? 'textColor.dark' : 'buttonsInactive.dark'}
      fontWeight="500"
      lineHeight="16px"
      fontSize="12px"
    >
      {selector}
    </Typography>
  </ChartOptionSelectorWrapper>
);

const ChartOptionSelectorWrapper = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  backgroundColor: isActive ? '#4C54F5' : 'transparent',
  border: '1px solid transparent',
  borderRadius: '8px',
  width: 'fit-content',
  minWidth: '38px',
  padding: '0 10px',
  height: '30px',

  '&:hover': {
    backgroundColor: '#4C54F5',
    border: `1px solid #4C54F5`,
    color: theme.palette.textColor.light,
    boxShadow: 'none',
  },

  '&:disabled': {
    backgroundColor: 'transparent',
  },

  '& > .MuiTypography-root': {
    color: isActive ? theme.palette.textColor.main : undefined,
  },
}));

export default ChartOptionSelector;
