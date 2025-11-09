import { useContext } from 'react';
import AlertDialog from '~/components/Dialogs/AlertDialog';
import ConnectWalletDialog from '~/components/Dialogs/ConnectWalletDialog/ConnectWalletDialog';
import StakingUpdateDialog from '~/components/Dialogs/StakingUpdateDialog';
import { AlertDialogContext } from '~/context/alertDialog';
import { ConnectWalletDialogContext } from '~/context/connectWalletDialog';
import { StakingUpdateDialogContext } from '~/context/stakingUpdateDialog';

const AppDialogs = () => {
  const connectWalletContext = useContext(ConnectWalletDialogContext);
  const alertContext = useContext(AlertDialogContext);
  const stakingUpdateContext = useContext(StakingUpdateDialogContext);

  return (
    <>
      {connectWalletContext?.connectWalletDialogData && (
        <ConnectWalletDialog
          {...connectWalletContext?.connectWalletDialogData}
          disconnectButtonProps={{
            style: {
              color: '#050518',
            },
          }}
        />
      )}
      {alertContext?.alertDialogData && (
        <AlertDialog {...alertContext?.alertDialogData} />
      )}
      {stakingUpdateContext?.stakingUpdateDialogData && (
        <StakingUpdateDialog {...stakingUpdateContext?.stakingUpdateDialogData} />
      )}
    </>
  );
};

export default AppDialogs;
