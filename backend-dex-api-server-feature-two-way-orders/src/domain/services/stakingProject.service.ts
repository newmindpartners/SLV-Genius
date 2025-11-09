import {singleton, injectable} from 'tsyringe';

import * as Private from '~/domain/models/private';

export interface StakingProjectService {
  sortLockDurations(
    lockDurations: Private.StakeVaultLockDuration[]
  ): Private.StakeVaultLockDuration[];
}

@singleton()
@injectable()
export class StakingProjectServiceImplementation
  implements StakingProjectService
{
  constructor() {}

  sortLockDurations(lockDurations: Private.StakeVaultLockDuration[]) {
    const lockDurationSortOrder: Record<
      Private.StakeVaultLockDuration,
      number
    > = {
      FLEX: 1,
      MONTHS_1: 2,
      MONTHS_3: 3,
      MONTHS_6: 4,
      MONTHS_9: 5,
      MONTHS_12: 6,
    };

    return lockDurations.sort(
      (a, b) => lockDurationSortOrder[a] - lockDurationSortOrder[b]
    );
  }
}
