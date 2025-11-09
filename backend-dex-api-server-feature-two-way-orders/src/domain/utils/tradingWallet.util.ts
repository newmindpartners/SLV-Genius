import * as Prisma from '@prisma/client';
import * as Private from '~/domain/models/private';

type SingleCondition =
  Prisma.Prisma.TradingWalletOrderByWithRelationAndSearchRelevanceInput;

type SingleOrManyConditions = Prisma.Prisma.Enumerable<SingleCondition>;

const OrderByConditionMap: Record<
  Private.TradingWalletOrderBy,
  SingleCondition
> = {
  '-created': {created: 'desc'},
  '+created': {created: 'asc'},

  '-roiPercent': {roiPercent: {sort: 'desc', nulls: 'last'}},
  '+roiPercent': {roiPercent: {sort: 'asc', nulls: 'last'}},

  '-earnedAdaAssetAmount': {
    earnedPriceAssetAmount: {sort: 'desc', nulls: 'last'},
  },
  '+earnedAdaAssetAmount': {
    earnedPriceAssetAmount: {sort: 'asc', nulls: 'last'},
  },

  // TODO: Add this when we add winRatePercent to Prisma entity
  '-winRatePercent': {},
  '+winRatePercent': {},
};

export const determineTradingWalletOrderByCondition = (
  orderBy: Private.TradingWalletOrderBy = '-created'
): SingleOrManyConditions => {
  const primaryCondition = OrderByConditionMap[orderBy];

  const secondaryCondition: SingleCondition = {
    tradingWalletId: 'desc',
  };

  return [primaryCondition, secondaryCondition];
};
