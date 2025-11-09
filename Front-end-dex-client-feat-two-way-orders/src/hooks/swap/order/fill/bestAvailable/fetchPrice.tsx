import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import {
  BestAvailableSwapOrderResults,
  FindBestAvailableSwapOrdersApiArg,
  useLazyFindBestAvailableSwapOrdersQuery,
} from '~/redux/api';
import { parseApiErrorToMessage } from '~/utils/errorHandlingUtils';
import { unitToIndivisible } from '~/utils/mathUtils';
import { TradingPairAmounts, TradingPairAssets } from '~/utils/tradingPairsUtils';

const FETCH_BEST_AVAILABLE_PRICE_DEBOUNCE_MS = 300;

type UseSwapBestAvailableOrderFetchPriceArgs = {
  tradingPairAmounts: TradingPairAmounts;
  selectedAssets: TradingPairAssets;
  onSuccess: (data: BestAvailableSwapOrderResults) => void;
  onFail: (error: string) => void;
};

const useSwapBestAvailableOrderFetchPrice = ({
  tradingPairAmounts,
  selectedAssets,
  onSuccess,
  onFail,
}: UseSwapBestAvailableOrderFetchPriceArgs) => {
  const [isPreparingBestAvailableRequest, setIsPreparingBestAvailableRequest] =
    useState(false);

  const [fetchBestAvailablePrice, bestAvailablePriceResponse] =
    useLazyFindBestAvailableSwapOrdersQuery();

  const getDebouncedFetchBestAvailablePrice = useCallback(
    debounce(async (order: FindBestAvailableSwapOrdersApiArg) => {
      fetchBestAvailablePrice(order);
      setIsPreparingBestAvailableRequest(false);
    }, FETCH_BEST_AVAILABLE_PRICE_DEBOUNCE_MS),
    [],
  );

  const isLoadingBestAvailablePrice =
    isPreparingBestAvailableRequest || bestAvailablePriceResponse.isFetching;

  useEffect(() => {
    if (bestAvailablePriceResponse.isError) {
      const errorMessage = parseApiErrorToMessage(bestAvailablePriceResponse.error);
      onFail(errorMessage);
    }
  }, [bestAvailablePriceResponse.isError]);

  useEffect(() => {
    if (bestAvailablePriceResponse.isSuccess && !isLoadingBestAvailablePrice) {
      onSuccess(bestAvailablePriceResponse.data);
    }
  }, [bestAvailablePriceResponse.isSuccess, isLoadingBestAvailablePrice]);

  const getBestAvailablePrice = useCallback((data: FindBestAvailableSwapOrdersApiArg) => {
    if (data.toAssetAmount === '0' || data.fromAssetAmount === '0') {
      return;
    }

    setIsPreparingBestAvailableRequest(true);
    getDebouncedFetchBestAvailablePrice(data);
  }, []);

  useEffect(() => {
    if (selectedAssets?.to && selectedAssets.from && tradingPairAmounts.from) {
      const bestAvailablePricePayload = {
        toAssetId: selectedAssets?.from?.assetId || '',
        fromAssetId: selectedAssets?.to?.assetId || '',
        toAssetAmount: unitToIndivisible(
          tradingPairAmounts.from,
          selectedAssets.from?.decimalPrecision,
        ),
      };

      getBestAvailablePrice(bestAvailablePricePayload);
    }
  }, [
    selectedAssets?.to?.shortName,
    selectedAssets?.from?.shortName,
    tradingPairAmounts.from,
    selectedAssets?.to,
    selectedAssets.from,
    getBestAvailablePrice,
  ]);

  return {
    isLoadingBestAvailablePrice,
    isErrorBestAvailablePrice: bestAvailablePriceResponse.isError,
    bestAvailableSwapOrders: bestAvailablePriceResponse.data,
  };
};

export default useSwapBestAvailableOrderFetchPrice;
