import {FastifyServerOptions} from 'fastify';
import {PinoLoggerOptions} from 'fastify/types/logger';

export class FastifyConfig {
  constructor(private loggerOptions: PinoLoggerOptions) {}

  getOptions(): FastifyServerOptions {
    return {
      disableRequestLogging: false,
      logger: this.loggerOptions,
    };
  }
}
