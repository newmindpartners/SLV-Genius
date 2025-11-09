/* eslint-disable node/no-unpublished-import */
import {createMock} from 'ts-auto-mock';
import {
  OrderSwap,
  OrderStatus,
  orderSwapOrderTypes,
} from '~/domain/models/private';

const mockOrderSwap = (
  orderSwap: Partial<OrderSwap> &
    Pick<OrderSwap, 'orderStatus' | 'toAssetAmount' | 'fromAssetAmount'>
): OrderSwap => ({
  ...createMock<OrderSwap>(),
  ...orderSwap,
});

const userIds = ['user-id-1', 'user-id-2'];
const assetIds = ['asset-id-1', 'asset-id-2'];

export const mockOrderSwaps: OrderSwap[] = Array(10)
  .fill(0)
  .map((_, i) => {
    const toAmount = BigInt((i + 1) * 200);
    const fromAmount = BigInt((i + 1) * 100);
    const toAssetAmountTotalFilled = BigInt((i + 1) * 200);
    const fromAssetAmountTotalFilled = BigInt((i + 1) * 100);
    const userId = userIds[i % 2];
    const toAssetId = assetIds[0];
    const fromAssetId = assetIds[1];

    return mockOrderSwap({
      orderStatus: OrderStatus.OPEN,
      toAssetAmount: toAmount,
      fromAssetAmount: fromAmount,
      toAssetAmountTotalFilled: toAssetAmountTotalFilled,
      fromAssetAmountTotalFilled: fromAssetAmountTotalFilled,
      orderType: orderSwapOrderTypes.LIMIT,
      userId: userId,
      toAssetId: toAssetId,
      fromAssetId: fromAssetId,
    });
  });
