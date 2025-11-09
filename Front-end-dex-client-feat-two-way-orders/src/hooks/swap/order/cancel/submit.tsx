import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { useAlertDialog } from '~/context/alertDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { TransactionEndpoints } from '~/types/transaction';
import { UIKitError } from '~/utils/errorHandlingUtils';
import { uiKitErrorToMessage } from '~/utils/stringUtils';

type UseSwapOrderCancellationProps = {
  orderId: string;
  onSuccess?: () => void;
};

const useSwapCancelOrderSubmit = ({
  orderId,
  onSuccess,
}: UseSwapOrderCancellationProps) => {
  const { getWalletChangeAddress } = useWallet();
  const { onDialogOpen: openAlertDialog } = useAlertDialog();

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const onCancelSwapOrderFailure = (error: UIKitError) => {
    setIsLoading(false);
    enqueueSnackbar(uiKitErrorToMessage(error), {
      variant: 'error',
    });
  };

  const onCancelSwapOrderSuccess = () => {
    setIsLoading(false);
    onSuccess?.();

    openAlertDialog({
      alertType: AlertType.Success,
      title: 'Transaction signing successful!',
      description: 'Your order was cancelled',
    });
  };

  const handleCancelOrder = async () => {
    setIsLoading(true);
    const walletAddress = await getWalletChangeAddress();
    if (walletAddress) {
      dispatch(
        createSignSubmitTransactionRequest({
          endpoint: TransactionEndpoints.CANCEL_SWAP_ORDER,
          data: {
            orderId,
            [TransactionEndpoints.CANCEL_SWAP_ORDER]: {},
          },
          callback: {
            onFailure: onCancelSwapOrderFailure,
            onSuccess: onCancelSwapOrderSuccess,
          },
        }),
      );
    } else {
      setIsLoading(false);
      enqueueSnackbar('Wallet address not found', {
        variant: 'error',
      });
      throw new Error('Wallet address not found');
    }
  };

  return {
    isLoadingCancellation: isLoading,
    handleCancelOrder,
  };
};

export default useSwapCancelOrderSubmit;
