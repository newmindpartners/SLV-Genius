import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { FC, ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { Dialog } from '~/components/Dialogs/Dialog';
import { getAlertDialogSubmitDescription, useAlertDialog } from '~/context/alertDialog';
import UnstakeDialogHeading from '~/pages/Earn/components/HarvestRewardsDialog/DialogHeading';
import UnstakeActions from '~/pages/Earn/components/UnstakeDialog/UnstakeActions';
import UnstakeContent from '~/pages/Earn/components/UnstakeDialog/UnstakeContent';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { StakeVault, SubmitTransactionApiResponse } from '~/redux/api';
import { TransactionEndpoints } from '~/types/transaction';
import { UIKitError } from '~/utils/errorHandlingUtils';
import { uiKitErrorToMessage } from '~/utils/stringUtils';

export const REFETCH_STAKE_VAULT_MS_TIMEOUT = 1000;

type HarvestRewardsDialogProps = {
  open: boolean;
  stakeVaultId: string | null;
  stakeVaults: StakeVault[];
  onClose: () => void;
  refetchStakeVaults: () => void;
};

const UnstakeDialog: FC<HarvestRewardsDialogProps> = ({
  open,
  stakeVaultId,
  stakeVaults,
  refetchStakeVaults,
  onClose,
}): ReactElement => {
  const { onDialogOpen: openAlertDialog } = useAlertDialog();
  const [isUnstakeLoading, setIsUnstakeLoading] = useState(false);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onUnstakeStakeVaultRequest = () => {
    setIsUnstakeLoading(true);
  };

  const onUnstakeStakeVaultFailure = (error: UIKitError) => {
    setTimeout(() => {
      refetchStakeVaults();
    }, REFETCH_STAKE_VAULT_MS_TIMEOUT);
    setIsUnstakeLoading(false);
    enqueueSnackbar(uiKitErrorToMessage(error), {
      variant: 'error',
    });
  };
  const onUnstakeStakeVaultSuccess = (response: SubmitTransactionApiResponse) => {
    setTimeout(() => {
      refetchStakeVaults();
    }, REFETCH_STAKE_VAULT_MS_TIMEOUT);

    const transactionUrl =
      response.status === 'SUBMITTED' ? response.transaction.transactionUrl : null;

    openAlertDialog({
      alertType: AlertType.Success,
      title: 'Transaction signing successful!',
      description: getAlertDialogSubmitDescription('staking vault unstake'),
      ...(transactionUrl
        ? {
            link: {
              href: transactionUrl,
              text: 'View in explorer',
            },
          }
        : {}),
    });

    setIsUnstakeLoading(false);
    onClose();
  };

  const unstakeStakeVault = (stakeVaultId: string) => {
    dispatch(
      createSignSubmitTransactionRequest({
        endpoint: TransactionEndpoints.UNSTAKE_STAKE_VAULT,
        data: {
          [TransactionEndpoints.UNSTAKE_STAKE_VAULT]: {
            stakeVaultId: stakeVaultId,
          },
        },
        callback: {
          onRequest: onUnstakeStakeVaultRequest,
          onFailure: onUnstakeStakeVaultFailure,
          onSuccess: onUnstakeStakeVaultSuccess,
        },
      }),
    );
  };

  const stakeVault = stakeVaults.find((vault) => vault.stakeVaultId === stakeVaultId);

  return (
    <DialogWrapper open={open} onClose={onClose}>
      <UnstakeDialogHeading
        onClose={onClose}
        title="Are you sure that you want to unstake?"
      />
      {stakeVault ? (
        <>
          <UnstakeContent stakeVault={stakeVault} />
          <UnstakeActions
            isUnstakeLoading={isUnstakeLoading}
            handleUnstakeClick={() => unstakeStakeVault(stakeVault.stakeVaultId)}
            handleReturnClick={onClose}
          />
        </>
      ) : (
        <>Staking Vault not found</>
      )}
    </DialogWrapper>
  );
};

const DialogWrapper = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    position: 'relative',
    backgroundColor: '#202740',
    padding: '40px',
    maxWidth: '420px',
    width: '100%',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  '& .dialogHeadingWrapper': {
    marginBottom: '28px',
    '& .dialogHeading': {
      textAlign: 'center',

      p: {
        display: 'block',
        maxWidth: '300px',
        fontWeight: 800,
        fontSize: '25px',
        lineHeight: '31px',
      },
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: '36px',
      '& .dialogHeading': {
        p: {
          fontSize: '20px',
          lineHeight: '28px',
        },
      },
      svg: {
        right: '24px',
        top: '28px',
      },
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: '48px',
      svg: {
        right: '20px',
        top: '20px',
      },
      '& .dialogHeading': {
        p: {
          maxWidth: '220px',
        },
      },
    },
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiPaper-root': {
      padding: '32px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiPaper-root': {
      padding: '32px 16px 36px',
      maxHeight: '490px',
    },
  },
}));

export default UnstakeDialog;
