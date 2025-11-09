import AdvancedSettingsContextProvider from '~/context/advancedSettingsContext';
import { FiatPriceContextProvider } from '~/context/fiatPriceContext';
import MarketPriceContextProvider from '~/context/marketPriceContext';
import TradingPairsContextProvider from '~/context/tradingPairsContext';
import useSwapDefaultTradingPair from '~/hooks/swap/trading/useSwapDefaultTradingPair';

import CustomGlobalStyles from './CustomGlobalStyles';
import Dialogs from './Dialogs';
import DialogsProviders from './DialogsProviders';
import SwapPageContent from './SwapPageContent';

const Swap = (): JSX.Element => (
  <TradingPairsContextProvider>
    <DialogsProviders>
      <FiatPriceContextProvider>
        <AdvancedSettingsContextProvider>
          <MarketPriceContextProvider>
            <SwapContent />
          </MarketPriceContextProvider>
        </AdvancedSettingsContextProvider>
      </FiatPriceContextProvider>
    </DialogsProviders>
  </TradingPairsContextProvider>
);

const SwapContent = () => {
  useSwapDefaultTradingPair();

  return (
    <>
      <SwapPageContent />
      <Dialogs />
      <CustomGlobalStyles />
    </>
  );
};

export default Swap;
