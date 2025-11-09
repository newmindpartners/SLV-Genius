import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1e2laaz7pcly9r84ml86kuj9av9tjam79mqradv';
const shortName = 'CNCT';

export const cnctAsset: Seed.Asset = {
  assetId,
  policyId: 'c27600f3aff3d94043464a33786429b78e6ab9df5e1d23b774acb34c',
  assetName: '434e4354',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 4,

  webEnabled: true,
};

export const assets = {
  cnct: cnctAsset,
};
