import {FastifyRequest} from 'fastify';
import {AuthorizationCheckTypes} from '~/implementation/authorization/types';
import {isStakingNftsPresentInRequest} from '~/implementation/authorization/staking/context.builders';
import {
  isStakingNftsUnique,
  isValidStakingNftCombination,
  isValidStakedAssetAmount,
} from '~/implementation/authorization/staking/authorizationChecks';
import {ValidationPublicError} from '~/implementation/fastify/error/ValidationError';
import {PublicErrorCode} from '~/domain/errors';

export const getStakingAuthorizationChecks = async (
  req: FastifyRequest
): Promise<AuthorizationCheckTypes[]> => {
  if (isStakingNftsPresentInRequest(req)) {
    return [
      isStakingNftsUnique,
      isValidStakingNftCombination,
      isValidStakedAssetAmount,
    ];
  } else {
    throw new ValidationPublicError(
      PublicErrorCode.INVALID_STAKE_VAULT__NFT_COMBINATION
    );
  }
};
