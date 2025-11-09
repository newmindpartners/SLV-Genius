import { createSelector } from 'reselect';
import { api, UserConnectResponse } from '~/redux/api';

export const CONNECT_WALLET_FIXED_CACHE_KEY = 'CONNECT_WALLET_FIXED_CACHE_KEY';

export const getConnectUserCache = api.endpoints.connectWallet.select(
  CONNECT_WALLET_FIXED_CACHE_KEY,
);

/**
 * Temporary fix to prevent `getUser` from returning `undefined` when data
 * is loading and `state.data` is `undefined`.
 * We should figure out if there is a way to get this data from RTK Query.
 */
let previousUserResponse: UserConnectResponse | undefined;

export const getUser = createSelector([getConnectUserCache], (state) => {
  if (state.data) {
    previousUserResponse = state.data;
    return state.data;
  } else {
    return previousUserResponse;
  }
});

export const getUserId = createSelector([getUser], (user) => user?.userId);
