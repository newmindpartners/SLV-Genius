import 'reflect-metadata';

import {container} from 'tsyringe';

import {PinoConfig} from '~/implementation/pino/pino.config';

import {LoggerServicePino} from '~/implementation/pino/logger.service';
import {ConfigServiceNode} from '~/implementation/node/config.service';
import {PrismaClientFactory} from '~/implementation/prisma/prismaClient.service.factory';

import {DomainMapper} from '~/implementation/prisma/domain.mapper';

import {
  OrderServiceImplementation,
  OrderSwapFeeServiceImplementation,
  OrderSwapServiceImplementation,
  ProjectServiceImplementation,
  StakeVaultServiceImplementation,
  MarketOrderPriceServiceImplementation,
  OrderSwapScriptServiceImplementation,
  MarketDataService,
} from '~/domain/services';
import {CoreServiceAxios} from '~/implementation/client/core.service';

import {
  AssetRepositoryPrisma,
  CountryRepositoryPrisma,
  EventStreamRepositoryPrisma,
  MarketDataRepositoryPrisma,
  OrderSaleProjectRepositoryPrisma,
  OrderSaleRepositoryPrisma,
  OrderSwapRepositoryPrisma,
  StakeVaultRepositoryPrisma,
  StakingNftRepositoryPrisma,
  StakingProjectRepositoryPrisma,
  TransactionRepositoryPrisma,
  UserRepositoryPrisma,
  WhitelistRepositoryPrisma,
} from '~/implementation/prisma/repositories';

import {OrderSwapReducer, OrderSwapFillReducer} from '~/domain/events/reducer';

import {OrderSwapApplication} from '~/application/orderSwap.application';
import {OrderSaleProjectApplication} from '~/application/orderSaleProject.application';

import {CliServerApplication} from '~/cli/server/application';
import {OrderSwapMutation} from '~/domain/events/mutation';
import {
  DomainEventListenerProjections,
  NoOpProjection,
  OrderSwapEventProjectionPrisma,
  OrderSwapFillEventProjectionPrisma,
} from '~/implementation/prisma/projections';
import {Redis as RedisClient} from '~/implementation/redis/redisClient';
import {RedisMock as RedisClientMock} from '~/implementation/redis/redisClientMock';
import {OrderSwapExclusionCache} from '~/implementation/redis/repositories/orderSwapExclusionCache';
import {StakeVaultApplication} from '~/application/stakeVault.application';
import {MaestroClientAxios} from '~/implementation/client/maestro/maestro.client';
import {StakingProjectServiceImplementation} from '~/domain/services/stakingProject.service';
import {TradingWalletService} from '~/domain/services/tradingWallet.service';
import {MarketDataApplication} from '~/application/marketData.application';
import {TradingWalletRepositoryPrisma} from '~/implementation/prisma/repositories/tradingWallet.repository';
import {TradingPairRepositoryPrisma} from '~/implementation/prisma/repositories/tradingPair.repository';
import {TradingWalletApplication} from '~/application/tradingWallet.application';
import {TradingPairApplication} from '~/application/tradingPair.application';
import {SmartVaultRepository} from '~/smartVaultFeature/repository/smartVault';
import {SmartVaultStrategyRepository} from '~/smartVaultFeature/repository/smartVaultStrategy';
import {SmartVaultProjectionPrisma} from '~/smartVaultFeature/event/smartVault/projection';
import {SmartVaultAssetProjectionPrisma} from '~/smartVaultFeature/event/smartVaultAsset/projection';
import {SmartVaultOperationProjectionPrisma} from '~/smartVaultFeature/event/smartVaultOperation/projection';
import {SmartVaultReducer} from '~/smartVaultFeature/event/smartVault/reducer';
import {SmartVaultAssetReducer} from '~/smartVaultFeature/event/smartVaultAsset/reducer';
import {SmartVaultOperationReducer} from '~/smartVaultFeature/event/smartVaultOperation/reducer';
import {SmartVaultEventMutation} from '~/smartVaultFeature/event/mutation';
import {SmartVaultStrategyApplication} from '~/smartVaultFeature/application/smartVaultStrategy';
import {SmartVaultApplication} from '~/smartVaultFeature/application/smartVault';

const pinoConfig = new PinoConfig();

const configService = new ConfigServiceNode();

const loggerService = new LoggerServicePino(pinoConfig.getLoggerOptions());

const prismaClientFactory = new PrismaClientFactory(
  configService,
  loggerService
);

const prismaClient = prismaClientFactory.getPrismaClient();

const Redis =
  process.env.DISABLE_REDIS === 'true' ? RedisClientMock : RedisClient;

container.register('DomainMapper', DomainMapper);

container.register('ConfigService', {useValue: configService});
container.register('LoggerService', {useValue: loggerService});
container.register('PrismaClient', {useValue: prismaClient});
container.register('Redis', Redis);

container.register('OrderSwapExclusionCache', OrderSwapExclusionCache);

container.register('MaestroClient', MaestroClientAxios);

container.register('CoreService', CoreServiceAxios);
container.register('OrderService', OrderServiceImplementation);
container.register('OrderSwapFeeService', OrderSwapFeeServiceImplementation);
container.register('OrderSwapService', OrderSwapServiceImplementation);
container.register(
  'OrderSwapScriptService',
  OrderSwapScriptServiceImplementation
);
container.register(
  'MarketOrderPriceService',
  MarketOrderPriceServiceImplementation
);
container.register('TradingWalletService', TradingWalletService);
container.register('ProjectService', ProjectServiceImplementation);
container.register(
  'StakingProjectService',
  StakingProjectServiceImplementation
);
container.register('StakeVaultService', StakeVaultServiceImplementation);
container.register('MarketDataService', MarketDataService);

container.register('AssetRepository', AssetRepositoryPrisma);
container.register('CountryRepository', CountryRepositoryPrisma);
container.register('EventStreamRepository', EventStreamRepositoryPrisma);
container.register('OrderSaleRepository', OrderSaleRepositoryPrisma);
container.register(
  'OrderSaleProjectRepository',
  OrderSaleProjectRepositoryPrisma
);
container.register('OrderSwapRepository', OrderSwapRepositoryPrisma);
container.register('TransactionRepository', TransactionRepositoryPrisma);
container.register('WhitelistRepository', WhitelistRepositoryPrisma);
container.register('StakeVaultRepository', StakeVaultRepositoryPrisma);
container.register('StakingNftRepository', StakingNftRepositoryPrisma);
container.register('StakingProjectRepository', StakingProjectRepositoryPrisma);
container.register('UserRepository', UserRepositoryPrisma);
container.register('MarketDataRepository', MarketDataRepositoryPrisma);
container.register('TradingWalletRepository', TradingWalletRepositoryPrisma);
container.register('TradingPairRepository', TradingPairRepositoryPrisma);
container.register('SmartVaultRepository', SmartVaultRepository);
container.register(
  'SmartVaultStrategyRepository',
  SmartVaultStrategyRepository
);

container.register(
  'DomainEventListenerProjections',
  DomainEventListenerProjections
);
container.register('NoOpProjection', NoOpProjection);
container.register('OrderSwapEventProjection', OrderSwapEventProjectionPrisma);
container.register(
  'OrderSwapFillEventProjection',
  OrderSwapFillEventProjectionPrisma
);
container.register('SmartVaultProjection', SmartVaultProjectionPrisma);
container.register(
  'SmartVaultAssetProjection',
  SmartVaultAssetProjectionPrisma
);
container.register(
  'SmartVaultOperationProjection',
  SmartVaultOperationProjectionPrisma
);

container.register('OrderSwapReducer', OrderSwapReducer);
container.register('OrderSwapFillReducer', OrderSwapFillReducer);
container.register('OrderSwapMutation', OrderSwapMutation);
container.register('SmartVaultReducer', SmartVaultReducer);
container.register('SmartVaultAssetReducer', SmartVaultAssetReducer);
container.register('SmartVaultOperationReducer', SmartVaultOperationReducer);
container.register('SmartVaultEventMutation', SmartVaultEventMutation);

container.register('OrderSwapApplication', OrderSwapApplication);
container.register('OrderSaleProjectApplication', OrderSaleProjectApplication);
container.register('StakeVaultApplication', StakeVaultApplication);
container.register('MarketDataApplication', MarketDataApplication);
container.register('TradingWalletApplication', TradingWalletApplication);
container.register('TradingPairApplication', TradingPairApplication);
container.register(
  'SmartVaultStrategyApplication',
  SmartVaultStrategyApplication
);
container.register('SmartVaultApplication', SmartVaultApplication);

container.register('CliServerApplication', CliServerApplication);

const projectApplication = container.resolve<OrderSaleProjectApplication>(
  'OrderSaleProjectApplication'
);

export {
  container,
  prismaClient,
  configService,
  loggerService,
  projectApplication,
};
