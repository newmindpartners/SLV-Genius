import {
  ErrorCode,
  PublicError,
  PublicErrors,
} from '~/domain/errors/domain.error';

export class CoreError extends Error {
  constructor(readonly errorCode: ErrorCode, message: string | null = null) {
    super(message || errorCode);
  }
}

export class CorePublicError extends PublicError {
  originalError: Error;

  constructor(
    readonly errorCode: PublicErrors,
    message: string | null = null,
    originalError: Error
  ) {
    super(errorCode, message);
    this.originalError = originalError;
  }
}
