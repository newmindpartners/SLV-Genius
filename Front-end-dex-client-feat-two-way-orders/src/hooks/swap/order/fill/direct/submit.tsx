import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { useAlertDialog } from '~/context/alertDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { FillSwapOrder } from '~/redux/api';
import { TransactionEndpoints, TransactionEndpointsData } from '~/types/transaction';
import { UIKitError } from '~/utils/errorHandlingUtils';
import { uiKitErrorToMessage } from '~/utils/stringUtils';

export type FillSwapOrderProps = {
  orderId: string;
  toAssetAmount: string;
};

type UseSwapOrderFillArgs = {
  onFillOrderSuccess: () => void;
};

const useSwapFillOrderSubmit = ({ onFillOrderSuccess }: UseSwapOrderFillArgs) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isWalletConnected } = useWallet();
  const { onDialogOpen: openAlertDialog } = useAlertDialog();
  const dispatch = useDispatch();

  const onFillSuccess = () => {
    onFillOrderSuccess();
    setIsLoading(false);
  };

  const onFillFailure = (error: UIKitError) => {
    openAlertDialog({
      alertType: AlertType.Failure,
      title: uiKitErrorToMessage(error) || '',
    });
    setIsLoading(false);
  };

  const fillSwapOrder = async ({ orderId, toAssetAmount }: FillSwapOrderProps) => {
    setIsLoading(true);

    if (!toAssetAmount) {
      openAlertDialog({
        alertType: AlertType.Failure,
        title: 'Token amount to fill the order is not set',
      });
      return;
    }

    if (!isWalletConnected) {
      openAlertDialog({
        alertType: AlertType.Failure,
        title: 'Wallet is not connected',
      });
      return;
    }

    const directFillSwapOrder: FillSwapOrder = {
      toAssetAmount,
      orderReference: {
        orderId,
      },
    };

    const fillSwapOrders: FillSwapOrder[] = [directFillSwapOrder];

    const data: TransactionEndpointsData = {
      orderId,
      [TransactionEndpoints.FILL_SWAP_ORDERS]: {
        orderFillType: 'FILL_DIRECT',
        fillSwapOrders,
      },
    };

    dispatch(
      createSignSubmitTransactionRequest({
        endpoint: TransactionEndpoints.FILL_SWAP_ORDERS,
        data: data,
        callback: {
          onSuccess: onFillSuccess,
          onFailure: onFillFailure,
        },
      }),
    );
  };

  return {
    isLoading,
    fillSwapOrder,
  };
};

export default useSwapFillOrderSubmit;
