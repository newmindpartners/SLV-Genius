import * as Private from '~/domain/models/private';
import {
  DomainEventMinimal,
  DomainEventTransaction,
  DomainEventTransactionOnChain,
  EventTypes,
} from '~/domain/events';

export type SmartVaultDepositEvent =
  | SmartVaultDepositInitRequestEvent
  | SmartVaultDepositInitFailureEvent
  | SmartVaultDepositInitSuccessEvent
  | SmartVaultDepositSubmitSuccessEvent
  | SmartVaultDepositSubmitFailureEvent
  | SmartVaultDepositOnChainSuccessEvent
  | SmartVaultDepositOnchainFailureEvent;

export type SmartVaultDepositInitRequestEvent = DomainEventMinimal<
  Pick<Private.SmartVault, 'smartVaultId' | 'creatorStakeKeyHash'> & {
    depositAssets: {
      assetId: string;
      assetAmount: string;
    }[];
  },
  typeof EventTypes.SMART_VAULT__DEPOSIT_INIT__REQUEST,
  1
>;

export type SmartVaultDepositInitFailureEvent = DomainEventMinimal<
  {
    errorReason: string;
  },
  typeof EventTypes.SMART_VAULT__DEPOSIT_INIT__FAILURE,
  1
>;

export type SmartVaultDepositInitSuccessEvent = DomainEventTransaction<
  {},
  typeof EventTypes.SMART_VAULT__DEPOSIT_INIT__SUCCESS,
  1
>;

export type SmartVaultDepositSubmitSuccessEvent = DomainEventTransaction<
  {},
  typeof EventTypes.SMART_VAULT__DEPOSIT_SUBMIT__SUCCESS,
  1
>;

export type SmartVaultDepositSubmitFailureEvent = DomainEventTransaction<
  {},
  typeof EventTypes.SMART_VAULT__DEPOSIT_SUBMIT__FAILURE,
  1
>;

export type SmartVaultDepositOnChainSuccessEvent =
  DomainEventTransactionOnChain<
    {},
    typeof EventTypes.SMART_VAULT__DEPOSIT_ONCHAIN__SUCCESS,
    1
  >;

export type SmartVaultDepositOnchainFailureEvent =
  DomainEventTransactionOnChain<
    {},
    typeof EventTypes.SMART_VAULT__DEPOSIT_ONCHAIN__FAILURE,
    1
  >;
