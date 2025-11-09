import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '52ea397f-97b5-47b8-9c37-1a6a36701d03',

  name: assets.soada.longName,
  imageLogoUrl: assets.soada.iconUrl,

  // set project description
  shortDescription: 'sOADA',
  description: 'sOADA',

  assetId: assets.soada.assetId,
};
