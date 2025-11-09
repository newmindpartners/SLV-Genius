import {injectable, singleton} from 'tsyringe';

import {map} from 'lodash';
import {randomUUID} from 'crypto';

import {Prisma} from '@prisma/client';
import * as Private from '~/domain/models/private';

import {WhitelistRepository} from '~/domain/repositories';

import {ErrorCode} from '~/domain/errors/domain.error';

@singleton()
@injectable()
export class WhitelistRepositoryPrisma implements WhitelistRepository {
  async createOrReplaceRoundWhitelist(
    prisma: Prisma.TransactionClient,
    roundId: string,
    walletStakeKeyHashList: string[]
  ): Promise<Boolean> {
    const roundWhitelist: Private.RoundWhitelist[] = map(
      walletStakeKeyHashList,
      walletStakeKeyHash => {
        return {
          roundWhitelistId: randomUUID(),
          created: new Date(),
          updated: new Date(),
          walletStakeKeyHash: walletStakeKeyHash,
          roundId: roundId,
        };
      }
    );

    try {
      // Delete the current round whitelist
      await prisma.roundWhitelist.deleteMany({
        where: {
          round: {
            roundId,
          },
        },
      });

      // Create the new round whitelist
      const result = await prisma.roundWhitelist.createMany({
        data: roundWhitelist,
      });

      // Return true if the operation was successful, otherwise throw an error
      if (result.count === roundWhitelist.length) {
        return true;
      } else {
        throw new Error(ErrorCode.WHITELIST_REPLACE_FAILED);
      }
    } catch (error) {
      throw new Error(ErrorCode.WHITELIST_REPLACE_FAILED);
    }
  }
}
