import { useEffect } from 'react';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { useAlertDialog } from '~/context/alertDialog';
import { useSwapOrderPreviewDialog } from '~/context/swapOrderPreviewDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import { Asset } from '~/redux/api';
import { TransactionEndpoints } from '~/types/transaction';
import { isGreater, isLessOrEqual, unitToIndivisible } from '~/utils/mathUtils';
import { formatFillOrderFee } from '~/utils/swapOrderFeeUtils';
import { TradingPairAmounts } from '~/utils/tradingPairsUtils';

import useSwapFillOrderFetchFee, { FillSwapOrderData } from './fetchFee';
import useSwapFillOrderSubmit from './submit';

type SwapFillOrder = {
  selectedAssets: {
    from: Asset | null;
    to: Asset | null;
  };

  maxFill: string | null;

  priceFormatted: string;

  orderId: string;

  fillAsset?: Asset;
  fillAmount: string | null;

  inputValue: string | null;
  handleChangeInputValue: (value: string | null) => void;

  handleToggleExpandOrder: () => void;
};

const useSwapFillOrder = ({
  selectedAssets,

  maxFill,

  fillAsset,
  fillAmount,

  inputValue,
  handleChangeInputValue,

  priceFormatted,
  orderId,
  handleToggleExpandOrder,
}: SwapFillOrder) => {
  const {
    orderPreviewDialogData,
    onDialogOpen: onOrderPreviewDialogOpen,
    onDialogDataChange: onOrderPreviewDialogDataChange,
    onClose,
  } = useSwapOrderPreviewDialog();

  const { isWalletConnected } = useWallet();
  const { onDialogOpen: openAlertDialog } = useAlertDialog();

  const onCreateOrder = () => {
    openAlertDialog({
      alertType: AlertType.Success,
      title: 'Transaction signing successful!',
      description: 'Order placed. Waiting for confirmation on chain.',
    });
    handleResetAmount();
    onClose();
  };

  const { isLoading: isLoadingSwapOrderFill, fillSwapOrder } = useSwapFillOrderSubmit({
    onFillOrderSuccess: onCreateOrder,
  });

  const {
    transactionFee,
    isLoading: isLoadingFee,
    getTransactionFee,
  } = useSwapFillOrderFetchFee();

  const fee = formatFillOrderFee(transactionFee, selectedAssets.from?.shortName);

  const isAmountValid =
    !!maxFill &&
    !!inputValue &&
    isGreater(inputValue, 0) &&
    isLessOrEqual(inputValue, maxFill);

  const getHelperText = () => {
    const isInvalidGreater = !!maxFill && !!inputValue && isGreater(inputValue, maxFill);
    if (isInvalidGreater) {
      return 'Value in excess of order amount';
    }
    return null;
  };

  const handleResetAmount = () => {
    handleToggleExpandOrder();
    handleChangeInputValue('');
  };

  const handleSetMaxFillAmount = () => {
    handleChangeInputValue(maxFill);
  };

  const handlePreviewOrder = (fillTradingPairAmounts: TradingPairAmounts) => {
    if (isWalletConnected && fillAsset && fillAmount && orderId) {
      const toAssetAmount = fillAsset
        ? unitToIndivisible(fillAmount, fillAsset.decimalPrecision)
        : '0';

      const transactionFeePayload: FillSwapOrderData = {
        toAssetAmount,
      };

      getTransactionFee(transactionFeePayload, orderId);

      onOrderPreviewDialogOpen({
        payload: {
          tradingPairAmounts: fillTradingPairAmounts,
          selectedAssets,
          fee,
          isLoadingFee,
          priceFormatted,
          orderId,
          onSubmit: handleSubmit(orderId, toAssetAmount),
          orderTypeLabel: 'Fill Order',
          isLoadingSubmission: isLoadingSwapOrderFill,
        },
        transactionType: TransactionEndpoints.FILL_SWAP_ORDERS,
      });
    }
  };

  const handleSubmit = (orderId: string, toAssetAmount: string) => () => {
    fillSwapOrder({
      orderId,
      toAssetAmount,
    });
  };

  useEffect(() => {
    if (orderPreviewDialogData) {
      onOrderPreviewDialogDataChange({
        fee,
        isLoadingFee,
        isLoadingSubmission: isLoadingSwapOrderFill,
      });
    }
  }, [isLoadingFee, isLoadingSwapOrderFill]);

  return {
    handlePreviewOrder,
    isAmountValid,
    helperText: getHelperText(),
    handleSetMaxFillAmount,
  };
};

export default useSwapFillOrder;
