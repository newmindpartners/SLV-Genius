import {
  DomainEventMinimal,
  DomainEventTransaction,
  DomainEventTransactionOnChain,
  EventTypes,
} from '~/domain/events';
import {Hex} from '~/domain/models/cardano';
import * as Private from '~/domain/models/private';

export type SmartVaultWithdrawEvent =
  | SmartVaultWithdrawInitRequestEvent
  | SmartVaultWithdrawInitFailureEvent
  | SmartVaultWithdrawInitSuccessEvent
  | SmartVaultWithdrawSubmitSuccessEvent
  | SmartVaultWithdrawSubmitFailureEvent
  | SmartVaultWithdrawOnChainSuccessEvent
  | SmartVaultWithdrawOnchainFailureEvent;

// TODO: We should pick from a large type to handle versioning of these events
export type SmartVaultWithdrawInitRequestEvent = DomainEventMinimal<
  Pick<Private.SmartVault, 'smartVaultId' | 'creatorStakeKeyHash'> & {
    withdrawAssets: {
      assetId: string;
      assetAmount: string;
    }[];
  },
  typeof EventTypes.SMART_VAULT__WITHDRAW_INIT__REQUEST,
  1
>;

export type SmartVaultWithdrawInitSuccessEvent = DomainEventTransaction<
  Pick<Private.SmartVault, 'smartVaultId' | 'creatorStakeKeyHash'> & {
    utxoReferenceTransactionHash: Hex;
    utxoReferenceIndex: number;
  },
  typeof EventTypes.SMART_VAULT__WITHDRAW_INIT__SUCCESS,
  1
>;

export type SmartVaultWithdrawInitFailureEvent = DomainEventMinimal<
  Pick<Private.SmartVault, 'smartVaultId' | 'creatorStakeKeyHash'> &
    Private.ErrorCodeReason<string>,
  typeof EventTypes.SMART_VAULT__WITHDRAW_INIT__FAILURE,
  1
>;

export type SmartVaultWithdrawSubmitSuccessEvent = DomainEventTransaction<
  Private.SmartVaultReference,
  typeof EventTypes.SMART_VAULT__WITHDRAW_SUBMIT__SUCCESS,
  1
>;

export type SmartVaultWithdrawSubmitFailureEvent = DomainEventTransaction<
  Private.SmartVaultReference & Private.ErrorCodeReason,
  typeof EventTypes.SMART_VAULT__WITHDRAW_SUBMIT__FAILURE,
  1
>;

export type SmartVaultWithdrawOnChainSuccessEvent =
  DomainEventTransactionOnChain<
    {},
    typeof EventTypes.SMART_VAULT__WITHDRAW_ONCHAIN__SUCCESS,
    1
  >;

export type SmartVaultWithdrawOnchainFailureEvent =
  DomainEventTransactionOnChain<
    {},
    typeof EventTypes.SMART_VAULT__WITHDRAW_ONCHAIN__FAILURE,
    1
  >;
