import {ErrorCode} from '~/domain/errors/domain.error';
import {DomainEvent} from '~/domain/events';
import {bigIntStringifyReplacer} from '~/domain/services/logger.service';

export const isProjectionError = (error: unknown): error is ProjectionError => {
  return error instanceof ProjectionError;
};

export class ProjectionError extends Error {
  originalError: Error;
  event: string;

  constructor(
    readonly errorCode: ErrorCode,
    event: DomainEvent,
    originalError: Error
  ) {
    super(errorCode);
    this.originalError = originalError;
    this.event = JSON.stringify(event, bigIntStringifyReplacer);
  }
}
