import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'c8bd7a55-7069-4f99-8629-406a069cabe5',

  name: assets.mntx.longName,
  imageLogoUrl: assets.mntx.iconUrl,

  // set project description
  shortDescription: 'MNTX',
  description: 'MNTX',

  assetId: assets.mntx.assetId,
};
