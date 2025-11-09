import {
  CircularProgress,
  Grid,
  SelectChangeEvent,
  styled,
  Typography,
} from '@mui/material';
import * as Sentry from '@sentry/react';
import { ChangeEvent, FC, FormEvent, MouseEvent, useEffect, useState } from 'react';
import Button from '~/components/Button/Button';
import Dialog from '~/components/Dialogs/Dialog/Dialog';
import DialogContent from '~/components/Dialogs/Dialog/DialogContent';
import { Close } from '~/components/Icons/Icons';
import { useWalletBalanceRecord } from '~/hooks/wallet/walletBalanceRecord';
import {
  Asset,
  StakeVault,
  StakeVaultData,
  StakeVaultLockDuration,
  StakingNft,
  StakingProject,
} from '~/redux/api';
import { indivisibleToUnit, isGreater, unitToIndivisible } from '~/utils/mathUtils';
import { clearStringNumericInput } from '~/utils/swapOrderUtils';
import { WalletBalanceRecord } from '~/utils/wallet';

import useStakeVaultCreation from '../../hooks/useStakeVaultCreation';
import useStakeVaultRewards from '../../hooks/useStakeVaultRewards';
import Heading from './Heading';
import LockPeriodSwitcher from './LockPeriodSwitcher';
import NftsInfo from './NftsInfo';
import Rewards from './Rewards';
import StakeAmountField from './StakeAmountField';
import StakeNftsField from './StakeNftsField';

type StakeDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
  projects: StakingProject[];
  nfts: StakingNft[];
  refetchStakeVaults: () => Promise<StakeVault[]>;
  onCreateStakeVaultSuccess: () => void;
};

export type DialogData = {
  stakeAmount: string | null;
  selectedNfts: string[];
  lockPeriod: StakeVaultLockDuration | null;
};

const DialogDataInitialState: DialogData = {
  stakeAmount: null,
  selectedNfts: [],
  lockPeriod: null,
};

const StakeDetailsDialog: FC<StakeDetailsDialogProps> = ({
  open,
  selectedProjectId,
  projects,
  nfts,
  setSelectedProjectId,
  refetchStakeVaults,
  onCreateStakeVaultSuccess,
  onClose,
}) => {
  const [dialogData, setDialogData] = useState<DialogData>(DialogDataInitialState);

  const walletBalance = useWalletBalanceRecord();

  const selectedProject = projects?.find(
    (project) => project?.stakingProjectId === selectedProjectId,
  );

  const { isLoading: isLoadingStakeVaultCreation, createStakeVault } =
    useStakeVaultCreation({
      refetchStakeVaults,
      onCreateStakeVaultSuccess,
      onClose,
    });

  const {
    isLoading: isLoadingStakeVaultRewards,
    stakeVaultRewards,
    fetchStakeVaultRewards,
  } = useStakeVaultRewards();

  useEffect(() => {
    if (selectedProject) {
      setDialogData({
        ...dialogData,
        lockPeriod: selectedProject?.lockDurationOptions?.[0],
      });
    }
  }, [selectedProject]);

  const maxAmount = 100000000;

  const handleStakeAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const sanitizedValue = clearStringNumericInput(newValue, 6);

    if (sanitizedValue && isGreater(sanitizedValue, maxAmount)) return;

    setDialogData((prev) => ({ ...prev, stakeAmount: sanitizedValue }));
  };

  const handleSelectedProjectChange = (e: SelectChangeEvent<unknown>) => {
    const shortName = e.target.value;
    const project = projects.find(
      (project) => project.stakingAsset.shortName === shortName,
    );
    if (project?.stakingProjectId) {
      setSelectedProjectId(project.stakingProjectId);
    } else {
      Sentry.captureMessage('User selected invalid Staking Project');
    }
  };

  const handleSelectedNftsChange = (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value;
    if (Array.isArray(value) || typeof value === 'string') {
      const newSelected = typeof value === 'string' ? value.split(',') : value;
      setDialogData((prev) => ({ ...prev, selectedNfts: newSelected }));
    }
  };

  const handleLockPeriodChange = (
    _: MouseEvent<HTMLElement>,
    period: StakeVaultLockDuration,
  ) => {
    // This is done to avoid "toggle" click that will unselect the active tab
    if (!period) return;

    setDialogData((prev) => ({
      ...prev,
      lockPeriod: period,
    }));
  };

  const parsedNfts = dialogData.selectedNfts.reduce(
    (acc: StakingNft[], currentNft: string) => {
      const nft = nfts.find(
        (nft) => nft.type + nft.subType + nft.assetName === currentNft,
      );
      return nft ? [...acc, nft] : acc;
    },
    [],
  );

  const handleSubmitStakeVault = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProject || !dialogData.lockPeriod) return;

    const stakeVault: StakeVaultData = {
      stakingProjectId: selectedProject?.stakingProjectId,
      lockDuration: dialogData?.lockPeriod,
      stakingNfts: parsedNfts,
      stakedAssetAmount: dialogData.stakeAmount
        ? unitToIndivisible(
            dialogData.stakeAmount,
            selectedProject.stakingAsset.decimalPrecision,
          )
        : '0',
    };
    createStakeVault(stakeVault);
  };

  useEffect(() => {
    if (!open) return;
    if (!selectedProject || !dialogData.lockPeriod) return;

    const stakeVault: StakeVaultData = {
      stakingProjectId: selectedProject?.stakingProjectId,
      lockDuration: dialogData?.lockPeriod,
      stakingNfts: parsedNfts,
      stakedAssetAmount: dialogData.stakeAmount
        ? unitToIndivisible(
            dialogData.stakeAmount,
            selectedProject.stakingAsset.decimalPrecision,
          )
        : '0',
    };
    fetchStakeVaultRewards(stakeVault);
  }, [
    open,
    dialogData.stakeAmount,
    selectedProjectId,
    dialogData.lockPeriod,
    dialogData.selectedNfts,
  ]);

  const stakeVaultAssetAmountReward =
    stakeVaultRewards?.data?.totalAssetAmountReward && selectedProject
      ? indivisibleToUnit(
          stakeVaultRewards.data.totalAssetAmountReward,
          selectedProject.stakingAsset.decimalPrecision,
        )
      : null;

  const isStakeAmountValid =
    dialogData.stakeAmount !== '' &&
    dialogData.stakeAmount &&
    isGreater(dialogData.stakeAmount, '0');

  const isValidInput = isStakeAmountValid;

  const getAssetBalance = (asset: Asset, walletBalance: WalletBalanceRecord) => {
    const amount = walletBalance[asset?.assetId]
      ? indivisibleToUnit(walletBalance[asset.assetId], asset.decimalPrecision)
      : null;

    return amount || null;
  };

  const availableAmount = selectedProject?.stakingAsset
    ? getAssetBalance(selectedProject?.stakingAsset, walletBalance)
    : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100% !important',
          maxWidth: '500px !important',
          maxHeight: '800px !important',
          padding: '10px 20px !important',
          backgroundColor: '#202740 !important',

          '@media (max-width: 1500px)': {
            padding: '0 35px !important',
            maxHeight: '700px !important',
          },

          '@media (max-width: 600px)': {
            padding: '0 10px !important',
          },
        },
      }}
    >
      <CloseDialog onClick={onClose}>
        <Close />
      </CloseDialog>
      <Wrapper>
        <DialogContent>
          <form onSubmit={handleSubmitStakeVault} autoComplete="off">
            {selectedProject && (
              <>
                <Grid container rowGap={{ xs: '10px', lg: '28px' }}>
                  <Heading
                    name={selectedProject.stakingAsset.shortName}
                    imageUrl={selectedProject.imageLogoUrl}
                  />
                  <LockPeriodSwitcher
                    {...selectedProject}
                    lockPeriod={dialogData.lockPeriod}
                    handleLockPeriodChange={handleLockPeriodChange}
                  />
                </Grid>
                <Fields>
                  <StakeAmountField
                    stakeAmount={dialogData.stakeAmount}
                    selectedProject={selectedProject}
                    projects={projects}
                    availableAmount={availableAmount}
                    handleStakeAmountChange={handleStakeAmountChange}
                    handleSelectedProjectChange={handleSelectedProjectChange}
                  />
                  <StakeNftsField
                    nfts={nfts}
                    selectedProject={selectedProject}
                    selectedNfts={dialogData.selectedNfts}
                    handleSelectedNftsChange={handleSelectedNftsChange}
                  />
                </Fields>

                <NftsInfo
                  APY={stakeVaultRewards.data?.nftsApyBoost || '-'}
                  isLoading={isLoadingStakeVaultRewards}
                />

                <Rewards
                  lockPeriod={dialogData.lockPeriod}
                  totalRevenueAmplifier={stakeVaultRewards.data?.totalRevenueAmplifier}
                  assetAmount={stakeVaultAssetAmountReward}
                  assetName={selectedProject.stakingAsset.shortName}
                  apy={stakeVaultRewards?.data?.totalApyBoost}
                  apyDisclaimer={stakeVaultRewards?.data?.nftsApyDisclaimer}
                  isLoading={isLoadingStakeVaultRewards}
                />
              </>
            )}

            <StakeButton
              color="primary"
              size="large"
              type="submit"
              id="gy-staking-create-stake-vault-button"
              disabled={!isValidInput || isLoadingStakeVaultCreation}
            >
              {isLoadingStakeVaultCreation ? (
                <CircularProgress color="info" size={20} />
              ) : (
                <StakeText>Stake</StakeText>
              )}
            </StakeButton>
          </form>
        </DialogContent>
      </Wrapper>
    </Dialog>
  );
};

const CloseDialog = styled('div')({
  position: 'absolute',
  top: '30px',
  right: '30px',
  cursor: 'pointer',
});

const Wrapper = styled('div')({
  '.MuiDialogContent-root': {
    '@media (max-width: 1500px)': {
      padding: '10px 4px',
      paddingTop: '20px',
    },
  },
});

const Fields = styled(Grid)({
  margin: '15px 0 0 0',

  '.projects-selection-dropdown > .MuiSelect-select': {
    paddingRight: '0 !important',
  },

  '@media (max-width: 1500px)': {
    margin: '8px 0 0 0',
  },
});

const StakeButton = styled(Button)({
  width: '100%',
  padding: '21.5px 0 !important',
  background: 'linear-gradient(90deg, #59EECA 0%, #59D3EE 100%)',
  borderRadius: '16px',
  display: 'flex',
  columnGap: '8px',

  '&:disabled': {
    background: '#172239',
    color: '#28304E',
    cursor: 'not-allowed',
  },

  '&:hover': {
    background: 'linear-gradient(90deg, #59EECA 0%, #59D3EE 100%)',
  },
});

const StakeText = styled(Typography)({
  color: '#151D2E',
  fontWeight: '800',
  fontSize: '16px',
  lineHeight: '20px',
});

export default StakeDetailsDialog;
