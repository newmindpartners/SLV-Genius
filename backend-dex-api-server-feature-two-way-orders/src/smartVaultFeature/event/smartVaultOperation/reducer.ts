import {injectable} from 'tsyringe';
import {AbstractReducer} from '~/domain/events/reducer';

import * as Private from '~/domain/models/private';
import {SmartVaultEvent, SmartVaultEventTypes} from '../types';
import {SmartVaultOperationAggregate} from './types';

@injectable()
export class SmartVaultOperationReducer extends AbstractReducer<
  SmartVaultOperationAggregate,
  SmartVaultEvent
> {
  protected getInitialState(
    smartVaultId: string
  ): SmartVaultOperationAggregate {
    return {
      smartVaultId,
      smartVaultOperations: [],
    };
  }

  protected handleEventAndReduce = (
    smartVaultOperations: SmartVaultOperationAggregate,
    event: SmartVaultEvent
  ): SmartVaultOperationAggregate => {
    switch (event.eventType) {
      case SmartVaultEventTypes.SMART_VAULT__DEPOSIT_INIT__REQUEST:
      case SmartVaultEventTypes.SMART_VAULT__DEPOSIT_INIT__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__DEPOSIT_INIT__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__DEPOSIT_SUBMIT__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__DEPOSIT_SUBMIT__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__DEPOSIT_ONCHAIN__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__DEPOSIT_ONCHAIN__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__WITHDRAW_INIT__REQUEST:
      case SmartVaultEventTypes.SMART_VAULT__WITHDRAW_INIT__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__WITHDRAW_INIT__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__WITHDRAW_SUBMIT__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__WITHDRAW_SUBMIT__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__WITHDRAW_ONCHAIN__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__WITHDRAW_ONCHAIN__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__REQUEST:
      case SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__FAILURE:
        return smartVaultOperations;
      case SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__SUCCESS: {
        return {
          ...smartVaultOperations,
          smartVaultOperations: event.eventPayload.depositAssets.map(
            depositAsset => ({
              operationType: Private.SmartVaultOperationType.DEPOSIT,
              status: Private.SmartVaultOperationStatus.PENDING,
              assetId: depositAsset.assetId,
              assetAmount: BigInt(depositAsset.assetAmount),
              creatorStakeKeyHash: event.eventPayload.creatorStakeKeyHash,
              mintAssetId: event.eventPayload.mintAssetId,
              transactionHash: event.transactionHash,
            })
          ),
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__OPEN_SUBMIT__SUCCESS:
        return smartVaultOperations;
      case SmartVaultEventTypes.SMART_VAULT__OPEN_SUBMIT__FAILURE:
        return smartVaultOperations;
      case SmartVaultEventTypes.SMART_VAULT__OPEN_ONCHAIN__SUCCESS: {
        return {
          ...smartVaultOperations,
          smartVaultOperations: smartVaultOperations.smartVaultOperations.map(
            operation =>
              operation.transactionHash === event.transactionHash
                ? {
                    ...operation,
                    status: Private.SmartVaultOperationStatus.CONFIRMED,
                    transactionDate: event.eventPayload.transactionDateOpen,
                  }
                : operation
          ),
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__OPEN_ONCHAIN__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__REQUEST:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_SUBMIT__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_SUBMIT__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_ONCHAIN__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_ONCHAIN__FAILURE:
        return smartVaultOperations;
    }
  };
}
