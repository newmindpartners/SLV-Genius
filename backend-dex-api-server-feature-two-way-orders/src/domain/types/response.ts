import * as either from 'fp-ts/Either';
export {fold, right as fromResult, left as fromError} from 'fp-ts/Either';

export type Response<Result extends object> = either.Either<Error, Result>;

export const unwrap = <Result extends object>(response: Response<Result>) =>
  either.fold<Error, Result, Error | Result>(
    (error: Error) => error,
    (result: Result) => result
  )(response);
