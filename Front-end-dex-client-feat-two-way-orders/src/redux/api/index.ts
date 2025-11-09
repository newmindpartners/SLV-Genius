import { core } from './core';

export const api = core.enhanceEndpoints({
  addTagTypes: ['TradingWallet'],
  endpoints: {
    listTradingWallets: {
      providesTags: ['TradingWallet'],
    },
    registerTradingWallet: {
      invalidatesTags: ['TradingWallet'],
    },
  },
});

export * from './core';
