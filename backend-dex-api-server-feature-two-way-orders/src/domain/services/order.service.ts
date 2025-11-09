import * as Core from '~/domain/models/core';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {div} from '~/domain/utils/math.util';
import {calcUnitMultiplier} from '~/domain/utils/asset.util';

export interface OrderService {
  toCoreOrderSaleOpenRequest(
    adaAsset: Private.Asset,
    walletAccount: Public.WalletAccount,
    orderSaleProject: Private.OrderSaleProject,
    orderSaleProjectRound: Private.OrderSaleProjectRound,
    baseAssetAmount: string
  ): Core.OrderSaleOpenRequest;

  toCoreOrderSaleGetScriptAddressRequest(
    project: Private.OrderSaleProject,
    projectRound: Private.OrderSaleProjectRound,
    adaAsset: Private.Asset
  ): Core.OrderSaleGetScriptAddressRequest;
}

export class OrderServiceImplementation implements OrderService {
  toCoreOrderSaleOpenRequest(
    adaAsset: Private.Asset,
    walletAccount: Public.WalletAccount,
    orderSaleProject: Private.OrderSaleProject,
    orderSaleProjectRound: Private.OrderSaleProjectRound,
    baseAssetAmount: string
  ): Core.OrderSaleOpenRequest {
    const {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = walletAccount;

    const orderSaleRequest = this.toCoreOrderSaleRequestTemplate(
      adaAsset,
      orderSaleProject,
      orderSaleProjectRound
    );

    const {orderBaseAssetMinAllocation} = orderSaleRequest;

    const {
      project: {asset: baseAsset},
    } = orderSaleProject;

    const {priceLovelace} = orderSaleProjectRound;

    const quoteAssetAmount = div(
      Number(priceLovelace || 0),
      calcUnitMultiplier(baseAsset.decimalPrecision)
    );

    return {
      ...orderSaleRequest,

      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,

      quoteAssetAmount: quoteAssetAmount.toString(), // price in `lovelace` for 1 baseAsset
      baseAssetAmount: baseAssetAmount.toString(), // offer (base asset amount to purchase)

      orderBaseAssetMinAllocation: Number(orderBaseAssetMinAllocation),
    };
  }

  toCoreOrderSaleGetScriptAddressRequest(
    orderSaleProject: Private.OrderSaleProject,
    orderSaleProjectRound: Private.OrderSaleProjectRound,
    adaAsset: Private.Asset
  ): Core.OrderSaleGetScriptAddressRequest {
    const {
      baseAssetId,
      baseAssetName,
      baseAssetPolicyId,

      quoteAssetId,
      quoteAssetName,
      quoteAssetPolicyId,

      endDate,
      startDate,
      distributionDate,

      feeAddress,
      feePercent,

      sellerPublicKeyHash,

      orderBaseAssetMinAllocation,
    } = this.toCoreOrderSaleRequestTemplate(
      adaAsset,
      orderSaleProject,
      orderSaleProjectRound
    );

    const {priceLovelace} = orderSaleProjectRound;

    const {
      project: {asset: baseAsset},
    } = orderSaleProject;

    const quoteAssetAmount = div(
      Number(priceLovelace || 0),
      calcUnitMultiplier(baseAsset.decimalPrecision)
    );

    const coreOrderSaleRequest: Core.OrderSaleGetScriptAddressRequest = {
      baseAssetId,
      baseAssetName,
      baseAssetPolicyId,

      quoteAssetId,
      quoteAssetName,
      quoteAssetPolicyId,
      quoteAssetAmount: quoteAssetAmount.toString(), // price in `lovelace` for 1 baseAsset

      endDate,
      startDate,
      distributionDate,

      feePercent,
      feeAddress,

      sellerPublicKeyHash,
      orderBaseAssetMinAllocation: Number(orderBaseAssetMinAllocation),
    };

    return coreOrderSaleRequest;
  }

  private toCoreOrderSaleRequestTemplate(
    adaAsset: Private.Asset,
    orderSaleProject: Private.OrderSaleProject,
    orderSaleProjectRound: Private.OrderSaleProjectRound
  ): Core.OrderSaleRequestTemplate {
    const {
      project: {asset: baseAsset},
    } = orderSaleProject;

    const {endDate, startDate, orderBaseAssetMinAllocation} =
      orderSaleProjectRound;

    const {sellerPublicKeyHash, distributionDate, feeAddress, feePercent} =
      orderSaleProject;

    const {
      assetId: baseAssetId,
      assetName: baseAssetName,
      policyId: baseAssetPolicyId,
    } = baseAsset;

    const quoteAsset = adaAsset;

    const {
      assetId: quoteAssetId,
      assetName: quoteAssetName,
      policyId: quoteAssetPolicyId,
    } = quoteAsset;

    const orderRequest: Core.OrderSaleRequestTemplate = {
      baseAssetId,
      baseAssetName,
      baseAssetPolicyId,

      quoteAssetId,
      quoteAssetName,
      quoteAssetPolicyId,

      endDate: new Date(endDate).toISOString(),
      startDate: new Date(startDate).toISOString(),
      distributionDate: new Date(distributionDate).toISOString(),

      feeAddress,
      feePercent: feePercent.toString(),

      sellerPublicKeyHash,

      orderBaseAssetMinAllocation: Number(orderBaseAssetMinAllocation),
    };

    return orderRequest;
  }
}
