import {FastifyRequest} from 'fastify';
import {Either} from 'fp-ts/Either';
import {EventExistsContext} from './event/context.builders';
import {StakingAuthorizationCheckTypes} from './staking/types';
import {
  ProjectEligibilityContext,
  OrderSaleCancellationContext,
} from './project/types';

import {AuthUserContext} from './user/context.builders';
import {SmartVaultContext} from '~/smartVaultFeature/fastify/authorizationChecks';

export interface ContextBuilder {
  (req: FastifyRequest): (context: ContextInput<object>) => Promise<object>;
}

export type ContextInput<T extends {}> = Promise<T> | T;

export type AuthorizationCheckTypes =
  | AuthorizationCheck<ProjectEligibilityContext>
  | AuthorizationCheck<AuthUserContext>
  | AuthorizationCheck<EventExistsContext>
  | AuthorizationCheck<OrderSaleCancellationContext>
  | StakingAuthorizationCheckTypes
  | AuthorizationCheck<SmartVaultContext>;

export interface AuthorizationCheck<T> {
  errorCode: string;
  predicate: (arg: T) => boolean;
  requestContextBuilder: ContextBuilder[];
}

export type AuthorizationResult = {
  errorCode?: string;
  isAuthorized: boolean;
};

/**
 * Authorization check resolver for unknown authorization checks
 */
export type AuthorizationCheckResolver = (
  req: FastifyRequest
) => Promise<AuthorizationCheckTypes[]>;

export type AuthorizationEither<T> = Either<string, T>;
