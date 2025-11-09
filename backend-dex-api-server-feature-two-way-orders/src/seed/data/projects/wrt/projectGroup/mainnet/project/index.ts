import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '69084084-c390-4b07-9293-42e1ee82ae93',

  name: assets.wrt.longName,
  imageLogoUrl: assets.wrt.iconUrl,

  // set project description
  shortDescription: 'WRT',
  description: 'WRT',

  assetId: assets.wrt.assetId,
};
