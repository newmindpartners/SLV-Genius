import {map} from 'lodash';
import 'reflect-metadata';
import {container} from 'tsyringe';
import {EventStream, OrderSwapEvent} from '~/domain/events';
import {OrderSwapMutation} from '~/domain/events/mutation';
import {
  OnChainFailureErrorDetails,
  OrderSwapOnChainSuccessEvent,
} from '~/domain/events/orderSwap/shared/OrderSwapOnChainEvent';

import {OrderSwapServiceImplementation} from '~/domain/services/orderSwap.service';
import {
  mockOrderSwapOpenEventStream,
  mockOrderSwapOpenOnChainFailure,
  mockOrderSwapOpenOnChainSuccess,
} from '../mock';

beforeAll(() => {
  container.register('OrderSwapMutation', OrderSwapMutation);
});

test('OrderSwapServiceImplementation: appendEventStreamWithOnChainFailureEvents', () => {
  const orderSwapMutation =
    container.resolve<OrderSwapMutation>('OrderSwapMutation');

  const eventsToInvalidate: OrderSwapOnChainSuccessEvent[] = [
    mockOrderSwapOpenOnChainSuccess,
  ];

  const rollbackDetails: Omit<
    OnChainFailureErrorDetails,
    'invalidatedEventId' | 'invalidatedTransactionHash'
  > = {
    rollBackBlock: {
      blockHash:
        'f270d1c40ea1eacd77be0e2ce7d9d4bb4cb44722735a1ce6df75ac5cff6754bb',
      blockSlot: 41874825,
    },
    eventReceivedAt: new Date(),
  };

  const rolledBackEventStream: EventStream<OrderSwapEvent> =
    new OrderSwapServiceImplementation(
      orderSwapMutation
    ).appendEventStreamWithOnChainFailureEvents(
      mockOrderSwapOpenEventStream,
      eventsToInvalidate,
      rollbackDetails
    );

  const eventStreamWithFailureEvent: EventStream = {
    ...mockOrderSwapOpenEventStream,
    mutatedStreamEvents: [mockOrderSwapOpenOnChainFailure],
  };

  /**
   * Most important check is to see that the function has added the expected
   * event types to the mutatedStreamEvents array.
   * For our test, this is the open on-chain failure event.
   */
  expect(
    map(rolledBackEventStream.mutatedStreamEvents, 'eventType')
  ).toStrictEqual(
    map(eventStreamWithFailureEvent.mutatedStreamEvents, 'eventType')
  );
  /**
   * `streamEvents` should be unaffected
   */
  expect(rolledBackEventStream.streamEvents).toStrictEqual(
    rolledBackEventStream.streamEvents
  );
});
