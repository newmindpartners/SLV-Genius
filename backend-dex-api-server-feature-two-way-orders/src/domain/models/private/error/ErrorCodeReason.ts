import {ErrorCode} from '~/domain/errors';

export type ErrorCodeReason<Code extends string = ErrorCode> = {
  errorCode: Code;
  errorReason?: string | null;
};
