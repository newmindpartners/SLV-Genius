import { AxiosResponse } from 'axios';
import { createContext, FC, PropsWithChildren, useState } from 'react';
import useInterval from '~/hooks/misc/useInterval';
import getUSDPrice, { GetUSDPriceResponse } from '~/utils/getADAUSDPrice';

export interface FiatPriceContextState {
  base: null | string;
  currency: null | string;
  amount: null | string;
}

export interface FiatPriceContextProps {
  delay?: number;
  url?: string;
}

const initialState = { base: null, currency: null, amount: null };

export const FiatPriceContext = createContext<FiatPriceContextState>(initialState);

export const FiatPriceContextProvider: FC<PropsWithChildren<FiatPriceContextProps>> = ({
  children,
  delay = 30000,
  url = 'https://api.coinbase.com/v2/prices/ADA-USD/spot',
}) => {
  const [state, setState] = useState<FiatPriceContextState>(initialState);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePriceUpdate = (response: AxiosResponse<GetUSDPriceResponse, any>) => {
    setState({
      ...state,
      base: response.data.data.base,
      currency: response.data.data.currency,
      amount: response.data.data.amount,
    });
  };

  useInterval(() => getUSDPrice(url).then(handlePriceUpdate), delay);

  return <FiatPriceContext.Provider value={state}>{children}</FiatPriceContext.Provider>;
};
