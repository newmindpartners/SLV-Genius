import { createAction } from '@reduxjs/toolkit';
import {
  UserConnectFailurePayload,
  UserConnectSuccessPayload,
  UserConnectWalletPayload,
} from '~/types/user';

export const userConnectSuccess =
  createAction<UserConnectSuccessPayload>('USER_CONNECT_SUCCESS');

export const userConnectFailure =
  createAction<UserConnectFailurePayload>('USER_CONNECT_FAILURE');

export const userConnectWallet =
  createAction<UserConnectWalletPayload>('USER_CONNECT_WALLET');
