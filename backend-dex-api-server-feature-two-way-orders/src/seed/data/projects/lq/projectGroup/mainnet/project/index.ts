import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '7d7cdcbb-fb47-46de-92c2-365e4294fde1',

  name: assets.lq.longName,
  imageLogoUrl: assets.lq.iconUrl,

  // set project description
  shortDescription: 'LQ',
  description: 'LQ',

  assetId: assets.lq.assetId,
};
