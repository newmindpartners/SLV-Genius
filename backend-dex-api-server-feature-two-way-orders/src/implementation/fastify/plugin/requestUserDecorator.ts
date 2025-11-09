import {container} from 'tsyringe';
import {FastifyInstance} from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import {UserHook} from '~/implementation/fastify/hook/user';

const userHook = container.resolve(UserHook);

export default fastifyPlugin(
  async (fastify: FastifyInstance): Promise<void> => {
    fastify.decorateRequest('user', null);
    fastify.addHook('preHandler', userHook.handler);
  }
);
