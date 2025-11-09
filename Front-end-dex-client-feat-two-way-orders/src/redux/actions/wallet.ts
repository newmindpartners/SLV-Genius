import { createAction } from '@reduxjs/toolkit';
import {
  WalletConnectFailurePayload,
  WalletConnectRequestPayload,
  WalletConnectSuccessPayload,
  WalletDisconnectFailurePayload,
  WalletDisconnectRequestPayload,
  WalletDisconnectSuccessPayload,
} from '~/types/wallet';

export const walletConnectRequest = createAction<WalletConnectRequestPayload>(
  'WALLET_CONNECT_REQUEST',
);

export const walletConnectSuccess = createAction<WalletConnectSuccessPayload>(
  'WALLET_CONNECT_SUCCESS',
);

export const walletConnectFailure = createAction<WalletConnectFailurePayload>(
  'WALLET_CONNECT_FAILURE',
);

export const walletDisconnectRequest = createAction<WalletDisconnectRequestPayload>(
  'WALLET_DISCONNECT_REQUEST',
);

export const walletDisconnectSuccess = createAction<WalletDisconnectSuccessPayload>(
  'WALLET_DISCONNECT_SUCCESS',
);

export const walletDisconnectFailure = createAction<WalletDisconnectFailurePayload>(
  'WALLET_DISCONNECT_FAILURE',
);
