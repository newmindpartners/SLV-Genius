import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '28ff7cac-33f4-4dbf-bfee-91b15fc1944c',

  name: assets.shards.longName,
  imageLogoUrl: assets.shards.iconUrl,

  // set project description
  shortDescription: 'SHARDS',
  description: 'SHARDS',

  assetId: assets.shards.assetId,
};
