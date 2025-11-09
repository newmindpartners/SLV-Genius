import {OrderSwapFinalFillOnChainFailureEvent} from './OrderSwapFinalFillOnChainFailureEvent';
import {
  OrderSwapFinalFillOnChainSuccessEvent,
  OrderSwapFinalFillOnChainSuccessEventV1,
} from './OrderSwapFinalFillOnChainSuccessEvent';

export type OrderSwapFinalFillEvent =
  | OrderSwapFinalFillOnChainSuccessEventV1
  | OrderSwapFinalFillOnChainSuccessEvent
  | OrderSwapFinalFillOnChainFailureEvent;
