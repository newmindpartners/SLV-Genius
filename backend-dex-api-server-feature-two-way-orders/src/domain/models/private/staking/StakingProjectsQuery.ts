import {listStakingProjects} from '~/domain/models/public';

export type StakingProjectsQuery = NonNullable<
  Parameters<typeof listStakingProjects>[0]
>;
