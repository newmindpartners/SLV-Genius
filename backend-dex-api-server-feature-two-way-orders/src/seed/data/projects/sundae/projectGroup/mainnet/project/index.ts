import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '5c236cb0-5835-43b5-9a95-c0abddd42a22',

  name: assets.sundae.longName,
  imageLogoUrl: assets.sundae.iconUrl,

  // set project description
  shortDescription: 'SUNDAE',
  description: 'SUNDAE',

  assetId: assets.sundae.assetId,
};
