import { useEffect, useState } from 'react';
import {
  ListSwapOrdersApiArg,
  SwapOrderResults,
  useListSwapOrdersQuery,
} from '~/redux/api';

export type UseListSwapOrdersArgs = Pick<
  ListSwapOrdersApiArg,
  | 'filterByWalletStakeKeyHash'
  | 'count'
  | 'filterByOrderSwapStatus'
  | 'sortSwapOrders'
  | 'filterByAssetId'
> & {
  skip?: boolean;
  pollingInterval?: number;
};

const isPreviousPageExists = (
  listSwapOrdersData: SwapOrderResults | undefined,
): boolean => !!listSwapOrdersData?.previous;

const isNextPageExists = (listSwapOrdersData: SwapOrderResults | undefined): boolean =>
  !!listSwapOrdersData?.next &&
  listSwapOrdersData.next !==
    listSwapOrdersData.results[listSwapOrdersData.results.length - 1].orderId;

const useSwapListOrders = ({
  filterByWalletStakeKeyHash,
  sortSwapOrders = '-created',
  count,
  skip,
  pollingInterval,
  filterByOrderSwapStatus,
  filterByAssetId,
}: UseListSwapOrdersArgs) => {
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoadingWithArgsUpdated, setIsLoadingWithArgsUpdated] = useState(false);

  const args = {
    filterByWalletStakeKeyHash,
    sortSwapOrders: sortSwapOrders,
    count,
    cursor: cursor || undefined,
    filterByOrderSwapStatus: filterByOrderSwapStatus,
    filterByAssetId,
  };

  const options = {
    pollingInterval,
    skip,
    refetchOnMountOrArgChange: true,
    sortSwapOrders: sortSwapOrders,
  };

  const listSwapOrders = useListSwapOrdersQuery(args, options);
  const listSwapOrdersData = listSwapOrders.data;

  const goToNextPage = () => {
    if (listSwapOrdersData?.next) {
      setCursor(listSwapOrdersData?.next);
    }
  };

  const goToPreviousPage = () => {
    if (listSwapOrdersData?.previous) {
      setCursor(listSwapOrdersData?.previous);
    }
  };

  const hasPreviousPage = isPreviousPageExists(listSwapOrdersData);
  const hasNextPage = isNextPageExists(listSwapOrdersData);

  const resetCursor = () => setCursor(null);

  useEffect(() => {
    setIsLoadingWithArgsUpdated(true);
  }, [args.filterByOrderSwapStatus, args.sortSwapOrders, args.cursor]);

  useEffect(() => {
    if (!listSwapOrders.isFetching) {
      setIsLoadingWithArgsUpdated(false);
    }
  }, [listSwapOrders.isFetching]);

  return {
    data: {
      ...listSwapOrders,
      isLoadingWithArgsUpdated,
    },

    pagination: {
      hasNextPage,
      goToNextPage,

      hasPreviousPage,
      goToPreviousPage,
    },
    resetPagination: resetCursor,
  };
};

export default useSwapListOrders;
