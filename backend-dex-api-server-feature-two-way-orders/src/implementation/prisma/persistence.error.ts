import {ErrorCode} from '~/domain/errors/domain.error';

export class PersistenceError extends Error {
  constructor(readonly errorCode: ErrorCode, message: string | null = null) {
    super(message || errorCode);
  }
}
