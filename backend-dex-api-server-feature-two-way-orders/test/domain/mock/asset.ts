// eslint-disable-next-line node/no-unpublished-import
import {createMock} from 'ts-auto-mock';

import {Asset} from '~/domain/models/public';
import {assetId} from '~/domain/utils/asset.util';

export const mockAsset = (
  asset: Partial<Asset> & Pick<Asset, 'assetName' | 'policyId'>
): Asset => ({
  ...createMock<Asset>(),
  ...asset,
  assetId: assetId(asset.policyId, asset.assetName),
});
