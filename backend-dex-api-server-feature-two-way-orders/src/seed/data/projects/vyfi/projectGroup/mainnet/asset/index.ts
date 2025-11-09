import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetName = '56594649';
const policyId = '804f5544c1962a40546827cab750a88404dc7108c0f588b72964754f';
const shortName = 'VYFI';

export const vyfiAsset: Seed.Asset = {
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
  vyfi: vyfiAsset,
};
