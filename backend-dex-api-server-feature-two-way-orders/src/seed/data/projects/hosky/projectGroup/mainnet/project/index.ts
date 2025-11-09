import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '9c5d06ff-c63d-425b-8286-fd3b4dc630d7',

  name: assets.hosky.longName,
  imageLogoUrl: getAssetIconUrl(assets.hosky.shortName),

  // set project description
  shortDescription: 'HOSKY',
  description: 'HOSKY',

  assetId: assets.hosky.assetId,
};
