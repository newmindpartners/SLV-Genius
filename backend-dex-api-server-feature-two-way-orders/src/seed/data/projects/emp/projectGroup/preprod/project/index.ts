import {Prisma} from '@prisma/client';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import {assets} from '../asset';

type Project = Omit<Prisma.ProjectUncheckedCreateInput, 'projectId'> &
  Required<Pick<Prisma.ProjectUncheckedCreateInput, 'projectId'>>;

export const project: Project = {
  projectId: 'fc9195ac-ea1e-40ec-a20b-7d63361a065f',
  name: assets.emp.longName,
  imageLogoUrl: getAssetIconUrl(assets.emp.shortName),

  shortDescription:
    'Empowa is the first RealFi property platform on Cardano that combines emerging technology, sustainable building and decentralised financial inclusion.',
  description:
    'Empowa is the first RealFi property platform on Cardano that combines emerging technology, sustainable building and decentralised financial inclusion. The Empowa utility token (EMP) allows different parties to participate in the Empowa ecosystem using a common unit of value.',

  websiteUrl: 'https://empowa.io',
  mediaMediumUrl: 'https://empowa-io.medium.com/',
  twitterUrl: 'https://twitter.com/empowa_io',
  whitePaperUrl: 'https://tr.ee/zxq_3wrsh7',

  assetId: assets.emp.assetId,

  teamMember: [],
};
