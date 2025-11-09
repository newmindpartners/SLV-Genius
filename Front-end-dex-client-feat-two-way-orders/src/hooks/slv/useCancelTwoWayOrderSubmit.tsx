import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { useAlertDialog } from '~/context/alertDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { TransactionEndpoints } from '~/types/transaction';
import { UIKitError } from '~/utils/errorHandlingUtils';
import { uiKitErrorToMessage } from '~/utils/stringUtils';

type UseSlvCancelTwoWayOrderSubmitProps = {
  utxoReference: string;
  onSuccess?: () => void;
};

const useSlvCancelTwoWayOrderSubmit = ({
  utxoReference,
  onSuccess,
}: UseSlvCancelTwoWayOrderSubmitProps) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { onDialogOpen: openAlertDialog } = useAlertDialog();
  const { getWalletChangeAddress } = useWallet();

  const [isLoading, setIsLoading] = useState(false);

  const onCancelFailure = (error: UIKitError) => {
    setIsLoading(false);
    enqueueSnackbar(uiKitErrorToMessage(error), { variant: 'error' });
  };

  const onCancelSuccess = () => {
    setIsLoading(false);
    onSuccess?.();
    openAlertDialog({
      alertType: AlertType.Success,
      title: 'Transaction signing successful!',
      description: 'Your order was cancelled',
    });
  };

  const handleCancel = useCallback(
    async (overrideUtxoReference?: string) => {
      const referenceToUse = overrideUtxoReference ?? utxoReference;
      if (!referenceToUse) {
        enqueueSnackbar('Order reference not found', { variant: 'error' });
        return;
      }

      setIsLoading(true);
      try {
        const walletAddress = await getWalletChangeAddress();
        if (!walletAddress) {
          enqueueSnackbar('Wallet address not found', { variant: 'error' });
          throw new Error('Wallet address not found');
        }

        dispatch(
          createSignSubmitTransactionRequest({
            endpoint: TransactionEndpoints.CANCEL_TWO_WAY_ORDER,
            data: { twoWayOrderCancel: { utxoReference: referenceToUse } },
            callback: {
              onRequest: () => setIsLoading(true),
              onFailure: onCancelFailure,
              onSuccess: onCancelSuccess,
            },
          }),
        );
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [dispatch, enqueueSnackbar, getWalletChangeAddress, onSuccess, utxoReference],
  );

  return { handleCancel, isLoading };
};

export default useSlvCancelTwoWayOrderSubmit;
