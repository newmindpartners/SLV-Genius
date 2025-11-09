import * as Private from '~/domain/models/private';
import {SmartVaultOperationType} from '~/domain/models/private';

type Operation = Pick<
  Private.SmartVaultOperation,
  'operationType' | 'assetId' | 'assetAmount'
>;

export const getDepositedAssets = <Asset extends {assetId: string}>(
  assets: Asset[],
  operations: Operation[]
): {assetId: string; asset: Asset; assetAmount: bigint}[] =>
  assets.map(asset => ({
    assetId: asset.assetId,
    asset,
    assetAmount: operations
      .filter(operation => operation.assetId === asset.assetId)
      .reduce(
        (acc, operation) =>
          operation.operationType === SmartVaultOperationType.DEPOSIT
            ? acc + (operation.assetAmount || 0n)
            : acc - (operation.assetAmount || 0n),
        0n
      ),
  }));
