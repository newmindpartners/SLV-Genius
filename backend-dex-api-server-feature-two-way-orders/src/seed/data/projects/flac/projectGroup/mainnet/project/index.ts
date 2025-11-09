import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '9769796c-231c-42e5-a49c-847225faa946',

  name: assets.flac.longName,
  imageLogoUrl: assets.flac.iconUrl,

  // set project description
  shortDescription: 'FLAC',
  description: 'FLAC',

  assetId: assets.flac.assetId,
};
