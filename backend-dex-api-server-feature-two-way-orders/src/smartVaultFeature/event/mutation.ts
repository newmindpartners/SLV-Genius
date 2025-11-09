import {injectable} from 'tsyringe';
import * as Private from '~/domain/models/private';
import {appendEventToEventStream, EventStream} from '~/domain/events';
import {
  SmartVaultEvent,
  SmartVaultEventType,
  SmartVaultEventTypes,
  SmartVaultEventVersion,
  SmartVaultEventVersions,
} from './types';
import {randomUUID} from 'crypto';
import {ExtractBySubstring} from '~/implementation/utils/typescript';

export type SmartVaultFailureEventHandler = (
  eventStream: EventStream<SmartVaultEvent>,
  transactionHash: string,
  errorCodeReason: Private.ErrorCodeReason
) => EventStream;

@injectable()
export class SmartVaultEventMutation {
  makeAndPersistEvent =
    <
      EventType extends SmartVaultEvent['eventType'],
      Event extends Extract<SmartVaultEvent, {eventType: EventType}>
    >(
      eventStream: EventStream<SmartVaultEvent>,
      eventType: EventType
    ) =>
    (
      eventRest: Omit<Event, 'eventType' | 'eventVersion' | 'created'>
    ): EventStream<SmartVaultEvent> => {
      const event = {
        eventType,
        eventVersion: SmartVaultEventVersions[eventType],
        created: new Date(),
        ...eventRest,
      } as Event;

      return appendEventToEventStream(eventStream, event);
    };

  private handleSubmitFailure =
    (
      submitFailureEventType: ExtractBySubstring<
        SmartVaultEventType,
        'SUBMIT__FAILURE'
      >
    ) =>
    (
      eventStream: EventStream<SmartVaultEvent>,
      transactionHash: string,
      errorCodeReason: Private.ErrorCodeReason
    ): EventStream<SmartVaultEvent> =>
      this.makeAndPersistEvent(
        eventStream,
        submitFailureEventType
      )({
        streamId: eventStream.streamId,
        eventId: randomUUID(),
        eventPayload: {
          smartVaultId: eventStream.streamId,
          errorCode: errorCodeReason.errorCode,
          errorReason: errorCodeReason.errorReason,
        },
        transactionHash,
      });

  handleOpenSubmitFailure = this.handleSubmitFailure(
    SmartVaultEventTypes.SMART_VAULT__OPEN_SUBMIT__FAILURE
  );

  handleDepositSubmitFailure = this.handleSubmitFailure(
    SmartVaultEventTypes.SMART_VAULT__DEPOSIT_SUBMIT__FAILURE
  );

  handleWithdrawSubmitFailure = this.handleSubmitFailure(
    SmartVaultEventTypes.SMART_VAULT__WITHDRAW_SUBMIT__FAILURE
  );

  handleCloseSubmitFailure = this.handleSubmitFailure(
    SmartVaultEventTypes.SMART_VAULT__CLOSE_SUBMIT__FAILURE
  );
}
