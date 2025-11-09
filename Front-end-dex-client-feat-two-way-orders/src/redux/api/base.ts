import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import queryString from 'query-string';
import { State } from '~/redux/rootReducer';

type RtkApi = Pick<BaseQueryApi, 'getState' | 'extra' | 'endpoint' | 'type' | 'forced'>;

// https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests
// https://security.stackexchange.com/questions/108662/why-is-bearer-required-before-the-token-in-authorization-header-in-a-http-re
const prepareHeaders = (headers: Headers, api: RtkApi) => {
  const stakeKeyHash = (api.getState() as State).wallet.wallet?.walletStakeKeyHash;

  if (stakeKeyHash) headers.set('Authorization', `WalletStakeKeyHash ${stakeKeyHash}`);

  return headers;
};

// https://redux-toolkit.js.org/rtk-query/usage-with-typescript#typing-a-basequery
// https://stackoverflow.com/questions/69568818/how-to-dynamicly-chane-base-url-using-redux-toolkit
// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#constructing-a-dynamic-base-url-using-redux-state
const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as State;
  const baseUrl = state.config.baseUrl;
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders,
    paramsSerializer: queryString.stringify,
  });
  return rawBaseQuery(args, api, extraOptions);
};

export const base = createApi({
  endpoints: () => ({}),
  baseQuery: dynamicBaseQuery,
});
