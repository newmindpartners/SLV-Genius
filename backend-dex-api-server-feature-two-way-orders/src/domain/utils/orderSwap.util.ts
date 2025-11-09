import {reduce} from 'lodash';

import * as Prisma from '@prisma/client';
import * as Private from '~/domain/models/private';

type OrderSwapOrderBy =
  Prisma.Prisma.OrderSwapOrderByWithRelationAndSearchRelevanceInput;

type EnumerableOrderSwapOrderBy = Prisma.Prisma.Enumerable<OrderSwapOrderBy>;

const orderSwapOrderBy = (
  attributesNames: (keyof OrderSwapOrderBy)[],
  direction: Prisma.Prisma.SortOrder
): OrderSwapOrderBy[] =>
  reduce(
    attributesNames,
    (orderSwapOrderBy, attributeName) => {
      return [...orderSwapOrderBy, {[attributeName]: direction}];
    },
    [] as OrderSwapOrderBy[]
  );

const orderSwapCreated: (keyof OrderSwapOrderBy)[] = ['orderDate'];

const orderSwapToAssetAmount: (keyof OrderSwapOrderBy)[] = ['toAssetAmount'];

const orderSwapFromAssetAmount: (keyof OrderSwapOrderBy)[] = [
  'fromAssetAmount',
];

const orderSwapOrderByMap: {
  [key: string]: EnumerableOrderSwapOrderBy;
} = {
  '+created': orderSwapOrderBy(orderSwapCreated, 'asc'),
  '-created': orderSwapOrderBy(orderSwapCreated, 'desc'),

  '+toAssetAmount': orderSwapOrderBy(orderSwapToAssetAmount, 'asc'),
  '-toAssetAmount': orderSwapOrderBy(orderSwapToAssetAmount, 'desc'),

  '+fromAssetAmount': orderSwapOrderBy(orderSwapFromAssetAmount, 'asc'),
  '-fromAssetAmount': orderSwapOrderBy(orderSwapFromAssetAmount, 'desc'),
};

export const determineSwapOrderSortByParameter = (
  orderSwapSort?: Private.OrderSwapQuery['sortSwapOrders']
): Prisma.Prisma.Enumerable<OrderSwapOrderBy> =>
  orderSwapOrderByMap[orderSwapSort ?? '-created'];
