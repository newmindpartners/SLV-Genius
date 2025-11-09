// eslint-disable-next-line node/no-unpublished-import
import {createMock} from 'ts-auto-mock';
import {
  EventStream,
  EventTypes,
  OrderSwapEvent,
  OrderSwapOpenInitRequestEvent,
  OrderSwapOpenInitSuccessEvent,
  OrderSwapOpenOnChainFailureEvent,
  OrderSwapOpenOnChainSuccessEvent,
  OrderSwapOpenSubmitSuccessEvent,
} from '~/domain/events';

type Event = OrderSwapEvent;

export const mockOrderSwapOpenOnChainFailure: Event =
  createMock<OrderSwapOpenOnChainFailureEvent>({
    eventType: EventTypes.ORDER_SWAP__OPEN_ONCHAIN__FAILURE,
  });

export const mockOrderSwapOpenOnChainSuccess: OrderSwapOpenOnChainSuccessEvent =
  {
    ...createMock<OrderSwapOpenOnChainSuccessEvent>(),
    eventType: EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS,
  };

const streamEvents: Event[] = [
  createMock<OrderSwapOpenInitRequestEvent>({
    eventType: EventTypes.ORDER_SWAP__OPEN_INIT__REQUEST,
  }),
  createMock<OrderSwapOpenInitSuccessEvent>({
    eventType: EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS,
  }),
  createMock<OrderSwapOpenSubmitSuccessEvent>({
    eventType: EventTypes.ORDER_SWAP__OPEN_SUBMIT__SUCCESS,
  }),
  mockOrderSwapOpenOnChainSuccess,
];

export const mockOrderSwapOpenEventStream: EventStream<OrderSwapEvent> = {
  streamId: '3663a61f-b861-4128-8c14-2d13cec74f4b',
  streamEvents,
  mutatedStreamEvents: [],
  streamVersion: streamEvents.length,
};
