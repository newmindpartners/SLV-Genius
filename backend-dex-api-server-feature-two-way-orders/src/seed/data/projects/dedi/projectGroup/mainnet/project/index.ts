import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '56161c05-9fe3-4790-b5b2-11239af3179c',

  name: assets.dedi.longName,
  imageLogoUrl: assets.dedi.iconUrl,

  // set project description
  shortDescription: 'DEDI',
  description: 'DEDI',

  assetId: assets.dedi.assetId,
};
