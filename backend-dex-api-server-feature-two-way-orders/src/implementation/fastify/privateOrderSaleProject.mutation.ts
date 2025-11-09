import {inject, singleton} from 'tsyringe';

import {AbstractMutation} from '~/implementation/fastify/abstract.mutation';
import {ConfigService} from '~/domain/services';

/**
 * Due to security concerns with our `@fastify/multipart` package, we decided
 * to remove the old implementation.
 * See this PR for more information:
 * https://github.com/geniusyield/dex-api-server/pull/2050
 */

@singleton()
export class PrivateOrderSaleProjectMutationFastify extends AbstractMutation {
  constructor(@inject('ConfigService') configService: ConfigService) {
    super(configService);
  }

  async replaceWhitelist(): Promise<{message: string}> {
    throw new Error('Not implemented');
  }
}
