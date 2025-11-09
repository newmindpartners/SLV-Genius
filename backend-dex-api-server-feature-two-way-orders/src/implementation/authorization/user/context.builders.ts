import {FastifyRequest} from 'fastify';

import * as Private from '~/domain/models/private';

import {ContextBuilder, ContextInput} from '~/implementation/authorization';

export type AuthUserContext = {
  user: Private.User | null;
};

/**
 * Provides `user` to the context
 */
export const userContextBuilder: ContextBuilder =
  (req: FastifyRequest) =>
  async (context: ContextInput<object>): Promise<AuthUserContext> => {
    const {user} = req;
    // Async & await necessary to ensure the builder remains functional
    // regardless of context builder order
    return {...(await context), user};
  };
