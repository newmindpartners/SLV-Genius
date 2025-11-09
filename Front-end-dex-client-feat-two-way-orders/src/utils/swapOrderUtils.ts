import {
  BestAvailableSwapOrderResults,
  FillSwapOrder,
  SwapOrder,
  SwapOrderStatus,
} from '~/redux/api';
import { isEqual, isGreater } from '~/utils/mathUtils';

export const PRICE_DECIMALS = 8;

export const numberRegex = (decimalPrecision: number): RegExp => {
  // Match leading zeroes (more than one zero before any digit or dot)
  const matchLeadingZeroes = '^(0{2,})';

  // Match everything that is not a digit
  const matchDot = '^[^0-9]*';

  // Match if the first digit is a dot which also breaks the app
  const matchDecimals = `(?<=\\.[0-9]{${decimalPrecision}}).+`;

  // Match all the digits after the 6th one that come after the dot
  const matchDotsAfterFirst = '(?<=(.*\\..*))\\.';

  // Match everything that is not a digit or a dot
  const matchInvalidCharacters = '[^0-9.]';

  // Regex that doesn't allow inputs with more than a single dot, 6 decimals, leading zeroes, and zeroes before a digit
  const inputRegexString = `${matchLeadingZeroes}|${matchDot}|${matchDecimals}|${matchDotsAfterFirst}|${matchInvalidCharacters}`;
  const defaultRegex = new RegExp(inputRegexString, 'g');
  return defaultRegex;
};

export const clearStringNumericInput = (
  inputValue: string,
  decimalPrecision = PRICE_DECIMALS,
) => {
  const clearedInputValue = inputValue.replace(numberRegex(decimalPrecision), '');
  return clearedInputValue;
};

const orderStatusesToStatusType: Record<SwapOrderStatus, OrderClientStatus> = {
  OPEN: 'success',
  OPEN_ONCHAIN: 'success',
  OPEN_INIT: 'warning',
  OPEN_SUBMIT: 'warning',
  FILLED: 'info',
  FILL_ONCHAIN: 'success',
  FILL_INIT: 'info',
  FILL_SUBMIT: 'info',
  PENDING: 'default',
  CANCELLED: 'error',
  EXPIRED: 'error',
  SCHEDULED: 'default',
  FAILED: 'error',
};

export const orderStatusesToStatusLabel: Record<SwapOrderStatus, string> = {
  OPEN: 'Open',
  OPEN_ONCHAIN: 'Open',
  OPEN_INIT: 'Open (Pending)',
  OPEN_SUBMIT: 'Open (Pending)',
  FILLED: 'Filled',
  FILL_ONCHAIN: 'Filled',
  FILL_INIT: 'Fill (Pending)',
  FILL_SUBMIT: 'Fill (Pending)',
  CANCELLED: 'Cancelled',
  PENDING: 'Pending',
  FAILED: 'Failed',
  SCHEDULED: 'Scheduled',
  EXPIRED: 'Expired',
};

export const getOrderStatusLabel = (order: SwapOrder): string => {
  const { fromAssetAmount, fromAssetAmountFilled } = order;
  const isFullFilled =
    isEqual(fromAssetAmountFilled, fromAssetAmount) ||
    isGreater(fromAssetAmountFilled, fromAssetAmount);
  const isPartiallyFilled = isGreater(fromAssetAmountFilled, '0') && !isFullFilled;

  const { status } = order;
  const statusLabel =
    ('OPEN' === status
      ? isFullFilled
        ? 'Filled'
        : isPartiallyFilled
        ? 'Partially Filled'
        : null
      : null) ||
    orderStatusesToStatusLabel[`${status}`] ||
    status;
  return statusLabel;
};

export type OrderClientStatus = 'default' | 'success' | 'error' | 'info' | 'warning';

export const getOrderStatusIconType = (order: SwapOrder) => {
  const status = orderStatusesToStatusType[order.status] || 'default';
  return status;
};

// The input should not have more that 14 digits for the positive part and respect the decimal precision
// 14 has been chosen because using HOKSY as a example for coins with huge circulation supply
// 999.999.999.999 HOSKY has an approximate valuation of $1400
const INPUT_MAX_DIGITS = 14;

export const isValidInput = (
  value: string,
  decimalPrecision = PRICE_DECIMALS,
): boolean => {
  // Check if the input matches the expected pattern and respects the decimal precision
  const validMatch = value.match(numberRegex(decimalPrecision));

  if (!validMatch) return false;

  const [wholePart] = value.split('.');
  return wholePart.length <= INPUT_MAX_DIGITS;
};

export const isAssetADA = (tradingAssetShortName: string) =>
  tradingAssetShortName === 'ADA';

export const bestAvailableResultToFillSwapOrders = (
  orders: BestAvailableSwapOrderResults,
): FillSwapOrder[] | null => {
  const marketOrderSwaps = orders.marketOrderSwapResults?.marketOrderSwaps;

  if (marketOrderSwaps) {
    const fillSwapOrders = marketOrderSwaps.map((order) => ({
      toAssetAmount: order.marketOrderSwapFillAmount,
      orderReference: {
        orderId: order.marketOrderSwap.orderId,
      },
    }));

    return fillSwapOrders;
  } else {
    return null;
  }
};
