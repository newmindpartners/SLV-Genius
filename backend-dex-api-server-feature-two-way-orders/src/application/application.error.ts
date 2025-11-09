import {ErrorCode} from '~/domain/errors/domain.error';

export class ApplicationError extends Error {
  constructor(readonly errorCode: ErrorCode, message: string | null = null) {
    super(message || errorCode);
  }
}
