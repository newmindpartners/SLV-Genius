import { Grid, styled } from '@mui/material';
import { FC } from 'react';
import Tooltip from '~/components/Tooltip';
import { StakeVaultRewardState } from '~/redux/api';
import { indivisibleToUnit, trimTrailingZeros } from '~/utils/mathUtils';
import { convertHexToAscii } from '~/utils/string-conversion';

import { CardProps as ParentProps } from '.';
import { Description, SubtleDescription } from './Typography';

const Wrapper = styled('div')<{ isUnstaked: boolean }>(({ isUnstaked }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginTop: 28,
  opacity: isUnstaked ? 0.3 : 1,
}));

const rowHeight = 35;
const StakedAmountWrapper = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: rowHeight,
}));

const StakedNftsWrapper = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: rowHeight,
}));

const NftsImages = styled('div')(() => ({
  display: 'flex',
  columnGap: '5px',
}));

const NftIcon = styled('img')(() => ({
  width: 30,
  height: 30,
  borderRadius: 30,
}));

const VestingWrapper = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: rowHeight,
}));

type StakingDetailsProps = {
  stats: StakeVaultRewardState;
  isUnstaked: ParentProps['isUnstaked'];
  assetShortName: ParentProps['assetShortName'];
  assetAmount: ParentProps['assetAmount'];
  assetVestingAmount: ParentProps['assetVestingAmount'];
  nfts: ParentProps['nfts'];
  precision: number;
};

export const StakingDetails: FC<StakingDetailsProps> = ({
  stats,
  isUnstaked,
  assetShortName,
  assetAmount,
  assetVestingAmount,
  nfts,
  precision,
}) => (
  <Wrapper isUnstaked={isUnstaked}>
    <StakedAmountWrapper>
      <SubtleDescription>Staked:</SubtleDescription>
      <Description>
        {isUnstaked
          ? '-'
          : `${indivisibleToUnit(assetAmount, precision) || 0} ${assetShortName}`}
      </Description>
    </StakedAmountWrapper>

    <StakedNftsWrapper>
      <SubtleDescription>NFT: </SubtleDescription>
      <NftsImages>
        {isUnstaked || nfts.length === 0
          ? '-'
          : nfts.map(({ imageUrl, name, assetName }, i) => (
              <Tooltip title={`${name} - ${convertHexToAscii(assetName)}`} key={i}>
                <Grid display="flex">
                  <NftIcon src={imageUrl} alt="Delegated NFT" />
                </Grid>
              </Tooltip>
            ))}
      </NftsImages>
    </StakedNftsWrapper>

    {assetVestingAmount && (
      <VestingWrapper>
        <SubtleDescription>Vesting:</SubtleDescription>
        <Description>
          {indivisibleToUnit(assetVestingAmount, precision) || 0} {assetShortName}
        </Description>
      </VestingWrapper>
    )}

    {stats.nftsApy && (
      <VestingWrapper>
        <SubtleDescription>NFT APY boost: </SubtleDescription>
        {isUnstaked ? (
          '-'
        ) : (
          <Description>{`+${trimTrailingZeros(
            Number(stats.nftsApy).toFixed(4),
          )}%`}</Description>
        )}
      </VestingWrapper>
    )}

    {stats.totalApy && (
      <VestingWrapper>
        <SubtleDescription>APY boost: </SubtleDescription>
        <Description>{`+${trimTrailingZeros(
          Number(stats.totalApy).toFixed(4),
        )}%`}</Description>
      </VestingWrapper>
    )}

    {stats.revenueAmplifier && (
      <VestingWrapper>
        <SubtleDescription>Rewards Multiplier: </SubtleDescription>
        <Description>{`${stats.revenueAmplifier}x`}</Description>
      </VestingWrapper>
    )}
  </Wrapper>
);
