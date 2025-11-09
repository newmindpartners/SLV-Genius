import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'f07d3830-a668-460b-b83e-19c396060ce9',

  name: assets.ding.longName,
  imageLogoUrl: assets.ding.iconUrl,

  // set project description
  shortDescription: 'DING',
  description: 'DING',

  assetId: assets.ding.assetId,
};
