import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { StakingUpdateDialogProps } from '~/components/Dialogs/StakingUpdateDialog';

type StakingUpdateDialogProviderProps = {
  children: ReactNode;
};

export type StakingUpdateDialogContextProps = {
  onDialogOpen: () => void;
  stakingUpdateDialogData: StakingUpdateDialogProps | null;
};

export const StakingUpdateDialogContext =
  createContext<StakingUpdateDialogContextProps | null>(null);

export const useStakingUpdateDialog = (): StakingUpdateDialogContextProps => {
  const useDialog = useContext(StakingUpdateDialogContext);

  if (!useDialog) {
    throw Error('Cannot use AlertDialogContext outside of AlertDialogProvider');
  } else {
    return useDialog;
  }
};

const StakingUpdateDialogProvider: FC<StakingUpdateDialogProviderProps> = ({
  children,
}) => {
  const [stakingUpdateDialogData, setStakingUpdateDialogData] =
    useState<StakingUpdateDialogProps | null>(null);

  const onClose = () => {
    setStakingUpdateDialogData(null);
  };

  const onDialogOpen = () => {
    setStakingUpdateDialogData(() => ({
      onClose,
      open: true,
    }));
  };

  return (
    <StakingUpdateDialogContext.Provider
      value={{ onDialogOpen, stakingUpdateDialogData }}
    >
      {children}
    </StakingUpdateDialogContext.Provider>
  );
};

export default StakingUpdateDialogProvider;
