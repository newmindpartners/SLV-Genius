import { Grid, styled } from '@mui/material';
import { FC } from 'react';
import OrderBookHeader from '~/pages/Swap/components/OrderBook/OrderBookHeader';
import OrderBookSkeleton from '~/pages/Swap/components/OrderBook/OrderBookSkeleton';
import { Asset, OrderBook } from '~/redux/api';

import OrderBookCardContent from './OrderBookCardContent';

export type OrderBookAssets = {
  amountAsset: Asset | null;
  priceAsset: Asset | null;
};

export type OrderBookCardProps = {
  data: OrderBook | undefined;
  isLoadingWithArgsUpdated: boolean;
  orderBookAssets: OrderBookAssets;
  handleCloseOrderBook: () => void;
};

const OrderBookCard: FC<OrderBookCardProps> = ({
  data,
  orderBookAssets,
  isLoadingWithArgsUpdated,
  handleCloseOrderBook,
}) => {
  const askOrderBookEntries = (data?.askOrderBookEntries || [])?.toReversed();
  const bidOrderBookEntries = data?.bidOrderBookEntries || [];

  const isOrderBookLoading = isLoadingWithArgsUpdated;
  const marketPrice = data?.marketPrice;

  return (
    <Wrapper>
      <OrderBookHeader handleCloseOrderBook={handleCloseOrderBook} />
      {isOrderBookLoading ? (
        <OrderBookSkeleton />
      ) : (
        <OrderBookCardContent
          orderBookAssets={orderBookAssets}
          askEntries={askOrderBookEntries}
          bidEntries={bidOrderBookEntries}
          marketPrice={marketPrice}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled(Grid)(({ theme }) => ({
  padding: '20px',
  background: '#171D2D',
  borderRadius: theme.borderRadius.md,
  width: '400px',
  height: '100%',
  paddingBottom: '0',
}));

export default OrderBookCard;
