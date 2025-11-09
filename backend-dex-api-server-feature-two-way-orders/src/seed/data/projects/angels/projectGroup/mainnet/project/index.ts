import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '2fb3f678-80bb-4046-a7c1-b2572616bf29',

  name: assets.angels.longName,
  imageLogoUrl: assets.angels.iconUrl,

  // set project description
  shortDescription: 'ANGELS',
  description: 'ANGELS',

  assetId: assets.angels.assetId,
};
