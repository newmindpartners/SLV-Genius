import { Grid, styled, Typography } from '@mui/material';
import { isEqual as isEqualLodash } from 'lodash';
import { FC, memo } from 'react';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { OrderBookEntry } from '~/redux/api';
import { formatMarketPrice } from '~/utils/tradingPairsUtils';

import OrderBookOrdersTable from '../OrderBook/OrderBookOrdersTable';
import { OrderBookAssets } from './OrderBookCard';
import { TradingListType } from './OrderBookOrdersTableRow';

type OrderBookContentProps = {
  orderBookAssets: OrderBookAssets;
  askEntries: OrderBookEntry[];
  bidEntries: OrderBookEntry[];
  marketPrice?: string;
};

const OrderBookCardContent: FC<OrderBookContentProps> = ({
  orderBookAssets,
  askEntries,
  bidEntries,
  marketPrice,
}) => {
  const detailedPrice = marketPrice ? formatMarketPrice(marketPrice).detailed : '-';
  const roundedPrice = marketPrice ? formatMarketPrice(marketPrice).rounded : '-';

  const marketPriceDetailed = `${detailedPrice} ${orderBookAssets.priceAsset?.shortName}`;
  const marketPriceRounded = `${roundedPrice} ${orderBookAssets.priceAsset?.shortName}`;

  const orderBookTooltip = (
    <>
      <b>{marketPriceDetailed}</b> <br />
      Calculated as a volume-weighted average price across last 7 filled orders, inclusive
      of partial fills
    </>
  );

  return (
    <OrderBookWrapper container direction="column" flexWrap="nowrap">
      <ContentWrapper>
        {askEntries?.length ? (
          <OrderBookOrdersTable
            orderBookAssets={orderBookAssets}
            tradingListType={TradingListType.upper}
            orders={askEntries}
          />
        ) : (
          <EmptyMessage>No sell orders to show</EmptyMessage>
        )}

        <PriceWrapper container gap="5px" alignItems="center" justifyContent="center">
          <PriceValue color="textColor.light">{marketPriceRounded}</PriceValue>

          <Tooltip title={orderBookTooltip} placement="right">
            <Grid display="flex" alignContent="center">
              <InfoIcon />
            </Grid>
          </Tooltip>
        </PriceWrapper>

        {bidEntries?.length ? (
          <OrderBookOrdersTable
            orderBookAssets={orderBookAssets}
            tradingListType={TradingListType.lower}
            orders={bidEntries}
          />
        ) : (
          <EmptyMessage>No buy orders to show</EmptyMessage>
        )}
      </ContentWrapper>
    </OrderBookWrapper>
  );
};

const ContentWrapper = styled(Grid)({
  paddingTop: '8px',
  height: '100%',
});

const OrderBookWrapper = styled(Grid)({
  overflow: 'hidden',
  width: '100%',
  height: '100%',
});

const PriceValue = styled(Typography)({
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '28px',
});

const PriceWrapper = styled(Grid)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.borderRadius.sm,
  padding: '6px',
  background: '#293250',
  margin: '12px 0',
}));

const EmptyMessage = styled(Grid)(({ theme }) => ({
  color: theme.palette.textColor.light,
  fontFamily: 'Mulish',
  fontSize: '20px',
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '20px',
  margin: '30px 0',
  width: '100%',
  textAlign: 'center',

  [theme.breakpoints.down('sm')]: {
    margin: '90px 0',
  },
}));

export default memo(OrderBookCardContent, isEqualLodash);
