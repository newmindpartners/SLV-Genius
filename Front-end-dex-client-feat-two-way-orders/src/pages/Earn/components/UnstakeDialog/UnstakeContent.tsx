import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, ReactElement } from 'react';
import { StakeVault } from '~/redux/api';
import { indivisibleToUnit } from '~/utils/mathUtils';

type ContentDialogProps = {
  stakeVault: StakeVault;
};

const UnstakeContent: FC<ContentDialogProps> = ({ stakeVault }): ReactElement => {
  const {
    stakedAsset,
    stakedAssetAmount,
    stakedStakingNfts,
    activeRewardState,
    inactiveRewardState,
  } = stakeVault;

  const stats = activeRewardState || inactiveRewardState;
  const rewardApyPercent = stats?.totalApy;

  return (
    <Grid container direction="column" mb="56px" height={{ xs: '640px', sm: 'unset' }}>
      <ContentWrapper container direction="column" gap="12px">
        <ContentItem title={'Staked:'}>
          <Grid container flexWrap="nowrap">
            <Typography
              paddingRight="5px"
              fontWeight="500"
              line-height="28px"
              color="#FFFFFF"
            >
              {indivisibleToUnit(stakedAssetAmount, stakedAsset.decimalPrecision) || 0}
            </Typography>
            <Typography fontWeight="500" line-height="28px" color="#FFFFFF">
              {stakedAsset.shortName}
            </Typography>
          </Grid>
        </ContentItem>
        <ContentItem title={'NFT:'}>
          <ImgWrapper container flexWrap="nowrap" gap="5px">
            {stakedStakingNfts.length
              ? stakedStakingNfts?.map(({ imageUrl }) => (
                  <img src={imageUrl} alt="nft" key={imageUrl} />
                ))
              : '-'}
          </ImgWrapper>
        </ContentItem>
        <ContentItem title={'APY:'}>
          <Grid container flexWrap="nowrap">
            {rewardApyPercent ? (
              <>
                <img src="/images/coins-stack.svg" alt="coin" />
                <Typography
                  paddingLeft="8px"
                  fontWeight="700"
                  line-height="20px"
                  fontSize="799"
                  color="#6AFFA6"
                >
                  {rewardApyPercent}%
                </Typography>
              </>
            ) : (
              '-'
            )}
          </Grid>
        </ContentItem>
      </ContentWrapper>
    </Grid>
  );
};

const ContentWrapper = styled(Grid)(({ theme }) => ({
  padding: '28px',
  borderRadius: theme.borderRadius.md,
  backgroundColor: '#172239',
}));
const ImgWrapper = styled(Grid)(() => ({
  img: {
    height: '28px',
    width: '28px',
  },
}));

type ContentItemProps = {
  title: string;
  children: ReactElement;
};
const ContentItem: FC<ContentItemProps> = ({ title, children }): ReactElement => (
  <Grid container flexWrap="nowrap" justifyContent="space-between">
    <Typography
      variant="description"
      font-weight="600"
      line-height="28px"
      color="#B9CAED"
    >
      {title}
    </Typography>
    <Grid container flexWrap="nowrap" width="fit-content">
      {children}
    </Grid>
  </Grid>
);

export default UnstakeContent;
