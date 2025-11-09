import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'fc144c8f-87ce-4e9e-9ae8-bca691dbfcf7',

  name: assets.vyfi.longName,
  imageLogoUrl: assets.vyfi.iconUrl,

  // set project description
  shortDescription: 'VYFI',
  description: 'VYFI',

  assetId: assets.vyfi.assetId,
};
