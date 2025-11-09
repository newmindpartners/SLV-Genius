import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '4af52836-fd05-4aca-bea4-8d3defe51a15',

  name: assets.hyn.longName,
  imageLogoUrl: assets.hyn.iconUrl,

  // set project description
  shortDescription: 'HYN',
  description: 'HYN',

  assetId: assets.hyn.assetId,
};
