import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1yjgux2s0xjdyawrccns0dd8dxs3k35qkyhh79y';
const shortName = 'rsRSN';

export const rsrsnAsset: Seed.Asset = {
  assetId,
  policyId: '04b95368393c821f180deee8229fbd941baaf9bd748ebcdbf7adbb14',
  assetName: '727352534e',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 3,

  webEnabled: true,
};

export const assets = {
  rsrsn: rsrsnAsset,
};
