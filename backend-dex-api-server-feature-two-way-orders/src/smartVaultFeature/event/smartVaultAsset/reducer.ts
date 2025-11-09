import {injectable} from 'tsyringe';
import {AbstractReducer} from '~/domain/events/reducer';

import {SmartVaultEvent, SmartVaultEventTypes} from '../types';
import {SmartVaultAssetAggregate} from './types';

@injectable()
export class SmartVaultAssetReducer extends AbstractReducer<
  SmartVaultAssetAggregate,
  SmartVaultEvent
> {
  protected getInitialState(smartVaultId: string): SmartVaultAssetAggregate {
    return {
      smartVaultId,
      smartVaultAssets: [],
    };
  }

  protected handleEventAndReduce = (
    aggregate: SmartVaultAssetAggregate,
    event: SmartVaultEvent
  ): SmartVaultAssetAggregate => {
    switch (event.eventType) {
      case SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__REQUEST: {
        return {
          ...aggregate,
          smartVaultAssets: event.eventPayload.depositAssets.map(
            depositAsset => ({
              assetId: depositAsset.assetId,
            })
          ),
        };
      }
      case SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__OPEN_INIT__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__OPEN_SUBMIT__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__OPEN_SUBMIT__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__OPEN_ONCHAIN__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__OPEN_ONCHAIN__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__REQUEST:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_INIT__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_SUBMIT__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_SUBMIT__FAILURE:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_ONCHAIN__SUCCESS:
      case SmartVaultEventTypes.SMART_VAULT__CLOSE_ONCHAIN__FAILURE:
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
        return aggregate;
    }
  };
}
