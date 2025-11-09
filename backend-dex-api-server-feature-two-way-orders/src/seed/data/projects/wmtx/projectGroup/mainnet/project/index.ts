import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '808b3178-2d11-4893-b55c-b19805fc3c17',

  name: assets.wmtx.longName,
  imageLogoUrl: assets.wmtx.iconUrl,

  // set project description
  shortDescription: 'WMTX',
  description: 'WMTX',

  assetId: assets.wmtx.assetId,
};
