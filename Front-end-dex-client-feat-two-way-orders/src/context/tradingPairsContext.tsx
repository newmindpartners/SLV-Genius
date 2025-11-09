import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { TradingPair, useListTradingPairsQuery } from '~/redux/api';
import {
  findTradingPair,
  getTradingAssetsFromTradingPairs,
  TradingAsset,
  TradingPairAssets,
} from '~/utils/tradingPairsUtils';

type TradingPairsContextProviderProps = {
  children: ReactNode;
};

export type TradingPairsContextProps = {
  tradingPairs: TradingPair[];
  tradingAssets: TradingAsset[];
  isLoadingTradingAssets: boolean;
  selectedAssets: TradingPairAssets;
  marketDataAssets: TradingPairAssets;
  selectedTradingPair: TradingPair | null;
  handleSetTradingPairAssets: (selectedAssets: TradingPairAssets) => void;
  handleSetMarketDataPairAssets: (marketDataAssets: TradingPairAssets) => void;
};

export const TradingPairsContext = createContext<TradingPairsContextProps | null>(null);

export const useTradingPairs = (): TradingPairsContextProps => {
  const useTradingPairsData = useContext(TradingPairsContext);

  if (!useTradingPairsData) {
    throw Error('Cannot use TradingPairsContext outside of TradingPairsContextProvider');
  } else {
    return useTradingPairsData;
  }
};

const TradingPairsContextProvider: FC<TradingPairsContextProviderProps> = ({
  children,
}) => {
  const { data, isLoading: isLoadingTradingPairs } = useListTradingPairsQuery();

  const [selectedAssets, setSelectedAssets] = useState<TradingPairAssets>({
    from: null,
    to: null,
  });

  const [marketDataAssets, setMarketDataAssets] = useState<TradingPairAssets>({
    from: null,
    to: null,
  });

  const tradingPairs = data?.results || [];
  const tradingAssets = getTradingAssetsFromTradingPairs(tradingPairs);
  const isLoadingTradingAssets = isLoadingTradingPairs;

  const selectedTradingPair = findTradingPair(
    selectedAssets.from,
    selectedAssets.to,
    tradingPairs,
  );

  const handleSetTradingPairAssets = (newTradingPairAssets: TradingPairAssets) => {
    const newTradingPair = findTradingPair(
      newTradingPairAssets.from,
      newTradingPairAssets.to,
      tradingPairs,
    );

    setSelectedAssets(newTradingPairAssets);

    if (selectedTradingPair?.tradingPairId !== newTradingPair?.tradingPairId) {
      handleSetMarketDataPairAssets({
        from: newTradingPair?.baseAsset as TradingAsset,
        to: newTradingPair?.quoteAsset as TradingAsset,
      });
    }
  };

  const handleSetMarketDataPairAssets = (newMarketDataAssets: TradingPairAssets) => {
    setMarketDataAssets(newMarketDataAssets);
  };

  return (
    <TradingPairsContext.Provider
      value={{
        tradingPairs,
        tradingAssets,
        isLoadingTradingAssets,
        selectedAssets,
        marketDataAssets,
        selectedTradingPair,
        handleSetTradingPairAssets,
        handleSetMarketDataPairAssets,
      }}
    >
      {children}
    </TradingPairsContext.Provider>
  );
};

export default TradingPairsContextProvider;
