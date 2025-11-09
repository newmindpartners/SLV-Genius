import 'reflect-metadata';

import {TransactionalContext} from '~/domain/context';

import * as Private from '~/domain/models/private';

export interface CountryRepository {
  /**
   * Retrieve all order sale country blacklist records
   * @param prisma
   */
  getOrderSaleProjectCountryBlacklist(
    prisma: TransactionalContext
  ): Promise<Private.OrderSaleProjectCountryBlacklist[]>;
}
