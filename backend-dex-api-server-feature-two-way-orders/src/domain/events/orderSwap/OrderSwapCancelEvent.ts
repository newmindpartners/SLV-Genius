import {OrderSwapCancelInitRequestEvent} from './OrderSwapCancelInitRequestEvent';
import {OrderSwapCancelInitSuccessEvent} from './OrderSwapCancelInitSuccessEvent';
import {OrderSwapCancelSubmitSuccessEvent} from './OrderSwapCancelSubmitSuccessEvent';
import {
  OrderSwapCancelOnChainSuccessEvent,
  OrderSwapCancelOnChainSuccessEventV1,
} from './OrderSwapCancelOnChainSuccessEvent';
import {OrderSwapCancelOnChainFailureEvent} from './OrderSwapCancelOnChainFailureEvent';
import {OrderSwapCancelInitFailureEvent} from './OrderSwapCancelInitFailureEvent';
import {OrderSwapCancelSubmitFailureEvent} from './OrderSwapCancelSubmitFailureEvent';

export type OrderSwapCancelEvent =
  | OrderSwapCancelInitRequestEvent
  | OrderSwapCancelInitSuccessEvent
  | OrderSwapCancelInitFailureEvent
  | OrderSwapCancelSubmitSuccessEvent
  | OrderSwapCancelSubmitFailureEvent
  | OrderSwapCancelOnChainSuccessEventV1
  | OrderSwapCancelOnChainSuccessEvent
  | OrderSwapCancelOnChainFailureEvent;
