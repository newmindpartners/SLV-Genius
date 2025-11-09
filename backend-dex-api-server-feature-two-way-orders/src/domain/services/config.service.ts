import { Prisma } from '@prisma/client';

import { UserType } from '~/domain/models/public';

import { KycProvider } from '~/domain/models/private';
import { CardanoNetwork } from '../models/cardano';
import { MarketOrderStrategy } from '../models/private/marketOrderStrategy';

export interface ConfigService {
  getEnvironmentName(): string;

  isDevelopmentEnvironment(): boolean;

  isProductionEnvironment(): boolean;

  isStakeVaultShortLockPeriodFeatureEnabled(): boolean;

  isCreateStakeVaultFeatureEnabled(): boolean;

  isTransactionSubmitQueueFeatureEnabled(): boolean;

  isDexOrderSwapFeatureEnabled(): boolean;

  // TWO-WAY ORDERS
  isDexTwoWayOrderFeatureEnabled(): boolean;

  getDexOrderSwapExclusionCacheTtlSeconds(): number;

  getServerPort(): number;

  getServerHost(): string;

  getSentryDataSourceName(): string;

  isPrismaLogEnabled(): boolean;

  getPrismaTransactionTimeout(): number;

  getPrismaTransactionMaxWait(): number;

  getPrismaClientOptions(): Prisma.PrismaClientOptions;

  getPrismaTransactionOptions(): {maxWait?: number; timeout?: number};

  getCardanoTransactionUrlTemplate(): string;

  getCardanoStakeKeyUrlTemplate(): string;

  getTransactionServerUrl(): string;

  getTransactionServerTimeout(): number;

  getSumsubBaseUrl(): string;

  getSumsubAppToken(): string;

  getSumsubSecretKey(): string;

  getSumsubSourceKey(): string;

  getSumsubLevelName(userType: UserType): string;

  getSumsubTimeToLive(): number;

  getCoreAddress(): string;

  getKycProvider(): KycProvider;

  getLatestTermsUrl(): string;

  getLatestTermsVersion(): string;

  getBasicAuthUser(): string;

  getBasicAuthPass(): string;

  getRedisHost(): string;

  getRedisPass(): string;

  getRedisPort(): string;

  getSentryTracesSampleRate(): number;

  getCardanoNetwork(): CardanoNetwork;

  getBlockfrostAccessToken(network: CardanoNetwork): string;

  getMarketOrderFillStrategy(): MarketOrderStrategy;

  getMarketOrderSingleFillMaximumNumberOfOrders(): number;

  getMarketOrderMultiFillMaximumNumberOfOrders(): number;

  getMaestroApiUrl(): string;

  getMaestroApiKey(): string;

  getMaestroApiTimeout(): number;

  getEntityRetreivalLimit(): number;

  // TWO - bootstrap helpers for Oura debugging
  getDexTwoWayBootstrapCreateTxHashes(): string[]; // CSV env
  getDexTwoWayBootstrapFillTxHashes(): string[]; // CSV env
}
