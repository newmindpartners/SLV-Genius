// eslint-disable-next-line node/no-unpublished-import
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  transform: {
    ['.(ts|tsx)']: [
      'ts-jest',
      {
        compiler: 'ttypescript',
        tsconfig: {
          rootDir: '.',
          types: ['@types/node', 'jest'],
        },
      },
    ],
  },
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/test/implementation/sumsub/kyc.service.test.ts',
    '<rootDir>/test/implementation/sumsub/kyc.validation.test.ts',
    '<rootDir>/test/domain/services/country.service.test.ts',
    '<rootDir>/test/domain/utils/project.util.test.ts',
  ].concat(
    process.env.DEVELOPMENT_TESTING
      ? []
      : [
          '<rootDir>/test/implementation/application/orderSwap/multiFill.test.ts',
        ]
  ),
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  /**
   * Required for Jest tests using BigInt to pass
   * See https://github.com/jestjs/jest/issues/11617
   */
  maxWorkers: 1,
};

export default config;
