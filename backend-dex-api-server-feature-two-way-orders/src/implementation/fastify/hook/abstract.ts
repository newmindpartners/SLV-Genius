import {FastifyReply, FastifyRequest} from 'fastify';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NextFunction = (err?: any) => void;

export type NextHandleFunction = (
  req: FastifyRequest,
  res: FastifyReply,
  next: NextFunction
) => void;

export default interface AbstractHook {
  /**
   * Middleware handler function
   *
   * @param req request
   * @param res response
   * @param next next function
   *
   * @return void
   */
  handler: NextHandleFunction;
}
