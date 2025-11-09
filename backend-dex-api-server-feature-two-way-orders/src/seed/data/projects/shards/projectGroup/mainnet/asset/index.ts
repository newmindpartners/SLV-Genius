import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset15nztuwg0e3kvynvpp0fjtdva8dcj5lyjqfgpv3';
const shortName = 'SHARDS';

export const shardsAsset: Seed.Asset = {
  assetId,
  policyId: 'ea153b5d4864af15a1079a94a0e2486d6376fa28aafad272d15b243a',
  assetName: '0014df10536861726473',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  shards: shardsAsset,
};
