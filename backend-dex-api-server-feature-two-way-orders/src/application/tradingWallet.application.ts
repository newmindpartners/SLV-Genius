import {inject, injectable, singleton} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';
import {
  OrderSwapRepository,
  UserRepository,
  TradingWalletRepository,
} from '~/domain/repositories';
import {MarketDataService, TradingWalletService} from '~/domain/services';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import {ErrorCode, PublicError, PublicErrorCode} from '~/domain/errors';
import {ApplicationError} from './application.error';
import {DomainMapper} from '~/implementation/prisma/domain.mapper';
import {MarketDataApplication} from './marketData.application';
import {windowIntervalToDateInterval} from '~/domain/utils/date.util';
import {isError} from 'lodash';
import {isUniqueConstraintViolation} from '~/implementation/utils/prisma';

@singleton()
@injectable()
export class TradingWalletApplication {
  constructor(
    @inject('TradingWalletRepository')
    private readonly tradingWalletRepository: TradingWalletRepository,

    @inject('TradingWalletService')
    private readonly tradingWalletService: TradingWalletService,

    @inject('MarketDataApplication')
    private readonly marketDataApplication: MarketDataApplication,

    @inject('MarketDataService')
    private readonly marketDataService: MarketDataService,

    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('OrderSwapRepository')
    private readonly orderSwapRepository: OrderSwapRepository,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper
  ) {}

  async listTradingWallets(
    context: TransactionalContext,
    query: Private.TradingWalletListQuery
  ): Promise<Public.TradingWalletsResult> {
    const {
      results: tradingWalletsResult,
      count,
      next,
      prev,
    }: Private.PaginatedResults<Private.TradingWallet> = await this.tradingWalletRepository.listTradingWallets(
      context,
      query
    );

    const enrichedTradingWalletResults: (Private.TradingWallet & {
      firstOrderDate: Date | null;
      tradesCount: number;
    })[] = await Promise.all(
      tradingWalletsResult.map(async (tradingWallet: Private.TradingWallet) => {
        const firstTradingWalletOrderSwap =
          await this.orderSwapRepository.getFirstOrderSwapByAssetIdPairAndUserId(
            context,
            [tradingWallet.assetOneId, tradingWallet.assetTwoId],
            tradingWallet.tradingWalletUserId
          );

        const isDirectionlessAssetPair = true;

        const tradesCount =
          await this.orderSwapRepository.getOrderSwapCountByAssetPair(
            context,
            tradingWallet.tradingWalletUserId,
            [tradingWallet.assetOneId, tradingWallet.assetTwoId],
            isDirectionlessAssetPair
          );

        return {
          ...tradingWallet,
          firstOrderDate: firstTradingWalletOrderSwap?.orderDate || null,
          tradesCount,
        };
      })
    );

    const publicTradingWalletsResult: Public.TradingWallet[] =
      await Promise.all(
        enrichedTradingWalletResults.map(async enrichedTradingWallet => {
          return this.domainMapper.toPublicTradingWallet(
            enrichedTradingWallet,
            {
              startDate: enrichedTradingWallet.firstOrderDate,
              tradesCount: enrichedTradingWallet.tradesCount,
            }
          );
        })
      );

    return {
      results: publicTradingWalletsResult,
      count,
      previous: prev,
      next,
    };
  }

  private async getFirstTradingWalletOrderSwap(
    context: TransactionalContext,
    tradingWallet: Private.TradingWallet
  ): Promise<Private.OrderSwap | null> {
    return this.orderSwapRepository.getFirstOrderSwapByAssetIdPairAndUserId(
      context,
      [tradingWallet.assetOneId, tradingWallet.assetTwoId],
      tradingWallet.tradingWalletUserId
    );
  }

  async getTradingWallet(
    context: TransactionalContext,
    query: Private.TradingWalletQuery
  ): Promise<Public.TradingWallet> {
    const tradingWallet: Private.TradingWallet =
      await this.tradingWalletRepository.getTradingWallet(context, query);

    const firstTradingWalletOrderSwap =
      await this.getFirstTradingWalletOrderSwap(context, tradingWallet);

    const isDirectionlessAssetPair = true;

    const tradesCount =
      await this.orderSwapRepository.getOrderSwapCountByAssetPair(
        context,
        tradingWallet.tradingWalletUserId,
        [tradingWallet.assetOneId, tradingWallet.assetTwoId],
        isDirectionlessAssetPair
      );

    return this.domainMapper.toPublicTradingWallet(tradingWallet, {
      startDate: firstTradingWalletOrderSwap?.orderDate || null,
      tradesCount,
    });
  }

  async registerTradingWallet(
    context: TransactionalContext,
    registerTradingWallet: Public.RegisterTradingWallet,
    followerWalletStakeKeyHash: string
  ): Promise<Public.TradingWalletRegisterResult> {
    const followerUser = await this.userRepository.getUserByStakeKeyHash(
      context,
      followerWalletStakeKeyHash
    );

    if (!followerUser) {
      throw new ApplicationError(
        ErrorCode.TRADING_WALLET__USER_NOT_ATTACHED_TO_REQUEST
      );
    }

    const tradingWalletUser =
      await this.userRepository.getOrCreateUserWithStakeKeyHash(
        context,
        registerTradingWallet.tradingWalletStakeKeyHash
      );

    const tradingWalletData: Private.TradingWalletCreate = {
      assetOneId: registerTradingWallet.assetOneId,
      assetTwoId: registerTradingWallet.assetTwoId,
      tradingWalletUserId: tradingWalletUser.userId,
    };

    const tradingWallet: Private.TradingWallet =
      await this.tradingWalletRepository.getOrCreateTradingWallet(
        context,
        tradingWalletData
      );

    try {
      await this.tradingWalletRepository.followTradingWallet(
        context,
        followerUser.userId,
        tradingWallet.tradingWalletId
      );
    } catch (error) {
      if (isError(error) && isUniqueConstraintViolation(error)) {
        throw new PublicError(
          PublicErrorCode.INVALID_TRADING_WALLET__ALREADY_EXISTS
        );
      }

      throw error;
    }

    const {binInterval, windowInterval} =
      this.tradingWalletService.getDefaultProfitabilityMetricsArgs();

    await this.updateProfitabilityMetrics(
      context,
      tradingWallet,
      binInterval,
      windowInterval
    );

    return {
      tradingWalletId: tradingWallet.tradingWalletId,
    };
  }

  async batchUpdateProfitabilityMetrics(
    context: TransactionalContext,
    batchSize: number,
    binInterval: Private.BinInterval,
    windowInterval: Private.WindowInterval,
    cursor?: string
  ): Promise<Private.PaginationQuery['cursor']> {
    const {results: tradingWallets, next} =
      await this.tradingWalletRepository.listTradingWallets(context, {
        sortTradingWalletOrderBy: '-created',
        cursor,
        count: batchSize,
      });

    await Promise.all(
      tradingWallets.map(tradingWallet =>
        this.updateProfitabilityMetrics(
          context,
          tradingWallet,
          binInterval,
          windowInterval
        )
      )
    );

    return next;
  }

  async updateProfitabilityMetrics(
    context: TransactionalContext,
    tradingWallet: Private.TradingWallet,
    binInterval: Private.BinInterval,
    windowInterval: Private.WindowInterval
  ): Promise<Private.TradingWallet> {
    const {startDate, endDate} = windowIntervalToDateInterval(windowInterval);

    const {
      assetPair,
      priceAssetId,
      data: metricsData,
    } = await this.marketDataApplication.getWalletMarketMakerMetricsBinnedOrders(
      context,
      [tradingWallet.assetOneId, tradingWallet.assetTwoId],
      startDate,
      endDate,
      binInterval,
      tradingWallet.tradingWalletUser.walletStakeKeyHash
    );

    const metricsPriceAsset: Private.Asset | null =
      this.tradingWalletService.getPriceAsset(assetPair, priceAssetId);

    if (metricsPriceAsset === null) {
      throw new ApplicationError(
        ErrorCode.TRADING_WALLET__PRICE_ASSET_NOT_FOUND
      );
    }

    const lastPresentMetrics =
      this.marketDataService.getLastPresentBinnedOrdersMetrics(metricsData);

    const roiPercent: number | null = lastPresentMetrics?.roiPercent || null;

    // TODO: Should we rename this variable to 'earnedDisplayPriceAssetAmount'?
    const earnedDisplayAmount: number | undefined =
      lastPresentMetrics?.earnedPriceAssetAmount;

    const earnedIndivisibleAmount: bigint | null = earnedDisplayAmount
      ? BigInt(
          Math.floor(
            earnedDisplayAmount *
              Math.pow(10, metricsPriceAsset.decimalPrecision)
          )
        )
      : null;

    const updateData: Private.TradingWalletUpdate = {
      profitabilityWindowInterval: windowInterval,
      profitabilityBinInterval: binInterval,
      profitabilityHistory: metricsData,
      roiPercent,
      earnedPriceAssetAmount: earnedIndivisibleAmount,
    };

    const updatedTradingWallet =
      await this.tradingWalletRepository.updateTradingWallet(
        context,
        tradingWallet.tradingWalletId,
        updateData
      );

    return updatedTradingWallet;
  }
}
