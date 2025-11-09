import {inject, injectable, singleton} from 'tsyringe';

import {find} from 'lodash';

import {TransactionSubmitOrPostProcessHandler} from './transactionSubmitOrPostProcessHandler';

import {
  DomainEvent,
  EventStream,
  EventType,
  EventTypes,
  isOrderSwapEvent,
  OrderSwapEvent,
} from '~/domain/events';

import * as Public from '~/domain/models/public';

import {TransactionalContext} from '~/domain/context';

import {OrderSwapMutation} from '~/domain/events/mutation';

import {EventStreamRepository} from '~/domain/repositories';

import {ErrorCode} from '~/domain/errors';
import {OrderSwapApplication} from '../orderSwap.application';
import {SmartVaultEventMutation} from '~/smartVaultFeature/event/mutation';
import {
  SmartVaultEvent,
  SmartVaultEventTypes,
} from '~/smartVaultFeature/event/types';
import {randomUUID} from 'crypto';

export type PostSubmitTransactionalContextActionMap<Event extends DomainEvent> =
  {
    [eventType in EventType]?: (
      context: TransactionalContext,
      eventStream: EventStream<Event>
    ) => Promise<void>;
  };

@singleton()
@injectable()
export class TransactionPostSubmitHandler
  implements
    TransactionSubmitOrPostProcessHandler<
      Public.SignedTransaction,
      Public.SignedTransaction
    >
{
  orderSwapPostSubmitTransactionalContextActionMap: PostSubmitTransactionalContextActionMap<OrderSwapEvent>;

  constructor(
    @inject('OrderSwapMutation')
    private readonly orderSwapMutation: OrderSwapMutation,

    @inject('SmartVaultEventMutation')
    private readonly smartVaultEventMutation: SmartVaultEventMutation,

    @inject('EventStreamRepository')
    private readonly eventStreamRepository: EventStreamRepository,

    @inject('OrderSwapApplication')
    private readonly orderSwapApplication: OrderSwapApplication
  ) {
    this.orderSwapPostSubmitTransactionalContextActionMap = {
      [EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS]:
        this.orderSwapApplication.addOrderSwapsByUtxoRefToExclusionList.bind(
          this.orderSwapApplication
        ),
    };
  }

  async handleTransaction(
    context: TransactionalContext,
    signedTransaction: Public.SignedTransaction
  ): Promise<Public.SignedTransaction> {
    const {transactionId: eventId} = signedTransaction;

    const eventStream =
      await this.eventStreamRepository.getEventStreamByEventId(
        context,
        eventId
      );

    if (eventStream) {
      const {streamEvents: eventStreamEvents} = eventStream;

      const event = find(
        eventStreamEvents,
        ({eventId: streamEventId}) => eventId === streamEventId
      );

      if (event) {
        await this.mutateAndSaveEventStream(context, eventStream, event);

        if (isOrderSwapEvent(event)) {
          const postSubmitTransactionalContextAction =
            this.orderSwapPostSubmitTransactionalContextActionMap[
              event.eventType
            ];

          if (postSubmitTransactionalContextAction) {
            await postSubmitTransactionalContextAction(
              context,
              eventStream as EventStream<OrderSwapEvent>
            );
          }
        }
      }
    }

    return signedTransaction;
  }

  private async mutateAndSaveEventStream(
    context: TransactionalContext,
    eventStream: EventStream,
    eventStreamEvent: DomainEvent
  ): Promise<EventStream> {
    const eventStreamMutated = this.mutateEventStream(
      eventStream,
      eventStreamEvent
    );

    const savedEventStream = await this.eventStreamRepository.saveEventStream(
      context,
      eventStreamMutated
    );

    return savedEventStream;
  }

  private mutateEventStream(
    eventStream: EventStream<DomainEvent>,
    eventStreamEvent: DomainEvent
  ): EventStream<DomainEvent> {
    const {eventType} = eventStreamEvent;

    switch (eventType) {
      case EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS:
        return this.orderSwapMutation.orderSwapOpenSubmitSuccess(
          eventStream as EventStream<OrderSwapEvent>
        );
      case EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS:
        return this.orderSwapMutation.orderSwapFillSubmit(
          eventStream as EventStream<OrderSwapEvent>
        );
      case EventTypes.ORDER_SWAP__CANCEL_INIT__SUCCESS:
        return this.orderSwapMutation.orderSwapCancelSubmit(
          eventStream as EventStream<OrderSwapEvent>
        );
      case EventTypes.SMART_VAULT__OPEN_INIT__SUCCESS: {
        return this.smartVaultEventMutation.makeAndPersistEvent(
          eventStream as EventStream<SmartVaultEvent>,
          SmartVaultEventTypes.SMART_VAULT__OPEN_SUBMIT__SUCCESS
        )({
          streamId: eventStream.streamId,
          eventId: randomUUID(),
          eventPayload: {
            smartVaultId: eventStream.streamId,
            utxoReferenceTransactionHash: eventStreamEvent.transactionHash,
          },
          transactionHash: eventStreamEvent.transactionHash,
        });
      }
      // TODO: Add deposit and withdraw
      case EventTypes.SMART_VAULT__CLOSE_INIT__SUCCESS: {
        return this.smartVaultEventMutation.makeAndPersistEvent(
          eventStream as EventStream<SmartVaultEvent>,
          SmartVaultEventTypes.SMART_VAULT__CLOSE_SUBMIT__SUCCESS
        )({
          streamId: eventStream.streamId,
          eventId: randomUUID(),
          eventPayload: {
            smartVaultId: eventStream.streamId,
          },
          transactionHash: eventStreamEvent.transactionHash,
        });
      }
      default:
        throw new Error(ErrorCode.EVENT__FAILED_TO_RESOLVE_EVENT_HANDLER);
    }
  }
}
