import { useCancelOrderDialog } from '~/context/cancelOrderDialog';

import CancelOrderDialog from '../Swap/components/Dialogs/CancelOrderDialog';

const Dialogs = () => {
  const { cancelOrderDialogData } = useCancelOrderDialog();

  const handleCloseCancelOrderDialog = () => {
    cancelOrderDialogData?.onClose();
  };

  return (
    <>
      {cancelOrderDialogData && (
        <CancelOrderDialog
          {...cancelOrderDialogData}
          onClose={handleCloseCancelOrderDialog}
        />
      )}
    </>
  );
};

export default Dialogs;
