import * as Core from '~/domain/models/core';
import * as Private from '~/domain/models/private';

export interface CoreService {
  // <!-- ASSET --!> //
  getAssetsOnAddresses(
    request: Core.AssetAddresses
  ): Promise<Core.AddressAssets[]>;

  // <!-- TRANSACTION --!> //

  transactionSubmit(
    request: Core.TransactionSubmitRequest
  ): Promise<Core.Transaction>;

  // <!-- SALE --!> //

  orderSaleOpen(
    request: Core.OrderSaleRequest
  ): Promise<Private.UnsignedTransactionSaleOrderOpen & Core.Transaction>;

  orderSaleCancel(
    request: Core.OrderSaleRequest
  ): Promise<Private.UnsignedTransactionSaleOrderCancel & Core.Transaction>;

  orderSaleGetScriptAddress(
    request: Core.OrderSaleGetScriptAddressRequest
  ): Promise<Private.ScriptAddress>;

  // <!-- SWAP --!> //

  orderSwapOpen(
    request: Core.OrderSwapRequest
  ): Promise<Private.UnsignedTransactionSwapOrderOpen & Core.Transaction>;

  orderSwapFill(
    requests: Core.OrderSwapFillRequest
  ): Promise<Private.UnsignedTransactionSwapOrderFill & Core.Transaction>;

  orderSwapMultiFill(
    requests: Core.OrderSwapMultiFillRequest
  ): Promise<Private.UnsignedTransactionSwapOrderFill & Core.Transaction>;

  orderSwapCancel(
    request: Core.OrderSwapRequest
  ): Promise<Private.UnsignedTransactionSwapOrderCancel & Core.Transaction>;

  // <!-- TWO-WAY ORDER --!> //

  twoWayOrderPlace(
    request: Core.TwoWayOrderPlaceRequest
  ): Promise<
    Private.UnsignedTransaction &
      Core.Transaction & {
        depositAmount: string;
        makerLovelaceFlatFeeAmount: string;
        makerFromAssetFeeAmount: string;
        makerFromAssetFeePercent: string;
      }
  >;

  twoWayOrderFill(
    request: Core.TwoWayOrderFillRequest
  ): Promise<Private.UnsignedTransaction & Core.Transaction>;

  twoWayOrderCancel(
    request: Core.TwoWayOrderCancelRequest
  ): Promise<Private.UnsignedTransaction & Core.Transaction>;

  twoWayOrderList(): Promise<unknown[]>;

  // <!-- STAKE --!> //

  stakeVaultCreate(
    request: Core.StakeVaultCreateRequest
  ): Promise<Private.UnsignedTransaction & Core.Transaction>;

  stakingStakeVaultUnstake(
    request: Core.StakingStakeUnstakeRequest
  ): Promise<Private.UnsignedTransaction & Core.Transaction>;

  // <!-- YIELD FARMING --!> //

  yieldFarmingListRewards(
    request: Core.YieldFarmingListRewardsRequest
  ): Promise<Core.YieldFarmingListRewardsResponse>;

  yieldFarmingRewardsClaim(
    request: Core.YieldFarmingRewardsClaimRequest
  ): Promise<Private.UnsignedTransaction>;

  // <!-- OPTIONS --!> //

  createOption(
    request: Core.CreateOption
  ): Promise<Private.UnsignedTransaction>;

  executeOption(
    request: Core.ExecuteOption
  ): Promise<Private.UnsignedTransaction>;

  retrieveOption(
    request: Core.RetrieveOption
  ): Promise<Private.UnsignedTransaction>;
}

export function joinTransactionHashAndOutputIndex(
  transactionHash: string,
  transactionOutputIndex: BigInt
): string {
  return [transactionHash, transactionOutputIndex].join('#');
}
