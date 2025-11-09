import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { ConnectWalletDialogProps } from '~/components/Dialogs/ConnectWalletDialog/ConnectWalletDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import { WalletType } from '~/types/wallet';
import { LOCAL_STORAGE_KEYS } from '~/utils/constants';

type ConnectWalletDialogProviderProps = {
  children: ReactNode;
};

type Props = {
  onOpen?: () => void;
};

export type DialogState = ConnectWalletDialogProps & Props;
export type OnDialogOpenState = Partial<Pick<DialogState, 'onOpen' | 'callback'>>;

export type ConnectWalletDialogContextProps = {
  onDialogOpen: (newState?: OnDialogOpenState) => void;
  onDialogClose: () => void;
  onDisconnectSuccess: () => void;
  connectWalletDialogData: ConnectWalletDialogProps | null;
};

export const ConnectWalletDialogContext =
  createContext<ConnectWalletDialogContextProps | null>(null);

export const useConnectWalletDialog = (): ConnectWalletDialogContextProps => {
  const useDialog = useContext(ConnectWalletDialogContext);

  if (!useDialog) {
    throw Error(
      'Cannot use ConnectWalletDialogContext outside of ConnectWalletDialogProvider',
    );
  } else {
    return useDialog;
  }
};

const isWalletTypeValid = (walletType: string | null): walletType is WalletType =>
  Object.values(WalletType).includes(walletType as WalletType);

const ConnectWalletDialogProvider: FC<ConnectWalletDialogProviderProps> = ({
  children,
}) => {
  const [connectWalletDialogData, setConnectWalletDialogData] =
    useState<DialogState | null>(null);

  const { walletType, handleWalletConnect } = useWallet();

  const onDialogClose = () => {
    setConnectWalletDialogData(null);
  };

  const onDialogOpen = (newState?: OnDialogOpenState) => {
    setConnectWalletDialogData(() => ({
      ...newState,
      onClose: onDialogClose,
      open: true,
    }));
  };

  const onDisconnectSuccess = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_CONNECTED_WALLET_TYPE);
  };

  useEffect(() => {
    if (walletType) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_CONNECTED_WALLET_TYPE, walletType);
    }
  }, [walletType]);

  useEffect(() => {
    const walletType = localStorage.getItem(
      LOCAL_STORAGE_KEYS.USER_CONNECTED_WALLET_TYPE,
    );

    if (isWalletTypeValid(walletType)) {
      handleWalletConnect(walletType);
    }
  }, []);

  return (
    <ConnectWalletDialogContext.Provider
      value={{
        onDialogOpen,
        onDialogClose,
        onDisconnectSuccess,
        connectWalletDialogData,
      }}
    >
      {children}
    </ConnectWalletDialogContext.Provider>
  );
};

export default ConnectWalletDialogProvider;
