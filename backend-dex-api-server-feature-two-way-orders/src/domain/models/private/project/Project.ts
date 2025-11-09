import {Prisma} from '@prisma/client';

export type Project = Prisma.ProjectGetPayload<{
  include: {
    asset: true;
    round: {
      orderBy: {
        number: 'asc';
      };
      include: {
        roundWhitelist: true;
      };
    };
  };
}>;
