import { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: './dex-api-schema/future.yml',
  apiFile: './src/redux/api/base.ts',
  apiImport: 'base',
  outputFile: './src/redux/api/core.ts',
  exportName: 'core',
  hooks: { queries: true, lazyQueries: true, mutations: true },
};

export default config;
