import {yieldFarmingListRewards} from '~/domain/models/public';

export type YieldFarmingRewardsQuery = NonNullable<
  Parameters<typeof yieldFarmingListRewards>[0]
>;
