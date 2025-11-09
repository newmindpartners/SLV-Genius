import { ReactNode } from 'react';
import AlertDialogProvider from '~/context/alertDialog';
import ConnectWalletDialogProvider from '~/context/connectWalletDialog';
import StakingUpdateDialogProvider from '~/context/stakingUpdateDialog';

type DialogProvidersProps = {
  children: ReactNode;
};

const AppProviders = ({ children }: DialogProvidersProps) => (
  <StakingUpdateDialogProvider>
    <AlertDialogProvider>
      <ConnectWalletDialogProvider>{children}</ConnectWalletDialogProvider>
    </AlertDialogProvider>
  </StakingUpdateDialogProvider>
);

export default AppProviders;
