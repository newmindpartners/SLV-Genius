import AdvancedSettingsContextProvider from '~/context/advancedSettingsContext';
import { FiatPriceContextProvider } from '~/context/fiatPriceContext';
import MarketPriceContextProvider from '~/context/marketPriceContext';
import PoolsContextProvider from '~/context/tradingPairsContext';

import { OptionsContent } from './components/OptionsContent';
import { OptionsGlobalStyles } from './components/OptionsGlobalStyles';

export const Options = () => (
  <PoolsContextProvider>
    <FiatPriceContextProvider>
      <AdvancedSettingsContextProvider>
        <MarketPriceContextProvider>
          <OptionsContentWithDefaultTradingPair />
          <OptionsGlobalStyles />
        </MarketPriceContextProvider>
      </AdvancedSettingsContextProvider>
    </FiatPriceContextProvider>
  </PoolsContextProvider>
);

export const OptionsContentWithDefaultTradingPair = () => {
  return <OptionsContent />;
};
