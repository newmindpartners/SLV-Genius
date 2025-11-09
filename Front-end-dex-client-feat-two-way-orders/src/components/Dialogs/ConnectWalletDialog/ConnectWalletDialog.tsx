import { Collapse, Grid, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import { includes, map } from 'lodash';
import { FC, ReactElement, useCallback } from 'react';
import Button, { ButtonProps } from '~/components/Button/Button';
import { Dialog, DialogTitle } from '~/components/Dialogs/Dialog';
import { useWallet } from '~/hooks/wallet/wallet';
import { CallbackHandlers } from '~/types/shared';
import { WalletType } from '~/types/wallet';

import WalletItem from './WalletItem';

export interface ConnectWalletDialogProps {
  open: boolean;
  disconnectButtonProps?: ButtonProps;
  privacyPolicyUrl?: string;
  onClose: () => void;
  callback?: {
    onConnectSuccess?: CallbackHandlers['onSuccess'];
    onConnectFailure?: CallbackHandlers['onFailure'];
    onDisconnectSuccess?: CallbackHandlers['onSuccess'];
    onDisconnectFailure?: CallbackHandlers['onFailure'];
  };
}

const ConnectWalletDialog: FC<ConnectWalletDialogProps> = ({
  open,
  disconnectButtonProps,
  privacyPolicyUrl,
  callback,
  onClose,
}): ReactElement => {
  const {
    wallets,
    connectingWalletType,
    isWalletLoading,
    isWalletConnected,
    availableWallets,
    handleWalletConnect,
    handleWalletDisconnect,
  } = useWallet();

  const dialogTitle = isWalletConnected ? 'Wallet Connected' : 'Connect your Wallet';

  const onWalletItemClick = useCallback(
    (walletType: WalletType) => {
      handleWalletConnect(walletType, {
        ...(callback?.onConnectSuccess ? { onSuccess: callback.onConnectSuccess } : {}),
        ...(callback?.onConnectFailure ? { onFailure: callback.onConnectFailure } : {}),
      });
    },
    [handleWalletConnect, callback],
  );

  const onWalletDisconnectClick = useCallback(() => {
    handleWalletDisconnect({
      ...(callback?.onDisconnectSuccess
        ? { onSuccess: callback.onDisconnectSuccess }
        : {}),
      ...(callback?.onDisconnectFailure
        ? { onFailure: callback.onDisconnectFailure }
        : {}),
    });
  }, [handleWalletDisconnect, callback]);

  return (
    <DialogWrapper open={open} onClose={onClose}>
      <DialogTitle title={dialogTitle} onClose={onClose} />
      <Grid container direction="column">
        <Grid container item gap="6px" marginBottom="22.54px">
          {map(wallets, (wallet, walletType) => (
            <WalletItem
              key={walletType}
              error={wallet?.error}
              warning={wallet?.warning}
              walletType={walletType as WalletType}
              isLoading={isWalletLoading && connectingWalletType === walletType}
              isDisabled={!includes(availableWallets, walletType)}
              isVisible={wallet.isVisible}
              isNotInstalled={!includes(availableWallets, walletType)}
              onClick={onWalletItemClick}
            />
          ))}
        </Grid>
        <Collapse in={isWalletConnected} timeout={300}>
          <Grid item>
            <Button
              variant="text"
              fullWidth
              onClick={onWalletDisconnectClick}
              {...disconnectButtonProps}
            >
              <Typography variant="body3">Disconnect Wallet</Typography>
            </Button>
          </Grid>
        </Collapse>

        {privacyPolicyUrl && (
          <Typography
            variant={'poweredBy'}
            textAlign={'center'}
            width={'60%'}
            m={'22px auto 0'}
            color={'social.main'}
          >
            By connecting your wallet you agree to our{' '}
            <Typography variant={'poweredBy'} color={'bgDisabled.main'}>
              <StyledLink target="_blank" href={privacyPolicyUrl} rel="noreferrer">
                Privacy Policy
              </StyledLink>
            </Typography>
          </Typography>
        )}
      </Grid>
    </DialogWrapper>
  );
};

const DialogWrapper = styled(Dialog)(({ theme }) => ({
  h2: {
    paddingBottom: '37px',
  },
  [theme.breakpoints.down('md')]: {
    h4: {
      fontSize: '20px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiDialog-scrollPaper': {
      alignItems: 'flex-end',
    },
    '& .MuiDialog-paper': {
      width: '100%',
      padding: '20px 16px 28px',
      margin: 0,
    },
    h2: {
      paddingBottom: '33px',
    },
    '.close': {
      marginRight: '8px',
    },
  },
}));

const StyledLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export default ConnectWalletDialog;
