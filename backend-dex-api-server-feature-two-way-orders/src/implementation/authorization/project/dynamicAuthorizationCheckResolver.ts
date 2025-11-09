import {FastifyRequest} from 'fastify';

import {find} from 'lodash';

import * as Private from '~/domain/models/private';

import {AuthorizationCheckTypes} from '~/implementation/authorization/types';

import {eligibilityCheckMap} from '~/implementation/authorization';

import {
  isRoundIdPresentInRequest,
  projectContextBuilder,
} from '~/implementation/authorization/project/context.builders';
import {PublicErrorCode} from '~/domain/errors';
import {ValidationPublicError} from '~/implementation/fastify/error/ValidationError';

export const getProjectAuthorizationChecks = async (
  req: FastifyRequest
): Promise<AuthorizationCheckTypes[]> => {
  if (isRoundIdPresentInRequest(req)) {
    const {roundId} = req.body;
    const {orderSaleProject} = await projectContextBuilder(req)({});

    const round: Private.OrderSaleProjectRound | undefined = find(
      orderSaleProject?.round,
      (round: Private.OrderSaleProjectRound) => round.roundId === roundId
    );

    const saleRule = round?.saleRule;

    return saleRule ? eligibilityCheckMap[saleRule] : [];
  } else {
    throw new ValidationPublicError(
      PublicErrorCode.REQUEST_VALIDATION__MISSING_ROUND_ID
    );
  }
};
