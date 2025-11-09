import {singleton} from 'tsyringe';

import {Prisma} from '@prisma/client';

import * as Private from '~/domain/models/private';

import {CountryRepository} from '~/domain/repositories';

@singleton()
export class CountryRepositoryPrisma implements CountryRepository {
  async getOrderSaleProjectCountryBlacklist(
    prisma: Prisma.TransactionClient
  ): Promise<Private.OrderSaleProjectCountryBlacklist[]> {
    const countryBlacklist = await prisma.orderSaleBlacklistCountry.findMany({
      include: {country: true},
    });

    return countryBlacklist;
  }
}
