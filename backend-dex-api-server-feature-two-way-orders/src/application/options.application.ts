import 'reflect-metadata';

import {inject, injectable, singleton} from 'tsyringe';

import * as Core from '~/domain/models/core';
import * as Public from '~/domain/models/public';
import {CoreService} from '~/domain/services';
import {CoreServiceMapper} from '~/implementation/client/core/core.mapper';

// TODO: We should make inject this mapper into dependency context, not extend it
@singleton()
@injectable()
export class OptionsApplication extends CoreServiceMapper {
  constructor(
    @inject('CoreService')
    private readonly coreService: CoreService
  ) {
    super();
  }

  async createOption(
    option: Public.CreateOptionData,
    wallet: Public.WalletAccount
  ): Promise<Public.UnsignedTransaction> {
    const coreCreateOptionRequestPayload: Core.CreateOption =
      this.toCreateOption(option, wallet);

    /**
     * Make request to Core tx server.
     * Response contains data needed to be signed by wallet and passed to submit endpoint.
     */

    const unsignedTransaction: Public.UnsignedTransaction =
      await this.coreService.createOption(coreCreateOptionRequestPayload);

    return Promise.resolve(unsignedTransaction);
  }

  async retrieveOption(
    wallet: Public.WalletAccount,
    optionUtxo: Public.RetrieveOption['optionUtxoRef'],
    amount: Public.RetrieveOption['optionAmount']
  ): Promise<Public.UnsignedTransaction> {
    const coreRetrieveOptionRequestPayload: Core.RetrieveOption =
      this.toRetrieveOption(wallet, optionUtxo, amount);

    /**
     * Make request to Core tx server.
     * Response contains data needed to be signed by wallet and passed to submit endpoint.
     */

    const unsignedTransaction: Public.UnsignedTransaction =
      await this.coreService.retrieveOption(coreRetrieveOptionRequestPayload);

    return Promise.resolve(unsignedTransaction);
  }

  async executeOption(
    wallet: Public.WalletAccount,
    optionUtxo: Public.RetrieveOption['optionUtxoRef'],
    amount: Public.RetrieveOption['optionAmount']
  ): Promise<Public.UnsignedTransaction> {
    const coreExecuteOptionRequestPayload: Core.ExecuteOption =
      this.toExecuteOption(wallet, optionUtxo, amount);

    /**
     * Make request to Core tx server.
     * Response contains data needed to be signed by wallet and passed to submit endpoint.
     */

    const unsignedTransaction: Public.UnsignedTransaction =
      await this.coreService.executeOption(coreExecuteOptionRequestPayload);

    return Promise.resolve(unsignedTransaction);
  }
}
