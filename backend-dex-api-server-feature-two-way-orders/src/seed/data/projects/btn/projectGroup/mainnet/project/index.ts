import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '967f514a-dea3-4615-9a13-289927c90ed8',

  name: assets.btn.longName,
  imageLogoUrl: assets.btn.iconUrl,

  // set project description
  shortDescription: 'BTN',
  description: 'BTN',

  assetId: assets.btn.assetId,
};
