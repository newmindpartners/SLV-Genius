import { Grid, List, ListItem, styled, Typography } from '@mui/material';
import { map } from 'lodash';
import { FC } from 'react';
import { YieldFarmingRewardAsset } from '~/redux/api';
import { indivisibleToUnit } from '~/utils/mathUtils';

import RewardAssetAvatar from './RewardAssetAvatar';

type RewardsListProps = {
  rewards: YieldFarmingRewardAsset[];
};

const AvailableRewards: FC<RewardsListProps> = ({ rewards }) => (
  <Grid container>
    <ListWrapper>
      {map(rewards, (reward) => (
        <ListItemWrapper
          key={reward.asset.assetName}
          alignItems="flex-start"
          disableGutters
          divider
        >
          <Grid container gap="10px" alignItems="center">
            <RewardAssetAvatar {...reward.asset} />
            <Typography variant="teamUserTitle" lineHeight="28px" fontWeight="800">
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
        </ListItemWrapper>
      ))}
    </ListWrapper>
  </Grid>
);

const ListWrapper = styled(List)(() => ({
  width: '100%',
  maxHeight: '400px',
  overflowY: 'auto',
}));

const ListItemWrapper = styled(ListItem)(() => ({
  borderBottom: '1px solid rgba(119,135,177, 0.3)',
  width: '100%',
  padding: '12px 0',

  '&:last-of-type': {
    borderBottom: 'none',
  },
}));

export default AvailableRewards;
