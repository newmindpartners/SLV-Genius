import {inject, injectable, singleton} from 'tsyringe';

import {find, flatten, isEmpty, isNil} from 'lodash';

import {TransactionalContext} from '~/domain/context';

import {Hex} from '~/domain/models/cardano';

import * as Oura from '~/domain/models/oura';
import {AssetReference} from '~/domain/models/public';

import {TransactionRepository} from '~/domain/repositories';

import {assetId, assetName} from '~/domain/utils/asset.util';

// Fill is an event, transactions should not know of events.
// Events should know of transactions.
// Meaning most if not all of this code does not belong here.

export interface TransactionService {
  /**
   * Identify a fill transaction
   *
   * @param context transactional context
   * @param baseAssets base asset reference
   * @param scriptAddresses script addresses
   * @param ouraTransaction oura transaction
   */
  isFillTransaction(
    context: TransactionalContext,
    baseAssets: AssetReference[],
    scriptAddresses: Hex[],
    ouraTransaction: Oura.Transaction
  ): Promise<boolean>;
}

export const GY_ASSET_NAME = assetName('GY');

@singleton()
@injectable()
export class TransactionServiceImplementation implements TransactionService {
  constructor(
    @inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository
  ) {}

  async isFillTransaction(
    context: TransactionalContext,
    baseAssets: AssetReference[],
    scriptAddresses: Hex[],
    transaction: Oura.Transaction
  ): Promise<boolean> {
    return (
      this.existsNegativeGyMint(transaction) &&
      this.matchesOutputAssetsBaseAsset(transaction, baseAssets) &&
      (await this.matchesSavedTransactionInputs(context, transaction)) &&
      (await this.matchesOutputAssetsScriptAddresses(
        context,
        transaction,
        scriptAddresses
      ))
    );
  }

  // return true if transaction contains a mint item with a negative quantity of GY
  // Because that means that the transaction has sent the token to the user
  private existsNegativeGyMint(transaction: Oura.Transaction): boolean {
    const {mint} = transaction;

    // early exit if mint is null
    if (!mint) return false;

    const nonNullMints = mint.filter(
      (element): element is Oura.MintAsset => null !== element
    );

    const GY = find(nonNullMints, mint =>
      mint ? GY_ASSET_NAME === mint.asset : false
    );

    return GY ? GY.quantity < 0 : false;
  }

  // return true if transaction includes at least one output with base asset
  private matchesOutputAssetsBaseAsset(
    transaction: Oura.Transaction,
    baseAssets: AssetReference[]
  ): boolean {
    const baseAssetInTxOutput = baseAssets.find(({assetId: baseAssetId}) => {
      const {outputs: transactionOutputs} = transaction;

      const transactionOutputsWithBaseAsset = transactionOutputs
        .map(output => {
          const filteredAssets = output.assets
            .map(({policy, asset}) => assetId(policy, asset))
            .filter(assetId => baseAssetId === assetId);

          return {...output, assets: filteredAssets};
        })
        .filter(output => output.assets.length);

      return !isEmpty(transactionOutputsWithBaseAsset);
    });

    return !isNil(baseAssetInTxOutput);
  }

  // return true if transaction include at least on save transaction input
  private async matchesSavedTransactionInputs(
    context: TransactionalContext,
    transaction: Oura.Transaction
  ): Promise<boolean> {
    const {inputs: transactionInputs} = transaction;

    const savedTransactionInputs = transactionInputs.filter(
      async transactionInput => {
        const {tx_id: txInputHash, index} = transactionInput;

        return await this.transactionRepository.transactionExistsByTxInputHash(
          context,
          txInputHash,
          index
        );
      }
    );

    return !isEmpty(savedTransactionInputs);
  }

  // return true if at least one transaction output matches script address
  private async matchesOutputAssetsScriptAddresses(
    context: TransactionalContext,
    transaction: Oura.Transaction,
    scriptAddresses: Hex[]
  ): Promise<boolean> {
    const {inputs: transactionInputs} = transaction;

    const savedTransactionInputs = flatten(
      await Promise.all(
        transactionInputs.map(({tx_id: transactionHash}) =>
          this.transactionRepository.getTransactionOutputByTransactionHashAndScriptAddresses(
            context,
            scriptAddresses,
            transactionHash
          )
        )
      )
    );

    return !isEmpty(savedTransactionInputs);
  }
}
