import {AsyncLocalStorage} from 'async_hooks';
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';

type AsyncLocalStorageState = Map<'requestId', string | undefined>;

export const asyncLocalStorage =
  new AsyncLocalStorage<AsyncLocalStorageState>();

const createAsyncLocalStorageWithRequestInfo = (
  req: FastifyRequest,
  reply: FastifyReply,
  next: HookHandlerDoneFunction
) => {
  /**
   * This creates an async context in which any logic that is run can access
   * the information we put on the store. It is therefore crucial that we call
   * `next()` within this context so that the custom logs in our routes logic
   * has access to it.
   */
  asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore()?.set('requestId', req.id);
    next();
  });
};

export const fastifyAsyncLocalStorageRequestScoping = fastifyPlugin(
  async (fastify: FastifyInstance): Promise<void> => {
    fastify.addHook('onRequest', createAsyncLocalStorageWithRequestInfo);
  }
);
