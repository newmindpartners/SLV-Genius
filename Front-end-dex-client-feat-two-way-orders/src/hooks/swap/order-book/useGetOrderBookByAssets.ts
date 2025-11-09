import { useEffect, useState } from 'react';
import { useMarketPrice } from '~/context/marketPriceContext';
import { useGetOrderBookByAssetsQuery } from '~/redux/api';

type UseGetOrderBookByAssetsArgs = {
  pollingInterval?: number;
  skip?: boolean;
  tradingPairString: string;
};

export const useGetOrderBookByAssets = ({
  pollingInterval,
  skip = false,
  tradingPairString,
}: UseGetOrderBookByAssetsArgs) => {
  const [isLoadingWithArgsUpdated, setIsLoadingWithArgsUpdated] = useState(false);
  const { setMarketPriceDetails } = useMarketPrice();

  const orderBook = useGetOrderBookByAssetsQuery(
    { assetPair: tradingPairString },
    {
      pollingInterval,
      skip,
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (tradingPairString) {
      setIsLoadingWithArgsUpdated(true);
    }
  }, [tradingPairString]);

  useEffect(() => {
    if (!orderBook.isFetching) {
      setIsLoadingWithArgsUpdated(false);
    }
  }, [orderBook.isFetching]);

  useEffect(() => {
    if (orderBook.data?.marketPrice) {
      setMarketPriceDetails({
        marketPrice: orderBook?.data?.marketPrice,
      });
    }
  }, [setMarketPriceDetails, orderBook?.data?.marketPrice]);

  return { ...orderBook, isLoadingWithArgsUpdated };
};
