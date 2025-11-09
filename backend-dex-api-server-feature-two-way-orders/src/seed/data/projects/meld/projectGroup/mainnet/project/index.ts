import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'ee9ab09e-172a-4359-ad38-dd4720856c33',

  name: assets.meld.longName,
  imageLogoUrl: assets.meld.iconUrl,

  // set project description
  shortDescription: 'MELD',
  description: 'MELD',

  assetId: assets.meld.assetId,
};
