import { CircularProgress, Grid, styled, Typography } from '@mui/material';
import { InfoIcon } from '~/components/Icons';
import { Info } from '~/components/Icons/Icons';
import Tooltip from '~/components/Tooltip';
import { StakeVaultLockDuration } from '~/redux/api';
import { isEqual, isGreater, round, trimTrailingZeros } from '~/utils/mathUtils';

type RewardsProps = {
  lockPeriod: StakeVaultLockDuration | null;
  totalRevenueAmplifier?: string;
  assetAmount: string | null;
  apy?: string;
  apyDisclaimer?: string;
  assetName: string;
  isLoading: boolean;
};

const Rewards = ({
  lockPeriod,
  totalRevenueAmplifier,
  assetAmount,
  apy,
  apyDisclaimer,
  assetName,
  isLoading,
}: RewardsProps) => {
  const isRewardIncalculatable =
    apy &&
    assetAmount &&
    isGreater(apy, 0) &&
    isEqual(0, assetAmount) &&
    lockPeriod === 'FLEX';
  const isEstimatedRewardsAmountValid =
    (assetAmount && isGreater(assetAmount, 0)) || isRewardIncalculatable;

  return (
    <Wrapper container direction="column" rowGap={2}>
      {isLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress size={24} />
        </Grid>
      ) : (
        <>
          {isEstimatedRewardsAmountValid && (
            <Grid item container direction="row" columnSpacing="1" alignItems="center">
              <Grid item xs={5} justifyContent="flex-end">
                <Typography fontSize="16px">Estimated Rewards:</Typography>
              </Grid>
              <Grid item xs={7} justifyContent="flex-end" container>
                {assetAmount && (
                  <InfoValue textAlign="end" style={{ position: 'relative' }}>
                    <Grid container alignItems="center" columnGap="5px">
                      {isRewardIncalculatable ? (
                        <Grid>
                          <Tooltip
                            title={`Flex rewards cannot yet be estimated for this Staking Vault but will be generated daily as long as the staked NFT has utility left.

                            Use the NFT checker to see the remaining utility of your NFT.`}
                            placement="right"
                          >
                            <InfoButton>
                              <InfoIcon />
                            </InfoButton>
                          </Tooltip>
                        </Grid>
                      ) : (
                        <Grid>
                          {parseFloat(assetAmount)
                            ? trimTrailingZeros(round(assetAmount, 2))
                            : '-'}{' '}
                          {assetName}
                        </Grid>
                      )}
                    </Grid>
                  </InfoValue>
                )}
              </Grid>
            </Grid>
          )}
          {apy && (
            <Grid item container direction="row" columnSpacing="1" alignItems="center">
              <Grid item xs={6}>
                <Typography fontSize="16px">APY:</Typography>
              </Grid>
              <Grid
                item
                container
                flexWrap="nowrap"
                columnSpacing={1}
                xs={6}
                justifyContent="flex-end"
                alignItems="center"
              >
                {apyDisclaimer && (
                  <Grid item>
                    <Tooltip title={apyDisclaimer}>
                      <InfoButton>
                        <Info />
                      </InfoButton>
                    </Tooltip>
                  </Grid>
                )}
                <Grid item>
                  <InfoValue textAlign="end">
                    {trimTrailingZeros(Number(apy).toFixed(4))}%
                  </InfoValue>
                </Grid>
              </Grid>
            </Grid>
          )}
          {totalRevenueAmplifier && (
            <Grid item container direction="row" columnSpacing="1" alignItems="center">
              <Grid item xs={8} container columnGap="5px">
                <Typography fontSize="16px">Rewards Multiplier:</Typography>
                <Tooltip
                  title={`The Genius Yield DEX charges a fee for each limit order, placed or filled. 20% of these fees, collected in traded tokens, are distributed to $GENS token stakers.

                $GENS stakers, who lock their tokens for 6, 9, or 12 months, receive a higher share of the fees, respectively 5x, 9x, and 15x multiplier.`}
                  placement="right"
                >
                  <Grid display="flex" alignItems="center">
                    <InfoIcon />
                  </Grid>
                </Tooltip>
              </Grid>
              <Grid item xs={4} justifyContent="flex-end" container>
                <InfoValue textAlign="end">{totalRevenueAmplifier}x</InfoValue>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Wrapper>
  );
};
const Wrapper = styled(Grid)({
  padding: '20px',
  background: '#28304E',
  borderRadius: '17px',
  marginBottom: '20px',

  '@media (max-width: 1500px)': {
    padding: '19px 26px',
    marginBottom: '10px',
  },
});

const InfoValue = styled(Typography)({
  color: '#6AFFA6',
  fontSize: '16px',
});

const InfoButton = styled('div')({
  display: 'flex',
  transform: 'scale(0.8)',
  cursor: 'pointer',
});

export default Rewards;
