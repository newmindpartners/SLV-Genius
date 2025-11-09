/* eslint-disable @typescript-eslint/no-explicit-any */
import {injectable, singleton} from 'tsyringe';

import {LoggerService} from '~/domain/services';

import pino from 'pino';
import {asyncLocalStorage} from '../fastify/plugin/requestScoping';
import {set} from 'lodash';

@singleton()
@injectable()
export class LoggerServicePino implements LoggerService {
  private readonly logger: pino.Logger;

  constructor(loggerOptions: pino.LoggerOptions) {
    this.logger = pino(loggerOptions);
  }

  private getRequestInfo(): {reqId?: string} {
    const reqId = asyncLocalStorage.getStore()?.get('requestId');

    return {reqId};
  }

  info(msg?: string, ...args: any) {
    this.logger.info(this.getRequestInfo(), msg, args);
  }

  error(error: Error, msg?: string, ...args: any) {
    const {reqId} = this.getRequestInfo();
    set(error, 'reqId', reqId);
    this.logger.error(error, msg, ...args);
  }

  warning(msg?: string, ...args: any) {
    this.logger.warn(this.getRequestInfo(), msg, ...args);
  }

  debug(msg?: string, ...args: any) {
    this.logger.debug(this.getRequestInfo(), msg, ...args);
  }

  trace(msg?: string, ...args: any) {
    this.logger.trace(this.getRequestInfo(), msg, ...args);
  }
}
