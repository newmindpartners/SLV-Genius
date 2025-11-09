import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '1c832f68-7ce2-45d1-82ab-d0a84ba0aa2b',

  name: assets.meld.longName,
  imageLogoUrl: assets.meld.iconUrl,

  // set project description
  shortDescription: 'MELD',
  description: 'MELD',

  assetId: assets.meld.assetId,
};
