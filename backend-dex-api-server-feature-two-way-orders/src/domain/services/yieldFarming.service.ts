import {singleton, injectable} from 'tsyringe';

import * as loFp from 'lodash/fp';

export interface YieldFarmingService {
  parseCoreGroupKey(coreGroupKey: string): string;
}

@singleton()
@injectable()
export class YieldFarmingServiceImplementation implements YieldFarmingService {
  constructor() {}

  /**
   * The `coreGroupKey` is expected to be in SCREAMING_SNAKE_CASE format.
   * This logic makes an effort to convert it to a more human readable format.
   */
  parseCoreGroupKey(coreGroupKey: string): string {
    return loFp.flow(
      loFp.lowerCase,
      loFp.replace(/_/g, ' '),
      loFp.startCase
    )(coreGroupKey);
  }
}
