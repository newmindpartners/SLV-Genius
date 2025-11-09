import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '9ec83021-dc27-4710-a9d6-c8e86858c415',

  name: assets.optim.longName,
  imageLogoUrl: assets.optim.iconUrl,

  // set project description
  shortDescription: 'OPTIM',
  description: 'OPTIM',

  assetId: assets.optim.assetId,
};
