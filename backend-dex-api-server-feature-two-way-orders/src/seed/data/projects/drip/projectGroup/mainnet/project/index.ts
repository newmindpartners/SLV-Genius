import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'c719a26c-bc08-43d2-87a6-397e66b94cc5',

  name: assets.drip.longName,
  imageLogoUrl: assets.drip.iconUrl,

  // set project description
  shortDescription: 'DRIP',
  description: 'DRIP',

  assetId: assets.drip.assetId,
};
