import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '57696e67526964657273';
const policyId = 'c0ee29a85b13209423b10447d3c2e6a50641a15c57770e27cb9d5073';
const shortName = 'WRT';

export const wrtAsset: Seed.Asset = {
  assetId: assetId(policyId, assetName),
  policyId,
  assetName,

  shortName,
  iconUrl: getAssetIconUrl(shortName),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  wrt: wrtAsset,
};
