import {inject, injectable, singleton} from 'tsyringe';

import {
  AbstractEventStreamListener,
  EventStreamProjection,
  EventTypes,
} from '~/domain/events';

import {LoggerService} from '~/domain/services';

@singleton()
@injectable()
export class DomainEventListenerProjections extends AbstractEventStreamListener {
  constructor(
    @inject('LoggerService')
    readonly loggerService: LoggerService,

    @inject('OrderSwapEventProjection')
    private readonly orderSwapEventProjection: EventStreamProjection,

    @inject('OrderSwapFillEventProjection')
    private readonly orderSwapFillEventProjection: EventStreamProjection,

    @inject('NoOpProjection')
    private readonly noOpProjection: EventStreamProjection,

    @inject('SmartVaultProjection')
    private readonly smartVaultProjection: EventStreamProjection,

    @inject('SmartVaultAssetProjection')
    private readonly smartVaultAssetProjection: EventStreamProjection,

    @inject('SmartVaultOperationProjection')
    private readonly smartVaultOperationProjection: EventStreamProjection
  ) {
    /**
     * Do NOT project events before submission
     * User events for the same amounts in short succession
     * can result in duplicate order creation (same txHash / mintAssetId)
     */
    super(loggerService, {
      // OPEN PRODUCER
      [EventTypes.ORDER_SWAP__OPEN_INIT__REQUEST]: [noOpProjection], // DO NOT PROJECT
      [EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS]: [noOpProjection], // DO NOT PROJECT
      [EventTypes.ORDER_SWAP__OPEN_INIT__FAILURE]: [noOpProjection], // DO NOT PROJECT
      [EventTypes.ORDER_SWAP__OPEN_SUBMIT__SUCCESS]: [orderSwapEventProjection],
      [EventTypes.ORDER_SWAP__OPEN_SUBMIT__FAILURE]: [orderSwapEventProjection],
      [EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS]: [
        orderSwapEventProjection,
      ],
      [EventTypes.ORDER_SWAP__OPEN_ONCHAIN__FAILURE]: [
        orderSwapEventProjection,
      ],

      // FILL PRODUCER
      [EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS]: [
        orderSwapEventProjection,
        orderSwapFillEventProjection,
      ],
      [EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE]: [
        orderSwapEventProjection,
      ],
      [EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS]: [
        orderSwapEventProjection,
        orderSwapFillEventProjection,
      ],
      [EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE]: [
        orderSwapEventProjection,
      ],

      // FILL CONSUMER
      [EventTypes.ORDER_SWAP__FILL_INIT__REQUEST]: [noOpProjection],
      [EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS]: [noOpProjection],
      [EventTypes.ORDER_SWAP__FILL_INIT__FAILURE]: [noOpProjection],
      [EventTypes.ORDER_SWAP__FILL_SUBMIT__SUCCESS]: [orderSwapEventProjection],
      [EventTypes.ORDER_SWAP__FILL_SUBMIT__FAILURE]: [orderSwapEventProjection],
      [EventTypes.ORDER_SWAP__FILL_ONCHAIN__SUCCESS]: [
        orderSwapEventProjection,
      ],
      [EventTypes.ORDER_SWAP__FILL_ONCHAIN__FAILURE]: [
        orderSwapEventProjection,
      ],

      // Cancel
      [EventTypes.ORDER_SWAP__CANCEL_INIT__REQUEST]: [noOpProjection],
      [EventTypes.ORDER_SWAP__CANCEL_INIT__SUCCESS]: [noOpProjection],
      [EventTypes.ORDER_SWAP__CANCEL_INIT__FAILURE]: [orderSwapEventProjection],
      [EventTypes.ORDER_SWAP__CANCEL_SUBMIT__SUCCESS]: [
        orderSwapEventProjection,
      ],
      [EventTypes.ORDER_SWAP__CANCEL_SUBMIT__FAILURE]: [noOpProjection],
      [EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS]: [
        orderSwapEventProjection,
      ],
      [EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__FAILURE]: [
        orderSwapEventProjection,
      ],

      [EventTypes.SMART_VAULT__OPEN_INIT__REQUEST]: [
        smartVaultProjection,
        smartVaultAssetProjection,
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__OPEN_INIT__FAILURE]: [
        smartVaultProjection,
        smartVaultAssetProjection,
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__OPEN_INIT__REQUEST]: [
        smartVaultProjection,
        smartVaultAssetProjection,
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__OPEN_INIT__SUCCESS]: [
        smartVaultProjection,
        smartVaultAssetProjection,
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__OPEN_SUBMIT__FAILURE]: [
        smartVaultProjection,
        smartVaultAssetProjection,
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__OPEN_SUBMIT__SUCCESS]: [
        smartVaultProjection,
        smartVaultAssetProjection,
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__OPEN_ONCHAIN__FAILURE]: [
        smartVaultProjection,
        smartVaultAssetProjection,
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__OPEN_ONCHAIN__SUCCESS]: [
        smartVaultProjection,
        smartVaultAssetProjection,
        smartVaultOperationProjection,
      ],

      [EventTypes.SMART_VAULT__DEPOSIT_INIT__REQUEST]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__DEPOSIT_INIT__FAILURE]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__DEPOSIT_INIT__REQUEST]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__DEPOSIT_INIT__SUCCESS]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__DEPOSIT_SUBMIT__FAILURE]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__DEPOSIT_SUBMIT__SUCCESS]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__DEPOSIT_ONCHAIN__FAILURE]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__DEPOSIT_ONCHAIN__SUCCESS]: [
        smartVaultOperationProjection,
      ],

      [EventTypes.SMART_VAULT__WITHDRAW_INIT__REQUEST]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__WITHDRAW_INIT__SUCCESS]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__WITHDRAW_INIT__FAILURE]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__WITHDRAW_SUBMIT__SUCCESS]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__WITHDRAW_SUBMIT__FAILURE]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__WITHDRAW_ONCHAIN__FAILURE]: [
        smartVaultOperationProjection,
      ],
      [EventTypes.SMART_VAULT__WITHDRAW_ONCHAIN__SUCCESS]: [
        smartVaultOperationProjection,
      ],

      [EventTypes.SMART_VAULT__CLOSE_INIT__REQUEST]: [smartVaultProjection],
      [EventTypes.SMART_VAULT__CLOSE_INIT__FAILURE]: [smartVaultProjection],
      [EventTypes.SMART_VAULT__CLOSE_INIT__REQUEST]: [smartVaultProjection],
      [EventTypes.SMART_VAULT__CLOSE_INIT__SUCCESS]: [smartVaultProjection],
      [EventTypes.SMART_VAULT__CLOSE_SUBMIT__FAILURE]: [smartVaultProjection],
      [EventTypes.SMART_VAULT__CLOSE_SUBMIT__SUCCESS]: [smartVaultProjection],
      [EventTypes.SMART_VAULT__CLOSE_ONCHAIN__FAILURE]: [smartVaultProjection],
      [EventTypes.SMART_VAULT__CLOSE_ONCHAIN__SUCCESS]: [smartVaultProjection],
    });
  }
}
