import { useCallback, useContext, useEffect, useState } from 'react';
import { FiatPriceContext } from '~/context/fiatPriceContext';
import { useTradingPairs } from '~/context/tradingPairsContext';
import { useGetOrderBookByAssets } from '~/hooks/swap/order-book/useGetOrderBookByAssets';
import { div, isEqual, round, times, trimTrailingZeros } from '~/utils/mathUtils';
import { isAssetADA } from '~/utils/swapOrderUtils';
import {
  getTradingPairString,
  TradingPairAmounts,
  TradingPairAssets,
} from '~/utils/tradingPairsUtils';
import { ADA_ASSET_ID } from '~/utils/wallet';

export const initialOrderPairAmountsState: TradingPairAmounts = { from: '', to: '' };

const useSwapTradingAmounts = (): {
  tradingPairAmounts: TradingPairAmounts;
  alternativeTradingPairAmounts: TradingPairAmounts;
  fiatAmounts: TradingPairAmounts;
  resetAmounts: () => void;
  price: string | null;
  setPrice: (price: string | null) => void;

  setTradingPairAmounts: (amounts: TradingPairAmounts) => void;
  setAlternativeTradingPairAmounts: (amounts: TradingPairAmounts) => void;
} => {
  const [tradingPairAmounts, _setTradingPairAmounts] = useState(
    initialOrderPairAmountsState,
  );
  const setTradingPairAmounts = useCallback(
    (amounts: TradingPairAmounts) => {
      /**
       * Because alternative trading pair amounts are only relevant as a result
       * of changing the trading pair amounts, rather than using an effect or
       * making sure that the alternative trading pair amounts are reset every time
       * we reset the trading pair amounts, we simply reset the alternative trading pair
       * amounts every time we set the trading pair amounts.
       */
      setAlternativeTradingPairAmounts(initialOrderPairAmountsState);
      _setTradingPairAmounts(amounts);
    },
    [_setTradingPairAmounts],
  );
  const [alternativeTradingPairAmounts, setAlternativeTradingPairAmounts] = useState(
    initialOrderPairAmountsState,
  );
  const [priceUSDAmount, setPriceUSDAmount] = useState<TradingPairAmounts>({
    from: '',
    to: '',
  });
  const [price, setPrice] = useState<string | null>(null);

  const { selectedAssets, selectedTradingPair } = useTradingPairs();

  const adaFiatPrice = useContext(FiatPriceContext);

  const tradingPairString = selectedTradingPair
    ? getTradingPairString(selectedTradingPair)
    : null;

  const otherTokenMarketPriceInADA = useGetOrderBookByAssets({
    skip: !tradingPairString,
    tradingPairString: tradingPairString || '',
  }).data?.marketPrice;

  const resetAmounts = useCallback(() => {
    setTradingPairAmounts(initialOrderPairAmountsState);
  }, []);

  useEffect(() => {
    const { from: fromAsset, to: toAsset } = selectedAssets;
    const { from: fromAmount, to: toAmount } = tradingPairAmounts;

    // check if `adaPriceInUsd` is non-null before trying to calculate token prices
    const adaPriceInUsd =
      adaFiatPrice.base &&
      isAssetADA(adaFiatPrice.base) &&
      adaFiatPrice.currency === 'USD'
        ? adaFiatPrice.amount
        : null;
    const otherTokenPrice = otherTokenMarketPriceInADA;

    if (!fromAmount || !toAmount || !otherTokenPrice || !fromAsset || !toAsset) {
      return;
    }

    if (
      !isADAInTradingPair(selectedAssets) ||
      (otherTokenPrice && isEqual(otherTokenPrice, '0'))
    ) {
      setPriceUSDAmount({ from: '', to: '' });
    } else if (fromAsset?.assetId === ADA_ASSET_ID && toAsset) {
      setPriceUSDAmount(
        determineUSDAmountForADAFrom(
          adaPriceInUsd,
          otherTokenPrice,
          fromAmount,
          toAmount,
        ),
      );
    } else {
      setPriceUSDAmount(
        determineUSDAmountForOtherTokenFrom(
          adaPriceInUsd,
          otherTokenPrice,
          fromAmount,
          toAmount,
        ),
      );
    }
  }, [selectedAssets, adaFiatPrice.amount, tradingPairAmounts]);

  const fiatAmounts: TradingPairAmounts = {
    from: priceUSDAmount.from || '',
    to: priceUSDAmount.to || '',
  };

  return {
    fiatAmounts,
    tradingPairAmounts,
    setTradingPairAmounts,
    alternativeTradingPairAmounts,
    setAlternativeTradingPairAmounts,
    price,
    setPrice,
    resetAmounts,
  };
};

const calculateTokenPrice = (
  adaPrice: string,
  conversionRate: string,
  isConvertingFromADA: boolean,
): string => {
  // If we're converting from ADA to another token, we multiply
  // If we're converting another token to ADA, we divide
  return isConvertingFromADA
    ? times(adaPrice, conversionRate)
    : div(adaPrice, conversionRate);
};

const formatUSD = (value: string): string => {
  const formattedValue = `$${trimTrailingZeros(round(value, 2))}`;
  return formattedValue;
};

const determineUSDAmountForADAFrom = (
  adaPrice: string | null,
  otherTokenPrice: string,
  fromAmount: string,
  toAmount: string,
): TradingPairAmounts => ({
  from: adaPrice ? formatUSD(times(fromAmount, adaPrice)) : null,
  to: adaPrice ? formatUSD(times(toAmount, div(adaPrice, otherTokenPrice))) : null,
});

const determineUSDAmountForOtherTokenFrom = (
  adaPrice: string | null,
  otherTokenPrice: string,
  fromAmount: string,
  toAmount: string,
): TradingPairAmounts => ({
  from: adaPrice
    ? formatUSD(times(fromAmount, calculateTokenPrice(adaPrice, otherTokenPrice, false)))
    : null,
  to: adaPrice ? formatUSD(times(toAmount, adaPrice)) : null,
});

const isADAInTradingPair = (tp: TradingPairAssets): boolean => {
  if (!tp.from || !tp.to) {
    return false;
  }

  return tp.from.assetId === ADA_ASSET_ID || tp.to.assetId === ADA_ASSET_ID;
};

export default useSwapTradingAmounts;
