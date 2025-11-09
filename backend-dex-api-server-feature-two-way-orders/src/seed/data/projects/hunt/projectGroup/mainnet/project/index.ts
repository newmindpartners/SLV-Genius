import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '634f8c12-5408-4c01-bc9d-221e2d649b59',

  name: assets.hunt.longName,
  imageLogoUrl: assets.hunt.iconUrl,

  // set project description
  shortDescription: 'HUNT',
  description: 'HUNT',

  assetId: assets.hunt.assetId,
};
