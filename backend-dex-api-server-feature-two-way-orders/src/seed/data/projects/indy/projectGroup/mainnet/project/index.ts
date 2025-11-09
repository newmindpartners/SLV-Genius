import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: 'd20777c2-5644-4182-8fd4-c3ade9f542c0',

  name: assets.indy.longName,
  imageLogoUrl: assets.indy.iconUrl,

  // set project description
  shortDescription: 'INDY',
  description: 'INDY',

  assetId: assets.indy.assetId,
};
