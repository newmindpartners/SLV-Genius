import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import * as Public from '~/domain/models/public';

import {ConfigService} from '~/domain/services';

import {ErrorCode} from '~/domain/errors';
import {ApplicationError} from '~/application/application.error';

import {AbstractMutation} from '~/implementation/fastify/abstract.mutation';
import {OptionsApplication} from '~/application/options.application';

@singleton()
export class OptionsMutationFastify extends AbstractMutation {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject(OptionsApplication)
    private readonly optionsApplication: OptionsApplication
  ) {
    super(configService);
  }

  async createOption({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.CreateOption;
  }>): Promise<Public.UnsignedTransaction> {
    const {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = body;

    const wallet: Public.WalletAccount = {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    };

    const {
      baseAssetId,
      quoteAssetId,
      baseAssetAmount,
      baseAssetShortName,
      quoteAssetShortName,
      endDate,
      baseAssetPrice,
    } = body;

    const optionData: Public.CreateOptionData = {
      baseAssetId,
      quoteAssetId,
      baseAssetAmount,
      baseAssetShortName,
      quoteAssetShortName,
      endDate,
      baseAssetPrice,
    };

    if (user) {
      return await this.optionsApplication.createOption(optionData, wallet);
    } else {
      throw new ApplicationError(ErrorCode.OPTIONS__UNEXPECTED_REQUEST_BODY);
    }
  }

  async executeOption({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.ExecuteOption;
  }>): Promise<Public.UnsignedTransaction> {
    const {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = body;

    const wallet: Public.WalletAccount = {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    };

    const {optionUtxoRef, optionAmount} = body;

    if (user) {
      return await this.optionsApplication.executeOption(
        wallet,
        optionUtxoRef,
        optionAmount
      );
    } else {
      throw new ApplicationError(ErrorCode.OPTIONS__UNEXPECTED_REQUEST_BODY);
    }
  }

  async retrieveOption({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.RetrieveOption;
  }>): Promise<Public.UnsignedTransaction> {
    const {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = body;

    const wallet: Public.WalletAccount = {
      collateralUtxo,
      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    };

    const {optionUtxoRef, optionAmount} = body;

    if (user) {
      return await this.optionsApplication.retrieveOption(
        wallet,
        optionUtxoRef,
        optionAmount
      );
    } else {
      throw new ApplicationError(ErrorCode.OPTIONS__UNEXPECTED_REQUEST_BODY);
    }
  }
}
