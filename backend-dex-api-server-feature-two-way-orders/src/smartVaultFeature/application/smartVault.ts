import 'reflect-metadata';
import {inject, injectable, singleton} from 'tsyringe';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import * as Core from '~/domain/models/core';
import * as Oura from '~/domain/models/oura';
import {TransactionalContext} from '~/domain/context';
import {SmartVaultRepository} from '../repository/smartVault';
import {DomainMapper} from '~/implementation/prisma/domain.mapper';
import {EventStream} from '~/domain/events';
import {SmartVaultEvent, SmartVaultEventTypes} from '../event/types';
import {
  AssetRepository,
  eventFilterOption,
  EventStreamRepository,
} from '~/domain/repositories';
import {
  CoreService,
  LoggerService,
  OrderSwapScriptService,
} from '~/domain/services';
import {SmartVaultEventMutation} from '../event/mutation';
import {randomUUID} from 'crypto';
import {first, isError, last, pick} from 'lodash';
import {epochInSecondsToDate} from '~/domain/utils/date.util';
import {ErrorCode} from '~/domain/errors';
import {SmartVaultReducer} from '../event/smartVault/reducer';
import {ApplicationError} from '~/application/application.error';
import {getDepositedAssets} from '../utils';
import {SmartVaultOpenInitRequestEvent} from '../event/types/OpenEvent';
import {SmartVaultStrategyRepository} from '../repository/smartVaultStrategy';
import {SmartVaultAggregate} from '../event/smartVault/types';

@singleton()
@injectable()
export class SmartVaultApplication {
  constructor(
    @inject('LoggerService')
    private readonly loggerService: LoggerService,

    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository,

    @inject('CoreService')
    private readonly coreService: CoreService,

    @inject('SmartVaultRepository')
    private readonly smartVaultRepository: SmartVaultRepository,

    @inject('SmartVaultEventMutation')
    private readonly smartVaultEventMutation: SmartVaultEventMutation,

    @inject('SmartVaultReducer')
    private readonly smartVaultReducer: SmartVaultReducer,

    @inject('SmartVaultStrategyRepository')
    private readonly smartVaultStrategyRepository: SmartVaultStrategyRepository,

    @inject('OrderSwapScriptService')
    private readonly orderSwapScriptService: OrderSwapScriptService,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper,

    @inject('EventStreamRepository')
    private readonly eventStreamRepository: EventStreamRepository<SmartVaultEvent>
  ) {}

  async listSmartVaultsByStakeKeyHash(
    context: TransactionalContext,
    query: Private.SmartVaultListQuery
  ): Promise<Private.PaginatedResults<Public.SmartVault>> {
    const privateSmartVaults: Private.SmartVault[] =
      await this.smartVaultRepository.listSmartVaults(context, query);

    const smartVaults = await Promise.all(
      privateSmartVaults.map(async smartVault => {
        const smartVaultOperations =
          await this.smartVaultRepository.listSmartVaultOperations(
            context,
            smartVault.smartVaultId
          );

        const smartVaultStrategy = smartVault.smartVaultStrategyId
          ? await this.smartVaultStrategyRepository.getSmartVaultStrategyById(
              context,
              smartVault.smartVaultStrategyId
            )
          : null;

        const smartVaultAssetToAssetMapper =
          await this.getSmartVaultAssetToAssetMapper(context, smartVault);

        return this.domainMapper.toPublicSmartVault(
          smartVault,
          smartVaultAssetToAssetMapper,
          smartVaultOperations,
          smartVaultStrategy
        );
      })
    );

    return {
      count: smartVaults.length,
      results: smartVaults,
    };
  }

  async getSmartVaultById(
    context: TransactionalContext,
    smartVaultId: string
  ): Promise<Public.SmartVaultResult> {
    const smartVault = await this.smartVaultRepository.getSmartVaultByIdOrThrow(
      context,
      smartVaultId
    );

    const smartVaultStrategy = smartVault.smartVaultStrategyId
      ? await this.smartVaultStrategyRepository.getSmartVaultStrategyById(
          context,
          smartVault.smartVaultStrategyId
        )
      : null;

    const smartVaultAssetToAssetMapper =
      await this.getSmartVaultAssetToAssetMapper(context, smartVault);

    const smartVaultOperations =
      await this.smartVaultRepository.listSmartVaultOperations(
        context,
        smartVaultId
      );

    return this.domainMapper.toPublicSmartVault(
      smartVault,
      smartVaultAssetToAssetMapper,
      smartVaultOperations,
      smartVaultStrategy
    );
  }

  private async getAssetIdToAssetMapper(
    context: TransactionalContext,
    assetIds: string[]
  ): Promise<(assetId: string) => Private.Asset | null> {
    const smartVaultAssetToAssetMap: Record<string, Private.Asset | null> =
      await assetIds.reduce(
        async (assetMapP, assetId: string) => ({
          ...(await assetMapP),
          [assetId]: await this.assetRepository.getAssetOrNullByAssetId(
            context,
            assetId
          ),
        }),
        Promise.resolve({})
      );

    return (assetId: string) => smartVaultAssetToAssetMap[assetId];
  }

  async listSmartVaultOperations(
    context: TransactionalContext,
    smartVaultId: string,
    query: Private.SmartVaultOperationListQuery
  ): Promise<Private.PaginatedResults<Public.SmartVaultOperation>> {
    const smartVaultOperations =
      await this.smartVaultRepository.listSmartVaultOperations(
        context,
        smartVaultId,
        query
      );

    const assetIdToAssetMapper: (assetId: string) => Private.Asset | null =
      await this.getAssetIdToAssetMapper(
        context,
        smartVaultOperations.map(({assetId}) => assetId)
      );

    return {
      count: smartVaultOperations.length,
      results: this.domainMapper.toPublicSmartVaultOperations(
        smartVaultOperations,
        assetIdToAssetMapper
      ),
    };
  }

  private async getSmartVaultAssetToAssetMapper(
    context: TransactionalContext,
    smartVault: Private.SmartVault
  ): Promise<(asset: Private.SmartVaultAsset) => Private.Asset | null> {
    const smartVaultAssetToAssetMap: Record<string, Private.Asset | null> =
      await smartVault.smartVaultAsset.reduce(
        async (assetMapP, {assetId}: Private.SmartVaultAsset) => ({
          ...(await assetMapP),
          [assetId]: await this.assetRepository.getAssetOrNullByAssetId(
            context,
            assetId
          ),
        }),
        Promise.resolve({})
      );

    return ({assetId}: Private.SmartVaultAsset) =>
      smartVaultAssetToAssetMap[assetId];
  }

  private async createSmartVaultOpenRequest(
    context: TransactionalContext,
    user: Private.User,
    data: Public.SmartVaultOpenData
  ): Promise<EventStream<SmartVaultEvent>> {
    const eventStream = this.eventStreamRepository.newEventStream();

    const mutatedEventStream = this.smartVaultEventMutation.makeAndPersistEvent(
      eventStream,
      SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__REQUEST
    )({
      streamId: eventStream.streamId,
      eventId: randomUUID(),
      eventPayload: {
        smartVaultId: eventStream.streamId,
        creatorStakeKeyHash: user.walletStakeKeyHash,
        depositAssets: data.depositAssets,
        smartVaultStrategyId: data.smartVaultStrategyId,
        smartVaultStrategyConfigJson: data.smartVaultStrategyConfigJson,
      },
    });

    const savedEventStream = await this.eventStreamRepository.saveEventStream(
      context,
      mutatedEventStream
    );

    return savedEventStream;
  }

  private async performSmartVaultOpen(
    context: TransactionalContext,
    user: Private.User,
    wallet: Public.WalletAccount,
    data: Public.SmartVaultOpenData,
    eventStream: EventStream<SmartVaultEvent>
  ): Promise<Public.UnsignedTransaction> {
    const orderVersion =
      this.orderSwapScriptService.getCurrentCoreOrderScriptVersion();

    const lastAsset = last(data.depositAssets);

    if (!lastAsset) {
      throw new Error('No deposit assets provided');
    }

    const toAsset = await this.assetRepository.getAdaAsset(context);
    const fromAsset = await this.assetRepository.getAssetByAssetId(
      context,
      lastAsset.assetId
    );

    // TODO: Temporarily opening order swap instead of smart vault
    const orderSwapOpenRequest: Core.OrderSwapOpenRequest = {
      ...wallet,

      toAssetId: toAsset.assetId,
      toAssetName: toAsset.assetName,
      toAssetPolicyId: toAsset.policyId,
      toAssetAmount: '1000000',

      fromAssetId: fromAsset.assetId,
      fromAssetName: fromAsset.assetName,
      fromAssetPolicyId: fromAsset.policyId,
      fromAssetAmount: lastAsset.assetAmount,

      orderVersion,
    };

    const coreOrderSwapOpenResponse = await this.coreService.orderSwapOpen(
      orderSwapOpenRequest
    );

    const mintAssetId = first(
      coreOrderSwapOpenResponse.transactionMint
    )?.mintAssetId;

    if (!mintAssetId) {
      // TODO: Proper error
      // We don't handle this case in order swap but I think that's a mistake
      // we should not repeat.
      throw new Error('No mint asset ID provided');
    }

    const smartVaultId = eventStream.streamId;

    const createInitSuccessEventId = randomUUID();

    const withInitCreateSuccess: EventStream<SmartVaultEvent> =
      this.smartVaultEventMutation.makeAndPersistEvent(
        eventStream,
        SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__SUCCESS
      )({
        streamId: smartVaultId,
        eventId: createInitSuccessEventId,
        eventPayload: {
          smartVaultId,
          depositAssets: data.depositAssets,
          creatorStakeKeyHash: user.walletStakeKeyHash,
          mintAssetId,
        },
        transactionHash: coreOrderSwapOpenResponse.transactionHash,
      });

    await this.eventStreamRepository.saveEventStream(
      context,
      withInitCreateSuccess
    );

    const unsignedTx: Public.UnsignedTransaction = {
      /**
       * This `transactionId` will be sent by the client to the `/transaction/submit` endpoint.
       * Unless we make the `transactionId` the same as the event which generated the unsigned tx,
       * i.e. the `SMART_VAULT__OPEN_INIT__SUCCESS` event, the "post submit handler" will not
       * be able to find the correct event stream to append the transaction success/failure event to.
       */
      transactionId: createInitSuccessEventId,
      transactionPayload: coreOrderSwapOpenResponse.transactionPayload,
    };

    return unsignedTx;
  }

  async smartVaultOpen(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    data: Public.SmartVaultOpenData
  ): Promise<Public.UnsignedTransaction | Error> {
    const withInitRequest: EventStream<SmartVaultEvent> =
      await this.createSmartVaultOpenRequest(context, user, data);

    try {
      const unsignedTx = await this.performSmartVaultOpen(
        context,
        user,
        walletAccount,
        data,
        withInitRequest
      );

      return unsignedTx;
    } catch (error) {
      const parsedError: Error | null = isError(error) ? error : null;

      // Save error to event stream
      const withInitCreateSuccess: EventStream<SmartVaultEvent> =
        this.smartVaultEventMutation.makeAndPersistEvent(
          withInitRequest,
          SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__FAILURE
        )({
          streamId: withInitRequest.streamId,
          eventId: randomUUID(),
          eventPayload: {
            errorCode:
              parsedError instanceof ApplicationError
                ? parsedError.errorCode
                : ErrorCode.UNKNOWN_ERROR,
            errorReason: parsedError?.message,
          },
        });

      await this.eventStreamRepository.saveEventStream(
        context,
        withInitCreateSuccess
      );

      return parsedError || Error(ErrorCode.SMART_VAULT__FAILED_TO_CREATE);
    }
  }

  private async createSmartVaultDepositRequest(
    context: TransactionalContext,
    user: Private.User,
    data: Public.SmartVaultDepositData
  ): Promise<EventStream<SmartVaultEvent>> {
    const {userId} = user;

    const eventStream = this.eventStreamRepository.newEventStream();

    const mutatedEventStream = this.smartVaultEventMutation.makeAndPersistEvent(
      eventStream,
      SmartVaultEventTypes.SMART_VAULT__DEPOSIT_INIT__REQUEST
    )({
      streamId: eventStream.streamId,
      eventId: randomUUID(),
      eventPayload: {
        smartVaultId: data.smartVaultId,
        creatorStakeKeyHash: user.walletStakeKeyHash,
        depositAssets: data.depositAssets,
      },
    });

    const savedEventStream = await this.eventStreamRepository.saveEventStream(
      context,
      mutatedEventStream
    );

    return savedEventStream;
  }

  private async createSmartVaultDepositInit(
    context: TransactionalContext,
    user: Private.User,
    wallet: Public.WalletAccount,
    data: Public.SmartVaultDepositData,
    eventStream: EventStream<SmartVaultEvent>
  ): Promise<Public.UnsignedTransaction> {
    const orderVersion =
      this.orderSwapScriptService.getCurrentCoreOrderScriptVersion();

    const lastAsset = last(data.depositAssets);

    if (!lastAsset) {
      throw new Error('No deposit assets provided');
    }

    const toAsset = await this.assetRepository.getAdaAsset(context);
    const fromAsset = await this.assetRepository.getAssetByAssetId(
      context,
      lastAsset.assetId
    );

    // TODO: Temporarily opening order swap instead of smart vault
    const orderSwapOpenRequest: Core.OrderSwapOpenRequest = {
      ...wallet,

      toAssetId: toAsset.assetId,
      toAssetName: toAsset.assetName,
      toAssetPolicyId: toAsset.policyId,
      toAssetAmount: '1000000',

      fromAssetId: fromAsset.assetId,
      fromAssetName: fromAsset.assetName,
      fromAssetPolicyId: fromAsset.policyId,
      fromAssetAmount: lastAsset.assetAmount,

      orderVersion,
    };

    const coreOrderSwapOpenResponse = await this.coreService.orderSwapOpen(
      orderSwapOpenRequest
    );

    const withInitSuccess: EventStream<SmartVaultEvent> =
      this.smartVaultEventMutation.makeAndPersistEvent(
        eventStream,
        SmartVaultEventTypes.SMART_VAULT__DEPOSIT_INIT__SUCCESS
      )({
        streamId: eventStream.streamId,
        eventId: randomUUID(),
        eventPayload: {},
        transactionHash: coreOrderSwapOpenResponse.transactionHash,
      });

    await this.eventStreamRepository.saveEventStream(context, withInitSuccess);

    const unsignedTx: Public.UnsignedTransaction = pick(
      coreOrderSwapOpenResponse,
      ['transactionId', 'transactionPayload']
    );

    return unsignedTx;
  }

  async smartVaultDeposit(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    data: Public.SmartVaultDepositData
  ): Promise<Public.UnsignedTransaction | Error> {
    const withInitRequest: EventStream<SmartVaultEvent> =
      await this.createSmartVaultDepositRequest(context, user, data);

    try {
      const unsignedTx = await this.createSmartVaultDepositInit(
        context,
        user,
        walletAccount,
        data,
        withInitRequest
      );

      return unsignedTx;
    } catch (error) {
      // Save error to event stream
      return Error('Failed to create smart vault deposit');
    }
  }

  async processSmartVaultOpenOnChain(
    context: TransactionalContext,
    event: Oura.TransactionEvent,
    output: Oura.TransactionOutputWithRef,
    // TODO: Will change when we have the actual Oura Smart Vault tx listener
    data: {
      walletStakeKeyHash: string | null;
      mintAssetId: string;
      baseAssetId: string;
      baseAssetAmountTotalRemaining: bigint;
      quoteAssetId: string;
      quoteAssetAmountTotalRemaining: bigint;
      partialFillsCount: number;
      effectiveFromDate: Date | null;
      effectiveUntilDate: Date | null;
      price: number;
      priceRatio: {numerator: bigint; denominator: bigint};
      makerLovelaceFlatFeeAmount: number;
      makerQuoteAssetFeeAmount: number;
      takerLovelaceFlatFeeAmount: number;
    }
  ): Promise<void> {
    const smartVault =
      await this.smartVaultRepository.getSmartVaultByMintAssetId(
        context,
        data.mintAssetId
      );

    const eventStream = smartVault
      ? await this.eventStreamRepository.getEventStreamByStreamId(
          context,
          smartVault.smartVaultId,
          eventFilterOption.SMART_VAULT
        )
      : this.eventStreamRepository.newEventStream();

    const transactionDateOpen = epochInSecondsToDate(event.context.timestamp);

    // TODO: This is a temporary solution. We should get this from on-chain data passed from Oura.
    const depositAssets = eventStream.streamEvents.reduce((acc, event) => {
      return event.eventType ===
        SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__REQUEST
        ? event.eventPayload.depositAssets
        : acc;
    }, [] as SmartVaultOpenInitRequestEvent['eventPayload']['depositAssets']);

    const newEventStream: EventStream<SmartVaultEvent> =
      this.smartVaultEventMutation.makeAndPersistEvent(
        eventStream,
        SmartVaultEventTypes.SMART_VAULT__OPEN_ONCHAIN__SUCCESS
      )({
        streamId: eventStream.streamId,
        eventId: randomUUID(),
        eventPayload: {
          depositAssets,
          creatorStakeKeyHash: data.walletStakeKeyHash,
          mintAssetId: data.mintAssetId,
          transactionDateOpen,
          utxoReferenceTransactionHash: output.utxoReferenceTransactionHash,
          utxoReferenceIndex: output.utxoReferenceIndex,
        },
        transactionHash: event.transaction.hash,
        blockSlot: BigInt(event.context.slot),
        blockHash: event.context.block_hash,
      });

    await this.eventStreamRepository.saveEventStream(context, newEventStream);
  }

  private async getEventStreamByMintAssetId(
    context: TransactionalContext,
    mintAssetId: string
  ): Promise<EventStream<SmartVaultEvent> | null> {
    const smartVault =
      await this.smartVaultRepository.getSmartVaultByMintAssetId(
        context,
        mintAssetId
      );

    if (smartVault) {
      return this.eventStreamRepository.getEventStreamByStreamId(
        context,
        smartVault.smartVaultId,
        eventFilterOption.SMART_VAULT
      );
    } else {
      return null;
    }
  }

  private async createSmartVaultWithdrawRequest(
    context: TransactionalContext,
    user: Private.User,
    data: Public.SmartVaultWithdrawData
  ): Promise<EventStream<SmartVaultEvent>> {
    const eventStream =
      await this.eventStreamRepository.getEventStreamByStreamId(
        context,
        data.smartVaultId,
        eventFilterOption.SMART_VAULT
      );

    const mutatedEventStream = this.smartVaultEventMutation.makeAndPersistEvent(
      eventStream,
      SmartVaultEventTypes.SMART_VAULT__WITHDRAW_INIT__REQUEST
    )({
      streamId: eventStream.streamId,
      eventId: randomUUID(),
      eventPayload: {
        creatorStakeKeyHash: user.walletStakeKeyHash,
        smartVaultId: data.smartVaultId,
        withdrawAssets: data.withdrawAssets,
      },
    });

    const savedEventStream = await this.eventStreamRepository.saveEventStream(
      context,
      mutatedEventStream
    );

    return savedEventStream;
  }

  private async performSmartVaultWithdraw(
    context: TransactionalContext,
    wallet: Public.WalletAccount,
    user: Private.User,
    eventStream: EventStream<SmartVaultEvent>
  ): Promise<Public.UnsignedTransaction> {
    const {
      smartVaultId,
      utxoReferenceTransactionHash,
      utxoReferenceIndex,
    }: SmartVaultAggregate = this.smartVaultReducer.reduce(eventStream);

    const hasUtxoReference =
      utxoReferenceTransactionHash && typeof utxoReferenceIndex === 'number';

    if (hasUtxoReference) {
      const utxoReference = `${utxoReferenceTransactionHash}#${utxoReferenceIndex}`;

      // TODO: Temporarily cancelling order swap instead of withdrawing from smart vault
      const orderSwapOpenRequest: Core.OrderSwapCancelRequest = {
        ...wallet,
        utxoReference,
      };

      const coreResponse = await this.coreService.orderSwapCancel(
        orderSwapOpenRequest
      );

      const closeInitSuccessEventId = randomUUID();

      const withInitCloseSuccess: EventStream<SmartVaultEvent> =
        this.smartVaultEventMutation.makeAndPersistEvent(
          eventStream,
          SmartVaultEventTypes.SMART_VAULT__WITHDRAW_INIT__SUCCESS
        )({
          streamId: smartVaultId,
          eventId: closeInitSuccessEventId,
          eventPayload: {
            smartVaultId,
            creatorStakeKeyHash: user.walletStakeKeyHash,
            utxoReferenceTransactionHash,
            utxoReferenceIndex,
          },
          transactionHash: coreResponse.transactionHash,
        });

      await this.eventStreamRepository.saveEventStream(
        context,
        withInitCloseSuccess
      );

      const unsignedTx: Public.UnsignedTransaction = {
        /**
         * This `transactionId` will be sent by the client to the `/transaction/submit` endpoint.
         * Unless we make the `transactionId` the same as the event which generated the unsigned tx,
         * i.e. the `SMART_VAULT__CLOSE_INIT__SUCCESS` event, the "post submit handler" will not
         * be able to find the correct event stream to append the transaction success/failure event to.
         */
        transactionId: closeInitSuccessEventId,
        transactionPayload: coreResponse.transactionPayload,
      };

      return unsignedTx;
    } else {
      throw new ApplicationError(
        // TODO: Correct error code
        ErrorCode.INVALID_ORDER__TRANSACTION_REFERENCE_NOT_FOUND
      );
    }
  }

  async smartVaultWithdraw(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    data: Public.SmartVaultWithdrawData
  ): Promise<Public.UnsignedTransaction | Error> {
    const withInitRequest: EventStream<SmartVaultEvent> =
      await this.createSmartVaultWithdrawRequest(context, user, data);

    try {
      const unsignedTx = await this.performSmartVaultWithdraw(
        context,
        walletAccount,
        user,
        withInitRequest
      );

      return unsignedTx;
    } catch (error) {
      const parsedError: Error | null = isError(error) ? error : null;

      // Save error to event stream
      const withInitCreateSuccess: EventStream<SmartVaultEvent> =
        this.smartVaultEventMutation.makeAndPersistEvent(
          withInitRequest,
          SmartVaultEventTypes.SMART_VAULT__WITHDRAW_INIT__FAILURE
        )({
          streamId: withInitRequest.streamId,
          eventId: randomUUID(),
          eventPayload: {
            smartVaultId: data.smartVaultId,
            creatorStakeKeyHash: user.walletStakeKeyHash,
            errorCode:
              parsedError instanceof ApplicationError
                ? parsedError.errorCode
                : ErrorCode.UNKNOWN_ERROR,
            errorReason: parsedError?.message,
          },
        });

      await this.eventStreamRepository.saveEventStream(
        context,
        withInitCreateSuccess
      );

      return parsedError || Error(ErrorCode.SMART_VAULT__FAILED_TO_CREATE);
    }
  }

  async smartVaultWithdrawEstimate(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    data: Public.SmartVaultWithdrawEstimateData
  ): Promise<Public.SmartVaultWithdrawEstimateResult> {
    const smartVault =
      await this.smartVaultRepository.getSmartVaultBySmartVaultId(
        context,
        data.smartVaultId
      );

    const depositedAssets: {
      assetId: string;
      asset: Private.SmartVaultAsset;
      assetAmount: bigint;
    }[] = getDepositedAssets(
      smartVault?.smartVaultAsset || [],
      smartVault?.smartVaultOperation || []
    );

    const depositedAssetsEnriched: {
      assetId: string;
      asset: Private.Asset | null;
      assetAmount: bigint;
    }[] = await Promise.all(
      depositedAssets.map(async ({asset, ...rest}) => ({
        asset: await this.assetRepository.getAssetOrNullByAssetId(
          context,
          asset.assetId
        ),
        ...rest,
      }))
    );

    const publicDepositedAssets: Public.SmartVaultAssetDetailed[] =
      depositedAssetsEnriched.map(
        this.domainMapper.toPublicSmartVaultAssetDetailed
      );

    return {
      withdrawableAssets: publicDepositedAssets,
    };
  }

  async processSmartVaultCloseOnChain(
    context: TransactionalContext,
    event: Oura.TransactionEvent,
    smartVault: Private.SmartVault
  ): Promise<void> {
    const {mintAssetId, creatorStakeKeyHash, smartVaultId} = smartVault;

    const eventStream = mintAssetId
      ? await this.getEventStreamByMintAssetId(context, mintAssetId)
      : null;

    if (eventStream) {
      const transactionDateClose = epochInSecondsToDate(
        event.context.timestamp
      );

      const newEventStream: EventStream<SmartVaultEvent> =
        this.smartVaultEventMutation.makeAndPersistEvent(
          eventStream,
          SmartVaultEventTypes.SMART_VAULT__CLOSE_ONCHAIN__SUCCESS
        )({
          streamId: eventStream.streamId,
          eventId: randomUUID(),
          eventPayload: {
            smartVaultId,
            creatorStakeKeyHash,
            mintAssetId,
            transactionDateClose,
            transactionFeeAmount: event.transaction.fee.toString(),
          },
          transactionHash: event.transaction.hash,
          blockSlot: BigInt(event.context.slot),
          blockHash: event.context.block_hash,
        });

      await this.eventStreamRepository.saveEventStream(context, newEventStream);
    } else {
      this.loggerService.error(
        new ApplicationError(
          ErrorCode.ONCHAIN_EVENT__CRITICAL_FAILED_TO_FIND_SMART_VAULT
        ),
        `CLOSING SMART VAULT MISSING EVENT STREAM: mintAssetId <${mintAssetId}>, event.transaction.hash <${event.transaction.hash}>`
      );
    }
  }

  private async createSmartVaultCloseRequest(
    context: TransactionalContext,
    user: Private.User,
    data: Public.SmartVaultCloseData
  ): Promise<EventStream<SmartVaultEvent>> {
    const eventStream =
      await this.eventStreamRepository.getEventStreamByStreamId(
        context,
        data.smartVaultId,
        eventFilterOption.SMART_VAULT
      );

    const mutatedEventStream = this.smartVaultEventMutation.makeAndPersistEvent(
      eventStream,
      SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__REQUEST
    )({
      streamId: eventStream.streamId,
      eventId: randomUUID(),
      eventPayload: {
        creatorStakeKeyHash: user.walletStakeKeyHash,
        smartVaultId: data.smartVaultId,
      },
    });

    const savedEventStream = await this.eventStreamRepository.saveEventStream(
      context,
      mutatedEventStream
    );

    return savedEventStream;
  }

  private async performSmartVaultClose(
    context: TransactionalContext,
    wallet: Public.WalletAccount,
    user: Private.User,
    eventStream: EventStream<SmartVaultEvent>
  ): Promise<Public.UnsignedTransaction> {
    const {
      smartVaultId,
      utxoReferenceTransactionHash,
      utxoReferenceIndex,
    }: SmartVaultAggregate = this.smartVaultReducer.reduce(eventStream);

    const hasUtxoReference =
      utxoReferenceTransactionHash && typeof utxoReferenceIndex === 'number';

    if (hasUtxoReference) {
      const utxoReference = `${utxoReferenceTransactionHash}#${utxoReferenceIndex}`;

      // TODO: Temporarily cancelling order swap instead of removing smart vault
      const orderSwapOpenRequest: Core.OrderSwapCancelRequest = {
        ...wallet,
        utxoReference,
      };

      const coreResponse = await this.coreService.orderSwapCancel(
        orderSwapOpenRequest
      );

      const closeInitSuccessEventId = randomUUID();

      const withInitCloseSuccess: EventStream<SmartVaultEvent> =
        this.smartVaultEventMutation.makeAndPersistEvent(
          eventStream,
          SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__SUCCESS
        )({
          streamId: smartVaultId,
          eventId: closeInitSuccessEventId,
          eventPayload: {
            smartVaultId,
            creatorStakeKeyHash: user.walletStakeKeyHash,
            utxoReferenceTransactionHash,
            utxoReferenceIndex,
          },
          transactionHash: coreResponse.transactionHash,
        });

      await this.eventStreamRepository.saveEventStream(
        context,
        withInitCloseSuccess
      );

      const unsignedTx: Public.UnsignedTransaction = {
        /**
         * This `transactionId` will be sent by the client to the `/transaction/submit` endpoint.
         * Unless we make the `transactionId` the same as the event which generated the unsigned tx,
         * i.e. the `SMART_VAULT__CLOSE_INIT__SUCCESS` event, the "post submit handler" will not
         * be able to find the correct event stream to append the transaction success/failure event to.
         */
        transactionId: closeInitSuccessEventId,
        transactionPayload: coreResponse.transactionPayload,
      };

      return unsignedTx;
    } else {
      throw new ApplicationError(
        // TODO: Correct error code
        ErrorCode.INVALID_ORDER__TRANSACTION_REFERENCE_NOT_FOUND
      );
    }
  }

  async smartVaultClose(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    data: Public.SmartVaultCloseData
  ): Promise<Public.UnsignedTransaction | Error> {
    const withInitRequest: EventStream<SmartVaultEvent> =
      await this.createSmartVaultCloseRequest(context, user, data);

    try {
      const unsignedTx = await this.performSmartVaultClose(
        context,
        walletAccount,
        user,
        withInitRequest
      );

      return unsignedTx;
    } catch (error) {
      const parsedError: Error | null = isError(error) ? error : null;

      // Save error to event stream
      const withInitCreateSuccess: EventStream<SmartVaultEvent> =
        this.smartVaultEventMutation.makeAndPersistEvent(
          withInitRequest,
          SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__FAILURE
        )({
          streamId: withInitRequest.streamId,
          eventId: randomUUID(),
          eventPayload: {
            smartVaultId: data.smartVaultId,
            creatorStakeKeyHash: user.walletStakeKeyHash,
            errorCode:
              parsedError instanceof ApplicationError
                ? parsedError.errorCode
                : ErrorCode.UNKNOWN_ERROR,
            errorReason: parsedError?.message,
          },
        });

      await this.eventStreamRepository.saveEventStream(
        context,
        withInitCreateSuccess
      );

      return parsedError || Error(ErrorCode.SMART_VAULT__FAILED_TO_CREATE);
    }
  }
}
