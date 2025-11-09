import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { AdvancedSettings } from '~/context/advancedSettingsContext';
import { useAlertDialog } from '~/context/alertDialog';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { SwapOrderData } from '~/redux/api';
import { TransactionEndpoints } from '~/types/transaction';
import { UIKitError } from '~/utils/errorHandlingUtils';
import { unitToIndivisible } from '~/utils/mathUtils';
import { uiKitErrorToMessage } from '~/utils/stringUtils';
import { TradingPairAmounts, TradingPairAssets } from '~/utils/tradingPairsUtils';

type UseSwapOrderCreationArgs = {
  onCreateOrderSuccess: () => void;
};

type PlaceOrderProps = {
  advancedSettings: AdvancedSettings;

  selectedAssets: TradingPairAssets;
  tradingPairAmounts: TradingPairAmounts;
};

const orderType = 'LIMIT' as const;

const useSwapLimitOrderSubmit = ({ onCreateOrderSuccess }: UseSwapOrderCreationArgs) => {
  const [isLoading, setIsLoading] = useState(false);
  const { onDialogOpen: openAlertDialog } = useAlertDialog();

  const dispatch = useDispatch();

  const onCreateSwapOrderFailure = (error: UIKitError) => {
    openAlertDialog({
      alertType: AlertType.Failure,
      title: 'Transaction submission failed!',
      description: uiKitErrorToMessage(error) || '',
    });

    setIsLoading(false);
  };

  const onCreateSwapOrderSuccess = () => {
    setIsLoading(false);
    onCreateOrderSuccess();
  };

  const handlePlaceOrderServerSubmission = (data: SwapOrderData) => {
    setIsLoading(true);

    dispatch(
      createSignSubmitTransactionRequest({
        endpoint: TransactionEndpoints.OPEN_SWAP_ORDER,
        data: {
          [TransactionEndpoints.OPEN_SWAP_ORDER]: data,
        },
        callback: {
          onSuccess: onCreateSwapOrderSuccess,
          onFailure: onCreateSwapOrderFailure,
        },
      }),
    );
  };

  const handlePlaceOrder = ({
    selectedAssets,
    tradingPairAmounts,
    advancedSettings,
  }: PlaceOrderProps) => {
    if (tradingPairAmounts.to === null || tradingPairAmounts.from === null) {
      openAlertDialog({
        alertType: AlertType.Failure,
        title: 'Transaction signing successful!',
        description: 'Token amounts to trade are not set',
      });
      return;
    }

    if (!selectedAssets.to || !selectedAssets.from) {
      openAlertDialog({
        alertType: AlertType.Failure,
        title: 'Transaction signing successful!',
        description: 'Failed to resolve token pair',
      });
      return;
    }

    const effectiveFromDate = advancedSettings.startDate
      ? advancedSettings.startDate?.toISOString()
      : '';

    const effectiveUntilDate = advancedSettings.endDate
      ? advancedSettings.endDate?.toISOString()
      : '';

    const settings = {
      ...(advancedSettings.startDate ? { effectiveFromDate } : {}),
      ...(advancedSettings.endDate ? { effectiveUntilDate } : {}),
    };

    const data: SwapOrderData = {
      ...settings,
      orderType,
      toAssetId: selectedAssets.to.assetId,
      toAssetAmount: unitToIndivisible(
        tradingPairAmounts.to,
        selectedAssets.to.decimalPrecision,
      ),
      fromAssetId: selectedAssets.from.assetId,
      fromAssetAmount: unitToIndivisible(
        tradingPairAmounts.from,
        selectedAssets.from.decimalPrecision,
      ),
    };

    handlePlaceOrderServerSubmission(data);
  };

  return {
    isLoading,
    handlePlaceOrder,
  };
};

export default useSwapLimitOrderSubmit;
