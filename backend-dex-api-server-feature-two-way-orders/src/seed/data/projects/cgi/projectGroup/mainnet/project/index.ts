import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '847f4eb2-4a07-478d-965d-8170a474102f',

  name: assets.cgi.longName,
  imageLogoUrl: assets.cgi.iconUrl,

  // set project description
  shortDescription: 'CGI',
  description: 'CGI',

  assetId: assets.cgi.assetId,
};
