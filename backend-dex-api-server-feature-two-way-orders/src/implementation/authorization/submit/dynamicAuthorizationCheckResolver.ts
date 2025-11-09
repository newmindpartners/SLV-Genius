import {FastifyRequest} from 'fastify';

import {AuthorizationCheckTypes} from '~/implementation/authorization/types';

import {
  isKycValid,
  isLatestTermsAccepted,
} from '~/implementation/authorization';
import * as Private from '~/domain/models/private';

import {ErrorCode} from '~/domain/errors';
import {isSignedTransactionRequest} from '../event/context.builders';
import {ApplicationError} from '~/application/application.error';

const eventTypeAuthorizationRuleMap: Record<string, AuthorizationCheckTypes[]> =
  {
    optionEvent: [],
    orderSaleEvent: [isKycValid, isLatestTermsAccepted],
    orderSwapEvent: [],
    twoWayOrderEvent: [],
    stakeVaultEvent: [],
    yieldFarmingEvent: [],
    smartVaultEvent: [],
  };

export interface EventTypeRequest {
  eventType: Private.EventsType;
}

export const getSubmitAuthorizationChecks = async (
  req: FastifyRequest
): Promise<AuthorizationCheckTypes[]> => {
  if (isSignedTransactionRequest(req)) {
    const {eventType} = req.body;
    return eventTypeAuthorizationRuleMap[eventType] || [];
  } else {
    throw new ApplicationError(
      ErrorCode.REQUEST_VALIDATION__MISSING_SIGNED_TRANSACTION
    );
  }
};
