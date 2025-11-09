import {getTradingWallet} from '~/domain/models/public';

export type TradingWalletQuery = {
  tradingWalletId: NonNullable<Parameters<typeof getTradingWallet>[0]>;
};
