import { FC } from 'react';
import TradingPairsContextProvider from '~/context/tradingPairsContext';

import DialogsProviders from '../Explore/DialogsProviders';
import PageContent from './PageContent';

export interface Props {}

export const SmartVaults: FC<Props> = () => {
  return (
    <TradingPairsContextProvider>
      <DialogsProviders>
        <PageContent />
      </DialogsProviders>
    </TradingPairsContextProvider>
  );
};

export default SmartVaults;
