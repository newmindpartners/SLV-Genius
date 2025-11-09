import { useSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
import { useWallet, WalletNetworkStatus } from '~/hooks/wallet/wallet';

export const WalletNetworkStatusNotifier = () => {
  const { getWalletNetworkStatus, walletStakeKeyHash } = useWallet();
  const { enqueueSnackbar } = useSnackbar();

  const notifyWalletNetworkMisconfiguration = useCallback(async () => {
    const networkStatus = await getWalletNetworkStatus();

    switch (networkStatus) {
      case WalletNetworkStatus.ShouldBeMainnet: {
        enqueueSnackbar('Wallet needs to change network to Cardano Mainnet', {
          variant: 'error',
        });
        break;
      }
      case WalletNetworkStatus.ShouldBePreprod: {
        enqueueSnackbar('Wallet needs to change network to Pre-Production Testnet', {
          variant: 'error',
        });
        break;
      }
    }
  }, [walletStakeKeyHash]);

  /**
   * Whenever `walletStakeKeyHash` changes a new wallet or wallet account has connected.
   * We should re-check if that wallet is configured correctly.
   */
  useEffect(() => {
    notifyWalletNetworkMisconfiguration();
  }, [walletStakeKeyHash]);

  return <></>;
};
