import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '841d47ff-d88b-4d4f-ad25-5c9c517a2b14',

  name: assets.wmt.longName,
  imageLogoUrl: assets.wmt.iconUrl,

  // set project description
  shortDescription: 'WMT',
  description: 'WMT',

  assetId: assets.wmt.assetId,
};
