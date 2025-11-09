import {
  DomainEventMinimal,
  DomainEventTransaction,
  DomainEventTransactionOnChain,
  EventTypes,
} from '~/domain/events';
import {OnChainFailureErrorDetails} from '~/domain/events/orderSwap/shared/OrderSwapOnChainEvent';
import {Hex} from '~/domain/models/cardano';

import * as Private from '~/domain/models/private';

export type SmartVaultCloseEvent =
  | SmartVaultCloseInitRequestEvent
  | SmartVaultCloseInitFailureEvent
  | SmartVaultCloseInitSuccessEvent
  | SmartVaultCloseSubmitSuccessEvent
  | SmartVaultCloseSubmitFailureEvent
  | SmartVaultCloseOnChainSuccessEvent
  | SmartVaultCloseOnchainFailureEvent;

export type SmartVaultCloseInitRequestEvent = DomainEventMinimal<
  Pick<Private.SmartVault, 'smartVaultId' | 'creatorStakeKeyHash'>,
  typeof EventTypes.SMART_VAULT__CLOSE_INIT__REQUEST,
  1
>;

export type SmartVaultCloseInitSuccessEvent = DomainEventTransaction<
  Pick<Private.SmartVault, 'smartVaultId' | 'creatorStakeKeyHash'> & {
    utxoReferenceTransactionHash: Hex;
    utxoReferenceIndex: number;
  },
  typeof EventTypes.SMART_VAULT__CLOSE_INIT__SUCCESS,
  1
>;

export type SmartVaultCloseInitFailureEvent = DomainEventMinimal<
  Pick<Private.SmartVault, 'smartVaultId' | 'creatorStakeKeyHash'> &
    Private.ErrorCodeReason<string>,
  typeof EventTypes.SMART_VAULT__CLOSE_INIT__FAILURE,
  1
>;

export type SmartVaultCloseSubmitSuccessEvent = DomainEventTransaction<
  Private.SmartVaultReference,
  typeof EventTypes.SMART_VAULT__CLOSE_SUBMIT__SUCCESS,
  1
>;

export type SmartVaultCloseSubmitFailureEvent = DomainEventTransaction<
  Private.SmartVaultReference & Private.ErrorCodeReason,
  typeof EventTypes.SMART_VAULT__CLOSE_SUBMIT__FAILURE,
  1
>;

export type SmartVaultCloseOnChainSuccessEvent = DomainEventTransactionOnChain<
  Pick<
    Private.SmartVault,
    | 'smartVaultId'
    | 'creatorStakeKeyHash'
    | 'mintAssetId'
    | 'transactionDateClose'
  > &
    Private.TransactionFee,
  typeof EventTypes.SMART_VAULT__CLOSE_ONCHAIN__SUCCESS,
  1
>;

export type SmartVaultCloseOnchainFailureEvent = DomainEventTransactionOnChain<
  Pick<Private.SmartVault, 'smartVaultId' | 'creatorStakeKeyHash'> &
    Private.ErrorCodeReason & {
      errorDetails: OnChainFailureErrorDetails;
    },
  typeof EventTypes.SMART_VAULT__CLOSE_ONCHAIN__FAILURE,
  1
>;
