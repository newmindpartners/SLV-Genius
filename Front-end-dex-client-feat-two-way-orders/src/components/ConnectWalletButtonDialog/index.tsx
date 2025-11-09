import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { ComponentProps, FC } from 'react';
import { useCallback } from 'react';
import { ErrorIcon } from '~/components/Icons';
import { Info } from '~/components/Icons/Icons';
import { useConnectWalletDialog } from '~/context/connectWalletDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import { handleSentryReporting } from '~/utils/errorHandlingUtils';
import { uiKitErrorToMessage } from '~/utils/stringUtils';

import Button from '../Button/Button';
import WalletIcon from '../Icons/WalletIcon';
import Tooltip from '../Tooltip';

type ButtonProps = ComponentProps<typeof Button>;

type ConnectWalletButtonDialogProps = ButtonProps & {
  size?: string;
  label?: string;
  showWalletAddressIfConnected?: boolean;
};

const ConnectWalletButtonDialog: FC<ConnectWalletButtonDialogProps> = ({
  size = 'medium',
  showWalletAddressIfConnected = true,
  label = 'Connect Wallet',
  ...buttonProps
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const { wallets, isWalletConnected, walletStakeKeyHash, walletType } = useWallet();

  const walletAddressShortForm = walletStakeKeyHash?.substring(0, 16);

  const { onDialogOpen, onDialogClose, onDisconnectSuccess, connectWalletDialogData } =
    useConnectWalletDialog();

  const connectSuccess = useCallback(() => {
    onDialogClose();
  }, []);

  const disconnectSuccess = useCallback(() => {
    onDialogClose();
    onDisconnectSuccess();
  }, []);

  const presentDialog = () => {
    onDialogOpen({
      callback: {
        onConnectSuccess: connectSuccess,
        onConnectFailure: connectFailure,
        onDisconnectSuccess: disconnectSuccess,
      },
    });
  };

  const connectFailure = useCallback(
    (e: Error) => {
      handleSentryReporting(e);
      enqueueSnackbar(uiKitErrorToMessage(e), {
        variant: 'error',
      });
    },
    [connectWalletDialogData?.open],
  );

  const connectedWallet = walletType ? wallets[walletType] : null;
  const isAlertVisible = connectedWallet?.error || connectedWallet?.warning;

  return (
    <>
      {isWalletConnected && showWalletAddressIfConnected ? (
        <Button size={size} color="transparent" onClick={presentDialog} {...buttonProps}>
          {walletType && (
            <WalletIconWrapper>
              <WalletIcon walletType={walletType} />
            </WalletIconWrapper>
          )}
          <Typography variant="body1">{walletAddressShortForm}</Typography>
          {isAlertVisible && (
            <Tooltip title={connectedWallet.error || connectedWallet.warning}>
              <Grid container alignItems="center" sx={{ marginLeft: 1 }}>
                {connectedWallet.error ? <ErrorIcon /> : <Info />}
              </Grid>
            </Tooltip>
          )}
        </Button>
      ) : (
        <Button size={size} color="gradient" onClick={presentDialog} {...buttonProps}>
          <Typography variant="body3" color="bgPrimaryGradient.contrastText">
            {label}
          </Typography>
        </Button>
      )}
    </>
  );
};

const WalletIconWrapper = styled('div')(() => ({
  display: 'flex',
  width: 24,
  minWidth: 24,
  marginRight: '0.5rem',
}));

export default ConnectWalletButtonDialog;
