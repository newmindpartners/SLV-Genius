import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1246cefejqp68g6qd20qfaryyv6ery2lqxv88xt';
const shortName = 'DEDI';

export const dediAsset: Seed.Asset = {
  assetId,
  policyId: '64f7b108bd43f4bde344b82587655eeb821256c0c8e79ad48db15d18',
  assetName: '44454449',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  dedi: dediAsset,
};
