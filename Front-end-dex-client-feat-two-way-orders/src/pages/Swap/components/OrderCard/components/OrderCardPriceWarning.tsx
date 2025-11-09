import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import { FC, useMemo } from 'react';
import Alert from '~/components/Alert';
import { div, isGreater, isLess, minus, plus, round, times } from '~/utils/mathUtils';

const SWAP_ORDER_PRICE_VALID_PERCENTAGE = 0.3;

type OrderCardPriceWarningProps = {
  orderPrice: string;
  marketPrice: string;
};

const OrderCardPriceWarning: FC<OrderCardPriceWarningProps> = ({
  orderPrice,
  marketPrice,
}) => {
  const detailedMarketPrice = marketPrice;

  const marketPriceDeltaDecimal = div(detailedMarketPrice, 100);
  const marketPriceDeltaPercentage = Number(SWAP_ORDER_PRICE_VALID_PERCENTAGE) * 100;
  const marketPriceDelta = times(marketPriceDeltaDecimal, marketPriceDeltaPercentage);

  const minAllowedPrice = minus(detailedMarketPrice, marketPriceDelta);
  const maxAllowedPrice = plus(detailedMarketPrice, marketPriceDelta);

  const isPriceLessThanAllowed = isLess(orderPrice, minAllowedPrice);
  const isPriceGreaterThanAllowed = isGreater(orderPrice, maxAllowedPrice);

  const isPriceDeviated = isPriceLessThanAllowed || isPriceGreaterThanAllowed;

  const priceDifference = useMemo(() => {
    const priceDifference = minus(orderPrice, marketPrice);
    const priceDifferencePercentage = div(priceDifference, marketPrice);
    const priceDifferencePercentageFormatted = round(
      times(priceDifferencePercentage, 100),
      2,
    );

    return priceDifferencePercentageFormatted;
  }, [orderPrice, marketPrice]);

  if (!isGreater(detailedMarketPrice, 0)) return null;

  if (!isPriceDeviated) return null;

  return (
    <Container mt="20px">
      <Alert severity="warning">
        Order price is {priceDifference}% off market price, make sure your inputs are
        correct
      </Alert>
    </Container>
  );
};

const Container = styled(Grid)({
  '& > .MuiPaper-root': {
    display: 'flex',
    alignItems: 'center',
  },
});

export default OrderCardPriceWarning;
