import {flatMap, flatten, flow, map, uniq} from 'lodash';

import {FastifyReply, FastifyRequest} from 'fastify';

import {
  AuthorizationCheckResolver,
  AuthorizationCheckTypes,
  validateAuthorization,
} from '~/implementation/authorization';

/**
 * Curried authorization hook
 * @param staticAuthorizationChecks Array of authorization Checks
 * @param dynamicAuthorizationChecks Array of functions which return authorization checks
 * @returns Hook handler
 */
export const authorizationHook = async (
  staticAuthorizationChecks: AuthorizationCheckTypes[],
  dynamicAuthorizationChecks?: AuthorizationCheckResolver[]
) => {
  return async (req: FastifyRequest, res: FastifyReply) => {
    // Resolve dynamic AuthorizationChecks
    const resolvedDynamicAuthorizationChecks = flatten(
      await Promise.all(
        map(dynamicAuthorizationChecks, dynamicAuthorizationCheck =>
          dynamicAuthorizationCheck(req)
        )
      )
    );

    // Determine final set of auth checks
    const finalAuthCheckSet = uniq([
      ...staticAuthorizationChecks,
      ...resolvedDynamicAuthorizationChecks,
    ]);

    // Determine all required context builders
    const contextBuilders = uniq(
      flatMap(finalAuthCheckSet, authCheck => authCheck.requestContextBuilder)
    );

    // Prepare context builders for composition with partial application of request
    const preparedContextBuilders = map(contextBuilders, async contextBuilder =>
      contextBuilder(req)
    );

    // Resolve final context
    const finalContext = await flow(await Promise.all(preparedContextBuilders))(
      {}
    );

    // Validate
    const {isAuthorized, errorCode} = validateAuthorization<
      typeof finalContext
    >(finalContext, finalAuthCheckSet);

    // Allow or block request
    if (!isAuthorized) {
      res.status(401).send({errorCode});
    }
  };
};
