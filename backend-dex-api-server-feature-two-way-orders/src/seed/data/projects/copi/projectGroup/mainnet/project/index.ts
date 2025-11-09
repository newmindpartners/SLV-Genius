import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '5fda22ad-30b4-463f-8831-3057f45ee34b',

  name: assets.copi.longName,
  imageLogoUrl: assets.copi.iconUrl,

  // set project description
  shortDescription: 'COPI',
  description: 'COPI',

  assetId: assets.copi.assetId,
};
