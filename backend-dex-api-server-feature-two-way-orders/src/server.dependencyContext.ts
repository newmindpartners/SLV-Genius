import 'reflect-metadata';

import {container} from 'tsyringe';

import {FastifyConfig} from './implementation/fastify/fastify.config';
import {PinoConfig} from './implementation/pino/pino.config';

import {OrderBookApplication} from '~/application/orderBook.application';

import {OrderSwapMutation} from '~/domain/events/mutation';
import {OrderSwapFillReducer, OrderSwapReducer} from '~/domain/events/reducer';

import {AssetApplication} from '~/application/asset.application';
import {OrderSaleApplication} from '~/application/orderSale.application';
import {OrderSaleProjectApplication} from '~/application/orderSaleProject.application';
import {OrderSwapApplication} from '~/application/orderSwap.application';
import {DomainMapper} from '~/implementation/prisma/domain.mapper';
import {LiquidityPoolApplication} from './application/liquidityPool.application';
import {MarketDataApplication} from './application/marketData.application';
import {StakeVaultApplication} from './application/stakeVault.application';
import {TradingPairApplication} from './application/tradingPair.application';
import {TransactionApplication} from './application/transaction.application';
import {YieldFarmingApplication} from './application/yieldFarming.application';

import {SumsubClientAxios} from '~/implementation/client/sumsub.client';
import {KycServiceFactory} from '~/implementation/kyc/kyc.service.factory';
import {CoreServiceAxios} from './implementation/client/core.service';
import {PrismaClientFactory} from './implementation/prisma/prismaClient.service.factory';

import {ConfigServiceNode} from '~/implementation/node/config.service';
import {LoggerServicePino} from '~/implementation/pino/logger.service';

import {
  MarketDataService,
  MarketOrderPriceServiceImplementation,
  OrderServiceImplementation,
  OrderSwapFeeServiceImplementation,
  OrderSwapScriptServiceImplementation,
  OrderSwapServiceImplementation,
  ProjectServiceImplementation,
  StakeVaultServiceImplementation,
  StakingProjectServiceImplementation,
  TermsServiceImplementation,
  TradingWalletService,
  TransactionServiceImplementation,
  YieldFarmingServiceImplementation,
} from '~/domain/services';

import {
  AssetRepositoryPrisma,
  CountryRepositoryPrisma,
  EventRepositoryPrisma,
  EventStreamRepositoryPrisma,
  LiquidityPoolRepositoryPrisma,
  MarketDataRepositoryPrisma,
  OrderBookRepositoryPrisma,
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

import {OrderSwapDirectFillOuraEventHandler} from '~/implementation/event/oura/orderSwap/OrderSwapDirectFillOuraEventHandler';
import {BlockOuraEventHandler} from './implementation/event/oura/blockOuraEventHandler';
import {OrderSaleFillOuraEventHandler} from './implementation/event/oura/orderSale/orderSaleFillOuraEventHandler';
import {RollBackOuraEventHandler} from './implementation/event/oura/rollBackOuraEventHandler';
import {TransactionOuraEventHandler} from './implementation/event/oura/transactionOuraEventHandler';

import {TransactionPostSubmitHandler} from '~/application/transaction/transactionPostSubmitHandler';
import {TransactionPostSubmitHandlerOrderSale} from '~/application/transaction/transactionPostSubmitHandlerOrderSale';
import {TransactionSubmitHandler} from '~/application/transaction/transactionSubmitHandler';
import {TransactionPostSubmitHandlerTwoWayOrder} from '~/application/transaction/transactionPostSubmitHandlerTwoWayOrder';

import {
  DomainEventListenerProjections,
  NoOpProjection,
  OrderSwapEventProjectionPrisma,
  OrderSwapFillEventProjectionPrisma,
} from '~/implementation/prisma/projections';
import {TradingWalletApplication} from './application/tradingWallet.application';
import {MaestroClientAxios} from './implementation/client/maestro/maestro.client';
import {OrderSwapCancelAndFinalFillOuraEventHandler} from './implementation/event/oura/orderSwap/OrderSwapCancelAndFinalFillOuraEventHandler';
import {OrderSwapOpenAndPartialFillOuraEventHandler} from './implementation/event/oura/orderSwap/OrderSwapOpenAndPartialFillOuraEventHandler';
import {TwoWayOrderOuraEventHandler} from './implementation/event/oura/twoWayOrder/TwoWayOrderOuraEventHandler';
import {TradingPairRepositoryPrisma} from './implementation/prisma/repositories/tradingPair.repository';
import {TradingWalletRepositoryPrisma} from './implementation/prisma/repositories/tradingWallet.repository';
import {TwoWayOrderRepositoryPrisma} from './implementation/prisma/repositories/twoWayOrder.repository';
import {TwoWayOrderPendingRepositoryPrisma} from './implementation/prisma/repositories/twoWayOrderPending.repository';
import {TwoWayOrderPendingCancelRepositoryPrisma} from './implementation/prisma/repositories/twoWayOrderPendingCancel.repository';
import {Redis} from './implementation/redis/redisClient';
import {OrderSwapExclusionCache} from './implementation/redis/repositories/orderSwapExclusionCache';

import {SmartVaultStrategyApplication} from './smartVaultFeature/application/smartVaultStrategy';

import {SmartVaultApplication} from './smartVaultFeature/application/smartVault';
import {SmartVaultEventMutation} from './smartVaultFeature/event/mutation';
import {SmartVaultProjectionPrisma} from './smartVaultFeature/event/smartVault/projection';
import {SmartVaultReducer} from './smartVaultFeature/event/smartVault/reducer';
import {SmartVaultAssetProjectionPrisma} from './smartVaultFeature/event/smartVaultAsset/projection';
import {SmartVaultAssetReducer} from './smartVaultFeature/event/smartVaultAsset/reducer';
import {SmartVaultOperationProjectionPrisma} from './smartVaultFeature/event/smartVaultOperation/projection';
import {SmartVaultOperationReducer} from './smartVaultFeature/event/smartVaultOperation/reducer';
import {SmartVaultOpenAndDepositOuraEventHandler} from './smartVaultFeature/oura/smartVault/createAndDepositListener';
import {SmartVaultCloseOuraEventHandler} from './smartVaultFeature/oura/smartVault/removeListener';
import {SmartVaultRepository} from './smartVaultFeature/repository/smartVault';
import {SmartVaultStrategyRepository} from './smartVaultFeature/repository/smartVaultStrategy';

const pinoConfig = new PinoConfig();

const configService = new ConfigServiceNode();

const fastifyConfig = new FastifyConfig(pinoConfig.getLoggerOptions());

const loggerService = new LoggerServicePino(pinoConfig.getLoggerOptions());

const prismaClientFactory = new PrismaClientFactory(
  configService,
  loggerService
);

const prismaClient = prismaClientFactory.getPrismaClient();

const KycService = new KycServiceFactory(configService).getKycService();

container.register('ConfigService', {useValue: configService});
container.register('LoggerService', {useValue: loggerService});
container.register('PrismaClient', {useValue: prismaClient});
container.register('Redis', Redis);

container.register('OrderSwapExclusionCache', OrderSwapExclusionCache);

container.register('KycService', KycService);
container.register('SumsubClient', SumsubClientAxios);

container.register('MaestroClient', MaestroClientAxios);

container.register('CoreService', CoreServiceAxios);
container.register('OrderService', OrderServiceImplementation);
container.register('OrderSwapFeeService', OrderSwapFeeServiceImplementation);
container.register('OrderSwapService', OrderSwapServiceImplementation);
container.register(
  'OrderSwapScriptService',
  OrderSwapScriptServiceImplementation
);
container.register('TradingWalletService', TradingWalletService);
container.register('MarketDataService', MarketDataService);
container.register(
  'MarketOrderPriceService',
  MarketOrderPriceServiceImplementation
);
container.register('TermsService', TermsServiceImplementation);
container.register('ProjectService', ProjectServiceImplementation);
container.register(
  'StakingProjectService',
  StakingProjectServiceImplementation
);
container.register('StakeVaultService', StakeVaultServiceImplementation);
container.register('TransactionService', TransactionServiceImplementation);
container.register('YieldFarmingService', YieldFarmingServiceImplementation);

container.register('DomainMapper', DomainMapper);

container.register('TransactionOuraEventHandler', TransactionOuraEventHandler);
container.register('BlockOuraEventHandler', BlockOuraEventHandler);
container.register('RollBackOuraEventHandler', RollBackOuraEventHandler);

container.register('AssetRepository', AssetRepositoryPrisma);
container.register('CountryRepository', CountryRepositoryPrisma);
container.register('EventRepository', EventRepositoryPrisma);
container.register('EventStreamRepository', EventStreamRepositoryPrisma);
container.register('LiquidityPoolRepository', LiquidityPoolRepositoryPrisma);
container.register('MarketDataRepository', MarketDataRepositoryPrisma);
container.register('OrderBookRepository', OrderBookRepositoryPrisma);
container.register(
  'OrderSaleProjectRepository',
  OrderSaleProjectRepositoryPrisma
);
container.register('OrderSaleRepository', OrderSaleRepositoryPrisma);
container.register('OrderSwapRepository', OrderSwapRepositoryPrisma);
container.register('TradingWalletRepository', TradingWalletRepositoryPrisma);
container.register('TradingPairRepository', TradingPairRepositoryPrisma);
container.register('StakeVaultRepository', StakeVaultRepositoryPrisma);
container.register('StakingNftRepository', StakingNftRepositoryPrisma);
container.register('StakingProjectRepository', StakingProjectRepositoryPrisma);
container.register('TransactionRepository', TransactionRepositoryPrisma);
container.register('UserRepository', UserRepositoryPrisma);
container.register('WhitelistRepository', WhitelistRepositoryPrisma);
container.register('TwoWayOrderRepository', TwoWayOrderRepositoryPrisma);
container.register(
  'TwoWayOrderPendingRepository',
  TwoWayOrderPendingRepositoryPrisma
);
container.register(
  'TwoWayOrderPendingCancelRepository',
  TwoWayOrderPendingCancelRepositoryPrisma
);
container.register('SmartVaultRepository', SmartVaultRepository);
container.register(
  'SmartVaultStrategyRepository',
  SmartVaultStrategyRepository
);

container.register(
  'DomainEventListenerProjections',
  DomainEventListenerProjections
);

container.register('OrderSwapEventProjection', OrderSwapEventProjectionPrisma);
container.register(
  'OrderSwapFillEventProjection',
  OrderSwapFillEventProjectionPrisma
);
container.register('NoOpProjection', NoOpProjection);
container.register('SmartVaultProjection', SmartVaultProjectionPrisma);
container.register(
  'SmartVaultAssetProjection',
  SmartVaultAssetProjectionPrisma
);
container.register(
  'SmartVaultOperationProjection',
  SmartVaultOperationProjectionPrisma
);

container.register('BlockOuraEventHandler', BlockOuraEventHandler);
container.register('RollBackOuraEventHandler', RollBackOuraEventHandler);
container.register('TransactionOuraEventHandler', TransactionOuraEventHandler);
container.register(
  'OrderSaleFillOuraEventHandler',
  OrderSaleFillOuraEventHandler
);
container.register(
  'OrderSwapOpenAndPartialFillOuraEventHandler',
  OrderSwapOpenAndPartialFillOuraEventHandler
);
container.register(
  'OrderSwapCancelAndFinalFillOuraEventHandler',
  OrderSwapCancelAndFinalFillOuraEventHandler
);
container.register(
  'OrderSwapDirectFillOuraEventHandler',
  OrderSwapDirectFillOuraEventHandler
);
container.register('TwoWayOrderOuraEventHandler', TwoWayOrderOuraEventHandler);
container.register(
  'SmartVaultOpenAndDepositOuraEventHandler',
  SmartVaultOpenAndDepositOuraEventHandler
);
container.register(
  'SmartVaultCloseOuraEventHandler',
  SmartVaultCloseOuraEventHandler
);

container.register('TransactionSubmitHandler', TransactionSubmitHandler);
container.register(
  'TransactionPostSubmitHandler',
  TransactionPostSubmitHandler
);
container.register(
  'TransactionPostSubmitHandlerOrderSale',
  TransactionPostSubmitHandlerOrderSale
);
container.register(
  'TransactionPostSubmitHandlerTwoWayOrder',
  TransactionPostSubmitHandlerTwoWayOrder
);

container.register('OrderSwapReducer', OrderSwapReducer);
container.register('OrderSwapFillReducer', OrderSwapFillReducer);
container.register('OrderSwapMutation', OrderSwapMutation);
container.register('SmartVaultReducer', SmartVaultReducer);
container.register('SmartVaultAssetReducer', SmartVaultAssetReducer);
container.register('SmartVaultOperationReducer', SmartVaultOperationReducer);
container.register('SmartVaultEventMutation', SmartVaultEventMutation);

container.register('AssetApplication', AssetApplication);
container.register('OrderBookApplication', OrderBookApplication);
container.register('OrderSaleApplication', OrderSaleApplication);
container.register('OrderSaleProjectApplication', OrderSaleProjectApplication);
container.register('OrderSwapApplication', OrderSwapApplication);
container.register('TradingPairApplication', TradingPairApplication);
container.register('TradingWalletApplication', TradingWalletApplication);
container.register('TransactionApplication', TransactionApplication);
container.register('LiquidityPoolApplication', LiquidityPoolApplication);
container.register('MarketDataApplication', MarketDataApplication);
container.register('StakeVaultApplication', StakeVaultApplication);
container.register('YieldFarmingApplication', YieldFarmingApplication);
container.register(
  'SmartVaultStrategyApplication',
  SmartVaultStrategyApplication
);
container.register('SmartVaultApplication', SmartVaultApplication);

const projectApplication = container.resolve<OrderSaleProjectApplication>(
  'OrderSaleProjectApplication'
);

export {
  configService,
  container,
  fastifyConfig,
  loggerService,
  prismaClient,
  projectApplication,
};
