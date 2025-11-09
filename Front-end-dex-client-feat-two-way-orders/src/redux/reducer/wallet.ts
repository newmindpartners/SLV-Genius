import { createReducer } from '@reduxjs/toolkit';
import { omit } from 'lodash';
import {
  walletConnectFailure,
  walletConnectRequest,
  walletConnectSuccess,
  walletDisconnectFailure,
  walletDisconnectRequest,
  walletDisconnectSuccess,
} from '~/redux/actions/wallet';
import { Wallet, WalletType } from '~/types/wallet';

export interface WalletState {
  wallet?: Wallet;
  isWalletLoading?: boolean;
  connectingWalletType?: WalletType;
}

const initialState: WalletState = {};

export default createReducer(initialState, (builder) => {
  // wallet connect
  builder.addCase(walletConnectRequest, setWalletConnectRequest);
  builder.addCase(walletConnectSuccess, setWalletConnectSuccess);
  builder.addCase(walletConnectFailure, setWalletConnectFailure);

  // wallet disconnect
  builder.addCase(walletDisconnectRequest, setWalletDisconnectRequest);
  builder.addCase(walletDisconnectSuccess, setWalletDisconnectSuccess);
  builder.addCase(walletDisconnectFailure, setWalletDisconnectFailure);
});

//
// Wallet connect

function setWalletConnectRequest(
  state: WalletState,
  action: ReturnType<typeof walletConnectRequest>,
) {
  return {
    ...state,
    isWalletLoading: true,
    connectingWalletType: action.payload.walletType,
  };
}

function setWalletConnectSuccess(
  state: WalletState,
  action: ReturnType<typeof walletConnectSuccess>,
) {
  return {
    ...omit(state, ['connectingWalletType']),
    wallet: action.payload,
    isWalletLoading: false,
  };
}

function setWalletConnectFailure(state: WalletState) {
  return { ...omit(state, ['connectingWalletType']), isWalletLoading: false };
}

//
// Wallet disconnect

function setWalletDisconnectRequest(state: WalletState) {
  return { ...state, isWalletLoading: true };
}

function setWalletDisconnectSuccess(state: WalletState) {
  return { ...state, wallet: undefined, isWalletLoading: false };
}

function setWalletDisconnectFailure(state: WalletState) {
  return { ...state, wallet: undefined, isWalletLoading: false };
}
