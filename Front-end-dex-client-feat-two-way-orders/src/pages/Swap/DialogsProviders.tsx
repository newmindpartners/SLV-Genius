import { ReactNode } from 'react';
import AdvancedSettingsDialogProvider from '~/context/advancedSettingsDialog';
import CancelOrderDialogProvider from '~/context/cancelOrderDialog';
import OrderBookDialogProvider from '~/context/orderBookDialog';
import OrderPreviewDialogProvider from '~/context/swapOrderPreviewDialog';

type SwapPageDialogsContextProviderProps = {
  children: ReactNode;
};

const DialogsProviders = ({ children }: SwapPageDialogsContextProviderProps) => (
  <OrderBookDialogProvider>
    <CancelOrderDialogProvider>
      <OrderPreviewDialogProvider>
        <AdvancedSettingsDialogProvider>{children}</AdvancedSettingsDialogProvider>
      </OrderPreviewDialogProvider>
    </CancelOrderDialogProvider>
  </OrderBookDialogProvider>
);

export default DialogsProviders;
