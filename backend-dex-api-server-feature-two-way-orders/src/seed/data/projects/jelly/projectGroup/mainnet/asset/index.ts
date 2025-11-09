import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '4a454c4c59';
const policyId = '5c1c91a65bedac56f245b8184b5820ced3d2f1540e521dc1060fa683';
const shortName = 'JELLY';

export const jellyAsset: Seed.Asset = {
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
  jelly: jellyAsset,
};
