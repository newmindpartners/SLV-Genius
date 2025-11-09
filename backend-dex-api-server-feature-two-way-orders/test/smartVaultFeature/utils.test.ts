import {SmartVaultOperationType} from '~/domain/models/private';
import {getDepositedAssets} from '~/smartVaultFeature/utils';

describe('getDepositedAssets', () => {
  const mockAssets = [{assetId: 'asset1'}, {assetId: 'asset2'}];

  const mockOperations = [
    {
      operationType: SmartVaultOperationType.DEPOSIT,
      assetId: 'asset1',
      assetAmount: 100n,
    },
    {
      operationType: SmartVaultOperationType.DEPOSIT,
      assetId: 'asset2',
      assetAmount: 200n,
    },
    {
      operationType: SmartVaultOperationType.WITHDRAW,
      assetId: 'asset1',
      assetAmount: 50n,
    },
    {
      operationType: SmartVaultOperationType.DEPOSIT,
      assetId: 'asset2',
      assetAmount: 300n,
    },
  ];

  it('should correctly calculate deposited assets', () => {
    const result = getDepositedAssets(mockAssets, mockOperations);

    expect(result).toEqual([
      {assetId: 'asset1', asset: {assetId: 'asset1'}, assetAmount: 50n},
      {assetId: 'asset2', asset: {assetId: 'asset2'}, assetAmount: 500n},
    ]);
  });
});
