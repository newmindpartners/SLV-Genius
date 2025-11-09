import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '79552edf-9e8e-4c83-b6c2-2a76a563b74a',

  name: assets.splash.longName,
  imageLogoUrl: assets.splash.iconUrl,

  // set project description
  shortDescription: 'SPLASH',
  description: 'SPLASH',

  assetId: assets.splash.assetId,
};
