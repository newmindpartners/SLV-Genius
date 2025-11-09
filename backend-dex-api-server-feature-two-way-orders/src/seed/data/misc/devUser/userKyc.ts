import * as Prisma from '@prisma/client';
import {now, tomorrow} from '~/domain/utils/date.util';
import {countriesByName as preprodCountriesByName} from '~/seed/data/commonGroup/preprod/countries';
import {user as preprodUser} from './user';
import {user2 as preprodUser2} from './user';

export const userKyc: Prisma.UserKyc = {
  userKycId: 'af7da472-8c8c-4b20-adeb-be412507bfef',
  userId: preprodUser.userId,
  kycExternalId: '62d62dc1f7023d0001e1b26c',
  kycProvider: 'SUMSUB',
  countryId: preprodCountriesByName.switzerland.countryId,
  reviewDate: now(),
  rejectReason: null,
  reviewStatus: 'completed',
  reviewResult: Prisma.KycReviewResult.GREEN,
  documentExpiryDate: tomorrow(),
  isLatestKycValidResult: true,
  latestKycValidationDate: new Date(),
  created: now(),
  updated: now(),
};

export const userKyc2: Prisma.UserKyc = {
  userKycId: '488c8b83-49f1-4792-849a-7d59075f090a',
  userId: preprodUser2.userId,
  kycExternalId: '3d0001e1b26c62d62dc1f702',
  kycProvider: 'SUMSUB',
  countryId: preprodCountriesByName.switzerland.countryId,
  reviewDate: now(),
  rejectReason: null,
  reviewStatus: 'completed',
  reviewResult: Prisma.KycReviewResult.GREEN,
  documentExpiryDate: tomorrow(),
  isLatestKycValidResult: true,
  latestKycValidationDate: new Date(),
  created: now(),
  updated: now(),
};
