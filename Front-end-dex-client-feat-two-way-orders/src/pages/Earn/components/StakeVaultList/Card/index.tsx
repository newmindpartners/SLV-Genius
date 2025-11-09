import { Divider, Grid, styled } from '@mui/material';
import { FC } from 'react';
import { StakeVaultRewardState, StakingNft } from '~/redux/api';

import { ActionButtons } from './ActionButtons';
import { CardHeader } from './CardHeader';
import { StakingDetails } from './StakingDetails';

export type CardProps = {
  activeRewardState?: StakeVaultRewardState;
  inactiveRewardState?: StakeVaultRewardState;
  isUnstaked: boolean;
  stakeVaultId: string;
  iconUrl?: string;
  assetShortName: string;
  assetAmount: string;
  assetVestingAmount?: string;
  nfts: StakingNft[];
  lockedUntil?: Date;
  precision: number;
  isUnstakingEnabled: boolean;
  openUnstakeDialog: (stakeVaultId: string) => void;
};

export const StakeVaultCard: FC<CardProps> = ({
  activeRewardState,
  inactiveRewardState,
  stakeVaultId,
  assetShortName,
  assetAmount,
  assetVestingAmount,
  nfts,
  lockedUntil,
  precision,
  isUnstakingEnabled,
  isUnstaked,
  openUnstakeDialog,
}) => {
  const assetLogoUrl = `/cdn/images/projects/${assetShortName}/asset.png`;

  const stats = activeRewardState || inactiveRewardState;

  const warning = getStakeVaultWarning(activeRewardState, inactiveRewardState);

  if (!stats) return;

  return (
    <OuterWrapper>
      <Content>
        <InnerWrapper>
          <CardHeader
            assetShortName={assetShortName}
            assetLogoUrl={assetLogoUrl}
            lockedUntil={lockedUntil}
            lockDuration={stats.lockDuration}
            isUnstaked={isUnstaked}
            warning={warning}
          />

          <StakingDetails
            isUnstaked={isUnstaked}
            assetShortName={assetShortName}
            assetAmount={assetAmount}
            assetVestingAmount={assetVestingAmount}
            nfts={nfts}
            precision={precision}
            stats={stats}
          />

          <Grid item mt="auto" mb="10px">
            <CardDivider />
          </Grid>

          <ActionButtons
            isUnstakingEnabled={isUnstakingEnabled}
            onClickUnstake={() => openUnstakeDialog(stakeVaultId)}
          />
        </InnerWrapper>
      </Content>
    </OuterWrapper>
  );
};

const getStakeVaultWarning = (
  activeRewardState?: StakeVaultRewardState,
  inactiveRewardState?: StakeVaultRewardState,
) => {
  if (activeRewardState && inactiveRewardState) {
    return (
      <Grid textAlign="left">
        Your Locked Staking Vault expired and was automatically turned into a Flex Staking
        Vault.
        <br />
        <br />
        Currently, your Flex Staking Vault has the following values: <br />
        {activeRewardState?.totalApy && (
          <>
            <b>- {activeRewardState?.totalApy}%</b> APY <br />
          </>
        )}
        <b>- {activeRewardState?.revenueAmplifier}x</b> Rewards Multiplier <br />
        <br />
        Your Locked Staking Vault used to have the following values:
        <br />
        {inactiveRewardState.totalApy && (
          <>
            <b>- {inactiveRewardState?.totalApy}%</b> APY <br />{' '}
          </>
        )}
        <b>- {inactiveRewardState?.revenueAmplifier}x</b> Rewards Multiplier <br />
        <br />
        Consider re-staking your tokens to gain higher rewards.
      </Grid>
    );
  } else if (inactiveRewardState && !activeRewardState) {
    return (
      <Grid>
        Your Staking Vault has unlocked and no longer generates rewards.
        <br />
        <br />
        Unstake and re-stake your tokens to continue generating rewards.
      </Grid>
    );
  } else {
    return null;
  }
};

const Content = styled(Grid)({
  padding: '25px 28px 12px',
  backgroundColor: 'rgb(32, 39, 64)',
  borderRadius: '30px',
  height: '100%',
});

const OuterWrapper = styled('div')(() => ({
  height: '100%',

  '& .MuiCard-root': {
    padding: '25px 28px',
    paddingBottom: 12,
    backgroundColor: '#202740',
  },
}));

const InnerWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundImage: 'none',
  height: '100%',
}));

const CardDivider = styled(Divider)(() => ({
  lineHeight: 1,
  opacity: 0.5,
  backgroundColor: '#2E3D60',
  marginTop: '12px',
  marginBottom: '12px',
}));
