import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { CancelOrderDialogProps } from '~/pages/Swap/components/Dialogs/CancelOrderDialog';

type CancelOrderProviderProps = {
  children: ReactNode;
};

export type DialogState = Pick<CancelOrderDialogProps, 'order'>;

export type CancelOrderDialogContextProps = {
  onDialogOpen: (newState: DialogState) => void;
  cancelOrderDialogData: CancelOrderDialogProps | null;
};

export const CancelOrderDialogContext =
  createContext<CancelOrderDialogContextProps | null>(null);

export const useCancelOrderDialog = (): CancelOrderDialogContextProps => {
  const useDialog = useContext(CancelOrderDialogContext);

  if (!useDialog) {
    throw Error(
      'Cannot use CancelOrderDialogContext outside of CancelOrderDialogProvider',
    );
  } else {
    return useDialog;
  }
};

const CancelOrderDialogProvider: FC<CancelOrderProviderProps> = ({ children }) => {
  const [cancelOrderDialogData, setCancelOrderDialogData] =
    useState<CancelOrderDialogProps | null>(null);

  const onClose = () => {
    setCancelOrderDialogData(null);
  };

  const onDialogOpen = (newState: DialogState) => {
    setCancelOrderDialogData(() => ({
      ...newState,
      onClose,
      open: true,
    }));
  };

  return (
    <CancelOrderDialogContext.Provider value={{ onDialogOpen, cancelOrderDialogData }}>
      {children}
    </CancelOrderDialogContext.Provider>
  );
};

export default CancelOrderDialogProvider;
