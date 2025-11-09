import { enqueueSnackbar } from 'notistack';
import { FormEvent, useEffect } from 'react';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { useAlertDialog } from '~/context/alertDialog';
import { useSwapOrderPreviewDialog } from '~/context/swapOrderPreviewDialog';
import { useTradingPairs } from '~/context/tradingPairsContext';
import useSwapBestAvailableOrderFetchFee from '~/hooks/swap/order/fill/bestAvailable/fetchFee';
import useSwapTradingAmounts from '~/hooks/swap/trading/useSwapTradingAmounts';
import { useWallet } from '~/hooks/wallet/wallet';
import { BestAvailableSwapOrderResults } from '~/redux/api';
import { TransactionEndpoints } from '~/types/transaction';
import {
  indivisibleToUnit,
  isValidBig,
  round,
  trimTrailingZeros,
} from '~/utils/mathUtils';
import {
  failedRetrievingBestAvailableOrderMessage,
  noBestAvailableOrderFoundMessage,
} from '~/utils/stringUtils';
import { formatBestAvailableOrderFee } from '~/utils/swapOrderFeeUtils';
import { getTradingPairPrice, TradingPairAmounts } from '~/utils/tradingPairsUtils';

import useSwapBestAvailableOrderFetchPrice from './fetchPrice';
import useSwapBestAvailableOrderSubmit from './submit';

const useSwapBestAvailableOrder = () => {
  const { isWalletConnected } = useWallet();
  const { selectedAssets, selectedTradingPair } = useTradingPairs();

  const {
    tradingPairAmounts,
    setTradingPairAmounts,
    alternativeTradingPairAmounts,
    setAlternativeTradingPairAmounts,
    price,
    setPrice,
    resetAmounts,
    fiatAmounts,
  } = useSwapTradingAmounts();

  const onSuccessFetchBestAvailablePrice = (results: BestAvailableSwapOrderResults) => {
    const { marketOrderSwapResults, alternativeMarketOrderSwapResults } = results;

    if (!marketOrderSwapResults && !alternativeMarketOrderSwapResults) {
      enqueueSnackbar(noBestAvailableOrderFoundMessage, {
        variant: 'error',
      });
      return;
    }

    if (!selectedAssets.from || !tradingPairAmounts.from) {
      enqueueSnackbar(failedRetrievingBestAvailableOrderMessage, {
        variant: 'error',
      });
      return;
    }

    if (!selectedAssets.to) {
      enqueueSnackbar(failedRetrievingBestAvailableOrderMessage, {
        variant: 'error',
      });
      return;
    }

    const isBestAvailableResultExpectedAsset =
      selectedAssets.to.assetId ===
        marketOrderSwapResults?.marketOrderFillAmountAssetId ||
      selectedAssets.to.assetId ===
        alternativeMarketOrderSwapResults?.marketOrderFillAmountAssetId;

    if (!isBestAvailableResultExpectedAsset) {
      enqueueSnackbar(failedRetrievingBestAvailableOrderMessage, {
        variant: 'error',
      });
      return;
    }

    const bestAvailablePriceResult =
      marketOrderSwapResults && marketOrderSwapResults.displayUnitPrice;

    const bestAvailablePrice: string | null =
      bestAvailablePriceResult && trimTrailingZeros(round(bestAvailablePriceResult, 8));

    setPrice(bestAvailablePrice);

    const fillAmountResult: string | null =
      marketOrderSwapResults && marketOrderSwapResults.marketOrderSwapTotalFillAmount;

    setTradingPairAmounts({
      from: tradingPairAmounts.from,
      to:
        fillAmountResult &&
        indivisibleToUnit(fillAmountResult, selectedAssets.to.decimalPrecision),
    });

    const alternativeFilledAmount: string | null =
      alternativeMarketOrderSwapResults?.marketOrderSwapFilledAmount ?? null;

    const alternativeTotalFillAmount: string | null =
      alternativeMarketOrderSwapResults?.marketOrderSwapTotalFillAmount ?? null;

    setAlternativeTradingPairAmounts({
      from:
        alternativeFilledAmount &&
        indivisibleToUnit(alternativeFilledAmount, selectedAssets.from.decimalPrecision),
      to:
        alternativeTotalFillAmount &&
        indivisibleToUnit(alternativeTotalFillAmount, selectedAssets.to.decimalPrecision),
    });
  };

  const onFailFetchBestAvailablePrice = (errorMessage: string) => {
    enqueueSnackbar(errorMessage, {
      variant: 'error',
    });
    setPrice('');
    setTradingPairAmounts({
      ...tradingPairAmounts,
      to: '',
    });
  };

  const {
    isLoadingBestAvailablePrice,
    isErrorBestAvailablePrice,
    bestAvailableSwapOrders,
  } = useSwapBestAvailableOrderFetchPrice({
    selectedAssets,
    tradingPairAmounts,
    onSuccess: onSuccessFetchBestAvailablePrice,
    onFail: onFailFetchBestAvailablePrice,
  });

  const { onDialogOpen: openAlertDialog } = useAlertDialog();
  const {
    orderPreviewDialogData,
    onDialogOpen: onOrderPreviewDialogOpen,
    onDialogDataChange: onOrderPreviewDialogDataChange,
    onClose,
  } = useSwapOrderPreviewDialog();

  const { transactionFee, isLoading: isLoadingFee } = useSwapBestAvailableOrderFetchFee({
    tradingPairAmounts,
    selectedAssets,
    isWalletConnected,
    bestAvailableSwapOrders,
  });

  const fee = formatBestAvailableOrderFee(transactionFee, selectedAssets.from?.shortName);

  const priceAsset = selectedTradingPair?.quoteAsset;

  const quotePrice = getTradingPairPrice(
    selectedAssets.from,
    selectedAssets.to,

    tradingPairAmounts.from,
    tradingPairAmounts.to,

    selectedTradingPair,
  );

  const handleSubmitSwapOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onOrderPreviewDialogOpen({
      payload: {
        priceFormatted: `${quotePrice} ${priceAsset?.shortName}`,
        tradingPairAmounts,
        fiatAmounts,
        selectedAssets,
        fee,
        isLoadingFee,
        orderTypeLabel: 'Best Available Order',
        isLoadingSubmission: isLoadingSwapOrderCreation,
        onSubmit: handleSubmit,
      },
      transactionType: TransactionEndpoints.OPEN_SWAP_ORDER,
    });
  };

  const onCreateOrderSuccess = () => {
    openAlertDialog({
      alertType: AlertType.Success,
      title: 'Transaction signing successful!',
      description: 'Order placed. Waiting for confirmation on chain.',
    });
    resetAmounts();
    onClose();
  };

  const { isLoading: isLoadingSwapOrderCreation, handlePlaceOrder } =
    useSwapBestAvailableOrderSubmit({
      onCreateOrderSuccess: onCreateOrderSuccess,
    });

  const handleSubmit = () => {
    if (bestAvailableSwapOrders) {
      handlePlaceOrder({
        selectedAssets,
        tradingPairAmounts,
        swapOrders: bestAvailableSwapOrders,
      });
    } else {
      enqueueSnackbar('Failed to place your order. Try again later', {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    if (orderPreviewDialogData) {
      onOrderPreviewDialogDataChange({
        fee,
        isLoadingFee,
        isLoadingSubmission: isLoadingSwapOrderCreation,
      });
    }
  }, [isLoadingFee, isLoadingSwapOrderCreation]);

  const handleChangeFrom = (from: string) => {
    const isFromValid = isValidBig(from);
    if (price && isFromValid) {
      setTradingPairAmounts({
        from: from,
        to: null,
      });
      setPrice(null);
    } else {
      setTradingPairAmounts({
        from: from,
        to: tradingPairAmounts.to,
      });
    }
  };

  const handleSetTradingPairAmounts = (newTradingPairAmounts: TradingPairAmounts) => {
    setTradingPairAmounts(newTradingPairAmounts);
    setPrice(null);
  };

  const handleChangeTo = () => {
    enqueueSnackbar("You can't edit 'to' value", {
      variant: 'error',
    });
    return;
  };

  const handleChangePrice = () => {
    enqueueSnackbar("You can't edit 'price' value", {
      variant: 'error',
    });
    return;
  };

  return {
    fee: {
      isLoading: isLoadingFee,
      data: fee,
    },
    from: {
      value: tradingPairAmounts.from,
      fiatValue: fiatAmounts.from,
      onChange: handleChangeFrom,
      alternativeValue: alternativeTradingPairAmounts.from,
    },
    to: {
      value:
        isLoadingBestAvailablePrice || isErrorBestAvailablePrice
          ? null
          : tradingPairAmounts.to,
      fiatValue: fiatAmounts.to,
      onChange: handleChangeTo,
      isLoading: isLoadingBestAvailablePrice,
      alternativeValue: alternativeTradingPairAmounts.to,
    },
    price: {
      value: isLoadingBestAvailablePrice || isErrorBestAvailablePrice ? '' : price,
      fiatValue: '',
      onChange: handleChangePrice,
      isLoading: isLoadingBestAvailablePrice,
    },
    handleSubmitOrder: handleSubmitSwapOrder,
    handleSetTradingPairAmounts,
    isWalletConnected,
    selectedAssets,
  };
};

export default useSwapBestAvailableOrder;
