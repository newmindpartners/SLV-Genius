import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset10whq4cv7rd0necges4l6m9h3e23tls9qqmwafu';
const shortName = 'MILK';

export const milkAsset: Seed.Asset = {
  assetId,
  policyId: 'afbe91c0b44b3040e360057bf8354ead8c49c4979ae6ab7c4fbdc9eb',
  assetName: '4d494c4b7632',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  milk: milkAsset,
};
