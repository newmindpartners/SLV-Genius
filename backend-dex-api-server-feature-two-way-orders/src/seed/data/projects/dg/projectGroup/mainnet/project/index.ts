import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '83f6d254-c4f6-4353-8a12-7e286c58e41f',

  name: assets.dg.longName,
  imageLogoUrl: assets.dg.iconUrl,

  // set project description
  shortDescription: 'DG',
  description: 'DG',

  assetId: assets.dg.assetId,
};
