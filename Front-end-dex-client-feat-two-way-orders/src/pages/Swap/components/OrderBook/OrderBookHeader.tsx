import { Grid, styled, Typography } from '@mui/material';
import React, { FC } from 'react';
import Button from '~/components/Button/Button';
import { CloseIcon } from '~/components/Icons/CloseIcon';

type OrderBookHeaderProps = {
  handleCloseOrderBook: () => void;
};

const OrderBookHeader: FC<OrderBookHeaderProps> = ({ handleCloseOrderBook }) => (
  <Wrapper container justifyContent="space-between" alignItems="center">
    <Title>Order Book</Title>
    <CloseButton color="transparent" onClick={handleCloseOrderBook}>
      <CloseIcon />
    </CloseButton>
  </Wrapper>
);

const CloseButton = styled(Button)({
  minWidth: '0',
  border: 'none',
  padding: '5px',
});

const Title = styled(Typography)({
  fontSize: '18px',
  fontWeight: '700',
  lineHeight: '28px',
});

const Wrapper = styled(Grid)({
  width: '100%',
  borderBottom: '1px solid #323F62',
  paddingBottom: '16px',

  'svg path': {
    stroke: '#7787B1',
  },
});

export default OrderBookHeader;
