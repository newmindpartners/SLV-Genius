import {listStakeVaults} from '~/domain/models/public';

export type StakeVaultsQuery = NonNullable<
  Parameters<typeof listStakeVaults>[0]
>;
