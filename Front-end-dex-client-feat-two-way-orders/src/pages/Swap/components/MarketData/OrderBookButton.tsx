import { Button, styled, Typography } from '@mui/material';
import { FC } from 'react';
import OrderBookIcon from '~/components/Icons/OrderBookIcon';

export type OrderBookButtonProps = {
  handleOrderBookClick: () => void;
  isOrderBookDisabled: boolean;
};

const OrderBookButton: FC<OrderBookButtonProps> = ({
  handleOrderBookClick,
  isOrderBookDisabled,
}) => (
  <Wrapper onClick={handleOrderBookClick} disabled={isOrderBookDisabled}>
    <Typography
      fontSize="12px"
      fontWeight="600"
      lineHeight="16px"
      letterSpacing="0.6px"
      color="buttonsInactive.light"
    >
      Order Book
    </Typography>
    <OrderBookIcon />
  </Wrapper>
);

const Wrapper = styled(Button)(({ theme }) => ({
  color: theme.palette.buttonsInactive.dark,
  display: 'flex',
  background: 'transparent',
  border: '1px solid #2D3758',
  columnGap: '6px',
  alignItems: 'center',
  cursor: 'pointer',
  textTransform: 'capitalize',
  width: '115px',
  borderRadius: theme.borderRadius.sm,
  padding: '5px 0px',
  marginLeft: 'auto',
  transition: '0.3s',

  '& svg': {
    width: '20px',
    display: 'block',
    marginTop: '0',
    fill: 'currentColor',
    stroke: 'currentColor',
  },

  '&:hover': {
    background: 'transparent',
    opacity: 0.8,
  },

  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'all',
  },
}));

export default OrderBookButton;
