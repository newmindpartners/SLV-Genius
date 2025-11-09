import * as Private from '~/domain/models/private';
import {
  DomainEventMinimal,
  DomainEventTransaction,
  DomainEventTransactionOnChain,
  EventTypes,
} from '~/domain/events';

export type SmartVaultOpenEvent =
  | SmartVaultOpenInitRequestEvent
  | SmartVaultOpenInitFailureEvent
  | SmartVaultOpenInitSuccessEvent
  | SmartVaultOpenSubmitSuccessEvent
  | SmartVaultOpenSubmitFailureEvent
  | SmartVaultOpenOnChainSuccessEvent
  | SmartVaultOpenOnChainFailureEvent;

export type SmartVaultOpenInitRequestEvent = DomainEventMinimal<
  Pick<Private.SmartVault, 'smartVaultId' | 'smartVaultStrategyId'> & {
    creatorStakeKeyHash: string;
    depositAssets: {
      assetId: string;
      assetAmount: string;
    }[];
    smartVaultStrategyConfigJson: string;
  },
  typeof EventTypes.SMART_VAULT__OPEN_INIT__REQUEST,
  1
>;

export type SmartVaultOpenInitFailureEvent = DomainEventMinimal<
  Private.ErrorCodeReason<string>,
  typeof EventTypes.SMART_VAULT__OPEN_INIT__FAILURE,
  1
>;

export type SmartVaultOpenInitSuccessEvent = DomainEventTransaction<
  Pick<Private.SmartVault, 'smartVaultId' | 'mintAssetId'> & {
    creatorStakeKeyHash: string;
    depositAssets: {
      assetId: string;
      assetAmount: string;
    }[];
  },
  typeof EventTypes.SMART_VAULT__OPEN_INIT__SUCCESS,
  1
>;

export type SmartVaultOpenSubmitSuccessEvent = DomainEventTransaction<
  Pick<
    Private.SmartVault,
    // TODO: Add when available: stakeKeyHashRef
    'smartVaultId' | 'utxoReferenceTransactionHash'
  >,
  typeof EventTypes.SMART_VAULT__OPEN_SUBMIT__SUCCESS,
  1
>;

export type SmartVaultOpenSubmitFailureEvent = DomainEventTransaction<
  Pick<Private.SmartVault, 'smartVaultId'> & Private.ErrorCodeReason,
  typeof EventTypes.SMART_VAULT__OPEN_SUBMIT__FAILURE,
  1
>;

export type SmartVaultOpenOnChainSuccessEvent = DomainEventTransactionOnChain<
  Pick<
    Private.SmartVault,
    | 'creatorStakeKeyHash'
    | 'mintAssetId'
    | 'transactionDateOpen'
    | 'utxoReferenceTransactionHash'
    | 'utxoReferenceIndex'
  > & {
    depositAssets: {
      assetId: string;
      assetAmount: string;
    }[];
  },
  typeof EventTypes.SMART_VAULT__OPEN_ONCHAIN__SUCCESS,
  1
>;

export type SmartVaultOpenOnChainFailureEvent = DomainEventTransactionOnChain<
  {},
  typeof EventTypes.SMART_VAULT__OPEN_ONCHAIN__FAILURE,
  1
>;
