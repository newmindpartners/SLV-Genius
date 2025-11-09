import 'reflect-metadata';
import {PrismaClient} from '@prisma/client';
import {OrderSwapApplication} from '~/application/orderSwap.application';
import {MarketOrderStrategy} from '~/domain/models/private/marketOrderStrategy';

export const getAdaGensMultiFillSelection = async (
  prisma: PrismaClient,
  orderSwapApplication: OrderSwapApplication,
  toAssetAmount: number,
  strategy: MarketOrderStrategy
) => {
  const tAdaAssetId = 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj';
  const tGensAssetId = 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4';
  const toAssetId = tAdaAssetId;
  const fromAssetId = tGensAssetId;

  const {result, alternativeResult} =
    await orderSwapApplication.getBestAvailableOrderSwapResults(
      prisma,
      {
        toAssetId,
        fromAssetId,
        toAssetAmount: String(toAssetAmount),
        slippagePercent: 3,
      },
      strategy
    );

  const results = result.map(
    ({marketOrderSwap, marketOrderSwapFillAmount}) => ({
      orderSwapId: marketOrderSwap.orderSwapId,
      filledAmount: marketOrderSwapFillAmount,
    })
  );

  const alternativeResults =
    alternativeResult.length > 0
      ? alternativeResult.map(
          ({marketOrderSwap, marketOrderSwapFillAmount}) => ({
            orderSwapId: marketOrderSwap.orderSwapId,
            filledAmount: marketOrderSwapFillAmount,
          })
        )
      : [];

  return {
    results,
    alternativeResults,
  };
};
