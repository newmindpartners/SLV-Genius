import { createContext, FC, ReactNode, useContext, useState } from 'react';

export type OrderCardOrderType = 'limit' | 'bestAvailable';

type MarketPriceContextProviderProps = {
  children: ReactNode;
};

export type MarketPriceContextProps = {
  marketPriceDetails: MarketPriceDetails;
  setMarketPriceDetails: (marketPriecDetails: MarketPriceDetails) => void;
};

export type MarketPriceDetails = {
  marketPrice: string | null;
};

export const MarketPriceContext = createContext<MarketPriceContextProps | null>(null);

export const useMarketPrice = (): MarketPriceContextProps => {
  const usetMarketPriceDetails = useContext(MarketPriceContext);

  if (!usetMarketPriceDetails) {
    throw Error('Cannot use MarketPriceContext outside of MarketPriceContextProvider');
  } else {
    return usetMarketPriceDetails;
  }
};

const MarketPriceContextProvider: FC<MarketPriceContextProviderProps> = ({
  children,
}) => {
  const [marketPriceDetails, setMarketPriceDetails] = useState<MarketPriceDetails>({
    marketPrice: null,
  });

  return (
    <MarketPriceContext.Provider value={{ marketPriceDetails, setMarketPriceDetails }}>
      {children}
    </MarketPriceContext.Provider>
  );
};

export default MarketPriceContextProvider;
