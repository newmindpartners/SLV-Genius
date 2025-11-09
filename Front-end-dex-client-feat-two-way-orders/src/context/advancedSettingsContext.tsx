import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { DEFAULT_DATE } from '~/pages/Swap/components/Dialogs/AdvancedSettingsDialog';

export type OrderCardOrderType = 'limit' | 'bestAvailable';

type AdvancedSettingsContextProviderProps = {
  children: ReactNode;
};

export type AdvancedSettingsContextProps = {
  advancedSettings: AdvancedSettings;
  setAdvancedSettings: (newAdvancedSettings: AdvancedSettings) => void;
};

export type AdvancedSettings = {
  startDate: Date | null;
  endDate: Date | null;
  orderType: OrderCardOrderType;
};

export const AdvancedSettingsContext = createContext<AdvancedSettingsContextProps | null>(
  null,
);

export const useAdvancedSettings = (): AdvancedSettingsContextProps => {
  const useAdvancedSettingsData = useContext(AdvancedSettingsContext);

  if (!useAdvancedSettingsData) {
    throw Error(
      'Cannot use AdvancedSettingsContext outside of AdvancedSettingsContextProvider',
    );
  } else {
    return useAdvancedSettingsData;
  }
};

const AdvancedSettingsContextProvider: FC<AdvancedSettingsContextProviderProps> = ({
  children,
}) => {
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    startDate: DEFAULT_DATE,
    endDate: DEFAULT_DATE,
    orderType: 'limit',
  });

  return (
    <AdvancedSettingsContext.Provider value={{ advancedSettings, setAdvancedSettings }}>
      {children}
    </AdvancedSettingsContext.Provider>
  );
};

export default AdvancedSettingsContextProvider;
