import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { useAlertDialog } from '~/context/alertDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { TransactionEndpoints } from '~/types/transaction';
import type { UIKitError } from '~/utils/errorHandlingUtils';
import { uiKitErrorToMessage } from '~/utils/stringUtils';

import type { TwoWayOrderDraft } from './useTwoWayOrderForm';

type UseTwoWayOrderSubmitArgs = {
  onSuccess: () => void;
};

const useTwoWayOrderSubmit = ({ onSuccess }: UseTwoWayOrderSubmitArgs) => {
  const dispatch = useDispatch();
  const { isWalletConnected } = useWallet();
  const { onDialogOpen: openAlertDialog } = useAlertDialog();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFailure = useCallback(
    (error: UIKitError) => {
      setIsSubmitting(false);
      openAlertDialog({
        alertType: AlertType.Failure,
        title: 'Transaction submission failed!',
        description: uiKitErrorToMessage(error) || '',
      });
    },
    [openAlertDialog],
  );

  const placeTwoWayOrder = useCallback(
    (payload: TwoWayOrderDraft) => {
      if (!isWalletConnected) {
        openAlertDialog({
          alertType: AlertType.Failure,
          title: 'Wallet is not connected',
          description: 'Please connect your wallet before placing an order.',
        });
        return;
      }

      setIsSubmitting(true);

      dispatch(
        createSignSubmitTransactionRequest({
          endpoint: TransactionEndpoints.PLACE_TWO_WAY_ORDER,
          data: {
            twoWayOrderPlace: payload,
          },
          callback: {
            onSuccess: () => {
              setIsSubmitting(false);
              onSuccess();
            },
            onFailure: handleFailure,
          },
        }),
      );
    },
    [dispatch, handleFailure, isWalletConnected, onSuccess, openAlertDialog],
  );

  return {
    placeTwoWayOrder,
    isSubmitting,
  };
};

export default useTwoWayOrderSubmit;
