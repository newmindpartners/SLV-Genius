import { FC, useState } from 'react';
import BlurryDialog from '~/components/Dialogs/Dialog/BlurryDialog';
import { AdvancedSettings } from '~/context/advancedSettingsContext';

import Actions from './Actions';
import Content from './Content';

export const DEFAULT_DATE = null;
export const DEFAULT_PRICE_MARGIN_PERCENTAGE = '3';
export const PRICE_MARGIN_VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export type AdvancedSettingsDialogProps = {
  advancedSettings: AdvancedSettings;
  setAdvancedSettings: (newAdvancedSettings: AdvancedSettings) => void;

  onClose: () => void;
};

const AdvancedSettingsDialog: FC<AdvancedSettingsDialogProps> = ({
  advancedSettings,
  setAdvancedSettings,
  onClose,
}) => {
  const [settings, setSettings] = useState<AdvancedSettings>({
    ...advancedSettings,
  });

  const handleClose = () => {
    onClose();
  };

  const onSave = () => {
    setAdvancedSettings(settings);
    onClose();
  };

  return (
    <BlurryDialog title="Advanced Settings" onClose={handleClose}>
      <Content settings={settings} setSettings={setSettings} />
      <Actions onClose={onClose} onSave={onSave} />
    </BlurryDialog>
  );
};

export default AdvancedSettingsDialog;
