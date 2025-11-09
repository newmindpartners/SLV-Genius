import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '0fcd2290-a141-4570-b4b6-3aa41f4ceab0',

  name: assets.cblp.longName,
  imageLogoUrl: assets.cblp.iconUrl,

  // set project description
  shortDescription: 'CBLP',
  description: 'CBLP',

  assetId: assets.cblp.assetId,
};
