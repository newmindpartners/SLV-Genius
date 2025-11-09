import * as Seed from '~/seed/types';

import {countriesByName} from '~/seed/data/commonGroup/preprod/countries';

export const orderSaleBlacklistCountries: Seed.OrderSaleBlacklistCountry[] = [
  countriesByName.slovenia,
].map(country => ({
  countryId: country.countryId,
}));
