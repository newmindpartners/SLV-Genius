import { useState } from 'react';
import useSwapListOrders, {
  UseListSwapOrdersArgs,
} from '~/hooks/swap/list-orders/useSwapListOrders';
import { SwapOrderSortByOptions } from '~/redux/api';

// Created because for the moment we can't use serviceFee from SwapOrderSort
export type SwapOrderSortNarrowed = Exclude<
  SwapOrderSortByOptions,
  '+serviceFee' | '-serviceFee'
>;

export type SortState = {
  column: keyof typeof sortOptionMap;
  direction: 'asc' | 'desc';
};

export type SortKeys = 'from' | 'to' | 'time';

export const sortOptionMap: Record<
  SortKeys,
  Record<'asc' | 'desc', SwapOrderSortNarrowed>
> = {
  from: {
    asc: '+fromAssetAmount',
    desc: '-fromAssetAmount',
  },
  to: {
    asc: '+toAssetAmount',
    desc: '-toAssetAmount',
  },
  time: {
    asc: '+created',
    desc: '-created',
  },
};

export type UseSwapListOrdersSortedParams = Pick<
  UseListSwapOrdersArgs,
  'filterByWalletStakeKeyHash' | 'filterByOrderSwapStatus' | 'sortSwapOrders' | 'count'
>;

export type UseSwapListOrdersSortedConfig = Pick<
  UseListSwapOrdersArgs,
  'skip' | 'pollingInterval'
>;

export const isKeyOfSortOptionMap = (key: string): key is keyof typeof sortOptionMap =>
  key in sortOptionMap;

const useSwapListOrdersSorted = (
  params: UseSwapListOrdersSortedParams,
  config: UseSwapListOrdersSortedConfig,
) => {
  const [sortState, setSortState] = useState<SortState>({
    column: 'time',
    direction: 'desc',
  });

  const combinedParams = {
    ...params,
    ...config,
    sortSwapOrders: sortOptionMap[sortState.column][sortState.direction],
  };

  const result = useSwapListOrders({
    ...combinedParams,
    skip: config.skip,
    pollingInterval: config.pollingInterval,
  });

  const handleSortChange = (content: string) => {
    if (isKeyOfSortOptionMap(content)) {
      const isSameColumn = content === sortState.column;

      // Toggle if it's the same column, default to 'desc' otherwise
      const newDirection: 'asc' | 'desc' = isSameColumn
        ? sortState.direction === 'asc'
          ? 'desc'
          : 'asc'
        : 'desc';

      setSortState({ column: content, direction: newDirection });
    }
  };

  return {
    ...result,
    sortState,
    handleSortChange,
  };
};

export default useSwapListOrdersSorted;
