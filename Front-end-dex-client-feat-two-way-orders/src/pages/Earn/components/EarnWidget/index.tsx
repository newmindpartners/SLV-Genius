import { FC } from 'react';
import { StakeVault } from '~/redux/api';

import { TabEnum } from '../..';
import StakeCard from '../StakeCard';
import { StakeVaultList } from '../StakeVaultList';

type EarnWidgetProps = {
  activeTab: TabEnum;
  stakeVaults: StakeVault[];
  refetchStakeVaults: () => void;
  openStakeDialog: () => void;
};
export const EarnWidget: FC<EarnWidgetProps> = ({
  activeTab,
  stakeVaults,
  refetchStakeVaults,
  openStakeDialog,
}) => {
  switch (activeTab) {
    case TabEnum.VaultStaking:
      return stakeVaults.length > 0 ? (
        <StakeVaultList
          stakeVaults={stakeVaults}
          refetchStakeVaults={refetchStakeVaults}
        />
      ) : (
        <StakeCard
          description="How it works"
          tooltip="You can stake both tokens and NFTs in individual staking vaults and harvest your staking rewards"
          cardTitle="New Staking Vault"
          openDialog={openStakeDialog}
        />
      );
  }
};
