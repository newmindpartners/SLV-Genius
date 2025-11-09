import {listStakingProjectNfts} from '~/domain/models/public';

export type StakingProjectNftsQuery = NonNullable<
  Parameters<typeof listStakingProjectNfts>[1]
>;
