import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

export type UserKycInternal = Private.User &
  Public.UserKyc &
  Private.UserKycData & {
    countryId?: string;
  };
