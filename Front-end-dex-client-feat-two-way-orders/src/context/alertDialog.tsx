import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { AlertDialogProps } from '~/components/Dialogs/AlertDialog';

type AlertDialogProviderProps = {
  children: ReactNode;
};

export type DialogState = Pick<
  AlertDialogProps,
  'alertType' | 'title' | 'description' | 'link'
>;

export type AlertDialogContextProps = {
  onDialogOpen: (newState: DialogState) => void;
  alertDialogData: AlertDialogProps | null;
};

export const AlertDialogContext = createContext<AlertDialogContextProps | null>(null);

export const getAlertDialogSubmitDescription = (transactionActionDescription: string) =>
  `Your ${transactionActionDescription} transaction is being submitted to the blockchain.` +
  ' If successfully processed, details will be available via the link below.';

export const useAlertDialog = (): AlertDialogContextProps => {
  const useDialog = useContext(AlertDialogContext);

  if (!useDialog) {
    throw Error('Cannot use AlertDialogContext outside of AlertDialogProvider');
  } else {
    return useDialog;
  }
};

const AlertDialogProvider: FC<AlertDialogProviderProps> = ({ children }) => {
  const [alertDialogData, setAlertDialogData] = useState<AlertDialogProps | null>(null);

  const onClose = () => {
    setAlertDialogData(null);
  };

  const onDialogOpen = (newState: DialogState) => {
    setAlertDialogData(() => ({
      ...newState,
      onClose,
      open: true,
    }));
  };

  return (
    <AlertDialogContext.Provider value={{ onDialogOpen, alertDialogData }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

export default AlertDialogProvider;
