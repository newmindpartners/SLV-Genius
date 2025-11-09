import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '0ecadf39-06dd-4c07-98e3-97a75f9803d3',

  name: assets.sky.longName,
  imageLogoUrl: assets.sky.iconUrl,

  // set project description
  shortDescription: 'SKY',
  description: 'SKY',

  assetId: assets.sky.assetId,
};
