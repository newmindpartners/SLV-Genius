import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '05501353-0729-4ce6-8bba-ef29a36d1374',

  name: assets.clarity.longName,
  imageLogoUrl: assets.clarity.iconUrl,

  // set project description
  shortDescription: 'CLARITY',
  description: 'CLARITY',

  assetId: assets.clarity.assetId,
};
