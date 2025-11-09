import { createSelector } from 'reselect';
import { WalletState } from '~/redux/reducer/wallet';

export const getStateWallet = (state: { wallet: WalletState }): WalletState =>
  state.wallet;

export const getWalletType = createSelector(
  [getStateWallet],
  (state) => state.wallet?.walletType,
);

export const getConnectingWalletType = createSelector(
  [getStateWallet],
  (state) => state?.connectingWalletType,
);

export const getWalletIsLoading = createSelector(
  [getStateWallet],
  (state) => state?.isWalletLoading,
);

export const getWalletStakeKeyHash = createSelector(
  [getStateWallet],
  (state) => state.wallet?.walletStakeKeyHash,
);

export const isWalletConnected = createSelector(
  [getStateWallet],
  (state) => null != state.wallet,
);
