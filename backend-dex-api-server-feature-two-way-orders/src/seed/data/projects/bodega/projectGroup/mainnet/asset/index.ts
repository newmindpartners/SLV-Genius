import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1f8paxp0vuytlw37aqpcnufx4uge8y3kakvqqkk';
const shortName = 'BODEGA';

export const bodegaAsset: Seed.Asset = {
  assetId,
  policyId: '5deab590a137066fef0e56f06ef1b830f21bc5d544661ba570bdd2ae',
  assetName: '424f44454741',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  bodega: bodegaAsset,
};
