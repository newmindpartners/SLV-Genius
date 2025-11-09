import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1a7ej28cdf078tndzcvswm5whk2jrpd0z98vlg4';
const shortName = 'rsERG';

export const rsergAsset: Seed.Asset = {
  assetId,
  policyId: '04b95368393c821f180deee8229fbd941baaf9bd748ebcdbf7adbb14',
  assetName: '7273455247',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 9,

  webEnabled: true,
};

export const assets = {
  rserg: rsergAsset,
};
