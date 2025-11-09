import { core } from '~/redux/api';
import { SignedTransaction, WalletAccount } from '~/redux/api/core';

export enum TransactionEndpoints {
  // order swap
  OPEN_SWAP_ORDER = 'openSwapOrder',
  FILL_SWAP_ORDERS = 'fillSwapOrders',
  CANCEL_SWAP_ORDER = 'cancelSwapOrder',
  // two-way order (SLV)
  PLACE_TWO_WAY_ORDER = 'placeTwoWayOrder',
  FILL_TWO_WAY_ORDER = 'fillTwoWayOrder',
  CANCEL_TWO_WAY_ORDER = 'cancelTwoWayOrder',
  // order sale
  OPEN_SALE_ORDER = 'openSaleOrder',
  CANCEL_SALE_ORDER = 'cancelSaleOrder',
  // stake vault
  CREATE_STAKE_VAULT = 'createStakeVault',
  UNSTAKE_STAKE_VAULT = 'unstakeStakeVault',
  // yield farming
  YIELD_FARMING_REWARDS_CLAIM = 'yieldFarmingRewardsClaim',

  // options
  CREATE_OPTION = 'createOption',
  RETRIEVE_OPTION = 'retrieveOption',
  EXECUTE_OPTION = 'executeOption',

  // smart vault
  OPEN_SMART_VAULT = 'smartVaultOpen',
  WITHDRAW_SMART_VAULT = 'smartVaultWithdraw',
  DEPOSIT_SMART_VAULT = 'smartVaultDeposit',
  CLOSE_SMART_VAULT = 'smartVaultClose',
}

export const transactionEventTypes: TransactionEventTypes = {
  // order swap
  OPEN_SWAP_ORDER: 'orderSwapEvent',
  FILL_SWAP_ORDERS: 'orderSwapEvent',
  CANCEL_SWAP_ORDER: 'orderSwapEvent',
  // two-way order (SLV)
  PLACE_TWO_WAY_ORDER: 'twoWayOrderEvent',
  FILL_TWO_WAY_ORDER: 'twoWayOrderEvent',
  CANCEL_TWO_WAY_ORDER: 'twoWayOrderEvent',
  // order sale
  OPEN_SALE_ORDER: 'orderSaleEvent',
  CANCEL_SALE_ORDER: 'orderSaleEvent',
  // stake vault
  CREATE_STAKE_VAULT: 'stakeVaultEvent',
  UNSTAKE_STAKE_VAULT: 'stakeVaultEvent',
  // yield farming
  YIELD_FARMING_REWARDS_CLAIM: 'yieldFarmingEvent',

  // option
  CREATE_OPTION: 'optionEvent',
  RETRIEVE_OPTION: 'optionEvent',
  EXECUTE_OPTION: 'optionEvent',

  // smart vault
  OPEN_SMART_VAULT: 'smartVaultEvent',
  WITHDRAW_SMART_VAULT: 'smartVaultEvent',
  DEPOSIT_SMART_VAULT: 'smartVaultEvent',
  CLOSE_SMART_VAULT: 'smartVaultEvent',
};

export const getTransactionEventTypeFromOperationName = (
  operationName: TransactionEndpoints,
): SignedTransaction['eventType'] =>
  transactionEventTypes[
    Object.keys(TransactionEndpoints)[
      Object.values(TransactionEndpoints).indexOf(operationName)
    ]
  ];

interface TransactionEventTypes {
  [key: string]: SignedTransaction['eventType'];
}

type Endpoints = typeof core.endpoints;

type EndpointApiArgs<T extends TransactionEndpoints = TransactionEndpoints> = Parameters<
  Endpoints[T]['initiate']
>[0];

/**
 * This generic strips out the `WalletAccount` from the payload, so that the client
 * consuming this code does not have to provide it.
 * For example, this changes `core.endpoints.openSaleOrder` from requiring
 * { orderId, cancelSaleOrder: { walletAddress, collateralUtxo }
 * To
 * { orderId, cancelSaleOrder: {}
 * Which is then used as types for `CreateSignSubmitTransactionRequestPayload`
 *
 * Unfortunately TypeScript is not able to infer these types in a general manner,
 * so for every new endpoint we want to add we need to add another conditional case below.
 */
type WalletAttributes = keyof WalletAccount;
export type TransactionEndpointsData<
  T extends TransactionEndpoints = TransactionEndpoints,
> = T extends TransactionEndpoints.OPEN_SALE_ORDER
  ? /**
     * At this point we have inferred that T is OPEN_SALE_ORDER.
     * We want to construct a new type that is stripped of `WalletAttributes`
     * To avoid merging `openSaleOrder` type incorrectly, we need to omit the
     * attribute, and then re-define it with the `WalletAttributes` omitted.
     */
    Omit<EndpointApiArgs<T>, 'openSaleOrder'> & {
      ['openSaleOrder']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.CANCEL_SALE_ORDER
  ? Omit<EndpointApiArgs<T>, 'cancelSaleOrder'> & {
      ['cancelSaleOrder']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.OPEN_SWAP_ORDER
  ? Omit<EndpointApiArgs<T>, 'openSwapOrder'> & {
      ['openSwapOrder']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.FILL_SWAP_ORDERS
  ? Omit<EndpointApiArgs<T>, 'fillSwapOrders'> & {
      ['fillSwapOrders']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.CANCEL_SWAP_ORDER
  ? Omit<EndpointApiArgs<T>, 'cancelSwapOrder'> & {
      ['cancelSwapOrder']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.PLACE_TWO_WAY_ORDER
  ? Omit<EndpointApiArgs<T>, 'twoWayOrderPlace'> & {
      ['twoWayOrderPlace']: Omit<
        EndpointApiArgs<T>['twoWayOrderPlace'],
        WalletAttributes
      >;
    }
  : T extends TransactionEndpoints.FILL_TWO_WAY_ORDER
  ? Omit<EndpointApiArgs<T>, 'twoWayOrderFill'> & {
      ['twoWayOrderFill']: Omit<EndpointApiArgs<T>['twoWayOrderFill'], WalletAttributes>;
    }
  : T extends TransactionEndpoints.CANCEL_TWO_WAY_ORDER
  ? Omit<EndpointApiArgs<T>, 'twoWayOrderCancel'> & {
      ['twoWayOrderCancel']: Omit<
        EndpointApiArgs<T>['twoWayOrderCancel'],
        WalletAttributes
      >;
    }
  : T extends TransactionEndpoints.CREATE_STAKE_VAULT
  ? Omit<EndpointApiArgs<T>, 'createStakeVault'> & {
      ['createStakeVault']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.UNSTAKE_STAKE_VAULT
  ? Omit<EndpointApiArgs<T>, 'unstakeStakeVault'> & {
      ['unstakeStakeVault']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.YIELD_FARMING_REWARDS_CLAIM
  ? Omit<EndpointApiArgs<T>, 'yieldFarmingRewardsClaim'> & {
      ['yieldFarmingRewardsClaim']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.CREATE_OPTION
  ? Omit<EndpointApiArgs<T>, 'createOption'> & {
      ['createOption']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.RETRIEVE_OPTION
  ? Omit<EndpointApiArgs<T>, 'retrieveOption'> & {
      ['retrieveOption']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.EXECUTE_OPTION
  ? Omit<EndpointApiArgs<T>, 'executeOption'> & {
      ['executeOption']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.OPEN_SMART_VAULT
  ? Omit<EndpointApiArgs<T>, 'smartVaultOpen'> & {
      ['smartVaultOpen']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.WITHDRAW_SMART_VAULT
  ? Omit<EndpointApiArgs<T>, 'smartVaultWithdraw'> & {
      ['smartVaultWithdraw']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.DEPOSIT_SMART_VAULT
  ? Omit<EndpointApiArgs<T>, 'smartVaultDeposit'> & {
      ['smartVaultDeposit']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : T extends TransactionEndpoints.CLOSE_SMART_VAULT
  ? Omit<EndpointApiArgs<T>, 'smartVaultClose'> & {
      ['smartVaultClose']: Omit<EndpointApiArgs<T>[T], WalletAttributes>;
    }
  : never;
