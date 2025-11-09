import { CircularProgress, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { enqueueSnackbar } from 'notistack';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { PopupCloseSvg } from '~/components/Icons/Icons';
import { getAlertDialogSubmitDescription, useAlertDialog } from '~/context/alertDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { useGetSmartVaultQuery } from '~/redux/api';
import { TransactionEndpoints } from '~/types/transaction';
import { handleSentryReporting, UIKitError } from '~/utils/errorHandlingUtils';
import { uiKitErrorToMessage } from '~/utils/stringUtils';

import { Dialog } from '../../../../../components/Dialogs/Dialog';
import Actions from './Actions';
import Content from './Content';

export type DepositDialogData = {
  smartVaultId: string;
};

type DepositDialogProps = DepositDialogData & {
  open: boolean;
  onClose: () => void;
  refetchSmartVaults: () => void;
};

const DepositSmartVaultDialog: FC<DepositDialogProps> = ({
  open,
  smartVaultId,
  onClose,
  refetchSmartVaults,
}) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [assetsAmountsMap, setAssetsAmountsMap] = useState<Record<string, string>>({});

  const { onDialogOpen: openAlertDialog } = useAlertDialog();

  const startDialogLoading = () => setIsLoading(true);

  const endDialogLoading = () => setIsLoading(false);

  const { getWalletChangeAddress } = useWallet();

  const {
    data: smartVault,
    isLoading: isGettingSmartVault,
    error,
  } = useGetSmartVaultQuery({
    smartVaultId,
  });

  const depositedAssets = smartVault?.depositedAssets;

  const handleDepositSmartVault = () => {
    startDialogLoading();

    const walletChangeAddress = getWalletChangeAddress();

    if (!walletChangeAddress) {
      enqueueSnackbar('Wallet change address not found', { variant: 'error' });
      return;
    }

    if (!smartVault || !depositedAssets) {
      enqueueSnackbar('Smart vault has no deposited assets', { variant: 'error' });
      return;
    }

    const depositAssets = Object.entries(assetsAmountsMap)
      .filter(([, assetAmount]) => assetAmount && parseFloat(assetAmount) > 0)
      .map(([assetId, assetAmount]) => ({
        assetId,
        assetAmount: assetAmount.toString(),
      }));

    if (depositAssets.length === 0) {
      enqueueSnackbar('No assets to deposit', { variant: 'error' });
      endDialogLoading();
      return;
    }

    dispatch(
      createSignSubmitTransactionRequest({
        endpoint: TransactionEndpoints.DEPOSIT_SMART_VAULT,
        data: {
          [TransactionEndpoints.DEPOSIT_SMART_VAULT]: {
            smartVaultId,
            depositAssets,
          },
        },
        callback: {
          onRequest: startDialogLoading,
          onFailure: onDepositSmartVaultFailure,
          onSuccess: _onDepositSmartVaultSuccess,
        },
      }),
    );
  };

  const onDepositSmartVaultFailure = (error: UIKitError) => {
    onClose();
    endDialogLoading();
    handleSentryReporting(error);
    enqueueSnackbar(uiKitErrorToMessage(error), {
      variant: 'error',
    });
  };

  const _onDepositSmartVaultSuccess = () => {
    setTimeout(async () => {
      await refetchSmartVaults();
    }, 2000);

    endDialogLoading();
    onClose();

    openAlertDialog({
      alertType: AlertType.Success,
      title: 'Smart vault successful deposit!',
      description: getAlertDialogSubmitDescription('smart vault deposit'),
    });
  };

  return (
    <DialogWrapper open={open} onClose={onClose}>
      <Grid container justifyContent={'flex-end'}>
        <CloseButton item onClick={onClose}>
          <PopupCloseSvg />
        </CloseButton>
      </Grid>

      <Grid display="flex" gap="23px" direction="column" margin="0px 12px">
        <Grid display="flex" justifyContent="center" gap="10px" direction="column">
          <Typography textAlign="center" fontSize="25px" fontWeight="800">
            Deposit Smart Vault
          </Typography>
        </Grid>

        <Grid display="flex" gap="47px" direction="column">
          {isGettingSmartVault && (
            <Grid container justifyContent="center">
              <CircularProgress size={30} color="primary" />
            </Grid>
          )}

          {smartVault && (
            <Content
              smartVault={smartVault}
              assetsAmountsMap={assetsAmountsMap}
              setAssetsAmountsMap={setAssetsAmountsMap}
            />
          )}

          {error && (
            <Grid container justifyContent="center">
              <Typography
                color="error"
                fontSize="15px"
                fontWeight="500"
                lineHeight="24px"
                align="center"
              >
                There was an error fetching the smart vault, please try again later.
              </Typography>
            </Grid>
          )}

          <Actions
            isDisabled={isGettingSmartVault || !smartVault}
            onClose={onClose}
            onDeposit={handleDepositSmartVault}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </DialogWrapper>
  );
};

const DialogWrapper = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#202740',
    padding: '30px',
    width: '450px',

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

export default DepositSmartVaultDialog;
