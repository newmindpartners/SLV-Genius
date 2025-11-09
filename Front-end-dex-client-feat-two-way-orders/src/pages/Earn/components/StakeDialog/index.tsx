import { useCallback, useEffect, useState } from 'react';
import SelectionDialog from '~/components/Dialogs/SelectionDialog';
import { useWalletBalanceRecord } from '~/hooks/wallet/walletBalanceRecord';
import { Asset, StakeVault, StakingNft, StakingProject } from '~/redux/api';
import { indivisibleToUnit } from '~/utils/mathUtils';
import { WalletBalanceRecord } from '~/utils/wallet';

import StakeDetailsDialog from '../StakeDetailsDialog';

const HEADER_TITLE = 'New Staking Vault';
const HEADER_SUBTITLE = 'Select a token to stake';

type StakeDialogProps = {
  projects: StakingProject[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
  walletStakingNfts: StakingNft[];
  refetchStakeVaults: () => Promise<StakeVault[]>;
  onCreateStakeVaultSuccess: () => void;
  handleClose: () => void;
};

const StakeDialog = ({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  walletStakingNfts,
  refetchStakeVaults,
  onCreateStakeVaultSuccess,
  handleClose,
}: StakeDialogProps) => {
  const [isStakeDetailsDialogOpen, setIsStakeDetailsDialogOpen] =
    useState<boolean>(false);
  const [isStakeSelectionDialogOpen, setIsStakeSelectionDialogOpen] =
    useState<boolean>(false);

  const openStakeSelectionDialog = useCallback(() => {
    setIsStakeSelectionDialogOpen(true);
  }, [isStakeSelectionDialogOpen]);

  const closeStakeSelectionDialog = useCallback(() => {
    setIsStakeSelectionDialogOpen(false);
    handleClose();
  }, [isStakeSelectionDialogOpen]);

  const openStakeDialog = useCallback(
    () => setIsStakeDetailsDialogOpen(true),
    [isStakeDetailsDialogOpen],
  );

  const closeStakeDialog = useCallback(() => {
    setIsStakeDetailsDialogOpen(false);
    handleClose();
  }, [isStakeDetailsDialogOpen]);

  useEffect(() => {
    openStakeSelectionDialog();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      setIsStakeSelectionDialogOpen(false);
      openStakeDialog();
    }
  }, [selectedProjectId]);

  const getAssetBalanceLabel = (asset: Asset, walletBalance: WalletBalanceRecord) => {
    const amount = walletBalance[asset?.assetId]
      ? indivisibleToUnit(walletBalance[asset.assetId], asset.decimalPrecision)
      : null;

    return amount ? `${amount} ${asset.shortName}` : '';
  };

  const walletBalance = useWalletBalanceRecord();

  const selectionOptions = projects.map(
    ({ stakingAsset, stakingProjectId, imageLogoUrl }) => ({
      image: imageLogoUrl,
      label: stakingAsset.shortName,
      id: stakingProjectId,
      balance: getAssetBalanceLabel(stakingAsset, walletBalance),
    }),
  );

  const onSelectOption = (id: string) => setSelectedProjectId(id);

  return (
    <>
      <SelectionDialog
        options={selectionOptions}
        open={isStakeSelectionDialogOpen}
        heading={{ title: HEADER_TITLE, subtitle: HEADER_SUBTITLE }}
        onSelectOption={onSelectOption}
        onClose={closeStakeSelectionDialog}
      />
      <StakeDetailsDialog
        selectedProjectId={selectedProjectId}
        projects={projects}
        nfts={walletStakingNfts}
        open={isStakeDetailsDialogOpen}
        setSelectedProjectId={setSelectedProjectId}
        refetchStakeVaults={refetchStakeVaults}
        onCreateStakeVaultSuccess={onCreateStakeVaultSuccess}
        onClose={closeStakeDialog}
      />
    </>
  );
};

export default StakeDialog;
