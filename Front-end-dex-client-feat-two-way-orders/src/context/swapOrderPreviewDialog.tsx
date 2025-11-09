import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { PreviewOrderDialogProps } from '~/pages/Swap/components/Dialogs/PreviewOrderDialog';
import { FormattedFee } from '~/utils/swapOrderFeeUtils';

type OrderPreviewProviderProps = {
  children: ReactNode;
};

export type DialogOnDataChangeState = {
  fee: FormattedFee[];
  isLoadingFee: boolean;
  isLoadingSubmission: boolean;
};

export type DialogState = Pick<PreviewOrderDialogProps, 'payload' | 'transactionType'>;

export type OrderPreviewDialogContextProps = {
  orderPreviewDialogData: PreviewOrderDialogProps | null;
  onDialogOpen: (newState: DialogState) => void;
  onClose: () => void;
  onDialogDataChange: (newState: DialogOnDataChangeState) => void;
};

export const OrderPreviewDialogContext =
  createContext<OrderPreviewDialogContextProps | null>(null);

export const useSwapOrderPreviewDialog = (): OrderPreviewDialogContextProps => {
  const useDialog = useContext(OrderPreviewDialogContext);

  if (!useDialog) {
    throw Error(
      'Cannot use OrderPreviewDialogContext outside of OrderPreviewDialogProvider',
    );
  } else {
    return useDialog;
  }
};

const OrderPreviewDialogProvider: FC<OrderPreviewProviderProps> = ({ children }) => {
  const [orderPreviewDialogData, setOrderPreviewDialogData] =
    useState<PreviewOrderDialogProps | null>(null);

  const onClose = () => {
    setOrderPreviewDialogData(null);
  };

  const onDialogOpen = (newState: DialogState) => {
    setOrderPreviewDialogData(() => ({
      ...newState,
      onClose,
      open: true,
    }));
  };

  const onDialogDataChange = (newState: DialogOnDataChangeState) => {
    if (!orderPreviewDialogData || !orderPreviewDialogData.payload) {
      throw new Error('Incorrect Preview Dialog usage');
    }
    setOrderPreviewDialogData({
      ...orderPreviewDialogData,
      payload: {
        ...orderPreviewDialogData.payload,
        ...newState,
      },
    });
  };

  return (
    <OrderPreviewDialogContext.Provider
      value={{ onClose, onDialogOpen, onDialogDataChange, orderPreviewDialogData }}
    >
      {children}
    </OrderPreviewDialogContext.Provider>
  );
};

export default OrderPreviewDialogProvider;
