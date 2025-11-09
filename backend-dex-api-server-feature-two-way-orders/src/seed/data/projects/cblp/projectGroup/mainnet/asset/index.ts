import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1vha2kdkxfegsam7qxr5hw8h7yglg9aljcphxph';
const shortName = 'CBLP';

export const cblpAsset: Seed.Asset = {
  assetId,
  policyId: 'ee0633e757fdd1423220f43688c74678abde1cead7ce265ba8a24fcd',
  assetName: '43424c50',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  cblp: cblpAsset,
};
