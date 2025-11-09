import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { getAlertDialogSubmitDescription, useAlertDialog } from '~/context/alertDialog';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { StakeVault, StakeVaultData, SubmitTransactionApiResponse } from '~/redux/api';
import { TransactionEndpoints } from '~/types/transaction';
import { handleSentryReporting, UIKitError } from '~/utils/errorHandlingUtils';
import { uiKitErrorToMessage } from '~/utils/stringUtils';

type UseStakeVaultCreationArgs = {
  refetchStakeVaults: () => Promise<StakeVault[]>;
  onCreateStakeVaultSuccess: () => void;
  onClose: () => void;
};

const useStakeVaultCreation = ({
  refetchStakeVaults,
  onCreateStakeVaultSuccess,
  onClose,
}: UseStakeVaultCreationArgs) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const { onDialogOpen: openAlertDialog } = useAlertDialog();

  const { enqueueSnackbar } = useSnackbar();

  const createStakeVault = useCallback((stakeVault: StakeVaultData) => {
    if (stakeVault) {
      dispatch(
        createSignSubmitTransactionRequest({
          endpoint: TransactionEndpoints.CREATE_STAKE_VAULT,
          data: { [TransactionEndpoints.CREATE_STAKE_VAULT]: stakeVault },
          callback: {
            onRequest: startDialogLoading,
            onFailure: onCreateStakeVaultFailure,
            onSuccess: _onCreateStakeVaultSuccess,
          },
        }),
      );
    }
  }, []);

  const startDialogLoading = useCallback(() => setIsLoading(true), [isLoading]);

  const endDialogLoading = useCallback(() => setIsLoading(false), [isLoading]);

  const onCreateStakeVaultFailure = (error: UIKitError) => {
    endDialogLoading();
    handleSentryReporting(error);
    enqueueSnackbar(uiKitErrorToMessage(error), {
      variant: 'error',
    });
  };

  const _onCreateStakeVaultSuccess = (response: SubmitTransactionApiResponse) => {
    onCreateStakeVaultSuccess();
    /**
     * Refetch stake vaults after 2 seconds which is a heuristic for when the
     * stake vault has been created in the DB and is available to fetch.
     */
    setTimeout(async () => {
      await refetchStakeVaults();
    }, 2000);

    const transactionUrl =
      response.status === 'SUBMITTED' ? response.transaction.transactionUrl : null;

    openAlertDialog({
      alertType: AlertType.Success,
      title: 'Transaction signing successful!',
      description: getAlertDialogSubmitDescription('staking vault creation'),
      ...(transactionUrl
        ? {
            link: {
              href: transactionUrl,
              text: 'View in explorer',
            },
          }
        : {}),
    });

    endDialogLoading();
    onClose();
  };

  return { isLoading, createStakeVault };
};

export default useStakeVaultCreation;
