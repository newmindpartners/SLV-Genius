import { CircularProgress, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { enqueueSnackbar } from 'notistack';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { PopupCloseSvg } from '~/components/Icons/Icons';
import { getAlertDialogSubmitDescription, useAlertDialog } from '~/context/alertDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import {
  SmartVaultWithdrawData,
  useGetSmartVaultQuery,
  useSmartVaultWithdrawEstimateMutation,
} from '~/redux/api';
import { TransactionEndpoints } from '~/types/transaction';
import { handleSentryReporting, UIKitError } from '~/utils/errorHandlingUtils';
import { uiKitErrorToMessage } from '~/utils/stringUtils';

import { Dialog } from '../../../../../components/Dialogs/Dialog';
import Actions from './Actions';
import Content from './Content';

type WithdrawDialogProps = Pick<SmartVaultWithdrawData, 'smartVaultId'> & {
  open: boolean;
  onClose: () => void;
  refetchSmartVaults: () => void;
};

const WithdrawSmartVaultsDialog: FC<WithdrawDialogProps> = ({
  open,
  smartVaultId,
  onClose,
  refetchSmartVaults,
}) => {
  const dispatch = useDispatch();

  const { onDialogOpen: openAlertDialog } = useAlertDialog();

  const [isLoading, setIsLoading] = useState(false);

  const startDialogLoading = () => setIsLoading(true);

  const endDialogLoading = () => setIsLoading(false);

  const {
    data: smartVault,
    isLoading: isGettingSmartVault,
    error,
  } = useGetSmartVaultQuery({
    smartVaultId,
  });

  const [estimateWithdrawMutation, estimation] = useSmartVaultWithdrawEstimateMutation();
  const estimationData = estimation.data?.withdrawableAssets;

  const {
    getWalletChangeAddress,
    getWalletUnusedAddresses,
    getWalletUsedAddresses,
    getWalletCollateralUtxo,
  } = useWallet();

  const handleWithdrawSmartVault = () => {
    startDialogLoading();

    const walletChangeAddress = getWalletChangeAddress();

    if (!walletChangeAddress) {
      enqueueSnackbar('Wallet change address not found', { variant: 'error' });
      return;
    }

    if (!smartVault?.depositedAssets || !estimationData) {
      enqueueSnackbar('Smart vault has no deposited assets', { variant: 'error' });
      return;
    }

    dispatch(
      createSignSubmitTransactionRequest({
        endpoint: TransactionEndpoints.CLOSE_SMART_VAULT,
        data: {
          [TransactionEndpoints.CLOSE_SMART_VAULT]: {
            smartVaultId,
          },
        },
        callback: {
          onRequest: startDialogLoading,
          onFailure: onWithdrawSmartVaultFailure,
          onSuccess: _onWithdrawSmartVaultSuccess,
        },
      }),
    );
  };

  const onWithdrawSmartVaultFailure = (error: UIKitError) => {
    setTimeout(async () => {
      await refetchSmartVaults();
    }, 2000);

    onClose();
    endDialogLoading();
    handleSentryReporting(error);
    enqueueSnackbar(uiKitErrorToMessage(error), {
      variant: 'error',
    });
  };

  const _onWithdrawSmartVaultSuccess = () => {
    setTimeout(async () => {
      await refetchSmartVaults();
    }, 2000);

    endDialogLoading();
    onClose();

    openAlertDialog({
      alertType: AlertType.Success,
      title: 'Smart vault successful widthdraw!',
      description: getAlertDialogSubmitDescription('smart vault widthdraw'),
    });
  };

  async function estimateWithdraw(smartVaultId: string) {
    const walletChangeAddress = await getWalletChangeAddress();

    if (!walletChangeAddress) {
      enqueueSnackbar('Wallet change address not found', { variant: 'error' });
      return;
    }

    const [walletUsedAddresses, walletUnusedAddresses, collateralUtxo] =
      await Promise.all([
        getWalletUsedAddresses(),
        getWalletUnusedAddresses(),
        getWalletCollateralUtxo(),
      ]);

    estimateWithdrawMutation({
      smartVaultWithdrawEstimate: {
        smartVaultId,
        walletAddress: walletChangeAddress,
        collateralUtxo,
        walletUsedAddresses,
        walletUnusedAddresses,
        walletRewardAddresses: walletUnusedAddresses,
      },
    });
  }

  useEffect(() => {
    estimateWithdraw(smartVaultId);
  }, [smartVaultId]);

  return (
    <DialogWrapper open={open} onClose={onClose}>
      <Grid container justifyContent={'flex-end'}>
        <CloseButton item onClick={onClose}>
          <PopupCloseSvg />
        </CloseButton>
      </Grid>
      <Grid display="flex" gap="46px" direction="column" margin="0px 12px">
        <Grid display="flex" gap="20px" direction="column">
          <Grid display="flex" justifyContent="center" gap="10px" direction="column">
            <Typography textAlign="center" fontSize="25px" fontWeight="800">
              Withdraw smart vault?
            </Typography>
            <Typography
              textAlign="center"
              fontSize="15px"
              fontWeight="500"
              lineHeight="24px"
            >
              Are you sure you want to withdraw smart vault assets? This can not be
              undone.
            </Typography>
          </Grid>
        </Grid>

        <Grid display="flex" direction="column" justifyContent="center" gap="56px">
          <Grid display="flex" direction="column" gap="17px">
            {isGettingSmartVault && <CircularProgress size={30} color="primary" />}

            {error && (
              <Typography>
                Error retrieving smart vault, please try again later.
              </Typography>
            )}

            {smartVault && estimationData && (
              <Content smartVault={smartVault} estimationData={estimationData} />
            )}

            <Actions
              isWithdrawing={isLoading}
              onClose={onClose}
              onWithdraw={handleWithdrawSmartVault}
            />
          </Grid>
        </Grid>
      </Grid>
    </DialogWrapper>
  );
};

const DialogWrapper = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#202740',
    padding: '30px 26px 43px',
    width: '437px',
    [theme.breakpoints.down('sm')]: {
      padding: '16px 16px 110px',
      maxHeight: 'unset',
    },
  },
}));

const CloseButton = styled(Grid)(({ theme }) => ({
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    padding: '4px',
  },
}));

export default WithdrawSmartVaultsDialog;
