import {injectable} from 'tsyringe';
import {AbstractReducer} from '~/domain/events/reducer';
import * as Private from '~/domain/models/private';

import {SmartVaultEvent, SmartVaultEventTypes} from '../types';
import {SmartVaultAggregate} from './types';

@injectable()
export class SmartVaultReducer extends AbstractReducer<
  SmartVaultAggregate,
  SmartVaultEvent
> {
  protected getInitialState(smartVaultId: string): SmartVaultAggregate {
    return {
      smartVaultId,

      status: Private.SmartVaultStatus.PENDING,
      stakeKeyHashRef: null,
      creatorStakeKeyHash: null,
      mintAssetId: null,

      utxoReferenceTransactionHash: null,
      utxoReferenceIndex: null,

      smartVaultStrategyId: null,
      smartVaultStrategyConfigJson: null,

      transactionDateOpen: null,
      transactionDateClose: null,
    };
  }

  protected handleEventAndReduce = (
    reduction: SmartVaultAggregate,
    event: SmartVaultEvent
  ): SmartVaultAggregate => {
    switch (event.eventType) {
      case SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__REQUEST: {
        return {
          ...reduction,
          status: Private.SmartVaultStatus.PENDING,
          smartVaultStrategyConfigJson:
            event.eventPayload.smartVaultStrategyConfigJson,
          creatorStakeKeyHash: event.eventPayload.creatorStakeKeyHash,
          smartVaultStrategyId: event.eventPayload.smartVaultStrategyId,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__FAILURE: {
        return {
          ...reduction,
          status: Private.SmartVaultStatus.FAILED,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__SUCCESS: {
        return {
          ...reduction,
          mintAssetId: event.eventPayload.mintAssetId,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__OPEN_SUBMIT__SUCCESS: {
        return {
          ...reduction,
          smartVaultId: event.eventPayload.smartVaultId,
          utxoReferenceTransactionHash: event.transactionHash,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__OPEN_SUBMIT__FAILURE: {
        return {
          ...reduction,
          status: Private.SmartVaultStatus.FAILED,
          smartVaultId: event.eventPayload.smartVaultId,
          utxoReferenceTransactionHash: event.transactionHash,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__OPEN_ONCHAIN__SUCCESS: {
        const creatorStakeKeyHash = event.eventPayload.creatorStakeKeyHash;

        return {
          ...reduction,
          status: Private.SmartVaultStatus.OPEN,
          creatorStakeKeyHash,
          // TODO: Temporary until we know how to track smart vault
          stakeKeyHashRef: creatorStakeKeyHash,
          mintAssetId: event.eventPayload.mintAssetId,
          transactionDateOpen: event.eventPayload.transactionDateOpen,
          utxoReferenceTransactionHash:
            event.eventPayload.utxoReferenceTransactionHash,
          utxoReferenceIndex: event.eventPayload.utxoReferenceIndex,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__OPEN_ONCHAIN__FAILURE: {
        return {
          ...reduction,
          status: Private.SmartVaultStatus.FAILED,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__REQUEST: {
        return {
          ...reduction,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__FAILURE: {
        return {
          ...reduction,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__SUCCESS: {
        return {
          ...reduction,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_SUBMIT__SUCCESS: {
        return {
          ...reduction,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_SUBMIT__FAILURE: {
        return {
          ...reduction,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_ONCHAIN__SUCCESS: {
        return {
          ...reduction,
          status: Private.SmartVaultStatus.CLOSED,
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_ONCHAIN__FAILURE: {
        return {
          ...reduction,
          status: Private.SmartVaultStatus.OPEN,
        };
      }
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
        return reduction;
    }
  };
}
