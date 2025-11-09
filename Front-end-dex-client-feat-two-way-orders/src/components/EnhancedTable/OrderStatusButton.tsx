import { Button, styled, Typography } from '@mui/material';
import { FC, useCallback } from 'react';

type OrderStatusButtonProps = {
  value: string;
  isActive: boolean;

  onClick: (value: string) => void;
};

const OrderStatusButton: FC<OrderStatusButtonProps> = ({
  value,
  isActive,

  onClick,
}) => {
  const handleClick = useCallback(() => {
    onClick(value);
  }, [value, onClick]);

  return (
    <Wrapper active={isActive} size={'small'} variant="contained" onClick={handleClick}>
      <Typography variant="statusCard" fontFamily="secondaryFont" fontWeight="500">
        {value}
      </Typography>
    </Wrapper>
  );
};

const Wrapper = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  backgroundColor: 'transparent',
  border: `1px solid transparent`,
  borderRadius: theme.borderRadius.xs,
  boxShadow: 'none',
  padding: '5px 10px',
  margin: '0 3px',
  minWidth: '40px',
  textTransform: 'capitalize',

  '&:hover': {
    backgroundColor: '#4C54F5',
    border: `1px solid #4C54F5`,
    color: theme.palette.textColor.light,
    boxShadow: 'none',
  },

  ...(active
    ? {
        backgroundColor: '#4C54F5',

        '& > .MuiTypography-root': {
          fontWeight: '700',
        },
      }
    : {}),
}));

export default OrderStatusButton;
