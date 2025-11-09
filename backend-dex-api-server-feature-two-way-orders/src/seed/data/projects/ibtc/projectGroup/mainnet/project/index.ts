import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '757d1ba2-5cdf-4127-87f3-0d6742a5382e',

  name: assets.ibtc.longName,
  imageLogoUrl: assets.ibtc.iconUrl,

  // set project description
  shortDescription: 'iBTC',
  description: 'iBTC',

  assetId: assets.ibtc.assetId,
};
