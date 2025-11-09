import { Action } from 'redux';
import { all, call, put, putResolve, takeLatest } from 'redux-saga/effects';
import {
  userConnectFailure,
  userConnectSuccess,
  userConnectWallet,
} from '~/redux/actions/user';
import { walletConnectFailure, walletConnectSuccess } from '~/redux/actions/wallet';
import { api, UserConnectResponse } from '~/redux/api';
import { UserConnect } from '~/redux/api/core';
import { CONNECT_WALLET_FIXED_CACHE_KEY } from '~/redux/selector/user';
import { WalletError, WalletErrorCode } from '~/types/wallet';
import { getErrorMessage } from '~/utils/error';

function* apiUserConnectWallet(
  userConnect: UserConnect,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Generator<any, UserConnectResponse, any> {
  const handler = api.endpoints.connectWallet.initiate;
  const action: Action = yield call(
    handler,
    { userConnect },
    { fixedCacheKey: CONNECT_WALLET_FIXED_CACHE_KEY },
  );
  const result = yield putResolve(action);
  const { data: user } = result;
  return user;
}

function* onUserConnectWallet(
  action: ReturnType<typeof userConnectWallet>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Generator<unknown, void, any> {
  const { walletType, walletStakeKeyHash, onSuccess, onFailure } = action.payload;
  try {
    const user = yield* apiUserConnectWallet({
      userType: 'INDIVIDUAL',
      walletStakeKeyHash,
      walletType,
    });

    if (!user) {
      throw new Error('Failed to connect user.');
    }

    yield put(
      walletConnectSuccess({
        walletType,
        walletStakeKeyHash,
        onSuccess,
      }),
    );
    yield put(userConnectSuccess({ user, onSuccess }));
  } catch (e) {
    yield put(
      userConnectFailure({
        error: getErrorMessage(e),
      }),
    );
    yield put(
      walletConnectFailure({
        error: new WalletError(WalletErrorCode.WALLET_ACCOUNT_NOT_FOUND),
        onFailure,
      }),
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function* (): Generator<any, void, any> {
  yield all([takeLatest(userConnectWallet.toString(), onUserConnectWallet)]);
}
