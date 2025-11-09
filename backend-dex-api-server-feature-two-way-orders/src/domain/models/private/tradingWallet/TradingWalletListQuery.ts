import {listTradingWallets} from '~/domain/models/public';

export type TradingWalletListQuery = NonNullable<
  Parameters<typeof listTradingWallets>[0]
>;

export type TradingWalletOrderBy =
  Required<TradingWalletListQuery>['sortTradingWalletOrderBy'];
