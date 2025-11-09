import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '0fd35932-8c39-4ff0-9e75-447afe9007a2',

  name: assets.lenfi.longName,
  imageLogoUrl: assets.lenfi.iconUrl,

  // set project description
  shortDescription: 'LENFI',
  description: 'LENFI',

  assetId: assets.lenfi.assetId,
};
