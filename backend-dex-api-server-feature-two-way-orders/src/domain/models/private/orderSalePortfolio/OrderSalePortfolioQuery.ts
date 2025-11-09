import type {PaginationQuery} from '~/domain/models/private';

export type OrderSalePortfolioQuery = PaginationQuery & {
  filterByWalletStakeKeyHash?: string;
};
