import {Prisma} from '@prisma/client';

export type OrderSaleProjectCountryBlacklist =
  Prisma.OrderSaleBlacklistCountryGetPayload<{
    include: {
      country: true;
    };
  }>;
