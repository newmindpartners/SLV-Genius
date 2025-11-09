import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1u3k3ceyrh6qstauhnaxuhy3vf24z99slhtx9tk';
const shortName = 'SPX';

export const spxAsset: Seed.Asset = {
  assetId,
  policyId: 'f7516c9f7b347eb412a777f3c711099b199ccd2be23b568a4a3abf6d',
  assetName: '535058',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  spx: spxAsset,
};
