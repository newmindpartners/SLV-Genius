import {DomainEventTransaction} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Private from '~/domain/models/private';

export type OrderSwapCancelSubmitFailureEventPayload =
  Private.OrderSwapReference & Private.ErrorCodeReason;

export type OrderSwapCancelSubmitFailureEvent = DomainEventTransaction<
  OrderSwapCancelSubmitFailureEventPayload,
  typeof eventType,
  typeof cancelSubmitFailureEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__CANCEL_SUBMIT__FAILURE;

export const cancelSubmitFailureEventVersion = 1;
