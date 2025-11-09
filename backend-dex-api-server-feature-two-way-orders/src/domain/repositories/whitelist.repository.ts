import 'reflect-metadata';
import {TransactionalContext} from '~/domain/context';

export interface WhitelistRepository {
  /**
   Creates an array of whitelist objects and replaces the existing data
   *
   * @param context prisma client for query
   * @param roundId id of the round that will get the new whitelists
   * @param walletStakeKeyHashList array of walletStakeKeyHashes
   *
   * @return true on success
   */
  createOrReplaceRoundWhitelist(
    context: TransactionalContext,
    roundId: string,
    walletStakeKeyHashList: string[]
  ): Promise<Boolean>;
}
