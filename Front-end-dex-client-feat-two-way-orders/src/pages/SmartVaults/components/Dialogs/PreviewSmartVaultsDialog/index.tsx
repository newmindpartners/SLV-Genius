import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { enqueueSnackbar } from 'notistack';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import Avatar from '~/components/Avatar/Avatar';
import GreenGradientButton from '~/components/Button/GreenGradientButton';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { InfoIcon } from '~/components/Icons';
import { PopupCloseSvg } from '~/components/Icons/Icons';
import Tooltip from '~/components/Tooltip';
import { getAlertDialogSubmitDescription, useAlertDialog } from '~/context/alertDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import {
  SubtleDescription as Label,
  Description as Value,
} from '~/pages/SmartVaults/components/Card/Typography';
import OrderFees from '~/pages/Swap/components/OrderFees/OrderFees';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { SmartVaultAssetDetailed, SmartVaultStrategy } from '~/redux/api/core';
import { TransactionEndpoints } from '~/types/transaction';
import { handleSentryReporting, UIKitError } from '~/utils/errorHandlingUtils';
import { unitToIndivisible } from '~/utils/mathUtils';
import { uiKitErrorToMessage } from '~/utils/stringUtils';
import { FormattedFee } from '~/utils/swapOrderFeeUtils';

import { Dialog } from '../../../../../components/Dialogs/Dialog';
import { jsonWidgets } from './components/Widgets';

const mockJsonSchema: RJSFSchema = {
  title: 'A registration form',
  type: 'object',
  required: ['firstName', 'lastName', 'select'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First name',
      default: 'Chuck',
    },
    lastName: {
      type: 'string',
      title: 'Last name',
    },
    select: {
      type: 'string',
      title: 'Select',
      enum: ['option1', 'option2', 'option3'],
      default: 'option1',
    },
  },
};

export type PreviewDialogProps = {
  open: boolean;
  isLoadingFees: boolean;
  fees: FormattedFee[];
  strategy: SmartVaultStrategy | null;
  lockedAssets: SmartVaultAssetDetailed[];
  onClose: () => void;
  refetchSmartVaults: () => void;
};

const PreviewSmartVaultsDialog: FC<PreviewDialogProps> = ({
  open,
  strategy,
  isLoadingFees,
  fees,
  lockedAssets,
  onClose,
  refetchSmartVaults,
}) => {
  const dispatch = useDispatch();

  const { onDialogOpen: openAlertDialog } = useAlertDialog();

  const [isLoading, setIsLoading] = useState(false);

  const startDialogLoading = () => setIsLoading(true);

  const endDialogLoading = () => setIsLoading(false);

  const { getWalletChangeAddress } = useWallet();

  const handleCreateSmartVault = () => {
    startDialogLoading();

    const walletChangeAddress = getWalletChangeAddress();

    if (!walletChangeAddress) {
      enqueueSnackbar('Wallet change address not found', { variant: 'error' });
      return;
    }

    if (!strategy?.smartVaultStrategyId) {
      enqueueSnackbar('Strategy not found, try to select strategy again', {
        variant: 'error',
      });
      return;
    }

    dispatch(
      createSignSubmitTransactionRequest({
        endpoint: TransactionEndpoints.OPEN_SMART_VAULT,
        data: {
          [TransactionEndpoints.OPEN_SMART_VAULT]: {
            smartVaultStrategyId: strategy?.smartVaultStrategyId,
            smartVaultStrategyConfigJson: '',

            depositAssets: lockedAssets.map((asset) => ({
              assetId: asset.assetId,
              assetAmount: unitToIndivisible(
                asset.assetAmount,
                // TODO: How do we handle this?
                asset.asset?.decimalPrecision || 6,
              ),
            })),
          },
        },
        callback: {
          onRequest: startDialogLoading,
          onFailure: onCreateSmartVaultFailure,
          onSuccess: _onCreateSmartVaultSuccess,
        },
      }),
    );
  };

  const onCreateSmartVaultFailure = (error: UIKitError) => {
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

  const _onCreateSmartVaultSuccess = () => {
    setTimeout(async () => {
      await refetchSmartVaults();
    }, 2000);

    endDialogLoading();
    onClose();

    openAlertDialog({
      alertType: AlertType.Success,
      title: 'Smart vault successful creation!',
      description: getAlertDialogSubmitDescription('smart vault creation'),
    });
  };

  return (
    <DialogWrapper open={open} onClose={onClose}>
      <Grid container justifyContent={'flex-end'}>
        <CloseButton item onClick={onClose}>
          <PopupCloseSvg />
        </CloseButton>
      </Grid>
      <Grid display="flex" direction="column" gap="24px" margin="0px 12px">
        <Grid display="flex" justifyContent="center" direction="column">
          <Typography textAlign="center" fontSize="25px" fontWeight="800">
            Preview Smart Vault
          </Typography>
        </Grid>
        <Grid display="flex" direction="column" gap="16px">
          <Grid display="flex" alignItems="center" justifyContent="space-between">
            <Grid item display="flex" flexDirection="row" gap="8px" alignItems="center">
              <Label>Strategy</Label>

              <Tooltip title={''} placement="right">
                <Grid display="flex" alignItems="center">
                  <InfoIcon />
                </Grid>
              </Tooltip>
            </Grid>

            <Value>{strategy?.name}</Value>
          </Grid>

          <Grid display="flex" flexDirection="column" gap="9px">
            <Label>Locked Assets:</Label>

            <List container>
              {lockedAssets.map((asset) => (
                <Item key={asset.assetId} container item>
                  <Logo variant="circle" src={asset.asset?.iconUrl || ''} />
                  <Asset>
                    {asset.assetAmount} {asset.asset?.shortName}
                  </Asset>
                </Item>
              ))}
            </List>
          </Grid>
        </Grid>

        <Form schema={mockJsonSchema} validator={validator} widgets={jsonWidgets}>
          <Grid
            display="flex"
            direction="column"
            justifyContent="center"
            gap="23px"
            marginTop="24px"
          >
            <OrderFees isLoadingFee={isLoadingFees} fee={fees} />
            <Actions onCreate={handleCreateSmartVault} isLoading={isLoading} />
          </Grid>
        </Form>
      </Grid>
    </DialogWrapper>
  );
};

type ActionsProps = {
  isLoading: boolean;
  onCreate: () => void;
};

const Actions: FC<ActionsProps> = ({ isLoading, onCreate }) => (
  <Grid display="flex" width="100%" marginTop="24px">
    <GreenGradientButton isLoading={isLoading} onClick={onCreate}>
      Create Smart Vault
    </GreenGradientButton>
  </Grid>
);

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

  '& .control-label': {
    display: 'none',
  },

  '& legend': {
    display: 'none',
  },

  '& fieldset': {
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
}));

const CloseButton = styled(Grid)(({ theme }) => ({
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    padding: '4px',
  },
}));

const Logo = styled(Avatar)(() => ({
  width: 30,
  height: 30,
}));

const List = styled(Grid)(() => ({
  gap: 4,
}));

const Item = styled(Grid)(() => ({
  gap: 8,
  alignItems: 'center',
}));

const Asset = styled(Typography)(() => ({
  color: '#fff',
  fontWeight: 700,
  fontSize: '15px',
  lineHeight: '22px',
}));

export default PreviewSmartVaultsDialog;
