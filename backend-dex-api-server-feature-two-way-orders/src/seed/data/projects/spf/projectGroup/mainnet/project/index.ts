import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '2b0c08fa-7233-4382-b95b-417c79df7a28',

  name: assets.spf.longName,
  imageLogoUrl: assets.spf.iconUrl,

  // set project description
  shortDescription: 'SPF',
  description: 'SPF',

  assetId: assets.spf.assetId,
};
