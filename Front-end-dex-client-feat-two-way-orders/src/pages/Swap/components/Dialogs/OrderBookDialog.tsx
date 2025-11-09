import { Grid, styled } from '@mui/material';
import { FC } from 'react';
import BlurryDialog from '~/components/Dialogs/Dialog/BlurryDialog';
import { useTradingPairs } from '~/context/tradingPairsContext';
import { useGetOrderBookByAssets } from '~/hooks/swap/order-book/useGetOrderBookByAssets';
import OrderBookCard from '~/pages/Swap/components/OrderBook/OrderBookCard';
import { DEFAULT_POLLING_INTERVAL } from '~/pages/Swap/SwapPageContent';
import { getTradingPairString } from '~/utils/tradingPairsUtils';

export type OrderBookDialogProps = {
  onClose: () => void;
  open?: boolean;
};

const OrderBookDialog: FC<OrderBookDialogProps> = ({ onClose }) => {
  const { selectedTradingPair } = useTradingPairs();

  const orderBookAssets = {
    amountAsset: selectedTradingPair?.baseAsset || null,
    priceAsset: selectedTradingPair?.quoteAsset || null,
  };

  const tradingPairString = selectedTradingPair
    ? getTradingPairString(selectedTradingPair)
    : null;

  const orderBook = useGetOrderBookByAssets({
    skip: !tradingPairString,
    tradingPairString: tradingPairString || '',
    pollingInterval: DEFAULT_POLLING_INTERVAL,
  });

  return (
    <BlurryDialog
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          padding: '0 !important',
        },
      }}
    >
      <Wrapper>
        <OrderBookCard
          data={orderBook.data}
          isLoadingWithArgsUpdated={orderBook.isLoadingWithArgsUpdated}
          orderBookAssets={orderBookAssets}
          handleCloseOrderBook={onClose}
        />
      </Wrapper>
    </BlurryDialog>
  );
};

const Wrapper = styled(Grid)({
  '& > div': {
    width: '100%',
    background: '#22273D',

    th: {
      background: '#22273D',
    },
  },
});

export default OrderBookDialog;
