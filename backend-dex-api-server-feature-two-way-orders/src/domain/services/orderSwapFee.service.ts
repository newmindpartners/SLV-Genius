import {injectable, singleton} from 'tsyringe';
import * as Private from '~/domain/models/private';
import {plus} from '../utils/math.util';

export interface OrderSwapFeeService {
  calculateOrderSwapMakerTotalFeesAmount(
    orderSwapMakerAndTransactionFees: Private.OrderSwapMakerFeesTransactionFeeAndDeposit
  ): string;

  calculateOrderSwapTakerTotalFeesAmount(
    orderSwapTakerAndTransactionFees: Private.OrderSwapTakerFeesTransactionFee
  ): string;
}

@singleton()
@injectable()
export class OrderSwapFeeServiceImplementation implements OrderSwapFeeService {
  calculateOrderSwapMakerTotalFeesAmount = ({
    makerLovelaceFlatFeeAmount,
    transactionFeeAmount,
  }: Private.OrderSwapMakerFeesTransactionFee) =>
    plus(makerLovelaceFlatFeeAmount, transactionFeeAmount).toString();

  calculateOrderSwapTakerTotalFeesAmount = ({
    takerLovelaceFlatFeeAmount,
    transactionFeeAmount,
  }: Private.OrderSwapTakerFeesTransactionFee) =>
    plus(takerLovelaceFlatFeeAmount, transactionFeeAmount).toString();
}
