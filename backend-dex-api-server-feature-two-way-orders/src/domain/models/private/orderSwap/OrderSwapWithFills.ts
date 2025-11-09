import {Prisma} from '@prisma/client';

import * as Private from '~/domain/models/private';

export type OrderSwapWithFills = Pick<
  Private.OrderSwap,
  | 'orderSwapId'
  | 'toAssetId'
  | 'fromAssetId'
  | 'toAssetAmount'
  | 'fromAssetAmount'
  | 'toAssetAmountTotalRemaining'
  | 'fromAssetAmountTotalRemaining'
  | 'price'
  | 'priceNumerator'
  | 'priceDenominator'
> & {orderSwapFills: Private.OrderSwapFillCreate[]};

export type OrderSwapFillCreate = Prisma.OrderSwapFillCreateManyInput;
