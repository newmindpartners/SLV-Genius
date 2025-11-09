import { injectable, singleton } from 'tsyringe';

import dotenv from 'dotenv';

import { isEmpty } from 'lodash';

import { Prisma } from '@prisma/client';
import { CardanoNetwork } from '~/domain/models/cardano';
import { KycProvider } from '~/domain/models/private';
import { UserType } from '~/domain/models/public';

import { ConfigService } from '~/domain/services';

import { MarketOrderStrategy } from '~/domain/models/private/marketOrderStrategy';
import { SumsubLevel } from '~/implementation/node/sumsub.config';

const PRODUCTION_ENVIRONMENT = 'production';
const DEVELOPMENT_ENVIRONMENT = 'development';

export const isProduction: boolean =
  PRODUCTION_ENVIRONMENT === process.env.NODE_ENV;
export const isDevelopment: boolean =
  DEVELOPMENT_ENVIRONMENT === process.env.NODE_ENV;

@singleton()
@injectable()
export class ConfigServiceNode implements ConfigService {
  constructor() {
    if (!isProduction) {
      dotenv.config();
    }
  }

  getEnvironmentName(): string {
    return this.isProductionEnvironment()
      ? PRODUCTION_ENVIRONMENT
      : DEVELOPMENT_ENVIRONMENT;
  }

  isDevelopmentEnvironment(): boolean {
    return isDevelopment;
  }

  isProductionEnvironment(): boolean {
    return isProduction;
  }

  /**
   * Feature flags used for fine grained control to enable or disable features in
   * different environments.
   *
   * Format: <PROJECT><FEATURE_NAME>FEATURE_ENABLED
   * Project: "STAKE_VAULT", "ORDER_SALE", "DEX" or "APPLICATION_WIDE" if it
   * affects all projects.
   */

  /**
   * Feature flag for controlling whether the "lockedUntil" input when creating a
   * stake vault should be artificially short to allow for testing, or be set with
   * the actual durations which are many months in the future.
   *
   * For extra caution, feature toggling has no effect unless CARDANO_NETWORK is `preprod`.
   */
  isStakeVaultShortLockPeriodFeatureEnabled(): boolean {
    return this.getOptionalBoolean(
      'STAKE_VAULT_SHORT_LOCK_PERIOD_FEATURE_ENABLED',
      process.env.STAKE_VAULT_SHORT_LOCK_PERIOD_FEATURE_ENABLED
    );
  }

  isCreateStakeVaultFeatureEnabled(): boolean {
    const isCreateStakeVaultDisabled = this.getOptionalBoolean(
      'STAKE_VAULT_DISABLE_STAKE_VAULT_CREATION',
      process.env.STAKE_VAULT_DISABLE_STAKE_VAULT_CREATION
    );

    return isCreateStakeVaultDisabled !== true;
  }

  /**
   * Feature flag for controlling whether submitted transactions should be
   * immediately sent to the Tx server or placed in a queue to be sent once all
   * previous transactions in the queue have been processed.
   *
   * The former approach allows us to inform the client whether the
   * submission was successful or not, while the latter may be beneficial
   * in cases of high load on the submit endpoint, which could cause requests to
   * time out.
   */
  isTransactionSubmitQueueFeatureEnabled(): boolean {
    return this.getOptionalBoolean(
      'APPLICATION_WIDE_TRANSACTION_SUBMIT_QUEUE_FEATURE_ENABLED',
      process.env.APPLICATION_WIDE_TRANSACTION_SUBMIT_QUEUE_FEATURE_ENABLED
    );
  }

  isDexOrderSwapFeatureEnabled(): boolean {
    return this.getOptionalBoolean(
      'DEX_ORDER_SWAP_FEATURE_ENABLED',
      process.env.DEX_ORDER_SWAP_FEATURE_ENABLED
    );
  }

  isDexTwoWayOrderFeatureEnabled(): boolean {
    return this.getOptionalBoolean(
      'DEX_TWO_WAY_ORDER_FEATURE_ENABLED',
      process.env.DEX_TWO_WAY_ORDER_FEATURE_ENABLED
    );
  }

  getDexTwoWayOrderPolicyIds(): string[] {
    const csv = this.getOptionalString(
      'DEX_TWO_WAY_ORDER_POLICY_IDS',
      process.env.DEX_TWO_WAY_ORDER_POLICY_IDS
    );
    return (csv || '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  getDexOrderSwapExclusionCacheTtlSeconds(): number {
    return this.getRequiredInt(
      'DEX_ORDER_SWAP_EXCLUSION_CACHE_TTL_SECONDS',
      process.env.DEX_ORDER_SWAP_EXCLUSION_CACHE_TTL_SECONDS
    );
  }

  getSentryDataSourceName(): string {
    return this.getRequiredString(
      'SENTRY_DATASOURCE_NAME',
      process.env.SENTRY_DATASOURCE_NAME
    );
  }

  getServerPort(): number {
    return this.getRequiredInt('APP_PORT', process.env.APP_PORT);
  }

  getServerHost(): string {
    return this.getOptionalStringOrElse(
      'APP_HOST',
      process.env.APP_HOST,
      'localhost'
    );
  }

  getPrismaTransactionMaxWait(): number {
    return this.getRequiredInt(
      'PRISMA_TRANSACTION_MAX_WAIT',
      process.env.PRISMA_TRANSACTION_MAX_WAIT
    );
  }

  getPrismaTransactionTimeout(): number {
    return this.getRequiredInt(
      'PRISMA_TRANSACTION_TIMEOUT',
      process.env.PRISMA_TRANSACTION_TIMEOUT
    );
  }

  isPrismaLogEnabled(): boolean {
    return this.getRequiredBoolean(
      'PRISMA_LOG_QUERY_ENABLED',
      process.env.PRISMA_LOG_QUERY_ENABLED
    );
  }

  getPrismaClientOptions(): Prisma.PrismaClientOptions {
    return {
      log: this.isPrismaLogEnabled() ? ['query', 'info', 'warn', 'error'] : [],
    };
  }

  getPrismaTransactionOptions(): {maxWait?: number; timeout?: number} {
    return {
      maxWait: this.getPrismaTransactionMaxWait(),
      timeout: this.getPrismaTransactionTimeout(),
    };
  }

  getCardanoTransactionUrlTemplate(): string {
    return this.getRequiredString(
      'CARDANO_TRANSACTION_ENDPOINT',
      process.env.CARDANO_TRANSACTION_ENDPOINT
    );
  }

  getCardanoStakeKeyUrlTemplate(): string {
    return this.getRequiredString(
      'CARDANO_STAKE_KEY_ENDPOINT',
      process.env.CARDANO_STAKE_KEY_ENDPOINT
    );
  }

  getTransactionServerUrl(): string {
    return this.getRequiredString(
      'TRANSACTION_SERVER_URL',
      process.env.TRANSACTION_SERVER_URL
    );
  }

  getTransactionServerTimeout(): number {
    return this.getRequiredInt(
      'TRANSACTION_SERVER_TIMEOUT',
      process.env.TRANSACTION_SERVER_TIMEOUT
    );
  }

  getSumsubBaseUrl(): string {
    return this.getRequiredString(
      'SUMSUB_BASE_URL',
      process.env.SUMSUB_BASE_URL
    );
  }

  getSumsubAppToken(): string {
    return this.getRequiredString(
      'SUMSUB_APP_TOKEN',
      process.env.SUMSUB_APP_TOKEN
    );
  }

  getSumsubSecretKey(): string {
    return this.getRequiredString(
      'SUMSUB_SECRET_KEY',
      process.env.SUMSUB_SECRET_KEY
    );
  }

  getSumsubSourceKey(): string {
    return this.getRequiredString(
      'SUMSUB_DEFAULT_SOURCE_KEY',
      process.env.SUMSUB_DEFAULT_SOURCE_KEY
    );
  }

  getSumsubLevelName(userType: UserType): string {
    const levelNameConfig = SumsubLevel[`SUMSUB_LEVELNAME_${userType}`];
    const levelNameConfigKey = levelNameConfig.valueOf();
    return this.getRequiredString(
      levelNameConfigKey,
      process.env[levelNameConfigKey]
    );
  }

  getSumsubTimeToLive(): number {
    return this.getRequiredInt(
      'SUMSUB_DEFAULT_TTL_IN_SECS',
      process.env.SUMSUB_DEFAULT_TTL_IN_SECS
    );
  }

  getCoreAddress(): string {
    return this.getRequiredString('CORE_ADDRESS', process.env.CORE_ADDRESS);
  }

  getLatestTermsUrl(): string {
    return this.getRequiredString('TERMS_URL', process.env.TERMS_URL);
  }

  getLatestTermsVersion(): string {
    return this.getRequiredString('TERMS_VERSION', process.env.TERMS_VERSION);
  }

  getKycProvider(): KycProvider {
    return KycProvider[
      this.getOptionalString(
        'KYC_PROVIDER',
        process.env.KYC_PROVIDER
      ) as keyof typeof KycProvider
    ];
  }

  getBasicAuthUser(): string {
    return this.getRequiredString(
      'BASIC_AUTH_USER',
      process.env.BASIC_AUTH_USER
    );
  }

  getBasicAuthPass(): string {
    return this.getRequiredString(
      'BASIC_AUTH_PASSWORD',
      process.env.BASIC_AUTH_PASSWORD
    );
  }

  getRedisHost(): string {
    return this.getRequiredString('REDIS_HOST', process.env.REDIS_HOST);
  }

  getRedisPass(): string {
    return this.getRequiredString('REDIS_PASSWORD', process.env.REDIS_PASSWORD);
  }

  getRedisPort(): string {
    return this.getRequiredString('REDIS_PORT', process.env.REDIS_PORT);
  }

  getSentryTracesSampleRate(): number {
    return this.getRequiredInt(
      'SENTRY_TRACES_SAMPLE_RATE',
      process.env.SENTRY_TRACES_SAMPLE_RATE
    );
  }

  getCardanoNetwork(): CardanoNetwork {
    const cardanoNetwork =
      CardanoNetwork[
        this.getRequiredString(
          'CARDANO_NETWORK',
          process.env.CARDANO_NETWORK
        ).toUpperCase() as keyof typeof CardanoNetwork
      ];

    if (cardanoNetwork) {
      return cardanoNetwork;
    } else {
      throw new Error(
        `CARDANO_NETWORK__UNEXPECTED_${process.env.CARDANO_NETWORK}`
      );
    }
  }

  getAllowedOrigins(): string[] | boolean {
    const allowedOriginsList = this.getOptionalStringOrElse(
      'ALLOWED_ORIGINS',
      process.env.ALLOWED_ORIGINS,
      ''
    );

    const allowedOrigins = allowedOriginsList
      .split(',')
      .map(origin => origin.trim())
      .filter(origin => origin.length > 0); // filter out any empty strings

    return isEmpty(allowedOrigins) ? true : allowedOrigins;
  }

  getBlockfrostAccessToken(network: CardanoNetwork): string {
    const accessTokenMap = {
      [CardanoNetwork.MAINNET]: process.env.BLOCKFROST_MAINNET_ACCESS_TOKEN,
      [CardanoNetwork.PREPROD]: process.env.BLOCKFROST_PREPROD_ACCESS_TOKEN,
      [CardanoNetwork.PREVIEW]: process.env.BLOCKFROST_PREVIEW_ACCESS_TOKEN,
    };

    const accessToken = accessTokenMap[network];

    if (accessToken) {
      return accessToken;
    } else {
      throw new Error(
        `Env variable for Blockfrost access token on ${network} network is unset`
      );
    }
  }

  getMarketOrderFillStrategy(): MarketOrderStrategy {
    const rawStrategy = this.getRequiredString(
      'MARKET_ORDER_FILL_STRATEGY',
      process.env.MARKET_ORDER_FILL_STRATEGY
    );

    const marketOrderStrategies: MarketOrderStrategy[] = [
      'MULTI_FILL_POSTGRES_KNAPSACK',
      'MULTI_FILL_NAIVE',
      'SINGLE_FILL',
    ];
    if ((marketOrderStrategies as string[]).includes(rawStrategy)) {
      return rawStrategy as MarketOrderStrategy;
    } else {
      throw new Error(`Invalid MARKET_ORDER_FILL_STRATEGY: ${rawStrategy}`);
    }
  }

  getMarketOrderSingleFillMaximumNumberOfOrders(): number {
    return (
      this.getRequiredInt(
        'MARKET_ORDER_SINGLE_FILL_MAXIMUM_NUMBER_OF_ORDERS_TO_FETCH',
        process.env.MARKET_ORDER_SINGLE_FILL_MAXIMUM_NUMBER_OF_ORDERS_TO_FETCH
      ) || 10
    );
  }

  getMarketOrderMultiFillMaximumNumberOfOrders(): number {
    return (
      this.getRequiredInt(
        'MARKET_ORDER_MULTI_FILL_MAXIMUM_NUMBER_OF_ORDERS_TO_FILL',
        process.env.MARKET_ORDER_MULTI_FILL_MAXIMUM_NUMBER_OF_ORDERS_TO_FILL
      ) || 3
    );
  }

  getMaestroApiUrl(): string {
    return (
      this.getRequiredString(
        'MAESTRO_API_BASE_URL',
        process.env.MAESTRO_API_BASE_URL
      ) || 'https://mainnet.gomaestro-api.org'
    );
  }

  getMaestroApiKey(): string {
    return this.getRequiredString(
      'MAESTRO_API_KEY',
      process.env.MAESTRO_API_KEY
    );
  }

  getMaestroApiTimeout(): number {
    return (
      this.getOptionalInt('MAESTRO_TIMEOUT', process.env.MAESTRO_TIMEOUT) ||
      5_000
    );
  }

  getEntityRetreivalLimit(): number {
    return (
      this.getRequiredInt(
        'ENTITY_RETRIEVAL_LIMIT',
        process.env.ENTITY_RETRIEVAL_LIMIT
      ) || 100
    );
  }

  // -- TWO bootstrap helpers --
  getDexTwoWayBootstrapCreateTxHashes(): string[] {
    const csv = this.getOptionalString(
      'DEX_TWO_WAY_BOOTSTRAP_CREATE_TX_HASHES',
      process.env.DEX_TWO_WAY_BOOTSTRAP_CREATE_TX_HASHES
    );
    return (csv || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  getDexTwoWayBootstrapFillTxHashes(): string[] {
    const csv = this.getOptionalString(
      'DEX_TWO_WAY_BOOTSTRAP_FILL_TX_HASHES',
      process.env.DEX_TWO_WAY_BOOTSTRAP_FILL_TX_HASHES
    );
    return (csv || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  private getRequiredInt(key: string, value: string | undefined): number {
    return parseInt(this.getRequiredString(key, value));
  }

  private getOptionalInt(
    _: string,
    value: string | undefined
  ): number | undefined {
    if (value) return parseInt(value);
    else return undefined;
  }

  private getRequiredString(key: string, value: string | undefined): string {
    if (!value) throw new Error(`CONFIG__${key}_REQUIRED`);
    return value;
  }

  private getRequiredBoolean(key: string, value: string | undefined): boolean {
    if (!value) if (!value) throw new Error(`CONFIG__${key}_REQUIRED`);
    return 'true' === value;
  }

  private getOptionalBoolean(_: string, value: string | undefined): boolean {
    return 'true' === value;
  }

  private getOptionalString(
    _: string,
    value: string | undefined
  ): string | undefined {
    return value;
  }

  private getOptionalStringOrElse(
    key: string,
    value: string | undefined,
    elseValue: string
  ): string {
    return value || elseValue;
  }
}
