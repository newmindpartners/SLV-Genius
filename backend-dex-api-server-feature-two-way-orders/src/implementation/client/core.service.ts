import { map } from 'lodash';

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { inject, injectable, singleton } from 'tsyringe';

import * as Core from '~/domain/models/core';
import * as Private from '~/domain/models/private';

import { ConfigService, CoreService, LoggerService } from '~/domain/services';

import {
  CoreErrorCodeToPublicErrorCodeMap,
  PublicErrorCode,
} from '~/domain/errors';
import {
  CoreError,
  CorePublicError,
} from '~/implementation/client/core/core.error';

import { CoreServiceMapper } from '~/implementation/client/core/core.mapper';
import * as CoreServiceModels from '~/implementation/client/core/models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAxiosError(error: any): error is AxiosError {
  return (error as AxiosError).isAxiosError;
}

@singleton()
@injectable()
export class CoreServiceAxios extends CoreServiceMapper implements CoreService {
  private readonly baseUrl: string;
  private readonly timeout: number;

  private readonly client: AxiosInstance;

  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('LoggerService')
    private readonly loggerService: LoggerService
  ) {
    super();

    this.baseUrl = this.configService.getTransactionServerUrl();
    this.timeout = this.configService.getTransactionServerTimeout();

    const axiosClient = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    });

    axiosClient.interceptors.response.use(
      this.logRequest(loggerService),
      this.handleError(loggerService)
    );

    this.client = axiosClient;
  }

  async getAssetsOnAddresses(
    request: Core.AssetAddresses
  ): Promise<Core.AddressAssets[]> {
    const coreResponse = await this.post<
      Core.AssetAddresses,
      Core.AddressAssets[]
    >('/assets', request);
    return coreResponse;
  }

  async orderSaleOpen(
    request: Core.OrderSaleOpenRequest
  ): Promise<Private.UnsignedTransactionSaleOrderOpen & Core.Transaction> {
    const coreRequest = this.toRequestOpenOrderSale(request);
    const coreResponse = await this.post<
      CoreServiceModels.OrderSalePlaceRequest,
      CoreServiceModels.OrderSalePlaceResponse
    >('/tokenSale/order/place', coreRequest);
    return this.toResponseUnsignedTransactionOrderSaleOpen(coreResponse);
  }

  async orderSaleCancel(
    request: Core.OrderSaleCancelRequest
  ): Promise<Private.UnsignedTransactionSaleOrderCancel & Core.Transaction> {
    const coreRequest = this.toRequestCancelOrderSale(request);
    const coreResponse = await this.post<
      CoreServiceModels.OrderSaleCancelRequest,
      CoreServiceModels.OrderSaleCancelResponse
    >('/tokenSale/order/cancel', coreRequest);
    return this.toResponseUnsignedTransaction(coreResponse);
  }

  async orderSaleGetScriptAddress(
    request: Core.OrderSaleGetScriptAddressRequest
  ): Promise<Private.ScriptAddress> {
    const coreRequest = this.toRequestOpenOrderSaleParams(request);
    const coreResponse = await this.post<
      CoreServiceModels.OrderSaleInfoRequest,
      CoreServiceModels.OrderSaleInfoResponse
    >('/tokenSale/order/info', coreRequest);
    return this.toResponseOrderScriptAddress(coreResponse);
  }

  async orderSwapOpen(
    request: Core.OrderSwapOpenRequest
  ): Promise<Private.UnsignedTransactionSwapOrderOpen & Core.Transaction> {
    const coreRequest = this.toRequestOpenOrderSwap(request);
    const coreResponse = await this.post<
      CoreServiceModels.OrderSwapOpenRequest,
      CoreServiceModels.OrderSwapOpenResponse
    >('/DEX/order/place', coreRequest);
    return this.toResponseOrderSwapOpenUnsignedTransactionMaker(coreResponse);
  }

  async orderSwapFill(
    request: Core.OrderSwapFillRequest
  ): Promise<Private.UnsignedTransactionSwapOrderFill & Core.Transaction> {
    const coreRequest = this.toRequestFillOrderSwap(request);
    const coreResponse = await this.post<
      CoreServiceModels.OrderSwapFillRequest,
      CoreServiceModels.OrderSwapFillResponse
    >('/DEX/order/limitFill', coreRequest);
    return this.toResponseOrderSwapFillUnsignedTransactionTaker(coreResponse);
  }

  async orderSwapMultiFill(
    request: Core.OrderSwapMultiFillRequest
  ): Promise<Private.UnsignedTransactionSwapOrderFill & Core.Transaction> {
    const coreRequest = this.toRequestMultiFillOrderSwap(request);
    const coreResponse = await this.post<
      CoreServiceModels.OrderSwapMultiFillRequest,
      CoreServiceModels.OrderSwapFillResponse
    >('/DEX/order/multiLimitFill', coreRequest);
    return this.toResponseOrderSwapFillUnsignedTransactionTaker(coreResponse);
  }

  async orderSwapCancel(
    request: Core.OrderSwapCancelRequest
  ): Promise<Private.UnsignedTransaction & Core.Transaction> {
    const coreRequest = this.toRequestCancelOrderSwap(request);
    const coreResponse = await this.post<
      CoreServiceModels.OrderSwapCancelRequest,
      CoreServiceModels.OrderSwapCancelResponse
    >('/DEX/order/cancel', coreRequest);
    return this.toResponseUnsignedTransaction(coreResponse);
  }

  // -- TWO-WAY ORDER -- //

  async twoWayOrderPlace(
    request: Core.TwoWayOrderPlaceRequest
  ): Promise<
    Private.UnsignedTransaction &
      Core.Transaction & {
        depositAmount: string;
        makerLovelaceFlatFeeAmount: string;
        makerFromAssetFeeAmount: string;
        makerFromAssetFeePercent: string;
      }
  > {
    const coreRequest = this.toRequestTwoWayOrderPlace(request);
    const coreResponse = await this.post<
      CoreServiceModels.TwoWayOrderPlaceRequest,
      CoreServiceModels.TwoWayOrderPlaceResponse
    >('/DEX/two-way-order/place', coreRequest);
    const unsignedTx = this.toResponseUnsignedTransaction(coreResponse);
    const {
      depositAmount,
      makerLovelaceFlatFee,
      makerOfferedFeeAmount,
      makerOfferedFeePercent,
    } = coreResponse;

    return {
      ...unsignedTx,
      depositAmount,
      makerLovelaceFlatFeeAmount: makerLovelaceFlatFee,
      makerFromAssetFeeAmount: makerOfferedFeeAmount,
      makerFromAssetFeePercent: makerOfferedFeePercent,
    };
  }

  async twoWayOrderFill(
    request: Core.TwoWayOrderFillRequest
  ): Promise<Private.UnsignedTransaction & Core.Transaction> {
    const coreRequest = this.toRequestTwoWayOrderFill(request);
    const coreResponse = await this.post<
      CoreServiceModels.TwoWayOrderFillRequest,
      CoreServiceModels.TwoWayOrderFillResponse
    >('/DEX/two-way-order/fill', coreRequest);
    return this.toResponseUnsignedTransaction(coreResponse);
  }

  async twoWayOrderCancel(
    request: Core.TwoWayOrderCancelRequest
  ): Promise<Private.UnsignedTransaction & Core.Transaction> {
    const coreRequest = this.toRequestTwoWayOrderCancel(request);
    const coreResponse = await this.post<
      CoreServiceModels.TwoWayOrderCancelRequest,
      CoreServiceModels.TwoWayOrderCancelResponse
    >('/DEX/two-way-order/cancel', coreRequest);
    return this.toResponseUnsignedTransaction(coreResponse);
  }

  async twoWayOrderList(): Promise<unknown[]> {
    return (await this.client.get('/DEX/two-way-order')).data as unknown[];
  }

  async stakeVaultCreate(
    request: Core.StakeVaultCreateRequest
  ): Promise<Private.UnsignedTransaction & Core.Transaction> {
    const rawRequest = this.toRequestOpenStakeVaultOrder(request);
    const rawResponse = await this.post<
      CoreServiceModels.StakingStakeStakeRequest,
      CoreServiceModels.StakingStakeStakeResponse
    >('/staking/stake/stake', rawRequest);
    return this.toResponseUnsignedTransaction(rawResponse);
  }

  // TODO rename
  async stakingStakeVaultUnstake(
    // request: CorePrivate.CoreStakingStakeUnstakeRequest
    request: Core.StakingStakeUnstakeRequest
  ): Promise<Private.UnsignedTransaction & Core.Transaction> {
    const rawRequest = this.toRequestUnstakeStakeVault(request);
    const rawResponse = await this.post<
      CoreServiceModels.StakingStakeUnstakeRequest,
      CoreServiceModels.StakingStakeUnstakeResponse
    >('/staking/stake/unstake', rawRequest);
    return this.toResponseStakeVaultUnstake(rawResponse);
  }

  async yieldFarmingListRewards(
    request: Core.YieldFarmingListRewardsRequest
  ): Promise<Core.YieldFarmingListRewardsResponse> {
    const coreRequest = this.toRequestYieldFarmingListRewards(request);
    const coreResponse = await this.post<
      CoreServiceModels.YieldFarmingListRewardsRequest,
      CoreServiceModels.YieldFarmingListRewardsResponse
    >('/rewards', coreRequest);
    return this.toYieldFarmingListRewardsResponse(coreResponse);
  }

  private toYieldFarmingListRewardsResponse(
    coreResponse: CoreServiceModels.YieldFarmingListRewardsResponse
  ): Core.YieldFarmingListRewardsResponse {
    return {
      rewardsClaimLovelaceServiceFee: coreResponse.lovelaceFlatFee,
      rewardsGroups: map(coreResponse.rewardsGroups, ({group, assets}) => ({
        groupKey: group,
        assets: assets.map(({token, symbol, amount}) => ({
          assetName: token,
          policyId: symbol,
          assetAmount: amount,
        })),
      })),
    };
  }

  async yieldFarmingRewardsClaim(
    request: Core.YieldFarmingRewardsClaimRequest
  ): Promise<Private.UnsignedTransaction> {
    const coreRequest = this.toRequestYieldFarmingRewardsClaim(request);
    const coreResponse = await this.post<
      CoreServiceModels.YieldFarmingRewardsClaimRequest,
      CoreServiceModels.YieldFarmingRewardsClaimResponse
    >('/rewards/claim', coreRequest);
    return this.toUnsignedTransaction(coreResponse);
  }

  async createOption(
    request: Core.CreateOption
  ): Promise<Private.UnsignedTransaction> {
    const coreRequest = this.toRequestCreateOption(request);
    const coreResponse = await this.post<
      CoreServiceModels.CreateOptionRequest,
      CoreServiceModels.CreateOptionResponse
    >('/DEX/option/create', coreRequest);
    return this.toUnsignedTransaction(coreResponse);
  }

  async executeOption(
    request: Core.ExecuteOption
  ): Promise<Private.UnsignedTransaction> {
    const coreRequest = this.toRequestExecuteOption(request);
    const coreResponse = await this.post<
      CoreServiceModels.ExecuteOptionRequest,
      CoreServiceModels.ExecuteOptionResponse
    >('/DEX/option/execute', coreRequest);
    return this.toUnsignedTransaction(coreResponse);
  }

  async retrieveOption(
    request: Core.RetrieveOption
  ): Promise<Private.UnsignedTransaction> {
    const coreRequest = this.toRequestRetrieveOption(request);
    const coreResponse = await this.post<
      CoreServiceModels.RetrieveOptionRequest,
      CoreServiceModels.RetrieveOptionResponse
    >('/DEX/option/retrieve', coreRequest);
    return this.toUnsignedTransaction(coreResponse);
  }

  async transactionSubmit(
    request: Core.TransactionSubmitRequest
  ): Promise<Core.Transaction> {
    const coreRequest = this.toRequestTransactionAddWitnessAndSubmit(request);
    const coreResponse = await this.post<
      CoreServiceModels.SubmitTransactionRequest,
      CoreServiceModels.SubmitTransactionResponse
    >('/Tx/add-wit-and-submit', coreRequest);
    return this.toTransaction(coreResponse);
  }

  private async post<T, R>(
    path: string,
    payload: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    if (config) {
      const mergedConfig: AxiosRequestConfig = {
        ...this.client.defaults,
        headers: {
          ...config?.headers,
        },
      };

      return (await this.client.post(path, payload, mergedConfig)).data;
    } else {
      return (await this.client.post(path, payload)).data;
    }
  }

  private curl<T>(path: string, payload: T) {
    return [
      "curl -X POST -H 'Content-Type: application/json'",
      `${this.baseUrl}${path}`,
      `-d '${payload}'`,
    ].join(' ');
  }

  private logRequest(loggerService: LoggerService) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response: AxiosResponse<any>) => {
      const {config} = response;
      const {url, data} = config;
      if (url && data) {
        const curl = this.curl(url, data);
        // Prefix only for TWO endpoints to make grepping easy
        const isTwoWay = typeof url === 'string' && url.includes('/DEX/two-way-order');
        loggerService.info(isTwoWay ? `[TWO-DEBUG][CORE] ${curl}` : curl);
      }
      return response;
    };
  }

  private getErrorCodeAndMessage(axiosError: AxiosError<any>) {
    const errorCode = axiosError.response?.data?.errorCode;
    const message = axiosError.response?.data?.message;
    return {errorCode, message};
  }

  private getPublicErrorCode(errorCode: string) {
    return CoreErrorCodeToPublicErrorCodeMap[
      errorCode as keyof typeof CoreErrorCodeToPublicErrorCodeMap
    ];
  }

  private isCoreErrorResponse(error: AxiosError) {
    const {errorCode, message} = this.getErrorCodeAndMessage(error);
    return errorCode && message;
  }

  private isAxiosTimeout(error: AxiosError) {
    const {code} = error;
    return code === 'ECONNABORTED';
  }

  /**
   * Resolves whether the error is public facing or should be obfuscated
   */
  private resolveCoreError(axiosError: AxiosError) {
    if (this.isCoreErrorResponse(axiosError)) {
      const {errorCode: coreErrorCode, message} =
        this.getErrorCodeAndMessage(axiosError);

      const publicErrorCode = this.getPublicErrorCode(coreErrorCode);
      return publicErrorCode
        ? new CorePublicError(publicErrorCode, message, axiosError)
        : new CoreError(coreErrorCode, message);
    } else if (this.isAxiosTimeout(axiosError)) {
      return new CorePublicError(
        PublicErrorCode.NETWORK__TIMEOUT,
        axiosError.message,
        axiosError
      );
    }
    return axiosError;
  }

  private logCoreError(
    loggerService: LoggerService,
    axiosError: AxiosError,
    coreError: Error
  ) {
    const {url, data: responseData} = axiosError?.config || {};
    loggerService.error(coreError, this.curl(url || '<omitted>', responseData));
  }

  private handleError(loggerService: LoggerService) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any) => {
      if (isAxiosError(error)) {
        const resolvedCoreError = this.resolveCoreError(error);
        this.logCoreError(loggerService, error, resolvedCoreError);
        return Promise.reject(resolvedCoreError);
      }

      loggerService.error(error);
      return Promise.reject(error);
    };
  }
}
