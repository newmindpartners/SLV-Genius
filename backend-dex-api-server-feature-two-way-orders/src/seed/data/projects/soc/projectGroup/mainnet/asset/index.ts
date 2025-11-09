import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '534f4349455459';
const policyId = '25f0fc240e91bd95dcdaebd2ba7713fc5168ac77234a3d79449fc20c';
const shortName = 'SOC';

export const socAsset: Seed.Asset = {
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
  soc: socAsset,
};
