import { CircularProgress, Grid, styled, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import TextField from '~/components/TextField/TextField';
import { OrderCardOrderType } from '~/context/advancedSettingsContext';
import { useTradingPairs } from '~/context/tradingPairsContext';
import { Asset } from '~/redux/api';
import { round, trimLeadingZeros, trimTrailingZeros } from '~/utils/mathUtils';
import { PRICE_DECIMALS } from '~/utils/swapOrderUtils';
import {
  getTradingPairPrice,
  TradingPairAmounts,
  TradingPairAssets,
} from '~/utils/tradingPairsUtils';

type OrderCardPriceProps = {
  tradingPairAmounts: TradingPairAmounts;
  price: string | null;
  priceAsset: Asset | null;
  isDisabled: boolean;
  isLoading: boolean;
  selectedAssets: TradingPairAssets;
  orderType: OrderCardOrderType;

  handleChangePriceExternally: (e: ChangeEvent<HTMLInputElement>) => void;
};

const OrderCardPrice = ({
  tradingPairAmounts,
  priceAsset,
  isDisabled,
  isLoading,
  orderType,
  selectedAssets,
  handleChangePriceExternally,
}: OrderCardPriceProps) => {
  const { selectedTradingPair } = useTradingPairs();
  const isBestAvailable = orderType === 'bestAvailable';

  const quotePrice = getTradingPairPrice(
    selectedAssets.from,
    selectedAssets.to,

    tradingPairAmounts.from,
    tradingPairAmounts.to,

    selectedTradingPair,
  );

  const displayPrice = getDisplayPrice(quotePrice);

  return (
    <PriceContainer isBestAvailable={isBestAvailable} aria-disabled={isDisabled}>
      <Typography
        color="gray.light"
        fontSize="14px"
        fontWeight="500"
        lineHeight="22px"
        minWidth="max-content"
        noWrap
      >
        {'Price:'}
      </Typography>

      <Price>
        {isLoading ? (
          <CircularProgress color="primary" size={16} sx={{ marginRight: '10px' }} />
        ) : (
          <TextField
            value={displayPrice}
            onChange={handleChangePriceExternally}
            disabled={!selectedAssets.from || isDisabled}
          />
        )}
        <Typography
          fontWeight="500"
          fontSize="12px"
          lineHeight="15px"
          color="#ABB4D1"
          width="min-content"
        >
          {priceAsset?.shortName}
        </Typography>
      </Price>
    </PriceContainer>
  );
};

/**
 * This function handles a myriad of edge cases for displaying a valid price
 * to be put in the input field.
 */
const getDisplayPrice = (price: string | null): string => {
  if (price === null) {
    return '';
  }

  if (price === '0') {
    return price;
  }

  if (price.includes('.')) {
    const decimals = price.split('.')[1];

    if (decimals.length > PRICE_DECIMALS) {
      return trimTrailingZeros(round(price, PRICE_DECIMALS));
    } else {
      return price;
    }
  } else {
    if (price.startsWith('0')) {
      return trimLeadingZeros(price);
    } else if (price.length > PRICE_DECIMALS) {
      return trimTrailingZeros(round(price, PRICE_DECIMALS));
    } else {
      return price;
    }
  }
};

const PriceContainer = styled('label', {
  shouldForwardProp: (prop) => prop !== 'isBestAvailable',
})<{ isBestAvailable: boolean }>(({ isBestAvailable, theme }) => ({
  backgroundColor: isBestAvailable
    ? '#2C324F'
    : theme.palette.bgPrimaryGradient.contrastText,

  padding: '12px 14px',
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: '12px',
  marginTop: '16px',
  position: 'relative',
  border: `1px solid transparent`,

  '& .MuiInputBase-root': {
    backgroundColor: isBestAvailable
      ? '#2C324F !important'
      : theme.palette.bgPrimaryGradient.contrastText,

    input: {
      color: isBestAvailable ? '#ABB4D1' : theme.palette.textColor.main,
      backgroundColor: isBestAvailable
        ? '#2C324F'
        : theme.palette.bgPrimaryGradient.contrastText,
    },
  },

  '&:hover': {
    border: `1px solid #4C54F5`,
  },

  '&:focus-within': {
    border: `1px solid #4C54F5`,
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    lineHeight: '20px',
  },

  '&[aria-disabled="true"]': {
    '&:hover': {
      border: `1px solid transparent`,
    },
  },
}));

const Price = styled(Grid)(({ theme }) => ({
  display: 'flex',
  columnGap: '14px',
  alignItems: 'center',
  height: '22px',

  '.MuiInputBase-root': {
    borderRadius: '0',
    width: 'max-content',

    fieldset: {
      border: 'none',
    },

    input: {
      fontWeight: '500',
      fontSize: '16px',
      lineHeight: '22px',
      padding: '0',
      height: 'auto',
      width: 'auto',
      border: 'none',
      marginRight: '2px',
      textAlign: 'right',

      '&:focus + label': {
        borderColor: theme.palette.primary.dark,
      },
    },
  },
}));

export default OrderCardPrice;
