import { useAdvancedSettings } from '~/context/advancedSettingsContext';
import { useAdvancedSettingsDialog } from '~/context/advancedSettingsDialog';
import { useCancelOrderDialog } from '~/context/cancelOrderDialog';
import { useSwapOrderBookDialog } from '~/context/orderBookDialog';
import { useSwapOrderPreviewDialog } from '~/context/swapOrderPreviewDialog';
import OrderBookDialog from '~/pages/Swap/components/Dialogs/OrderBookDialog';

import AdvancedSettingsDialog from './components/Dialogs/AdvancedSettingsDialog';
import CancelOrderDialog from './components/Dialogs/CancelOrderDialog';
import PreviewOrderDialog from './components/Dialogs/PreviewOrderDialog';

const Dialogs = () => {
  const { orderPreviewDialogData } = useSwapOrderPreviewDialog();
  const { advancedSettingsDialogData } = useAdvancedSettingsDialog();
  const { advancedSettings, setAdvancedSettings } = useAdvancedSettings();
  const { cancelOrderDialogData } = useCancelOrderDialog();
  const { orderBookDialogData } = useSwapOrderBookDialog();

  const handleCloseOrderPreviewDialog = () => {
    orderPreviewDialogData?.onClose();
  };

  const handleCloseAdvancedSettingsDialog = () => {
    advancedSettingsDialogData?.onClose();
  };

  const handleCloseCancelOrderDialog = () => {
    cancelOrderDialogData?.onClose();
  };

  const handleCloseOrderBookDialog = () => {
    orderBookDialogData?.onClose();
  };

  return (
    <>
      {orderPreviewDialogData && (
        <PreviewOrderDialog
          {...orderPreviewDialogData}
          onClose={handleCloseOrderPreviewDialog}
        />
      )}

      {advancedSettingsDialogData && (
        <AdvancedSettingsDialog
          {...advancedSettingsDialogData}
          advancedSettings={advancedSettings}
          setAdvancedSettings={setAdvancedSettings}
          onClose={handleCloseAdvancedSettingsDialog}
        />
      )}

      {cancelOrderDialogData && (
        <CancelOrderDialog
          {...cancelOrderDialogData}
          onClose={handleCloseCancelOrderDialog}
        />
      )}

      {orderBookDialogData && (
        <OrderBookDialog {...orderBookDialogData} onClose={handleCloseOrderBookDialog} />
      )}
    </>
  );
};

export default Dialogs;
