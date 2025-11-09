import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '02e703ec-5ace-4db9-b87a-90a27495af4c',

  name: assets.shen.longName,
  imageLogoUrl: assets.shen.iconUrl,

  // set project description
  shortDescription: 'SHEN',
  description: 'SHEN',

  assetId: assets.shen.assetId,
};
