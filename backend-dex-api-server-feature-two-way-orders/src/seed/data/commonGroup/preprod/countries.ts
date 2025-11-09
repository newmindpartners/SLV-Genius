import * as Seed from '~/seed/types';

/**
 * List of countries with country codes based on values returned from Sumsub.
 * See https://developers.sumsub.com/api-reference/#getting-applicant-data
 * which references ISO 3166-1 alpha-3 https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
 */
export const countriesByName = {
  afghanistan: {
    countryId: '1021dd0e-10b0-4d49-86db-2449b8f2f503',
    countryCode: 'AFG',
    name: 'Afghanistan',
  },
  albania: {
    countryId: '04539311-f49e-4308-8eaa-94720b605162',
    countryCode: 'ALB',
    name: 'Albania',
  },
  algeria: {
    countryId: '6eac18cc-4831-4b04-b9bf-d4edc4c3eda8',
    countryCode: 'DZA',
    name: 'Algeria',
  },
  angola: {
    countryId: '3871efe3-9c01-45ab-aa8b-c315610e7ec5',
    countryCode: 'AGO',
    name: 'Angola',
  },
  anguilla: {
    countryId: '5c1ba6b6-7a24-4707-995c-3442a2c99473',
    countryCode: 'AIA',
    name: 'Anguilla',
  },
  antiguaAndBarbuda: {
    countryId: 'f6a85c60-aadd-4001-b52d-809611dec767',
    countryCode: 'ATG',
    name: 'Antigua and Barbuda',
  },
  aruba: {
    countryId: '45db6d6d-7cad-4aff-b511-d5dc2cf0d459',
    countryCode: 'ABW',
    name: 'Aruba',
  },
  azerbaijan: {
    countryId: '546ae54f-10cb-4e38-b46d-9b9425eb10cf',
    countryCode: 'AZE',
    name: 'Azerbaijan',
  },
  bahamas: {
    countryId: '3f4f5394-82ba-46e2-8cc7-34b29ee7367c',
    countryCode: 'BHS',
    name: 'Bahamas',
  },
  bahrain: {
    countryId: '8a0c9d61-d00b-460b-94df-ea13163691da',
    countryCode: 'BHR',
    name: 'Bahrain',
  },
  bangladesh: {
    countryId: '3c9914b6-c158-46a8-aa66-203d7a3205fd',
    countryCode: 'BGD',
    name: 'Bangladesh',
  },
  barbados: {
    countryId: 'dc21a6c1-966d-4e37-b8e2-fcd7114b8a76',
    countryCode: 'BRB',
    name: 'Barbados',
  },
  belarus: {
    countryId: 'b0eda50c-c08f-4e0d-9174-1baa20ddd0b7',
    countryCode: 'BLR',
    name: 'Belarus',
  },
  belize: {
    countryId: '83cc50c8-257a-4ebe-9fa6-49526df9991a',
    countryCode: 'BLZ',
    name: 'Belize',
  },
  benin: {
    countryId: '61c98817-3810-4d9b-bb1c-5af6e6d8ad4a',
    countryCode: 'BEN',
    name: 'Benin',
  },
  bermuda: {
    countryId: '5bc6e37e-fb8b-40ee-91e1-899368377bc8',
    countryCode: 'BMU',
    name: 'Bermuda',
  },
  bolivia: {
    countryId: 'eb5673ce-f67f-46bf-98ab-68f75d0bf427',
    countryCode: 'BOL',
    name: 'Bolivia',
  },
  bosnia: {
    countryId: 'ffd8317f-323e-4f17-9c6e-00f648a97104',
    countryCode: 'BIH',
    name: 'Bosnia and Herzegovina',
  },
  botswana: {
    countryId: 'fef91ea1-3955-4482-9e28-d7c823f6cfc5',
    countryCode: 'BWA',
    name: 'Botswana',
  },
  britishVirginIslands: {
    countryId: 'f986bbde-5548-4701-af37-1554a67eef31',
    countryCode: 'VGB',
    name: 'British Virgin Islands',
  },
  burkinaFaso: {
    countryId: 'e60494bf-552f-42e5-92d6-5395a50905e6',
    countryCode: 'BFA',
    name: 'Burkina Faso',
  },
  cambodia: {
    countryId: '466f8a46-dc7b-4b89-9211-a171c031c5eb',
    countryCode: 'KHM',
    name: 'Cambodia',
  },
  caymanIslands: {
    countryId: 'd6703e08-ef15-4e74-a97c-d4337a27578b',
    countryCode: 'CYM',
    name: 'Cayman Islands',
  },
  dprk: {
    countryId: '85e4280c-1941-4e8a-875c-9ab784f7c168',
    countryCode: 'PRK',
    name: "Democratic People's Republic of Korea (DPRK)",
  },
  gibraltar: {
    countryId: 'd8b8127f-7800-4074-9e3d-8fc494e22c1f',
    countryCode: 'GIB',
    name: 'Gibraltar',
  },
  haiti: {
    countryId: '31f21a8d-e285-46c2-9a17-6cfaeb1ad3aa',
    countryCode: 'HTI',
    name: 'Haiti',
  },
  iran: {
    countryId: 'bae02824-d7ea-4c68-8c27-845778f6e2d9',
    countryCode: 'IRN',
    name: 'Iran',
  },
  jamaica: {
    countryId: '3b19ddf5-ff1f-41b9-8472-a36a2a9fd9c7',
    countryCode: 'JAM',
    name: 'Jamaica',
  },
  jordan: {
    countryId: '454cb153-0b58-42d8-8377-23a0a196e00c',
    countryCode: 'JOR',
    name: 'Jordan',
  },
  mali: {
    countryId: 'd66a96c3-139e-4da2-bb4c-a0099532398c',
    countryCode: 'MLI',
    name: 'Mali',
  },
  malta: {
    countryId: '5e95c993-4c38-44fe-86bc-27ee4dffec7c',
    countryCode: 'MLT',
    name: 'Malta',
  },
  morocco: {
    countryId: '6aa88d5d-b5a6-4c61-adce-cafe660a060b',
    countryCode: 'MAR',
    name: 'Morocco',
  },
  myanmar: {
    countryId: '66eeddfd-e4c1-456d-8a2a-3dc5bde5100f',
    countryCode: 'MMR',
    name: 'Myanmar',
  },
  nicaragua: {
    countryId: 'ca580288-cdb2-4b4a-9c8b-72097a9e60ab',
    countryCode: 'NIC',
    name: 'Nicaragua',
  },
  pakistan: {
    countryId: '206d7ca6-20c5-49f3-9c68-242e72dac8fd',
    countryCode: 'PAK',
    name: 'Pakistan',
  },
  panama: {
    countryId: '7695392c-83eb-4e2d-a7c3-8eae0b0ed7cc',
    countryCode: 'PAN',
    name: 'Panama',
  },
  philippines: {
    countryId: '053ff668-fe89-46af-8334-62b1282cd202',
    countryCode: 'PHL',
    name: 'Philippines',
  },
  russia: {
    countryId: 'f4309d25-0229-4244-a722-b1a71d754346',
    countryCode: 'RUS',
    name: 'Russian Federation',
  },
  slovenia: {
    countryId: 'ae346a09-50c4-4754-937e-cab2981ced12',
    countryCode: 'SVN',
    name: 'Slovenia',
  },
  switzerland: {
    countryId: '7c374f1b-f36b-491a-a541-ddcf48bfddb0',
    countryCode: 'CHE',
    name: 'Switzerland',
  },
  senegal: {
    countryId: '8efeedeb-5fa4-4c71-b337-67f600e62c65',
    countryCode: 'SEN',
    name: 'Senegal',
  },
  southSudan: {
    countryId: '564dee57-ceff-4baa-964f-b79a72dfed10',
    countryCode: 'SSD',
    name: 'South Sudan',
  },
  syrianArabRepublic: {
    countryId: 'bab8a481-4d00-4396-be7b-b1dd9516747f',
    countryCode: 'SYR',
    name: 'Syrian Arab Republic',
  },
  turkey: {
    countryId: 'a97330f2-b9e1-42ce-8a03-81b6fd911e45',
    countryCode: 'TUR',
    name: 'Turkey',
  },
  uganda: {
    countryId: '73c6d0f9-daa5-4198-8b30-011a8c9d028a',
    countryCode: 'UGA',
    name: 'Uganda',
  },
  unitedArabEmirates: {
    countryId: '05f6b69d-5bac-478e-a055-5dea47312598',
    countryCode: 'ARE',
    name: 'United Arab Emirates',
  },
  usa: {
    countryId: 'd4729718-a775-40f7-a465-234619e5996b',
    countryCode: 'USA',
    name: 'United States of America',
  },
  yemen: {
    countryId: 'fa25690d-c1c3-4bfd-be87-fdef5acfb3f3',
    countryCode: 'YEM',
    name: 'Yemen',
  },
};

export const countries: Seed.Country[] = Object.values(countriesByName);
