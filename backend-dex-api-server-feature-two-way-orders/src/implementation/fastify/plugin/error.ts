import {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';

import * as Sentry from '@sentry/node';

import fastifyPlugin from 'fastify-plugin';

import {ConfigService, LoggerService} from '~/domain/services';

import {AbstractError, ErrorCode, PublicError} from '~/domain/errors';

/* eslint-disable */
declare global {
  interface Error {
    errorCode?: string;
    reqId?: string;
    reqUrl?: string;
    reqBody?: any;
  }
}
/* eslint-enable */

export default (configService: ConfigService, loggerService: LoggerService) => {
  // https://docs.sentry.io/platforms/javascript/guides/react/configuration/
  Sentry.init({
    dsn: configService.getSentryDataSourceName(),
    environment: configService.getEnvironmentName(),

    // every transaction created will have that percentage chance of being sent to Sentry.
    tracesSampleRate: configService.getSentryTracesSampleRate(),
  });

  const errorHandler = (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    Sentry.withScope(scope => {
      scope.setUser(request.user);

      Sentry.captureException(error);

      const {message, errorCode = ErrorCode.UNKNOWN_ERROR} = error;

      const statusCode = ErrorCode.UNKNOWN_ERROR === errorCode ? 500 : 400;

      if (error instanceof PublicError) {
        // Error code is whitelisted for public exposure
        send(statusCode, {
          errorCode,
          message: obfuscateMessageInProduction(message),
        });
      } else {
        // Error code is obfuscated for security
        const errorCode = ErrorCode.UNKNOWN_ERROR;
        const {message} = error;
        send(500, {errorCode, message: obfuscateMessageInProduction(message)});
      }
    });

    function obfuscateMessageInProduction(message: string) {
      // Error messages are for debug purposes
      // Always obfuscate in production environments
      return configService.isProductionEnvironment() ? undefined : message;
    }

    function send(statusCode: number, errorPayload: AbstractError) {
      reply.status(statusCode).send(errorPayload);
    }
  };

  const errorLogger =
    (loggerService: LoggerService) =>
    async (req: FastifyRequest, reply: FastifyReply, error: FastifyError) => {
      error.reqId = req.id;
      error.reqUrl = req.url;
      if (error?.validation) {
        // Include body on validation error for context
        error.reqBody = req.body;
      }
      loggerService.error(error);
    };

  return fastifyPlugin(async (fastify: FastifyInstance): Promise<void> => {
    fastify.setErrorHandler(errorHandler);
    fastify.addHook('onError', errorLogger(loggerService));
  });
};
