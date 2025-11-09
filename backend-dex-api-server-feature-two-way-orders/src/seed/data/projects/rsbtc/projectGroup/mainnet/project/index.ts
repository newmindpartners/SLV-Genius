import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '9de1aaba-334a-4183-b40e-c847e14f6b97',

  name: assets.rsbtc.longName,
  imageLogoUrl: assets.rsbtc.iconUrl,

  // set project description
  shortDescription: 'rsBTC',
  description: 'rsBTC',

  assetId: assets.rsbtc.assetId,
};
