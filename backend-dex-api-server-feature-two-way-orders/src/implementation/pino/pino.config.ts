import {PinoLoggerOptions} from 'fastify/types/logger';

import {stdTimeFunctions} from 'pino';

import {isDevelopment, isProduction} from '../node/config.service';

export class PinoConfig {
  getLoggerOptions(): PinoLoggerOptions {
    const levelToSeverityMap: {readonly [index: string]: string} = {
      // Google Cloud compliant severity level labels:
      // https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
      silent: 'DEBUG',
      trace: 'DEBUG',
      debug: 'DEBUG',
      info: 'INFO',
      warn: 'WARNING',
      error: 'ERROR',
      fatal: 'CRITICAL',
    };

    return {
      level: process.env.PINO_LEVEL || process.env.LOG_LEVEL || 'info',
      timestamp: stdTimeFunctions.isoTime,
      redact: ['req.headers.authorization'],
      formatters: {
        level(label: string, number: number) {
          return {
            // Convert the severity levels to be Google Cloud compliant in prod:
            ...(isProduction && {
              severity: levelToSeverityMap[label] || levelToSeverityMap['info'],
            }),
            // The 'level' key is needed for pino-pretty, add it for development:
            ...(isDevelopment && {level: number}),
          };
        },
        bindings() {
          // Do not add process ID and hostname to the log entries:
          return {};
        },
      },
      serializers: {
        // Log HTTP requests and responses:
        req(request) {
          return {
            url: request.url,
            method: request.method,
            headers: request.headers,
            hostname: request.hostname,
            remoteAddress: request.ip,
          };
        },
      },
    };
  }
}
