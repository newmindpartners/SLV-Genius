import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '9d5d82e6-6cb8-4678-8457-dc791d9cc8ae',

  name: assets.rjv.longName,
  imageLogoUrl: assets.rjv.iconUrl,

  // set project description
  shortDescription: 'RJV',
  description: 'RJV',

  assetId: assets.rjv.assetId,
};
