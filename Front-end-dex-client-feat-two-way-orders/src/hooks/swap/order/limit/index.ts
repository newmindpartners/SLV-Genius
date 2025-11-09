import { FormEvent, useEffect } from 'react';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { AdvancedSettings, useAdvancedSettings } from '~/context/advancedSettingsContext';
import { useAlertDialog } from '~/context/alertDialog';
import { useSwapOrderPreviewDialog } from '~/context/swapOrderPreviewDialog';
import { useTradingPairs } from '~/context/tradingPairsContext';
import { useWallet } from '~/hooks/wallet/wallet';
import { TransactionEndpoints } from '~/types/transaction';
import { div, round, times, trimTrailingZeros } from '~/utils/mathUtils';
import { formatLimitOrderFee } from '~/utils/swapOrderFeeUtils';
import { getTradingPairPrice, TradingAsset, TradingPairAmounts } from '~/utils/tradingPairsUtils';

import useSwapTradingAmounts from '../../trading/useSwapTradingAmounts';
import useSwapLimitOrderFetchFee from './fetchFee';
import useSwapLimitOrderSubmit from './submit';

export const defaultLimitOrderAdvancedSettings: AdvancedSettings = {
  startDate: null,
  endDate: null,
  orderType: 'limit',
};

const useSwapLimitOrder = () => {
  const {
    tradingPairAmounts,
    setTradingPairAmounts,
    price,
    setPrice,
    resetAmounts,
    fiatAmounts,
  } = useSwapTradingAmounts();

  const { isWalletConnected } = useWallet();
  const { selectedAssets, selectedTradingPair, handleSetTradingPairAssets } = useTradingPairs();
  const { advancedSettings, setAdvancedSettings } = useAdvancedSettings();

  const { onDialogOpen: openAlertDialog } = useAlertDialog();
  const {
    orderPreviewDialogData,
    onDialogOpen: onOrderPreviewDialogOpen,
    onDialogDataChange,
    onClose,
  } = useSwapOrderPreviewDialog();

  const { transactionFee, isLoading: isLoadingFee } = useSwapLimitOrderFetchFee({
    selectedAssets,
    tradingPairAmounts,
    isWalletConnected,
  });

  const fee = formatLimitOrderFee(transactionFee, selectedAssets.from);

  const resetAdvancedSettings = () => {
    setAdvancedSettings({ ...defaultLimitOrderAdvancedSettings });
  };

  const priceAsset = selectedTradingPair?.quoteAsset;

  const quotePrice = getTradingPairPrice(
    selectedAssets.from,
    selectedAssets.to,

    tradingPairAmounts.from,
    tradingPairAmounts.to,

    selectedTradingPair,
  );

  const quotePriceFormatted = quotePrice ? round(quotePrice, 8) : '-';

  const handleSubmitSwapOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onOrderPreviewDialogOpen({
      payload: {
        priceFormatted: `${quotePriceFormatted} ${priceAsset?.shortName}`,
        tradingPairAmounts,
        fiatAmounts,
        selectedAssets,
        advancedSettings,
        fee,
        isLoadingFee,
        isLoadingSubmission: isLoadingSwapOrderCreation,
        orderTypeLabel: 'Limit Order',
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
    resetAdvancedSettings();
    onClose();
  };

  const { isLoading: isLoadingSwapOrderCreation, handlePlaceOrder } =
    useSwapLimitOrderSubmit({
      onCreateOrderSuccess: onCreateOrderSuccess,
    });

  const handleSubmit = () => {
    handlePlaceOrder({
      selectedAssets,
      tradingPairAmounts,
      advancedSettings,
    });
  };

  useEffect(() => {
    if (orderPreviewDialogData) {
      onDialogDataChange({
        fee,
        isLoadingFee,
        isLoadingSubmission: isLoadingSwapOrderCreation,
      });
    }
  }, [isLoadingFee, isLoadingSwapOrderCreation]);

  const updateAmountAndPrice = (
    fromValue: string | null,
    toValue: string | null,
  ): void => {
    const computedPrice = getTradingPairPrice(
      selectedAssets.from,
      selectedAssets.to,

      fromValue,
      toValue,

      selectedTradingPair,
    );
    const updatedAmounts = {
      from: fromValue,
      to: toValue,
    };

    setTradingPairAmounts(updatedAmounts);

    if (computedPrice) {
      setPrice(computedPrice);
    } else {
      setPrice(null);
    }
  };

  const handleSwitchTradingPairs = (
    fromAmount: string,
    toAmount: string,
    from: TradingAsset | null,
    to: TradingAsset | null,
  ) => {
    const quotePrice = getTradingPairPrice(
      selectedAssets.to,
      selectedAssets.from,

      fromAmount,
      toAmount,

      selectedTradingPair,
    );

    const updatedAmounts = {
      from: fromAmount,
      to: toAmount,
    };

    handleSetTradingPairAssets({
      from,
      to,
    });
    setTradingPairAmounts(updatedAmounts);

    setPrice(quotePrice);
  };

  const handleSetFrom = (from: string) => {
    updateAmountAndPrice(from, tradingPairAmounts.to);
  };

  const handleSetTo = (to: string) => {
    updateAmountAndPrice(tradingPairAmounts.from, to);
  };

  const handleSetTradingPairAmounts = (newTradingPairAmounts: TradingPairAmounts) => {
    updateAmountAndPrice(newTradingPairAmounts.from, newTradingPairAmounts.to);
  };

  const handleSetPrice = (value: string): void => {
    // TODO: refactor ternary
    const newToAmount =
      selectedAssets.from?.assetId !== selectedTradingPair?.baseAsset.assetId
        ? tradingPairAmounts.from && value
          ? div(tradingPairAmounts.from, value)
          : tradingPairAmounts.to
        : tradingPairAmounts.from && value
        ? times(tradingPairAmounts.from, value)
        : tradingPairAmounts.to;

    const newToAmountFormatted =
      newToAmount && typeof selectedAssets.to?.decimalPrecision === 'number'
        ? trimTrailingZeros(round(newToAmount, selectedAssets.to?.decimalPrecision))
        : newToAmount;

    setPrice(value);
    setTradingPairAmounts({ ...tradingPairAmounts, to: newToAmountFormatted });
  };

  const result = {
    fee: {
      isLoading: isLoadingFee,
      data: fee,
    },
    from: {
      value: tradingPairAmounts.from,
      fiatValue: fiatAmounts.from,
      onChange: handleSetFrom,
    },
    to: {
      value: tradingPairAmounts.to,
      fiatValue: fiatAmounts.to,
      onChange: handleSetTo,
    },
    price: {
      value: price,
      fiatValue: '',
      onChange: handleSetPrice,
    },
    switchTradingPairs: handleSwitchTradingPairs,
    handleSubmitOrder: handleSubmitSwapOrder,
    handleSetTradingPairAmounts,
    selectedAssets,
    isWalletConnected,
  };

  return result;
};

export default useSwapLimitOrder;
