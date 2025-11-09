import 'reflect-metadata';

import {container} from 'tsyringe';

import {
  CountryService,
  CountryServiceImplementation,
} from '~/domain/services/country.service';

import {mockUser} from '../mock';

import * as Private from '~/domain/models/private';

beforeAll(() => {
  container.register('CountryService', CountryServiceImplementation);
});

test('User must be blacklist', () => {
  const countryService = container.resolve<CountryService>('CountryService');

  const user = mockUser({
    userType: Private.UserType.INDIVIDUAL,
    walletStakeKeyHash:
      '8200581cb98d41fa032cda9644cddfe39a0ed0eb905e96a546ddd8e854719c27',
  });

  const result: boolean = countryService.validateUserCountryEligibility(user, [
    {
      countryId: '1',
    },
  ]);

  expect(result).toBeFalsy();
});

test('User not must be blacklisted', () => {
  const countryService = container.resolve<CountryService>('CountryService');

  const user = mockUser({
    userType: Private.UserType.INDIVIDUAL,
    walletStakeKeyHash:
      '8200581cb98d41fa032cda9644cddfe39a0ed0eb905e96a546ddd8e854719c27',
  });

  const result: boolean = countryService.validateUserCountryEligibility(user, [
    {
      countryId: '2',
    },
  ]);

  expect(result).toBeTruthy();
});
