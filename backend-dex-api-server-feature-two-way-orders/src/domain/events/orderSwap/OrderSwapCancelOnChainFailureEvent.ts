import {DomainEventMinimal} from '../DomainEvent';
import {EventTypes} from '../EventTypes';
import {OrderSwapOnChainFailureEventPayload} from './shared/OrderSwapOnChainEvent';

export type OrderSwapCancelOnChainFailureEventPayload =
  OrderSwapOnChainFailureEventPayload;

export type OrderSwapCancelOnChainFailureEvent = DomainEventMinimal<
  OrderSwapCancelOnChainFailureEventPayload,
  typeof eventType,
  typeof cancelOnChainFailureEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__FAILURE;

export const cancelOnChainFailureEventVersion = 1;
