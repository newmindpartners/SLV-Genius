import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { AdvancedSettingsDialogProps } from '~/pages/Swap/components/Dialogs/AdvancedSettingsDialog';

type AdvancedSettingsProviderProps = {
  children: ReactNode;
};

export type DialogState = AdvancedSettingsDialogProps;

export type AdvancedSettingsDialogContextProps = {
  onDialogOpen: (newState?: DialogState) => void;
  advancedSettingsDialogData: AdvancedSettingsDialogProps | null;
};

export const AdvancedSettingsDialogContext =
  createContext<AdvancedSettingsDialogContextProps | null>(null);

export const useAdvancedSettingsDialog = (): AdvancedSettingsDialogContextProps => {
  const useDialog = useContext(AdvancedSettingsDialogContext);

  if (!useDialog) {
    throw Error(
      'Cannot use AdvancedSettingsDialogContext outside of AdvancedSettingsDialogProvider',
    );
  } else {
    return useDialog;
  }
};

const AdvancedSettingsDialogProvider: FC<AdvancedSettingsProviderProps> = ({
  children,
}) => {
  const [advancedSettingsDialogData, setAdvancedSettingsDialogData] =
    useState<AdvancedSettingsDialogProps | null>(null);

  const onClose = () => {
    setAdvancedSettingsDialogData(null);
  };

  const defaultDialogState: DialogState = {
    advancedSettings: {
      startDate: null,
      endDate: null,
      orderType: 'limit',
    },

    setAdvancedSettings: () => {},
    onClose: onClose,
  };

  const onDialogOpen = (newState: DialogState = defaultDialogState) =>
    setAdvancedSettingsDialogData(() => ({
      ...newState,
      onClose,
      open: true,
    }));

  return (
    <AdvancedSettingsDialogContext.Provider
      value={{ onDialogOpen, advancedSettingsDialogData }}
    >
      {children}
    </AdvancedSettingsDialogContext.Provider>
  );
};

export default AdvancedSettingsDialogProvider;
