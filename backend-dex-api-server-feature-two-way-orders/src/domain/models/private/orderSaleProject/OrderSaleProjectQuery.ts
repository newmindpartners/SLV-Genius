import type {
  listOrderSalePortfolioProjects,
  OrderSaleProjectRoundStatus,
} from '~/domain/models/public';
import type {PaginationQuery} from '~/domain/models/private';

type ListOrderSalePortfolioProjectsInput = NonNullable<
  Parameters<typeof listOrderSalePortfolioProjects>[0]
>;

export type OrderSaleProjectQuery = PaginationQuery & {
  /**
   * Filter results by exact project's status values comma separated
   */
  status?: Array<OrderSaleProjectRoundStatus>;
} & Pick<ListOrderSalePortfolioProjectsInput, 'filterByWalletStakeKeyHash'>;
