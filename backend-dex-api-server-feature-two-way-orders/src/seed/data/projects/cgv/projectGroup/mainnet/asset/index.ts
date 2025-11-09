import {assetId} from '~/domain/utils/asset.util';
import {getImageUrlPng} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

// https://cardanoscan.io/token/e52792c2fd70c0a3dfb240c02bb8ace315e19e28784e5d5d182a54140014df1047584c
// We will be selling the GXL token however we need to display it as if it were CGV.
// So every asset value is set as if it was the Cogito token however the policy Id is from the GXL token.
const cgv = {
  shortName: 'CGV',
  assetName: '0014df1047584c',
  policyId: 'e52792c2fd70c0a3dfb240c02bb8ace315e19e28784e5d5d182a5414',
};

export const cgvAsset: Seed.Asset = {
  assetId: assetId(cgv.policyId, cgv.assetName),
  policyId: cgv.policyId,
  assetName: cgv.assetName,

  shortName: cgv.shortName,
  iconUrl: getImageUrlPng(cgv.shortName),
  longName: 'Cogito Protocol',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  cgv: cgvAsset,
};
