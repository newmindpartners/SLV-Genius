import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '9bd8bd99-a804-42cc-8140-4d457e21b56a',

  name: assets.lenfi.longName,
  imageLogoUrl: assets.lenfi.iconUrl,

  // set project description
  shortDescription: 'LENFI',
  description: 'LENFI',

  assetId: assets.lenfi.assetId,
};
