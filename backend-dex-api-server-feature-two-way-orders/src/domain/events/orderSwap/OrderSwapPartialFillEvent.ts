import {OrderSwapPartialFillOnChainFailureEvent} from './OrderSwapPartialFillOnChainFailureEvent';
import {
  OrderSwapPartialFillOnChainSuccessEvent,
  OrderSwapPartialFillOnChainSuccessEventV1,
} from './OrderSwapPartialFillOnChainSuccessEvent';

export type OrderSwapPartialFillEvent =
  | OrderSwapPartialFillOnChainSuccessEventV1
  | OrderSwapPartialFillOnChainSuccessEvent
  | OrderSwapPartialFillOnChainFailureEvent;
