import {includes, map} from 'lodash';

import * as Private from '~/domain/models/private';

export interface CountryService {
  validateUserCountryEligibility(
    user: Private.User,
    blacklistedCountries: {countryId: string}[]
  ): boolean;
}

export class CountryServiceImplementation implements CountryService {
  validateUserCountryEligibility(
    user: Private.User,
    blacklistedCountries: {countryId: string}[]
  ): boolean {
    const userCountryId = user?.userKyc?.countryId;

    const blacklistCountryIds = map(
      blacklistedCountries,
      (o: {countryId: string}) => o.countryId
    );

    const isUserNotCountryBlacklisted = !includes(
      blacklistCountryIds,
      userCountryId
    );

    return isUserNotCountryBlacklisted;
  }
}
