import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '33f9b755-a5ee-4d93-9ac8-64acb571e4ee',

  name: assets.ieth.longName,
  imageLogoUrl: assets.ieth.iconUrl,

  // set project description
  shortDescription: 'iETH',
  description: 'iETH',

  assetId: assets.ieth.assetId,
};
