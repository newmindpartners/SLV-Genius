import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '5032090a-7128-4427-9e8e-b9063f7e1ab3',

  name: assets.danzo.longName,
  imageLogoUrl: assets.danzo.iconUrl,

  // set project description
  shortDescription: 'DANZO',
  description: 'DANZO',

  assetId: assets.danzo.assetId,
};
