import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '070e3a1d-7408-418e-91e4-4ad009e8dbe4',

  name: assets.rserg.longName,
  imageLogoUrl: assets.rserg.iconUrl,

  // set project description
  shortDescription: 'rsERG',
  description: 'rsERG',

  assetId: assets.rserg.assetId,
};
