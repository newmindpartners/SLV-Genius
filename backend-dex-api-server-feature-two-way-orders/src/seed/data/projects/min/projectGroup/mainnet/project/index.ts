import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '9c6c9e2f-41f7-4611-b106-907a31675b73',

  name: assets.min.longName,
  imageLogoUrl: assets.min.iconUrl,

  // set project description
  shortDescription: 'MIN',
  description: 'MIN',

  assetId: assets.min.assetId,
};
