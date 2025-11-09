import 'reflect-metadata';

import {mergeWith} from 'lodash';

import {inject, injectable, singleton} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';

import {
  DomainEvent,
  EventStream,
  EventType,
  EventTypes,
  isOrderSwapEvent,
} from '~/domain/events';

import * as Core from '~/domain/models/core';
import * as Oura from '~/domain/models/oura';
import * as Private from '~/domain/models/private';
import * as Public from '~/domain/models/public';
import * as Response from '~/domain/types/response';

import {
  OrderSwapFailureEventHandler,
  OrderSwapMutation,
} from '~/domain/events/mutation';
import {EventStreamRepository} from '~/domain/repositories';
import {ConfigService, LoggerService} from '~/domain/services';

import {ApplicationError} from '~/application/application.error';
import {ErrorCode} from '~/domain/errors';

import {mergeArrays} from '~/domain/utils/array.utils';
import {calculateTransactionHash} from '~/domain/utils/transaction.util';
import {getCardanoTransactionUrl} from '~/domain/utils/url.util';

import {
  TransactionSubmitOrPostProcessHandler,
  TransactionSubmitOrPostProcessHandlerMap,
} from '~/application/transaction/transactionSubmitOrPostProcessHandler';
import {
  SmartVaultEventMutation,
  SmartVaultFailureEventHandler,
} from '~/smartVaultFeature/event/mutation';
import {isSmartVaultEvent} from '~/smartVaultFeature/event/types';

@singleton()
@injectable()
export class TransactionApplication {
  orderSwapFailureEventHandlers: Partial<
    Record<EventType, OrderSwapFailureEventHandler>
  >;

  smartVaultFailureEventHandlers: Partial<
    Record<EventType, SmartVaultFailureEventHandler>
  >;

  transactionSubmitHandlers: Required<
    TransactionSubmitOrPostProcessHandlerMap<
      Public.SignedTransaction,
      Response.Response<Core.Transaction>
    >
  >;

  transactionPostSubmitHandlers: Partial<
    TransactionSubmitOrPostProcessHandlerMap<
      Public.SignedTransaction,
      Public.SignedTransaction
    >
  >;

  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('LoggerService')
    private readonly loggerService: LoggerService,

    @inject('OrderSwapMutation')
    private readonly orderSwapMutation: OrderSwapMutation,

    @inject('SmartVaultEventMutation')
    private readonly smartVaultEventMutation: SmartVaultEventMutation,

    @inject('EventStreamRepository')
    private readonly eventStreamRepository: EventStreamRepository<DomainEvent>,

    @inject('TransactionSubmitHandler')
    private readonly transactionSubmitHandler: TransactionSubmitOrPostProcessHandler<
      Public.SignedTransaction,
      Response.Response<Core.Transaction>
    >,

    @inject('TransactionPostSubmitHandler')
    private readonly transactionPostSubmitHandler: TransactionSubmitOrPostProcessHandler<
      Public.SignedTransaction,
      Public.SignedTransaction
    >,
    @inject('TransactionPostSubmitHandlerTwoWayOrder')
    private readonly transactionPostSubmitHandlerTwoWayOrder: TransactionSubmitOrPostProcessHandler<
      Public.SignedTransaction,
      Public.SignedTransaction
    >,

    @inject('TransactionPostSubmitHandlerOrderSale')
    private readonly transactionPostSubmitHandlerOrderSale: TransactionSubmitOrPostProcessHandler<
      Public.SignedTransaction,
      Public.SignedTransaction
    >,

    @inject('BlockOuraEventHandler')
    private readonly blockOuraEventHandler: Oura.EventHandler,

    @inject('RollBackOuraEventHandler')
    private readonly rollBackOuraEventHandler: Oura.EventHandler,

    @inject('TransactionOuraEventHandler')
    private readonly transactionOuraEventHandler: Oura.EventHandler,

    @inject('OrderSaleFillOuraEventHandler')
    private readonly orderSaleFillOuraEventHandler: Oura.EventHandler,

    @inject('OrderSwapOpenAndPartialFillOuraEventHandler')
    private readonly orderSwapOpenOrPartialFillOuraEventHandler: Oura.EventHandler,

    @inject('OrderSwapCancelAndFinalFillOuraEventHandler')
    private readonly orderSwapCancelAndFinalFillOuraEventHandler: Oura.EventHandler,

    @inject('OrderSwapDirectFillOuraEventHandler')
    private readonly orderSwapDirectFillOuraEventHandler: Oura.EventHandler,

    @inject('SmartVaultOpenAndDepositOuraEventHandler')
    private readonly smartVaultOpenAndDepositOuraEventHandler: Oura.EventHandler,

    @inject('SmartVaultCloseOuraEventHandler')
    private readonly smartVaultCloseOuraEventHandler: Oura.EventHandler,

    @inject('TwoWayOrderOuraEventHandler')
    private readonly twoWayOrderOuraEventHandler: Oura.EventHandler
  ) {
    this.transactionSubmitHandlers = {
      optionEvent: this.transactionSubmitHandler,
      orderSwapEvent: this.transactionSubmitHandler,
      orderSaleEvent: this.transactionSubmitHandler,
      stakeVaultEvent: this.transactionSubmitHandler,
      yieldFarmingEvent: this.transactionSubmitHandler,
      smartVaultEvent: this.transactionSubmitHandler,
      twoWayOrderEvent: this.transactionSubmitHandler,
    };

    this.transactionPostSubmitHandlers = {
      orderSwapEvent: this.transactionPostSubmitHandler,
      orderSaleEvent: this.transactionPostSubmitHandlerOrderSale,
      smartVaultEvent: this.transactionPostSubmitHandler,
      twoWayOrderEvent: this.transactionPostSubmitHandlerTwoWayOrder,
    };

    this.orderSwapFailureEventHandlers = {
      [EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS]:
        this.orderSwapMutation.orderSwapOpenSubmitFailure.bind(this),
      [EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS]:
        this.orderSwapMutation.orderSwapFillSubmitFailure.bind(this),
      [EventTypes.ORDER_SWAP__CANCEL_INIT__SUCCESS]:
        this.orderSwapMutation.orderSwapCancelSubmitFailure.bind(this),
    };

    this.smartVaultFailureEventHandlers = {
      [EventTypes.SMART_VAULT__OPEN_INIT__SUCCESS]:
        this.smartVaultEventMutation.handleOpenSubmitFailure.bind(this),
      [EventTypes.SMART_VAULT__DEPOSIT_INIT__SUCCESS]:
        this.smartVaultEventMutation.handleDepositSubmitFailure.bind(this),
      [EventTypes.SMART_VAULT__WITHDRAW_INIT__SUCCESS]:
        this.smartVaultEventMutation.handleWithdrawSubmitFailure.bind(this),
      [EventTypes.SMART_VAULT__CLOSE_INIT__SUCCESS]:
        this.smartVaultEventMutation.handleCloseSubmitFailure.bind(this),
    };
  }

  async submitTransaction(
    context: TransactionalContext,
    signedTransaction: Public.SignedTransaction
  ): Promise<Public.Transaction | Error> {
    const {eventType} = signedTransaction;

    const transactionSubmitHandler = this.transactionSubmitHandlers[eventType];

    const transactionSubmitResponse =
      await transactionSubmitHandler.handleTransaction(
        context,
        signedTransaction
      );

    const processedTransactionResponse =
      await this.transactionSubmitResponseProcess(
        context,
        signedTransaction,
        transactionSubmitResponse
      );

    return Response.unwrap(processedTransactionResponse);
  }

  private async transactionSubmitResponseProcess(
    context: TransactionalContext,
    signedTransaction: Public.SignedTransaction,
    transactionSubmitResponse: Response.Response<Core.Transaction>
  ): Promise<Response.Response<Public.Transaction>> {
    const result = Response.fold<
      Error,
      Core.Transaction,
      Promise<Response.Response<Public.Transaction>>
    >(
      async transactionSubmitError => {
        const {transactionId: eventId} = signedTransaction;

        const eventStream =
          await this.eventStreamRepository.getEventStreamByEventId(
            context,
            eventId
          );

        const submitEvent = eventStream?.streamEvents.find(
          event => event.eventId === eventId
        );

        if (eventStream && submitEvent) {
          const handledError = await this.transactionSubmitResponseErrorProcess(
            context,
            signedTransaction,
            submitEvent,
            eventStream,
            transactionSubmitError
          );

          return Promise.resolve(Response.fromError(handledError));
        } else {
          return Promise.resolve(Response.fromError(transactionSubmitError));
        }
      },
      async transactionSubmitResult => {
        const handledResult =
          await this.transactionSubmitResponseSuccessProcess(
            context,
            signedTransaction,
            transactionSubmitResult
          );

        return handledResult;
      }
    )(transactionSubmitResponse);

    return result;
  }

  private async transactionSubmitResponseErrorProcess(
    context: TransactionalContext,
    signedTransaction: Public.SignedTransaction,
    submitEvent: DomainEvent,
    eventStream: EventStream,
    transactionSubmitError: Error
  ): Promise<Error> {
    const {transactionPayload} = signedTransaction;

    const transactionHash = calculateTransactionHash(transactionPayload);

    const {message: errorReason} = transactionSubmitError;
    const errorCode = ErrorCode.TRANSACTION_SUBMIT__UNKNOWN_ERROR;
    const errorCodeReason: Private.ErrorCodeReason = {errorCode, errorReason};

    if (isOrderSwapEvent(submitEvent)) {
      const failureEventHandler =
        this.orderSwapFailureEventHandlers[submitEvent.eventType];

      /**
       * In practice the event stream always contain the same types as the event,
       * but due to shortcomings in our types, this is not inferred here, so
       * we have to make this assertion.
       */
      const orderSwapEventStream = eventStream as EventStream<
        typeof submitEvent
      >;

      if (failureEventHandler) {
        const orderSwapEventStreamMutated = failureEventHandler(
          orderSwapEventStream,
          transactionHash,
          errorCodeReason
        );

        await this.eventStreamRepository.saveEventStream(
          context,
          orderSwapEventStreamMutated
        );
      }
    } else if (isSmartVaultEvent(submitEvent)) {
      const failureEventHandler =
        this.smartVaultFailureEventHandlers[submitEvent.eventType];

      /**
       * In practice the event stream always contain the same types as the event,
       * but due to shortcomings in our types, this is not inferred here, so
       * we have to make this assertion.
       */
      const smartVaultEventStream = eventStream as EventStream<
        typeof submitEvent
      >;

      if (failureEventHandler) {
        const eventStreamMutated = failureEventHandler(
          smartVaultEventStream,
          transactionHash,
          errorCodeReason
        );

        await this.eventStreamRepository.saveEventStream(
          context,
          eventStreamMutated
        );
      }
    }

    return transactionSubmitError;
  }

  private async transactionSubmitResponseSuccessProcess(
    context: TransactionalContext,
    signedTransaction: Public.SignedTransaction,
    transactionSubmitResult: Core.Transaction
  ): Promise<Response.Response<Public.Transaction>> {
    const {eventType} = signedTransaction;
    const transactionPostSubmitHandler =
      this.transactionPostSubmitHandlers[eventType];

    try {
      if (transactionPostSubmitHandler) {
        await transactionPostSubmitHandler.handleTransaction(
          context,
          signedTransaction
        );
      }

      const transaction = this.toPublicTransactionReference(
        signedTransaction,
        transactionSubmitResult
      );

      return Response.fromResult(transaction);
    } catch (e) {
      if (e instanceof Error) {
        return Response.fromError(e);
      } else {
        throw e;
      }
    }
  }

  private toPublicTransactionReference(
    signedTransaction: Public.SignedTransaction,
    submittedTransaction: Core.Transaction
  ): Public.Transaction {
    const {transactionId} = signedTransaction;
    const {transactionHash} = submittedTransaction;

    const transactionUrl = getCardanoTransactionUrl(
      this.configService.getCardanoTransactionUrlTemplate(),
      transactionHash
    );

    return {transactionId, transactionUrl};
  }

  private eventLogger(_: TransactionalContext, event: Oura.Event) {
    this.loggerService.debug(
      `Oura <${event.variant}> event received : ${JSON.stringify(event)}`
    );
  }

  getEventHandlers(eventVariant: Oura.EventVariant) {
    const globalEventHandlers = [this.eventLogger.bind(this)];
    try {
      return [
        ...globalEventHandlers,
        ...this.getEventHandlerMap()[eventVariant],
      ];
    } catch (error) {
      throw new ApplicationError(
        ErrorCode.ON_CHAIN_EVENT__FAILED_TO_RESOLVE_EVENT_HANDLER
      );
    }
  }

  /**
   * Certain event handlers are not ready for production and should therefore
   * only be included in development mode.
   */
  getOrderSwapOuraEventHandlerMap(): Required<
    Oura.HandlerFunctionMap<Oura.Event>
  > {
    const emptyDefault: Required<Oura.HandlerFunctionMap<Oura.Event>> = {
      Transaction: [],
      BlockEnd: [],
      RollBack: [],
    };
    return mergeWith(
      emptyDefault,
      this.orderSwapDirectFillOuraEventHandler.getEventHandlerMap(),
      this.orderSwapCancelAndFinalFillOuraEventHandler.getEventHandlerMap(),
      this.orderSwapOpenOrPartialFillOuraEventHandler.getEventHandlerMap(),
      mergeArrays
    );
  }

  getSmartVaultOuraEventHandlerMap(): Required<
    Oura.HandlerFunctionMap<Oura.Event>
  > {
    const emptyDefault: Required<Oura.HandlerFunctionMap<Oura.Event>> = {
      Transaction: [],
      BlockEnd: [],
      RollBack: [],
    };
    return mergeWith(
      emptyDefault,
      this.smartVaultOpenAndDepositOuraEventHandler.getEventHandlerMap(),
      this.smartVaultCloseOuraEventHandler.getEventHandlerMap(),
      mergeArrays
    );
  }

  getEventHandlerMap(): Required<Oura.HandlerFunctionMap<Oura.Event>> {
    const emptyDefault: Required<Oura.HandlerFunctionMap<Oura.Event>> = {
      Transaction: [],
      BlockEnd: [],
      RollBack: [],
    };
    const orderSwapEventHandlers =
      this.configService.isDexOrderSwapFeatureEnabled()
        ? this.getOrderSwapOuraEventHandlerMap()
        : {};

    /**
     * TODO: Smart vault event handlers are currently implemented as modified copy
     * paste of the order swap event handlers and are therefore listening to the wrong
     * on-chain information.
     * This can uncommented for testing purposes, but it should not be used in production.
     */
    // const smartVaultEventHandlers = this.getSmartVaultOuraEventHandlerMap();

    return mergeWith(
      emptyDefault,
      this.blockOuraEventHandler.getEventHandlerMap(),
      this.rollBackOuraEventHandler.getEventHandlerMap(),
      this.transactionOuraEventHandler.getEventHandlerMap(),
      this.orderSaleFillOuraEventHandler.getEventHandlerMap(),
      orderSwapEventHandlers,
      this.twoWayOrderOuraEventHandler.getEventHandlerMap(),
      // smartVaultEventHandlers,
      mergeArrays
    );
  }
}
