import {ConfigService} from '~/domain/services';

import {ErrorCode} from '~/domain/errors';
import {AuthenticationError} from './error/AuthenticationError';

export const validate =
  (configService: ConfigService) =>
  async (username: string, password: string): Promise<void | Error> => {
    if (
      username !== configService.getBasicAuthUser() ||
      password !== configService.getBasicAuthPass()
    ) {
      return new AuthenticationError(
        ErrorCode.AUTHENTICATION__UNAUTHORIZED,
        'Unauthorized'
      );
    }
  };
