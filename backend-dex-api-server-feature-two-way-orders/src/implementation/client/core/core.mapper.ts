import {first, isEmpty, isUndefined} from 'lodash';

import {randomUUID} from 'crypto';

import {walletAddressHexToBech32} from '~/domain/utils/wallet.util';

import {ErrorCode} from '~/domain/errors/domain.error';

import {Hex} from '~/domain/models/cardano';

import * as Core from '~/domain/models/core';
import * as Private from '~/domain/models/private';
import * as Public from '~/domain/models/public';
import * as CoreServiceModels from '~/implementation/client/core/models';

import {CoreError} from '~/implementation/client/core/core.error';

import {mintToAssetId} from '~/implementation/event/oura/orderSwap/OrderSwapCancelAndFinalFillOuraEventHandler.utils';

export class CoreServiceMapper {
  // -- RESPONSE -- //

  protected toResponseUnsignedTransaction(
    response: CoreServiceModels.AbstractResponseTransaction
  ): Private.UnsignedTransaction & Core.Transaction {
    const pendingTransaction = this.toTransaction(response);
    const unsignedTransaction = this.toUnsignedTransaction(response);

    return {
      ...pendingTransaction,
      ...unsignedTransaction,
    };
  }

  protected toResponseUnsignedTransactionOrderSaleOpen(
    coreResponse: CoreServiceModels.OrderSalePlaceResponse
  ): Private.UnsignedTransactionSaleOrderOpen & Core.Transaction {
    const response = this.toResponseUnsignedTransaction(coreResponse);

    const {tScriptAddress, depositAmount} = coreResponse;
    const scriptAddress = tScriptAddress;

    return {
      ...response,
      scriptAddress,
      transactionFeeDepositAmount: depositAmount.toString(),
    };
  }

  protected toResponseOrderSwapFillUnsignedTransactionTaker(
    coreResponse: CoreServiceModels.OrderSwapFillResponse
  ): Private.UnsignedTransactionSwapOrderFill & Core.Transaction {
    const response = this.toResponseUnsignedTransaction(coreResponse);

    const {
      takerLovelaceFlatFee,
      takerOfferedFeeAmount,
      takerOfferedFeePercent,
      tx_fee: transactionFeeAmount,
    } = coreResponse;

    return {
      ...response,
      takerLovelaceFlatFeeAmount: takerLovelaceFlatFee,
      takerFromAssetFeeAmount: takerOfferedFeeAmount,
      takerFromAssetFeePercent: takerOfferedFeePercent,
      transactionFeeAmount: transactionFeeAmount.toString(),
    };
  }

  protected toResponseOrderSwapOpenUnsignedTransactionMaker(
    coreResponse: CoreServiceModels.OrderSwapOpenResponse
  ): Private.UnsignedTransactionSwapOrderOpen & Core.Transaction {
    const response = this.toResponseUnsignedTransaction(coreResponse);

    const {transactionMint} = response;
    if (1 !== transactionMint.length) {
      throw new CoreError(ErrorCode.ORDER__MINT_ASSET_MISMATCH_ONE_EXPECTED);
    }

    const {
      depositAmount,
      makerLovelaceFlatFee,
      makerOfferedFeeAmount,
      makerOfferedFeePercent,
    } = coreResponse;

    return {
      ...response,
      depositAmount,
      makerLovelaceFlatFeeAmount: makerLovelaceFlatFee,
      makerFromAssetFeeAmount: makerOfferedFeeAmount,
      makerFromAssetFeePercent: makerOfferedFeePercent,
    };
  }

  protected toResponseOrderScriptAddress<
    T extends CoreServiceModels.ScriptAddressResponse
  >(response: T): Private.ScriptAddress {
    const {tScriptAddress: scriptAddress} = response;

    const orderScriptAddress = {
      scriptAddress,
    };

    return orderScriptAddress;
  }

  // -- REQUEST SALE -- //
  private toRequestOrderSale(
    request: Core.OrderSaleOpenRequest
  ): CoreServiceModels.OrderSaleRequest {
    const params = this.toRequestOpenOrderSaleParams(request);

    const {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = request;

    const firstCollateralUtxo =
      this.getFirstCollateralUnspentTransactionOutput(collateralUtxo);

    const coreTokenOrderSaleRequest = {
      params,
      collateral: firstCollateralUtxo,
      change: walletAddress,
      usedAddrs: walletUsedAddresses,
      unusedAddrs: walletUnusedAddresses,
    };

    return coreTokenOrderSaleRequest;
  }

  protected toRequestOpenOrderSale(
    request: Core.OrderSaleOpenRequest
  ): CoreServiceModels.OrderSalePlaceRequest {
    const orderRequest = this.toRequestOrderSale(request);

    const {baseAssetAmount: offer, walletUnusedAddresses: unusedAddrs} =
      request;

    const coreTokenOrderSalePlaceRequest = {
      ...orderRequest,
      offer: Number(offer),
      unusedAddrs,
    };

    return coreTokenOrderSalePlaceRequest;
  }

  protected toRequestOpenOrderSaleParams(
    request: Core.OrderSaleGetScriptAddressRequest
  ): CoreServiceModels.OrderSaleParams {
    const {
      feeAddress,
      feePercent,
      baseAssetName,
      baseAssetPolicyId,
      sellerPublicKeyHash: sellerKey,

      quoteAssetAmount,
      orderBaseAssetMinAllocation: minAllocation,

      endDate: endSale,
      startDate: beginSale,
      distributionDate: endDistribution,
    } = request;

    const bech32FeeAddress = walletAddressHexToBech32(feeAddress);

    const token = this.joinTokenByPolicyIdAndAssetName(
      baseAssetPolicyId,
      baseAssetName
    );

    const coreTokenOrderSaleParams = {
      fee: feePercent,
      feeAddress: bech32FeeAddress,
      token: this.gensxAssetFixHack(token),
      sellerKey,
      minAllocation,
      endDistribution,
      price: quoteAssetAmount.toString(),
      endSale: endSale.toString(),
      beginSale: beginSale.toString(),
    };

    return coreTokenOrderSaleParams;
  }

  /**
   * !!! GENSX asset updated from mock token to real token
   * for reward claims has broken LP cancellation
   * Check for new address on order sales and replace with old
   * @HACK
   * @TODO fix, remove
   */
  gensxAssetFixHack = (token: string) => {
    return token ===
      'fbae99b8679369079a7f6f0da14a2cf1c2d6bfd3afdf3a96a64ab67a.0014df1047454e5358'
      ? 'edfba4480f4e2a3e449bd95adee0e3dae8e68328af10171c7a8dd250.0014df1047584c41'
      : token;
  };

  protected toRequestCancelOrderSale(
    request: Core.OrderSaleCancelRequest
  ): CoreServiceModels.OrderSaleCancelRequest {
    const {utxoReference} = request;

    const params = this.toRequestOpenOrderSaleParams(request);

    const {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = request;

    const firstCollateralUtxo =
      this.getFirstCollateralUnspentTransactionOutput(collateralUtxo);

    const coreTokenOrderSaleRequest = {
      params,
      collateral: firstCollateralUtxo,
      change: walletAddress,
      usedAddrs: walletUsedAddresses,
      unusedAddrs: walletUnusedAddresses,
    };

    const coreTokenOrderSaleCancelRequest = {
      ...coreTokenOrderSaleRequest,
      utxoRef: utxoReference,
    };

    return coreTokenOrderSaleCancelRequest;
  }

  // -- REQUEST SWAP -- //
  protected toRequestOpenOrderSwap(
    request: Core.OrderSwapOpenRequest
  ): CoreServiceModels.OrderSwapOpenRequest {
    const params = this.toRequestOpenOrderSwapParams(request);

    const {
      collateralUtxo,
      walletAddress,
      walletRewardAddresses,
      walletUsedAddresses,
      walletUnusedAddresses,
      effectiveFromDate,
      effectiveUntilDate,
    } = request;

    const firstCollateralUtxo =
      this.getFirstCollateralUnspentTransactionOutput(collateralUtxo);

    const coreOrderSwapPlaceRequest = {
      ...params,
      collateral: firstCollateralUtxo,
      change: walletAddress,
      rewardAddrs: walletRewardAddresses,
      usedAddrs: walletUsedAddresses,
      unusedAddrs: walletUnusedAddresses,
      start: effectiveFromDate,
      end: effectiveUntilDate,
    };

    return coreOrderSwapPlaceRequest;
  }

  protected toRequestOpenOrderSwapParams(
    request: Core.OrderSwapOpenRequest
  ): CoreServiceModels.OrderSwapOpenRequestParams {
    const {
      toAssetName,
      toAssetPolicyId,

      fromAssetName,
      fromAssetPolicyId,

      toAssetAmount,
      fromAssetAmount,

      orderVersion,
    } = request;

    const coreOrderSwapPlaceParams = {
      priceToken: toAssetName,
      priceAmount: toAssetAmount,
      priceSymbol: toAssetPolicyId,

      offerToken: fromAssetName,
      offerAmount: fromAssetAmount,
      offerSymbol: fromAssetPolicyId,

      orderVersion,
    };

    return coreOrderSwapPlaceParams;
  }

  protected toRequestFillOrderSwap(
    request: Core.OrderSwapFillRequest
  ): CoreServiceModels.OrderSwapFillRequest {
    const params = this.toRequestFillOrderSwapParams(request);

    const {collateralUtxo, walletAddress, walletUsedAddresses} = request;

    const firstCollateralUtxo =
      this.getFirstCollateralUnspentTransactionOutput(collateralUtxo);

    const coreOrderSwapFillRequest = {
      ...params,
      collateral: firstCollateralUtxo,
      change: walletAddress,
      usedAddrs: walletUsedAddresses,
    };

    return coreOrderSwapFillRequest;
  }

  protected toRequestMultiFillOrderSwap(
    request: Core.OrderSwapMultiFillRequest
  ): CoreServiceModels.OrderSwapMultiFillRequest {
    const {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      utxoRefsWithAmt,
    } = request;

    const firstCollateralUtxo =
      this.getFirstCollateralUnspentTransactionOutput(collateralUtxo);

    const transformedUtxoRefsWithAmt: [string, string][] = utxoRefsWithAmt.map(
      ref => [ref.utxoReference, ref.toAssetAmount]
    );

    const coreOrderSwapMultiFillRequest = {
      collateral: firstCollateralUtxo,
      change: walletAddress,
      usedAddrs: walletUsedAddresses,
      utxoRefsWithAmt: transformedUtxoRefsWithAmt,
    };

    return coreOrderSwapMultiFillRequest;
  }

  protected toRequestFillOrderSwapParams(
    request: Core.OrderSwapFillRequest
  ): CoreServiceModels.OrderSwapFillRequestParams {
    const {utxoReference, toAssetAmount} = request;

    const coreOrderSwapFillParams = {
      utxoRef: utxoReference,
      offerFillAmount: toAssetAmount,
    };

    return coreOrderSwapFillParams;
  }

  protected toRequestCancelOrderSwap(
    request: Core.OrderSwapCancelRequest
  ): CoreServiceModels.OrderSwapCancelRequest {
    const params = this.toParamsCancelOrderSwapParams(request);

    const {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = request;

    const firstCollateralUtxo =
      this.getFirstCollateralUnspentTransactionOutput(collateralUtxo);

    const coreTokenOrderSwapCancelRequest: CoreServiceModels.OrderSwapCancelRequest =
      {
        ...params,
        collateral: firstCollateralUtxo,
        change: walletAddress,
        usedAddrs: walletUsedAddresses,
        unusedAddrs: walletUnusedAddresses,
      };

    return coreTokenOrderSwapCancelRequest;
  }

  // -- REQUEST TWO-WAY ORDER -- //

  protected toRequestTwoWayOrderPlace(
    request: Core.TwoWayOrderPlaceRequest
  ): CoreServiceModels.TwoWayOrderPlaceRequest {
    const {
      collateralUtxo,
      walletAddress,
      walletRewardAddresses,
      walletUsedAddresses,
      walletUnusedAddresses,
      effectiveFromDate,
      effectiveUntilDate,
      straightPrice,
      fromAssetName,
      fromAssetPolicyId,
      fromAssetAmount,
      toAssetName,
      toAssetPolicyId,
      toAssetAmount,
    } = request;

    const firstCollateralUtxo =
      this.getFirstCollateralUnspentTransactionOutput(collateralUtxo);

    return {
      offerToken: fromAssetName,
      offerAmount: fromAssetAmount,
      offerSymbol: fromAssetPolicyId,
      priceToken: toAssetName,
      priceAmount: isUndefined(straightPrice) ? toAssetAmount : '0',
      priceSymbol: toAssetPolicyId,
      collateral: firstCollateralUtxo,
      change: walletAddress,
      rewardAddrs: walletRewardAddresses,
      usedAddrs: walletUsedAddresses,
      unusedAddrs: walletUnusedAddresses,
      start: effectiveFromDate,
      end: effectiveUntilDate,
      straightPrice,
    };
  }

  protected toRequestTwoWayOrderFill(
    request: Core.TwoWayOrderFillRequest
  ): CoreServiceModels.TwoWayOrderFillRequest {
    const {collateralUtxo, walletAddress, walletUsedAddresses, utxoReference} =
      request;

    const firstCollateralUtxo =
      this.getFirstCollateralUnspentTransactionOutput(collateralUtxo);

    return {
      utxoRef: utxoReference,
      collateral: firstCollateralUtxo,
      change: walletAddress,
      usedAddrs: walletUsedAddresses,
    };
  }

  protected toRequestTwoWayOrderCancel(
    request: Core.TwoWayOrderCancelRequest
  ): CoreServiceModels.TwoWayOrderCancelRequest {
    const {collateralUtxo, walletAddress, walletUsedAddresses, utxoReference} =
      request;

    const firstCollateralUtxo =
      this.getFirstCollateralUnspentTransactionOutput(collateralUtxo);

    return {
      utxoRef: utxoReference,
      collateral: firstCollateralUtxo,
      change: walletAddress,
      usedAddrs: walletUsedAddresses,
    };
  }

  protected toParamsCancelOrderSwapParams(
    request: Core.OrderSwapCancelRequest
  ): CoreServiceModels.OrderSwapCancelRequestParams {
    const {utxoReference} = request;

    const coreOrderSwapCancelParams = {
      utxoRef: utxoReference,
    };

    return coreOrderSwapCancelParams;
  }

  // -- REQUEST STAKE VAULT -- //
  protected toRequestOpenStakeVaultOrder(
    request: Core.StakeVaultCreateRequest
  ): CoreServiceModels.StakingStakeStakeRequest {
    const {
      collateralUtxo,
      walletAddress,
      walletUnusedAddresses,
      walletUsedAddresses,

      lockedUntil,
      stakingAssets,
    } = request;

    const value: CoreServiceModels.StakingStakeStakeRequest['value'] =
      stakingAssets.reduce((totalValue, {policyId, assetName, assetAmount}) => {
        const token = this.joinTokenByPolicyIdAndAssetName(policyId, assetName);

        return {
          [token]: assetAmount,
          ...totalValue,
        };
      }, {});

    const firstCollateralUnspentTransactionOutput =
      this.getFirstCollateralUnspentTransactionOutput(collateralUtxo);

    const coreStakingStakeStakeRequest = {
      collateral: firstCollateralUnspentTransactionOutput,

      change: walletAddress,
      usedAddrs: walletUsedAddresses,
      unusedAddrs: walletUnusedAddresses,

      lockedUntil,
      value,
    };

    return coreStakingStakeStakeRequest;
  }

  protected toRequestUnstakeStakeVault(
    request: Core.StakingStakeUnstakeRequest
  ): CoreServiceModels.StakingStakeUnstakeRequest {
    const {
      collateralUtxo,
      walletAddress: change,
      walletUnusedAddresses: unusedAddrs,
      walletUsedAddresses: usedAddrs,
      stakeVaultUtxo: stakeRef,
    } = request;

    const collateral =
      this.getFirstCollateralUnspentTransactionOutput(collateralUtxo);

    const internalCoreRequest: CoreServiceModels.StakingStakeUnstakeRequest = {
      change,
      unusedAddrs,
      usedAddrs,
      collateral,
      stakeRef,
    };

    return internalCoreRequest;
  }

  protected toRequestYieldFarmingListRewards(
    request: Core.YieldFarmingListRewardsRequest
  ): CoreServiceModels.YieldFarmingRewardsRequest {
    const {walletStakeKeyHash} = request;

    return {
      walletStakeKeyHash,
    };
  }

  protected toRequestYieldFarmingRewardsClaim(
    request: Core.YieldFarmingRewardsClaimRequest
  ): CoreServiceModels.YieldFarmingRewardsClaimRequest {
    const {
      walletStakeKeyHash,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = request;

    return {
      walletStakeKeyHash,
      change: walletAddress,
      usedAddrs: walletUsedAddresses,
      unusedAddrs: walletUnusedAddresses,
    };
  }

  protected toResponseStakeVaultUnstake(
    // response: CorePublic.CoreStakingStakeUnstakeResponse
    response: CoreServiceModels.StakingStakeUnstakeResponse
  ): Private.UnsignedTransaction & Core.Transaction {
    const pendingTransaction: Core.Transaction = this.toTransaction(response);
    const unsignedTransaction: Private.UnsignedTransaction =
      this.toUnsignedTransaction(response);

    return {
      ...pendingTransaction,
      ...unsignedTransaction,
    };
  }

  // -- OPTION -- //

  protected toCreateOption(
    option: Public.CreateOptionData,
    wallet: Public.WalletAccount
  ): Core.CreateOption {
    const coreCreateOptionRequestPayload: Core.CreateOption = {
      depositSymbol: option.baseAssetId,
      depositToken: option.baseAssetShortName,
      paymentSymbol: option.quoteAssetId,
      paymentToken: option.quoteAssetShortName,

      amount: Number(option.baseAssetAmount),

      start: new Date().toISOString(),
      end: option.endDate,

      usedAddrs: wallet.walletUsedAddresses,
      change: wallet.walletAddress,
      collateral: wallet.collateralUtxo,

      price: option.baseAssetPrice,
    };

    return coreCreateOptionRequestPayload;
  }

  protected toRetrieveOption(
    wallet: Public.WalletAccount,
    optionUtxo: Public.RetrieveOption['optionUtxoRef'],
    amount: Public.RetrieveOption['optionAmount']
  ): Core.RetrieveOption {
    const coreRetrieveOptionRequestPayload: Core.RetrieveOption = {
      usedAddrs: wallet.walletUsedAddresses,
      change: wallet.walletAddress,
      collateral: wallet.collateralUtxo?.[0],
      ref: optionUtxo,
      amount: amount,
    };

    return coreRetrieveOptionRequestPayload;
  }

  protected toExecuteOption(
    wallet: Public.WalletAccount,
    optionUtxo: Public.ExecuteOption['optionUtxoRef'],
    amount: Public.ExecuteOption['optionAmount']
  ): Core.ExecuteOption {
    const coreExecuteOptionRequestPayload: Core.ExecuteOption = {
      usedAddrs: wallet.walletUsedAddresses,
      change: wallet.walletAddress,
      collateral: wallet.collateralUtxo?.[0],
      ref: optionUtxo,
      amount: amount,
    };

    return coreExecuteOptionRequestPayload;
  }

  protected toRequestCreateOption(
    request: Core.CreateOption
  ): CoreServiceModels.CreateOptionRequest {
    const {
      depositSymbol,
      depositToken,
      paymentSymbol,
      paymentToken,
      price,
      amount,
      start,
      end,

      usedAddrs,
      change,
      collateral,
    } = request;

    const option = {
      depositSymbol,
      depositToken,
      paymentSymbol,
      paymentToken,
      price,
      amount,
    };

    const date = {
      start,
      end,
    };

    const wallet = {
      usedAddrs,
      change,
      collateral: collateral?.[0],
    };

    return {
      ...option,
      ...date,
      ...wallet,
    };
  }

  protected toRequestExecuteOption(
    request: Core.ExecuteOption
  ): CoreServiceModels.ExecuteOptionRequest {
    const {usedAddrs, change, collateral, amount, ref} = request;

    const option = {
      amount: Number(amount),
      ref,
    };

    const wallet = {
      usedAddrs,
      change,
      collateral,
    };

    return {
      ...option,
      ...wallet,
    };
  }

  protected toRequestRetrieveOption(
    request: Core.RetrieveOption
  ): CoreServiceModels.RetrieveOptionRequest {
    const {usedAddrs, change, collateral, amount, ref} = request;

    const option = {
      amount: Number(amount),
      ref,
    };

    const wallet = {
      usedAddrs,
      change,
      collateral,
    };

    return {
      ...option,
      ...wallet,
    };
  }

  // -- TRANSACTION -- //

  protected toTransaction(
    response: CoreServiceModels.Transaction
  ): Core.Transaction {
    const {tx_mints, tx_inputs, tx_outputs} = response;

    const {tx_fee: transactionFeeAmount, tx_hash: transactionHash} = response;

    const transactionMint = tx_mints.map(this.toTransactionMint);
    const transactionInputs = tx_inputs.map(this.toTransactionInput);
    const transactionOutputs = tx_outputs.map(this.toTransactionOutput);

    const transaction = {
      transactionHash,
      transactionMint,
      transactionInputs,
      transactionOutputs,
      transactionFeeAmount: transactionFeeAmount.toString(),
    };

    return transaction;
  }

  protected toRequestTransactionAddWitnessAndSubmit(
    request: Core.TransactionSubmitRequest
  ): CoreServiceModels.SubmitTransactionRequest {
    const {transactionPayload, transactionSignature} = request;

    return {
      walletWitness: transactionSignature,
      originalUnsignedTx: transactionPayload,
    };
  }

  protected toUnsignedTransaction<T extends CoreServiceModels.AbstractResponse>(
    response: T
  ): Private.UnsignedTransaction {
    const {tTx: transactionPayload, tx_fee: transactionFee} = response;

    const unsignedTransaction = {
      transactionId: randomUUID(), // this is actually required but not available from core server response
      transactionPayload,
      transactionFeeAmount: (transactionFee ?? 0).toString(),
    };

    return unsignedTransaction;
  }

  private toTransactionMint(
    coreTransactionInput: CoreServiceModels.TransactionMint
  ): Core.TransactionMint {
    const transactionMint = {
      mintAssetId: mintToAssetId(coreTransactionInput),
    };

    return transactionMint;
  }

  private toTransactionInput(
    coreTransactionInput: CoreServiceModels.TransactionInput
  ): Core.TransactionInput {
    const {
      input_index: inputIndex,
      input_tx_hash: inputTransactionHash,
      output_index: outputIndex,
      output_tx_hash: outputTransactionHash,
    } = coreTransactionInput;

    const transactionInput = {
      inputIndex,
      inputTransactionHash,
      outputIndex,
      outputTransactionHash,
    };

    return transactionInput;
  }

  private toTransactionOutput(
    coreTransactionOutput: CoreServiceModels.TransactionOutput
  ): Core.TransactionOutput {
    const {index, tx_hash: transactionHash, address} = coreTransactionOutput;

    const transactionOutput = {
      index,
      address,
      transactionHash,
    };

    return transactionOutput;
  }

  // -- UTILS -- //

  private getFirstCollateralUnspentTransactionOutput(
    collateralUtxo: string[]
  ): string | null {
    const firstCollateralUtxo = first(collateralUtxo);
    return isEmpty(firstCollateralUtxo) || isUndefined(firstCollateralUtxo)
      ? null
      : firstCollateralUtxo;
  }

  private joinTokenByPolicyIdAndAssetName(
    policyId: Hex,
    assetName: Hex
  ): string {
    return `${policyId}.${assetName}`;
  }
}
