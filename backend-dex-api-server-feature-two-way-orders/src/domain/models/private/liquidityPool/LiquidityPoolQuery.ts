import type {PaginationQuery} from '~/domain/models/private';
import type {listLiquidityPool} from '~/domain/models/public';

type ListLiquidityPoolsInput = NonNullable<
  Parameters<typeof listLiquidityPool>[0]
>;

export type LiquidityPoolQuery = PaginationQuery & {
  sortBy?: string;
  filterSearch?: string;
} & ListLiquidityPoolsInput;
