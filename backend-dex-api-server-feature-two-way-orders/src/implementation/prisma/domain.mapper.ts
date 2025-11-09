import {inject, injectable, singleton} from 'tsyringe';

import {
  Dictionary,
  filter,
  first,
  flatMap,
  groupBy,
  last,
  map,
  sumBy,
} from 'lodash';
import * as loFp from 'lodash/fp';

import {optional} from '~/domain/utils/object.util';
import {getRoundStatus} from '~/domain/utils/project.util';
import {calcUnitMultiplier, isAdaAssetId} from '~/domain/utils/asset.util';

import * as Prisma from '@prisma/client';
import {ErrorCode} from '~/domain/errors';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {div, plus, times} from '~/domain/utils/math.util';
import {isNotNull} from '~/implementation/utils/typescript';
import {
  getCardanoStakeKeyUrl,
  getCardanoTransactionUrl,
} from '~/domain/utils/url.util';

import {ConfigService, LoggerService} from '~/domain/services';
import {ApplicationError} from '~/application/application.error';
import {
  EventTypes,
  isDomainEventTransaction,
  OrderSwapEvent,
  OrderSwapEventType,
} from '~/domain/events';
import {
  appendFilledAmountToFills,
  OrderSwapEventWithFilledAmounts,
} from '~/domain/events/orderSwap/OrderSwapFill.utils';
import {isOnChainSuccessEvent} from '~/domain/events/orderSwap/shared/OrderSwapOnChainEvent';
import {excludeInvalidatedEvents} from '~/domain/events/reducer/orderSwap/shared/eventPreProcessor';
import Big from 'big.js';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {getDepositedAssets} from '~/smartVaultFeature/utils';

@singleton()
@injectable()
export class DomainMapper {
  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('LoggerService')
    private readonly loggerService: LoggerService
  ) {}

  toPublicAsset(asset: Private.Asset): Public.Asset {
    const {
      assetId,
      policyId,
      assetName,
      iconUrl,
      decimalPrecision,
      webEnabled,
      shortName,
      longName,
    } = asset;

    return {
      assetId,
      policyId,
      assetName,
      decimalPrecision,

      enabled: webEnabled,

      iconUrl: iconUrl || '',
      longName: longName || '',
      shortName: shortName || '',

      referenceAssetId: '', // DEPRECATED DON'T USE
      referenceAssetAmount: '', // DEPRECATED DON'T USE
    };
  }

  toPublicOrderSwaps(
    orderSwapAssetsMap: Private.AssetsMap,
    orderSwapWithEventStream: Private.ValidOrderSwapWithEventStream
  ): Public.SwapOrder {
    const {orderSwap, streamEvents} = orderSwapWithEventStream;
    const streamEventsAfterEventPreProcessing =
      excludeInvalidatedEvents(streamEvents);

    const {
      orderSwapId: orderId,
      orderType,
      orderStatus,
      orderStatusTransactionHash,
      toAssetId,
      fromAssetId,
      toAssetAmount,
      fromAssetAmount,
      toAssetAmountTotalFilled,
      fromAssetAmountTotalFilled,
      toAssetAmountTotalRemaining,
      fromAssetAmountTotalRemaining,
      depositAmount,
      makerFromAssetFeeAmount,
      makerFromAssetFeePercent,
      makerLovelaceFlatFeeAmount,
      takerFromAssetFeeAmount,
      takerFromAssetFeePercent,
      takerLovelaceFlatFeeAmount,
      transactionFeeAmount,
      cancellationTransactionFeeAmount,
      effectiveFromDate,
      effectiveUntilDate,
      orderDate,
      updated,
    } = orderSwap;

    const adjustedStatus = this.getTimeLimitOrderStatus(
      orderStatus,
      effectiveFromDate,
      effectiveUntilDate
    );

    const orderSwapDate = new Date(orderDate);
    const updatedDate = new Date(updated);

    const toAsset = this.toPublicAsset(orderSwapAssetsMap[toAssetId]);
    const fromAsset = this.toPublicAsset(orderSwapAssetsMap[fromAssetId]);
    const isFromAssetAda = isAdaAssetId(fromAsset.assetId);

    const makerLovelaceFromAssetFeeAmount = isFromAssetAda
      ? makerFromAssetFeeAmount
      : null;

    const takerLovelaceFromAssetFeeAmount = isFromAssetAda
      ? takerFromAssetFeeAmount
      : null;

    const transactionTotalFeesAmount = plus(
      Number(makerLovelaceFlatFeeAmount), // iif producing order
      Number(makerLovelaceFromAssetFeeAmount), // iif producing order and from is Ada
      Number(takerLovelaceFlatFeeAmount), // iif consuming order
      Number(takerLovelaceFromAssetFeeAmount), // iif consuming order and from is Ada
      Number(transactionFeeAmount),
      Number(cancellationTransactionFeeAmount)
    );

    return {
      orderId,
      orderType,

      status: adjustedStatus,
      statusTransactionId: orderStatusTransactionHash || '',

      toAsset,
      fromAsset,
      toAssetId,
      fromAssetId,
      toAssetAmount: toAssetAmount.toString(),
      fromAssetAmount: fromAssetAmount.toString(),
      toAssetAmountFilled: toAssetAmountTotalFilled.toString(),
      fromAssetAmountFilled: fromAssetAmountTotalFilled.toString(),
      toAssetAmountRemaining: toAssetAmountTotalRemaining.toString(),
      fromAssetAmountRemaining: fromAssetAmountTotalRemaining.toString(),

      minFillToAssetAmount: '1',
      minFillFromAssetAmount: '1',

      depositAmount: depositAmount?.toString(),
      makerLovelaceFlatFeeAmount: makerLovelaceFlatFeeAmount?.toString(),
      makerFromAssetFeeAmount: makerFromAssetFeeAmount?.toString(),
      makerFromAssetFeePercent: makerFromAssetFeePercent?.toString(),
      takerFromAssetFeeAmount: takerFromAssetFeeAmount?.toString(),
      takerFromAssetFeePercent: takerFromAssetFeePercent?.toString(),
      transactionFeeAmount: transactionFeeAmount?.toString(),
      transactionTotalFeesAmount: transactionTotalFeesAmount?.toString(),

      effectiveFromDate: effectiveFromDate?.toISOString(),
      effectiveUntilDate: effectiveUntilDate?.toISOString(),

      transactions: this.eventStreamToPublicTransactions({
        orderSwap,
        streamEvents: streamEventsAfterEventPreProcessing,
      }),

      created: orderSwapDate.toISOString(),
      updated: updatedDate.toISOString(),
    };
  }

  private eventStreamToPublicTransactions(
    orderSwapWithEventStream: Private.ValidOrderSwapWithEventStream
  ): Public.SwapOrderTransaction[] {
    const {orderSwap, streamEvents} = orderSwapWithEventStream;
    // TODO handle failure events
    // TODO handle off chain events?

    return loFp.flow(
      loFp.filter(isOnChainSuccessEvent),
      loFp.orderBy(['streamVersion'], ['asc']), // sort before append fill
      appendFilledAmountToFills(orderSwap), // order sensitive
      loFp.map(this.toPublicOrderSwapTransaction)
    )(streamEvents);
  }

  private toPublicOrderSwapTransaction = (
    orderSwapEvent: OrderSwapEventWithFilledAmounts
  ): Public.SwapOrderTransaction => {
    const {filledToAssetAmount, filledFromAssetAmount} = orderSwapEvent;

    const {eventId: orderSwapEventId, created: orderSwapEventCreated} =
      orderSwapEvent;

    const transactionId = orderSwapEventId;
    const transactionDate = orderSwapEventCreated.toISOString();
    const transactionHashSafe = isDomainEventTransaction(orderSwapEvent)
      ? orderSwapEvent.transactionHash
      : '';
    const transactionUrl = getCardanoTransactionUrl(
      this.configService.getCardanoTransactionUrlTemplate(),
      transactionHashSafe
    );

    return {
      transactionId,
      transactionUrl,
      transactionDate,
      transactionHash: transactionHashSafe,
      transactionType: this.orderSwapTransactionTypeMap(orderSwapEvent),
      toAssetAmountFilled: filledToAssetAmount,
      fromAssetAmountFilled: filledFromAssetAmount,
      isTransactionConfirmed: true, // Current only returning on chain events / transactions
    };
  };

  private orderSwapTransactionTypeMap(
    orderSwapEvent: OrderSwapEvent
  ): Public.SwapOrderTransactionType {
    const {FILL, OPEN, CANCEL} = Private.OrderSaleTransactionType;
    const transactionTypeMap: Record<
      OrderSwapEventType,
      Public.SwapOrderTransactionType
    > = {
      // LIMIT OPEN
      [EventTypes.ORDER_SWAP__OPEN_INIT__REQUEST]: OPEN,
      [EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS]: OPEN,
      [EventTypes.ORDER_SWAP__OPEN_INIT__FAILURE]: OPEN,
      [EventTypes.ORDER_SWAP__OPEN_SUBMIT__FAILURE]: OPEN,
      [EventTypes.ORDER_SWAP__OPEN_SUBMIT__SUCCESS]: OPEN,
      [EventTypes.ORDER_SWAP__OPEN_ONCHAIN__FAILURE]: OPEN,
      [EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS]: OPEN,

      // LIMIT PRODUCER FILL
      [EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS]: FILL,
      [EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE]: FILL,
      [EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS]: FILL,
      [EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE]: FILL,

      // LIMIT CONSUMER FILL
      [EventTypes.ORDER_SWAP__FILL_INIT__REQUEST]: FILL,
      [EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS]: FILL,
      [EventTypes.ORDER_SWAP__FILL_INIT__FAILURE]: FILL,
      [EventTypes.ORDER_SWAP__FILL_SUBMIT__SUCCESS]: FILL,
      [EventTypes.ORDER_SWAP__FILL_SUBMIT__FAILURE]: FILL,
      [EventTypes.ORDER_SWAP__FILL_ONCHAIN__SUCCESS]: FILL,
      [EventTypes.ORDER_SWAP__FILL_ONCHAIN__FAILURE]: FILL,

      // LIMIT CANCEL
      [EventTypes.ORDER_SWAP__CANCEL_INIT__REQUEST]: CANCEL,
      [EventTypes.ORDER_SWAP__CANCEL_INIT__SUCCESS]: CANCEL,
      [EventTypes.ORDER_SWAP__CANCEL_INIT__FAILURE]: CANCEL,
      [EventTypes.ORDER_SWAP__CANCEL_SUBMIT__SUCCESS]: CANCEL,
      [EventTypes.ORDER_SWAP__CANCEL_SUBMIT__FAILURE]: CANCEL,
      [EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS]: CANCEL,
      [EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__FAILURE]: CANCEL,
    };

    return transactionTypeMap[orderSwapEvent.eventType];
  }

  toPublicSmartVaultAssetDetailed = ({
    assetId,
    assetAmount,
    asset,
  }: {
    assetId: string;
    asset: Private.Asset | null;
    assetAmount: bigint;
  }): Public.SmartVaultAssetDetailed => ({
    assetId,
    assetAmount: assetAmount.toString(),
    ...(asset ? {asset: this.toPublicAsset(asset)} : {}),
  });

  toPublicSmartVault(
    smartVault: Private.SmartVault,
    smartVaultAssetToAsset: (
      asset: Private.SmartVaultAsset
    ) => Private.Asset | null,
    smartVaultOperations: Private.SmartVaultOperation[],
    smartVaultStrategy: Private.SmartVaultStrategy | null
  ): Public.SmartVault {
    const isNotNull = <T>(value: T | null): value is T => value !== null;

    const smartVaultAssets: Private.Asset[] = smartVault.smartVaultAsset
      .map(smartVaultAssetToAsset)
      .filter(isNotNull);

    const depositedAssets = getDepositedAssets(
      smartVaultAssets,
      smartVaultOperations
    ).map(this.toPublicSmartVaultAssetDetailed);

    return {
      smartVaultId: smartVault.smartVaultId,
      // TODO: We need to update schema to make stakeKeyHashRef required
      stakeKeyHashRef: smartVault.stakeKeyHashRef || '',
      created: smartVault.created.toISOString(),
      status: smartVault.status,
      smartVaultStrategy: smartVaultStrategy
        ? this.toPublicSmartVaultStrategy(smartVaultStrategy)
        : null,
      depositedAssets,
      // TODO: Temporary until we have a better way of estimating this
      withdrawableAssets: depositedAssets,
    };
  }

  toPublicSmartVaultOperations(
    smartVaultOperations: Private.SmartVaultOperation[],
    assetIdToAssetMapper: (assetId: string) => Private.Asset | null
  ): Public.SmartVaultOperation[] {
    const groupedOperations: Dictionary<Private.SmartVaultOperation[]> =
      groupBy(smartVaultOperations, 'transactionHash');

    const publicOperations = map(groupedOperations, operations => {
      const firstOperation = first(operations);

      if (!firstOperation) {
        this.loggerService.warning(
          `Expected to find at least one operation in the group, got: ${operations}`
        );
        return null;
      } else {
        const assets: Public.SmartVaultAssetDetailed[] = operations
          .map(operation => ({
            assetId: operation.assetId,
            asset: assetIdToAssetMapper(operation.assetId),
            assetAmount: operation.assetAmount,
          }))
          .map(({assetId, asset, assetAmount}) => ({
            assetId,
            assetAmount: assetAmount.toString(),
            ...(asset ? {asset: this.toPublicAsset(asset)} : {}),
          }));

        return {
          smartVaultId: firstOperation.smartVaultId,
          smartVaultOperationId: firstOperation.smartVaultOperationId,
          operationType: firstOperation.operationType,
          status: firstOperation.status,
          creatorStakeKeyHash: firstOperation.creatorStakeKeyHash,
          transactionHash: firstOperation.transactionHash,
          transactionDate: firstOperation.transactionDate?.toISOString(),
          assets,
        };
      }
    });

    const filtered = filter(
      publicOperations,
      <T>(operation: T | null): operation is T => operation !== null
    );

    return filtered;
  }

  toPublicTradingWallet(
    tradingWallet: Private.TradingWallet,
    additionalData: {
      startDate: Date | null;
      tradesCount: number;
    }
  ): Public.TradingWallet {
    const assetOne = this.toPublicAsset(tradingWallet.assetOne);
    const assetTwo = this.toPublicAsset(tradingWallet.assetTwo);

    const stakeKeyUrl: string | null = getCardanoStakeKeyUrl(
      this.configService.getCardanoStakeKeyUrlTemplate(),
      tradingWallet.tradingWalletUser.walletStakeKeyHash,
      this.configService.getCardanoNetwork()
    );

    if (stakeKeyUrl === null) {
      this.loggerService.warning(
        `Could not generate stake key url for trading wallet with user walletStakeKeyHash: ${tradingWallet.tradingWalletUser.walletStakeKeyHash}`
      );
    }

    const profitabilityHistory = this.toPublicTradingWalletRoiHistory(
      tradingWallet.profitabilityHistory
    );

    const roiPercent = tradingWallet.roiPercent;
    const earnedAdaAssetAmount = tradingWallet.earnedPriceAssetAmount
      ? new Big(tradingWallet.earnedPriceAssetAmount.toString())
          /**
           * TODO: We currently just assume price asset is ADA, that is not ideal.
           * We need to store a `priceAssetId` on the TradingWallet to be able to determine
           * what the decimal precision should be as well as signaling to the user what asset this is.
           */
          .div(Math.pow(10, adaAsset.decimalPrecision))
          .toString()
      : null;

    const profitabilityWindowInterval:
      | Public.TradingWallet['profitabilityWindowInterval'] =
      tradingWallet.profitabilityWindowInterval
        ? this.toPublicProfitabilityWindowInterval(
            tradingWallet.profitabilityWindowInterval
          )
        : null;

    return {
      ...tradingWallet,
      tradingWalletStakeKeyHash:
        tradingWallet.tradingWalletUser.walletStakeKeyHash,
      ...additionalData,
      assetOne,
      assetTwo,
      roiPercent,
      winRatePercent: null,
      startDate: additionalData.startDate?.toISOString(),
      earnedAdaAssetAmount,
      tradesCount: additionalData.tradesCount.toString(),
      profitabilityWindowInterval,
      profitabilityHistory,
      stakeKeyUrl,
    };
  }

  private toPublicProfitabilityWindowInterval(
    profitabilityWindowInterval: string
  ): Public.TradingWallet['profitabilityWindowInterval'] {
    if (Private.isWindowInterval(profitabilityWindowInterval)) {
      return profitabilityWindowInterval;
    } else {
      this.loggerService.warning(
        `Expected TradingWallet entity to have a profitabilityWindowInterval which overlaps the ` +
          `corresponding public type, got profitabilityWindowInterval: ${profitabilityWindowInterval}`
      );

      return null;
    }
  }

  private isMarketMarkerMetrics(
    profitabilityHistorySample: Prisma.Prisma.JsonValue
  ): profitabilityHistorySample is Private.MarketMakerBinnedOrdersMetrics {
    return (
      typeof profitabilityHistorySample === 'object' &&
      profitabilityHistorySample !== null &&
      'timestamp' in profitabilityHistorySample &&
      'earnedPriceAssetAmount' in profitabilityHistorySample &&
      'roiPercent' in profitabilityHistorySample
    );
  }

  private toMarketMakerBinnedOrdersMetrics(
    profitabilityHistory: Prisma.Prisma.JsonValue
  ): Private.MarketMakerBinnedOrdersMetrics[] {
    return Array.isArray(profitabilityHistory)
      ? profitabilityHistory.filter(this.isMarketMarkerMetrics)
      : [];
  }

  private toPublicTradingWalletRoiHistory(
    profitabilityHistory: Private.TradingWallet['profitabilityHistory']
  ): Public.TradingWallet['profitabilityHistory'] {
    return this.toMarketMakerBinnedOrdersMetrics(profitabilityHistory).map(
      metrics => ({
        timestamp: metrics.timestamp,
        roiPercent: metrics.roiPercent,
      })
    );
  }

  toPublicPortfolioOrderSaleProjects(
    portfolioProjects: Private.OrderSalePortfolioProject[],
    adaAsset: Private.Asset
  ): Public.OrderSalePortfolioProject[] {
    return portfolioProjects.map(project => {
      const publicProject = this.toPublicOrderSaleProject(adaAsset, project);

      const publicOrders = flatMap(project.round, round =>
        this.toPublicOrdersSale(adaAsset, round.orderSale, project, round)
      );

      return {...publicProject, orders: publicOrders};
    });
  }

  toPublicOrderSaleProject(
    adaAsset: Private.Asset,
    orderSaleProject: Private.OrderSaleProject
  ): Public.OrderSaleProject {
    const {
      vestingPeriod,
      distributionDate,
      distributionMethod,
      baseAssetAllocationAmount,
      baseAssetTotalTokenSupplyAmount,
      orderSaleProjectId,

      fundingMethod,
      lockupPeriod,

      project: {
        asset,

        name,
        imageLogoUrl,
        description,
        shortDescription,

        websiteUrl,
        mediaEmail,
        pitchDeckUrl,
        whitePaperUrl,
        mediaMediumUrl,
        discordUrl,
        twitterUrl,
        telegramUrl,
        mediaYoutubeUrl,
        projectReportUrl,
        privacyPolicyUrl,
        tokenUtility,
        roadmapItem,
        keyFeature,
        technology,
        tokenomics,
        teamMember,
      },
    } = orderSaleProject;

    if (!asset.iconUrl || !asset.shortName || !asset.longName)
      throw new ApplicationError(ErrorCode.ASSET__INVALID_ARGUMENT);

    const baseAsset = {
      ...asset,
      iconUrl: asset.iconUrl,
      longName: asset.longName,
      shortName: asset.shortName,
    };

    const baseAssetAmount = calcUnitMultiplier(
      asset.decimalPrecision
    ).toString();

    const quoteAsset = this.toPublicAsset(adaAsset);

    const rounds = orderSaleProject.round.map(
      (round: Private.OrderSaleProjectRound): Public.OrderSaleProjectRound =>
        this.toPublicOrderSaleProjectRound(orderSaleProject, round, adaAsset)
    );

    const distributionIsCompleted = new Date() > new Date(distributionDate);

    const roundsQuoteAssetRoundsRaisedAmount = rounds.reduce(
      (total: number | string, round) =>
        plus(total, round.quoteAssetRaisedAmount),
      0
    );

    const roundsBaseAssetAllocationAmount = rounds.reduce(
      (total: number | string, round) =>
        plus(total, round.baseAssetAllocationAmount),
      0
    );

    const lastRound = rounds[rounds.length - 1];

    const activeRound = rounds.find(
      ({status}) => Private.OrderSaleProjectRoundStatus.ACTIVE === status
    );

    const upcomingRound = rounds.find(
      ({status}) => Private.OrderSaleProjectRoundStatus.UPCOMING === status
    );

    const statusRound = activeRound || upcomingRound || lastRound;

    const {status, quoteAssetAmount, roundId: statusRoundId} = statusRound;

    return {
      orderSaleProjectId,

      name,
      shortDescription,
      longDescription: description,

      status,
      statusRoundId,

      baseAsset,
      baseAssetAmount,

      quoteAsset,
      quoteAssetAmount,

      imageLogoUrl,

      vestingPeriod,
      distributionMethod,
      distributionIsCompleted,
      distributionDate: distributionDate.toISOString(),

      baseAssetAllocationAmount: baseAssetAllocationAmount.toString(),
      baseAssetTotalTokenSupplyAmount:
        baseAssetTotalTokenSupplyAmount?.toString() || '',
      roundsBaseAssetAllocationAmount:
        roundsBaseAssetAllocationAmount.toString(),
      roundsQuoteAssetRoundsRaisedAmount:
        roundsQuoteAssetRoundsRaisedAmount.toString(),

      ...optional({
        fundingMethod,
        lockupPeriod,

        websiteUrl,
        pitchDeckUrl,
        whitePaperUrl,

        mediaEmail,
        mediaMediumUrl,
        mediaDiscordUrl: discordUrl,
        mediaTwitterUrl: twitterUrl,
        mediaTelegramUrl: telegramUrl,
        mediaYoutubeUrl,
        projectReportUrl,
        privacyPolicyUrl,

        tokenUtility,

        roadmapItems: roadmapItem,
        keyFeatures: keyFeature,
        technologies: technology,
        tokenomics,
        teamMembers: teamMember,
      }),

      rounds,

      isBuyForbidden: false,
      isBuyForbiddenReason: undefined,
    };
  }

  toPublicOrderSaleProjectRound(
    orderSaleProject: Private.OrderSaleProject,
    projectRound: Private.OrderSaleProjectRound,
    adaAsset: Private.Asset
  ): Public.OrderSaleProjectRound {
    const {
      orderSaleProjectId,
      project: {asset: baseAsset},
    } = orderSaleProject;

    const {number} = projectRound;

    const shortName = `Round ${number}`;

    const status = getRoundStatus(projectRound);

    const baseAssetAmount = calcUnitMultiplier(
      baseAsset.decimalPrecision
    ).toString();

    const quoteAsset = adaAsset;

    const {
      endDate,
      startDate,
      priceLovelace,
      eligibilityDescription,
      quoteAssetRaisedAmount,
      baseAssetSubmittedAmount,
      baseAssetAllocationAmount,
      orderBaseAssetMinAllocation,
      orderBaseAssetMaxAllocation,
    } = projectRound;

    return {
      ...projectRound,

      orderSaleProjectId,

      status,
      shortName,

      baseAssetId: baseAsset.assetId,
      baseAssetAmount,

      quoteAssetId: quoteAsset.assetId,
      quoteAssetAmount: priceLovelace?.toString() || '',

      endDate: endDate.toISOString(),
      startDate: startDate.toISOString(),

      eligibilityDescription,
      quoteAssetRaisedAmount: quoteAssetRaisedAmount.toString(),
      baseAssetSubmittedAmount: baseAssetSubmittedAmount.toString(),
      baseAssetAllocationAmount: baseAssetAllocationAmount.toString(),
      orderBaseAssetMaxAllocation: orderBaseAssetMaxAllocation.toString(),
      orderBaseAssetMinAllocation: orderBaseAssetMinAllocation.toString(),
    };
  }

  toPublicOrdersSale(
    adaAsset: Private.Asset,
    ordersSale: Private.OrderSale[],
    orderSaleProject: Private.OrderSaleProject,
    orderSaleProjectRound: Private.OrderSaleProjectRound
  ): Public.SaleOrder[] {
    return ordersSale.map(saleOrder =>
      this.toPublicOrderSale(
        adaAsset,
        saleOrder,
        orderSaleProject,
        orderSaleProjectRound
      )
    );
  }

  toPublicOrderSale(
    adaAsset: Private.Asset,
    orderSale: Private.OrderSale,
    orderSaleProject: Private.OrderSaleProject,
    orderSaleProjectRound: Private.OrderSaleProjectRound
  ): Public.SaleOrder {
    const {created, roundId} = orderSale;

    const {project} = orderSaleProject;

    const {assetId: baseAssetId} = project;

    const {assetId: quoteAssetId} = adaAsset;

    const {orderSaleId: orderId} = orderSale;

    const {baseAssetAmount, quoteAssetAmount} =
      this.getOrderSaleBaseQuoteAssetAmount(
        adaAsset,
        orderSale,
        orderSaleProjectRound
      );

    const transactions = this.getOrderSaleTransactions(orderSale);

    const statusTransaction = this.getOrderStatusTransaction(transactions);

    const {orderStatus: status, baseAssetAmountFilled} =
      this.getOrderSaleStatusByStatusTransactionAndEvents(
        orderSale.orderSaleEvent,
        statusTransaction
      );

    const statusTransactionId = statusTransaction.transactionId;

    const isStatusPending = !statusTransaction.isTransactionConfirmed;

    return {
      orderId,

      roundId,

      created: created.toISOString(),
      updated: created.toISOString(),

      status,
      isStatusPending,
      statusTransactionId,

      baseAssetId,
      baseAssetAmount: baseAssetAmount.toString(),
      baseAssetAmountFilled: baseAssetAmountFilled.toString(),

      quoteAssetId,
      quoteAssetAmount: quoteAssetAmount.toString(),

      transactions,
    };
  }

  public toPublicUnsignedOrderSale(
    saleOrderEvent: Prisma.OrderSaleEvent,
    unsignedOrderSale: Public.UnsignedSaleOrder
  ): Public.UnsignedSaleOrder {
    const {eventId, orderSaleId} = saleOrderEvent;

    return {
      ...unsignedOrderSale,
      orderId: orderSaleId,
      transactionId: eventId,
    };
  }

  toPublicStakingNft(
    stakingNft: Private.StakingNft,
    mintingData: Pick<Private.StakingNftMintingData, 'policyId' | 'assetName'>,
    vestingBoost: string | null
  ): Public.StakingNft {
    return {
      type: stakingNft.type,
      subType: stakingNft.subType,
      policyId: mintingData.policyId,
      assetName: mintingData.assetName,
      stackableWith: stakingNft.stackableWith,
      imageUrl: stakingNft.imageUrl || '',
      name: stakingNft.name,
      ...(stakingNft.apyBoost ? {apyBoost: String(stakingNft.apyBoost)} : {}),
      ...optional({vestingBoost}),
    };
  }

  toPublicStakeVaultRewardState(
    stakeVaultRewardState: Private.StakeVaultRewardState
  ): Public.StakeVaultRewardState {
    const {lockDuration, revenueAmplifier, nftsApy, totalStakeVaultApy} =
      stakeVaultRewardState;

    return {
      lockDuration: lockDuration,
      ...(totalStakeVaultApy !== null
        ? {totalApy: String(totalStakeVaultApy)}
        : {}),
      ...(nftsApy !== null ? {nftsApy: String(nftsApy)} : {}),
      ...(revenueAmplifier !== null && revenueAmplifier > 0
        ? {
            revenueAmplifier: String(revenueAmplifier),
          }
        : {}),
    };
  }

  protected toPublicSaleOrderTransaction(
    event: Prisma.OrderSaleEvent,
    eventTransaction: Prisma.Transaction
  ): Public.SaleOrderTransaction {
    const {eventType} = event;

    const {transactionHash, transactionDate} = eventTransaction;

    const transactionUrl = getCardanoTransactionUrl(
      this.configService.getCardanoTransactionUrlTemplate(),
      transactionHash
    );

    const isTransactionConfirmed = !!eventTransaction.blockHash;

    return {
      transactionUrl,
      transactionHash,
      isTransactionConfirmed,
      transactionId: transactionHash,
      transactionType: eventType,
      transactionDate: transactionDate.toISOString(),
    };
  }

  toPublicLiquidityPool(
    liquidityPool: Private.LiquidityPool
  ): Public.LiquidityPool {
    const {liquidityPoolId, asset: liquidityPoolAssets} = liquidityPool;

    const assets = map(liquidityPoolAssets, ({asset}) =>
      this.toPublicAsset(asset)
    );

    return {
      liquidityPoolId,
      assets,
    };
  }

  toPublicTradingPair(tradingPair: Private.TradingPair): Public.TradingPair {
    const {tradingPairId, baseAsset, quoteAsset} = tradingPair;

    const baseAssetPublic = this.toPublicAsset(baseAsset);
    const quoteAssetPublic = this.toPublicAsset(quoteAsset);

    return {
      tradingPairId,
      baseAsset: baseAssetPublic,
      quoteAsset: quoteAssetPublic,
    };
  }

  toPublicMarketAggPrice(
    privateMarketData: Private.MarketAggPriceHistory
  ): Public.MarketAggPrice {
    const {assetPair, data} = privateMarketData;
    const {baseAsset, quoteAsset} = assetPair;

    return {
      assetPair: {
        baseAsset: this.toPublicAsset(baseAsset),
        quoteAsset: this.toPublicAsset(quoteAsset),
      },
      data,
    };
  }

  toPublicMarketMakerMetricsBinnedOrders(
    privateMarketData: Private.MarketMakerMetricsBinnedOrders
  ): Public.MarketMakerMetricsBinnedOrders {
    const {assetPair, priceAssetId, data} = privateMarketData;
    const {assetOne, assetTwo} = assetPair;

    return {
      assetPair: {
        assetOne: this.toPublicAsset(assetOne),
        assetTwo: this.toPublicAsset(assetTwo),
      },
      walletStakeKeyHash: privateMarketData.walletStakeKeyHash,
      priceAssetId,
      data: data.map(
        ({
          timestamp,
          earnedPriceAssetAmount,
          roiPercent,
          externalMarketPrice,
          accumulativeAssetOneAmountBought,
          accumulativeAssetTwoAmountBought,
          accumulativeAssetOneAmountNetPosition,
          accumulativeAssetTwoAmountNetPosition,
          accumulativeAssetOneBoughtCount,
          accumulativeAssetTwoBoughtCount,
          accumulativeTotalOpenTransactionFeeAmount,
          accumulativeTotalCancelTransactionFeeAmount,
          accumulativeTotalBuyMakerFromAssetFeeAmount,
          accumulativeTotalSellMakerFromAssetFeeAmount,
          accumulativeTotalMakerAdaFlatFeeAmount,
        }) => ({
          timestamp,
          earnedPriceAssetAmount: earnedPriceAssetAmount?.toString(),
          roiPercent: roiPercent,
          price: externalMarketPrice,
          assetOneAmountBought: accumulativeAssetOneAmountBought?.toString(),
          assetTwoAmountBought: accumulativeAssetTwoAmountBought?.toString(),
          assetOneAmountNetPosition:
            accumulativeAssetOneAmountNetPosition?.toString(),
          assetTwoAmountNetPosition:
            accumulativeAssetTwoAmountNetPosition?.toString(),
          assetOneBoughtCount: accumulativeAssetOneBoughtCount?.toString(),
          assetTwoBoughtCount: accumulativeAssetTwoBoughtCount?.toString(),
          openTransactionFeeAmount:
            accumulativeTotalOpenTransactionFeeAmount?.toString(),
          cancelTransactionFeeAmount:
            accumulativeTotalCancelTransactionFeeAmount?.toString(),
          buyMakerFromAssetFeeAmount:
            accumulativeTotalBuyMakerFromAssetFeeAmount?.toString(),
          sellMakerFromAssetFeeAmount:
            accumulativeTotalSellMakerFromAssetFeeAmount?.toString(),
          makerAdaFlatFeeAmount:
            accumulativeTotalMakerAdaFlatFeeAmount?.toString(),
        })
      ),
    };
  }

  toPublicSmartVaultStrategy(
    smartVaultStrategy: Prisma.SmartVaultStrategy
  ): Public.SmartVaultStrategy {
    return {
      created: smartVaultStrategy.created.toISOString(),
      smartVaultStrategyId: smartVaultStrategy.smartVaultStrategyId,
      name: smartVaultStrategy.name,
      description: smartVaultStrategy.description,
      configJsonSchema: smartVaultStrategy.configJsonSchema,
      numberOfAssetsSupported: smartVaultStrategy.numberOfAssetsSupported,
    };
  }

  private getOrderSaleBaseQuoteAssetAmount(
    adaAsset: Prisma.Asset,
    orderSale: Private.OrderSale,
    orderSaleProjectRound: Private.OrderSaleProjectRound
  ): {baseAssetAmount: bigint; quoteAssetAmount: number} {
    const {orderSaleEvent} = orderSale;

    const orderSaleEventOpen = orderSaleEvent.find(
      ({eventType}) => Private.OrderSaleTransactionType.OPEN === eventType
    );

    if (!orderSaleEventOpen) {
      throw new ApplicationError(ErrorCode.ORDER__TRANSACTION_OPEN_NOT_FOUND);
    }

    const {baseAssetAmount} = orderSaleEventOpen;

    const priceLovelaceOrZero = Number(
      orderSaleProjectRound.priceLovelace || 0
    );

    const quoteAssetAmount = div(
      times(priceLovelaceOrZero, baseAssetAmount.toString()),
      calcUnitMultiplier(adaAsset.decimalPrecision)
    );

    return {baseAssetAmount, quoteAssetAmount};
  }

  private getOrderSaleStatusByStatusTransactionAndEvents(
    orderSaleEvents: Prisma.OrderSaleEvent[],
    orderSaleStatusTransaction: Public.SaleOrderTransaction
  ): {
    orderStatus: Public.SaleOrderStatus;
    baseAssetAmountFilled: number;
  } {
    const {transactionType} = orderSaleStatusTransaction;

    if (Private.OrderSaleTransactionType.FILL === transactionType) {
      const baseAssetAmountOpen = this.getOrderSaleEventBaseAmount(
        orderSaleEvents,
        Prisma.OrderSaleEventType.OPEN
      );
      const baseAssetAmountFilled = this.getOrderSaleEventBaseAmount(
        orderSaleEvents,
        Prisma.OrderSaleEventType.FILL
      );

      const isPartialFill = baseAssetAmountFilled < baseAssetAmountOpen; // TODO @luca duplicated in swap mapper, in both case fullfill state might derived by the difference between filled / order amounts

      const orderStatus = isPartialFill
        ? Private.OrderSaleStatus.PARTIAL_FILL
        : Private.OrderSaleStatus.FILL;

      return {orderStatus, baseAssetAmountFilled};
    } else {
      return {
        orderStatus: transactionType,
        baseAssetAmountFilled: 0,
      };
    }
  }

  private getOrderSaleEventBaseAmount(
    orderSaleEvents: Prisma.OrderSaleEvent[],
    orderSaleEventType: Prisma.OrderSaleEventType
  ): number {
    const orderSaleEventsOfType = orderSaleEvents.filter(
      orderSaleEvent => orderSaleEventType === orderSaleEvent.eventType
    );

    const orderBaseAssetAmountOfType = sumBy(
      orderSaleEventsOfType,
      orderSaleEventOpen => Number(orderSaleEventOpen.baseAssetAmount)
    );

    return orderBaseAssetAmountOfType;
  }

  private getOrderSaleTransactions(
    saleOrder: Private.OrderSale
  ): Public.SaleOrderTransaction[] {
    const saleOrderEvents = filter(
      saleOrder.orderSaleEvent,
      isNotNull('transaction')
    );

    return map(saleOrderEvents, saleOrderEvent =>
      this.toPublicSaleOrderTransaction(
        saleOrderEvent,
        saleOrderEvent.transaction
      )
    );
  }

  private getOrderStatusTransaction(
    transactions: Public.SaleOrderTransaction[]
  ): Public.SaleOrderTransaction {
    const lastTransaction = last(transactions);
    if (lastTransaction) {
      return lastTransaction;
    } else {
      throw new ApplicationError(ErrorCode.ORDER__TRANSACTION_NOT_FOUND);
    }
  }

  private getTimeLimitOrderStatus = (
    currentStatus: Private.OrderSwapStatusTypes,
    effectiveFromDate?: Private.OrderSwap['effectiveFromDate'],
    effectiveUntilDate?: Private.OrderSwap['effectiveUntilDate']
  ): Public.SwapOrderStatus => {
    return currentStatus === Private.OrderStatus.OPEN
      ? this.getTimeLimitOrderStatusOpen(
          currentStatus,
          effectiveFromDate,
          effectiveUntilDate
        )
      : currentStatus;
  };

  private getTimeLimitOrderStatusOpen = (
    currentStatus: Private.OrderSwapStatusTypes,
    effectiveFromDate?: Private.OrderSwap['effectiveFromDate'],
    effectiveUntilDate?: Private.OrderSwap['effectiveUntilDate']
  ): Public.SwapOrderStatus => {
    const currentDate = new Date();
    if (effectiveUntilDate && currentDate > new Date(effectiveUntilDate)) {
      return 'EXPIRED';
    } else if (effectiveFromDate && currentDate < new Date(effectiveFromDate)) {
      return 'SCHEDULED';
    } else {
      return currentStatus;
    }
  };
}
