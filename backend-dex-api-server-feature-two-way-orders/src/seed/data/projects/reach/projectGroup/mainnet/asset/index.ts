import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1x97zdy72ahcvmk9luwkf2fq5nrpgc5d3xzum4m';
const shortName = 'REACH';

export const reachAsset: Seed.Asset = {
  assetId,
  policyId: '3b31e746a68c5bef72c0fb9f2185e6b1fad0ea2faaccfeeb275afe91',
  assetName: '5245414348',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  reach: reachAsset,
};
