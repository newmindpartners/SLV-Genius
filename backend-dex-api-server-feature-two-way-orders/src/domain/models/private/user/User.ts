import {Prisma} from '@prisma/client';

type UserWithKyc = Prisma.UserGetPayload<{
  include: {
    userKyc: true;
  };
}>;

export type User = Prisma.UserGetPayload<{}> & UserWithKyc;
