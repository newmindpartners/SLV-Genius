import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '1c66bcb3-cd91-419a-9211-09b2be95436a',

  name: assets.spx.longName,
  imageLogoUrl: assets.spx.iconUrl,

  // set project description
  shortDescription: 'SPX',
  description: 'SPX',

  assetId: assets.spx.assetId,
};
