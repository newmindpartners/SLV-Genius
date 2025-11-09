import { ReactNode } from 'react';
import CancelOrderDialogProvider from '~/context/cancelOrderDialog';

type DialogsProvidersProps = {
  children: ReactNode;
};

const DialogsProviders = ({ children }: DialogsProvidersProps) => (
  <CancelOrderDialogProvider>{children}</CancelOrderDialogProvider>
);

export default DialogsProviders;
