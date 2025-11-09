import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'cbedc200-ca33-4838-aa50-c85d5b05666c',

  name: assets.newm.longName,
  imageLogoUrl: assets.newm.iconUrl,

  // set project description
  shortDescription: 'NEWM',
  description: 'NEWM',

  assetId: assets.newm.assetId,
};
