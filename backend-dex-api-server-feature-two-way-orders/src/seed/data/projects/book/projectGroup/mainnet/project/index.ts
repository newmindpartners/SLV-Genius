import * as Seed from '~/seed/types';
import {assets} from '../asset';

export const project: Seed.Project = {
  projectId: '42968d35-0859-4491-9311-3c6917dbd5bc',

  name: assets.book.longName,
  imageLogoUrl: assets.book.iconUrl,

  // set project description
  shortDescription: 'BOOK',
  description: 'BOOK',

  assetId: assets.book.assetId,
};
