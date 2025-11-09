import { Grid, styled } from '@mui/material';
import React, { FC, useState } from 'react';
import UnstakeDialog from '~/pages/Earn/components/UnstakeDialog/UnstakeDialog';
import { ListStakeVaultsApiResponse } from '~/redux/api';
import { stringToNumber } from '~/utils/mathUtils';

import { StakeVaultCard } from './Card';

export * from './NoResultsView';

type StakeVaultListProps = {
  stakeVaults: NonNullable<ListStakeVaultsApiResponse['results']>;
  refetchStakeVaults: () => void;
};

const GridWrapper = styled(Grid)(() => ({
  display: 'flex',
  width: '100%',
  marginLeft: '0',
}));

export const StakeVaultList: FC<StakeVaultListProps> = ({
  stakeVaults,
  refetchStakeVaults,
}) => {
  const [unstakeStakeVaultId, setUnstakeStakeVaultId] = useState<string | null>(null);
  const unstakeDialogOpen = !!unstakeStakeVaultId;

  const openUnstakeDialog = (stakeVaultId: string) => {
    setUnstakeStakeVaultId(stakeVaultId);
  };

  const closeUnstakeDialog = () => {
    setUnstakeStakeVaultId(null);
  };

  return (
    <>
      <GridWrapper container spacing={2} alignItems="stretch">
        {stakeVaults.map((card, i) => {
          const {
            isUnstaked,
            isUnstakingEnabled,
            stakedAsset,
            stakeVaultId,
            stakedAssetAmount,
            stakedStakingNfts,
            unlocksAt,

            activeRewardState,
            inactiveRewardState,
          } = card;

          const parsedLockedUntil =
            typeof unlocksAt == 'string' ? new Date(unlocksAt) : undefined;

          const assetVestingAmount = stakedStakingNfts.reduce((acc, nft) => {
            const nftVestingBoost = nft.vestingBoost && stringToNumber(nft.vestingBoost);
            return nftVestingBoost ? nftVestingBoost : acc;
          }, 0);

          return (
            <Grid item xs={12} sm={6} md={4} lg={4} key={i}>
              <StakeVaultCard
                activeRewardState={activeRewardState}
                inactiveRewardState={inactiveRewardState}
                isUnstaked={isUnstaked}
                isUnstakingEnabled={isUnstakingEnabled}
                stakeVaultId={stakeVaultId}
                iconUrl={stakedAsset?.iconUrl}
                assetShortName={stakedAsset.shortName}
                assetAmount={stakedAssetAmount}
                assetVestingAmount={
                  assetVestingAmount !== 0 ? assetVestingAmount.toString() : undefined
                }
                nfts={stakedStakingNfts}
                precision={stakedAsset.decimalPrecision}
                lockedUntil={parsedLockedUntil}
                openUnstakeDialog={openUnstakeDialog}
              />
            </Grid>
          );
        })}
      </GridWrapper>
      {unstakeDialogOpen && (
        <UnstakeDialog
          stakeVaults={stakeVaults}
          stakeVaultId={unstakeStakeVaultId}
          onClose={closeUnstakeDialog}
          refetchStakeVaults={refetchStakeVaults}
          open={unstakeDialogOpen}
        />
      )}
    </>
  );
};
