import { Grid, styled, Typography } from '@mui/material';
import { map } from 'lodash';
import _ from 'lodash';
import { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import GreenGradientButton from '~/components/Button/GreenGradientButton';
import BlurryDialog from '~/components/Dialogs/Dialog/BlurryDialog';
import { useAlertDialog } from '~/context/alertDialog';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { YieldFarmingRewardAsset } from '~/redux/api';
import { TransactionEndpoints } from '~/types/transaction';
import { indivisibleToUnit, NumericInput, plus } from '~/utils/mathUtils';
import { defaultAdaPrecision } from '~/utils/tradingPairsUtils';

import { AlertType } from '../../../../components/Dialogs/AlertDialog';
import RewardAssetAvatar from './RewardAssetAvatar';

const adaAsset = {
  decimalPrecision: defaultAdaPrecision,
  shortName: 'ADA',
};

export type PreviewOrderDialogProps = {
  rewards?: YieldFarmingRewardAsset[];
  rewardsClaimLovelaceServiceFee?: string;
  onClose: () => void;
};

const PreviewClaimRewards: FC<PreviewOrderDialogProps> = ({
  rewards,
  rewardsClaimLovelaceServiceFee,
  onClose,
}) => {
  const { onDialogOpen: openAlertDialog } = useAlertDialog();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const onPreviewClaimRewardsSuccess = () => {
    setIsLoading(false);
    openAlertDialog({
      alertType: AlertType.Success,
      title: 'Transaction signing successful!',
      description:
        'You have claimed your rewards successfully. Waiting for confirmation on chain.',
    });
    onClose();
  };

  const onPreviewClaimRewardsFailure = () => {
    setIsLoading(false);
    openAlertDialog({
      alertType: AlertType.Failure,
      title: 'Failed to claim your rewards.',
    });
  };

  const startDialogLoading = () => {
    setIsLoading(true);
  };

  const handleClaimRewards = useCallback(() => {
    dispatch(
      createSignSubmitTransactionRequest({
        endpoint: TransactionEndpoints.YIELD_FARMING_REWARDS_CLAIM,
        data: { [TransactionEndpoints.YIELD_FARMING_REWARDS_CLAIM]: {} },
        callback: {
          onRequest: startDialogLoading,
          onFailure: onPreviewClaimRewardsFailure,
          onSuccess: onPreviewClaimRewardsSuccess,
        },
      }),
    );
  }, []);

  const groupAssetsById = (
    assets: YieldFarmingRewardAsset[],
  ): YieldFarmingRewardAsset[] => {
    const grouped = _.groupBy(assets, (item) => item.asset.assetId);
    return _.map(grouped, (assets) => ({
      asset: assets[0].asset,
      assetAmount: assets
        .reduce((acc: NumericInput, current) => plus(acc, current.assetAmount), 0)
        .toString(),
    }));
  };

  const groupedRewards = groupAssetsById(rewards || []);

  return (
    <BlurryDialog
      title="Claim My Rewards"
      onClose={onClose}
      actions={
        <GreenGradientButton onClick={handleClaimRewards} isLoading={isLoading}>
          Confirm
        </GreenGradientButton>
      }
    >
      <PreviewContent rewards={groupedRewards} />
      {rewardsClaimLovelaceServiceFee && (
        <FeeWrapper item container alignItems={'center'} justifyContent={'space-between'}>
          <Grid item>
            <Typography variant="statusCard" component="h4" color="textColor.main">
              Service Fee
            </Typography>
          </Grid>
          <Grid item container width={'auto'} alignItems={'center'}>
            <Typography
              variant="statusCard"
              fontWeight="700"
              component="h4"
              color="textColor.main"
            >
              {indivisibleToUnit(
                rewardsClaimLovelaceServiceFee,
                adaAsset.decimalPrecision,
              )}{' '}
              {adaAsset.shortName}
            </Typography>
          </Grid>
        </FeeWrapper>
      )}
    </BlurryDialog>
  );
};

type PreviewContentProps = {
  rewards: YieldFarmingRewardAsset[];
};

const PreviewContent: FC<PreviewContentProps> = ({ rewards }) => (
  <Wrapper container minWidth="350px" margin="40px 0 20px">
    {map(rewards, (reward) => (
      <Grid
        container
        gap="10px"
        alignItems="center"
        justifyContent="space-between"
        padding="10px 0"
        marginRight="10px"
      >
        <Grid display="flex" gap="10px" alignItems="center" justifyContent="flex-start">
          <RewardAssetAvatar {...reward.asset} />
          <Typography fontSize="18px" fontWeight="600">
            {reward.asset.shortName}
          </Typography>
        </Grid>

        <Grid display="flex" justifyContent="flex-end" alignItems="center" gap="10px">
          <Typography fontSize="18px" fontWeight="600">
            {indivisibleToUnit(reward.assetAmount, reward.asset.decimalPrecision)}
          </Typography>

          <Typography
            variant="roundWrapperCardDesc"
            fontSize="18px"
            color="buttonsInactive.dark"
          >
            {reward.asset.shortName}
          </Typography>
        </Grid>
      </Grid>
    ))}
  </Wrapper>
);

const FeeWrapper = styled(Grid)(() => ({
  padding: '20px',
  background: '#172239',
  borderRadius: '16px',

  h4: {
    fontSize: '16px',
    lineHeight: '24px',
  },
}));

const Wrapper = styled(Grid)(({ theme }) => ({
  width: '100%',
  overflowY: 'auto',
  maxHeight: '330px',

  [theme.breakpoints.down('lg')]: {
    maxHeight: '240px',
  },
}));

export default PreviewClaimRewards;
