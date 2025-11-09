import {ErrorCode} from '~/domain/errors/domain.error';

export class AuthenticationError extends Error {
  constructor(
    readonly errorCode: ErrorCode.AUTHENTICATION__UNAUTHORIZED,
    message: string | null = null
  ) {
    super(message || errorCode);
  }
}
