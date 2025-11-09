import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '35a7be40-4e5e-4a35-b5f1-6b57dee5b1b0',

  name: assets.mnt.longName,
  imageLogoUrl: assets.mnt.iconUrl,

  // set project description
  shortDescription: 'MNT',
  description: 'MNT',

  assetId: assets.mnt.assetId,
};
