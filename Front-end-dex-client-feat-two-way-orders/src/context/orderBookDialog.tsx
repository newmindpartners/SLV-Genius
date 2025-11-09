import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { OrderBookDialogProps } from '~/pages/Swap/components/Dialogs/OrderBookDialog';

type OrderBookProviderProps = {
  children: ReactNode;
};

export type DialogState = OrderBookDialogProps;

export type OrderBookDialogContextProps = {
  onDialogOpen: (newState?: DialogState) => void;
  orderBookDialogData: OrderBookDialogProps | null;
};

export const OrderBookDialogContext = createContext<OrderBookDialogContextProps | null>(
  null,
);

export const useSwapOrderBookDialog = (): OrderBookDialogContextProps => {
  const useDialog = useContext(OrderBookDialogContext);

  if (!useDialog) {
    throw Error('Cannot use OrderBookDialogContext outside of OrderBookDialogProvider');
  } else {
    return useDialog;
  }
};

const OrderBookDialogProvider: FC<OrderBookProviderProps> = ({ children }) => {
  const [orderBookDialogData, setOrderBookDialogData] =
    useState<OrderBookDialogProps | null>(null);

  const onClose = () => {
    setOrderBookDialogData(null);
  };

  const onDialogOpen = (newState?: DialogState) => {
    setOrderBookDialogData(() => ({
      ...newState,
      onClose,
      open: true,
    }));
  };

  return (
    <OrderBookDialogContext.Provider value={{ onDialogOpen, orderBookDialogData }}>
      {children}
    </OrderBookDialogContext.Provider>
  );
};

export default OrderBookDialogProvider;
