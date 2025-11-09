import {chain, getOrElse, isRight, left, right} from 'fp-ts/Either';
import {pipe} from 'fp-ts/function';
import lodash from 'lodash';

import {
  AuthorizationCheck,
  AuthorizationEither,
  AuthorizationResult,
} from '~/implementation/authorization';

/**
 * Curried predicated either wrapper
 */
const predicateEither =
  <T>(authorizationCheck: AuthorizationCheck<T>) =>
  (arg: T): AuthorizationEither<T> =>
    authorizationCheck.predicate(arg)
      ? right(arg)
      : left(authorizationCheck.errorCode);

/**
 * Compose eithers with flatmap
 */
const validateAuthorizationEither = <T>(
  arg: T,
  authorizationChecks: AuthorizationCheck<T>[]
) => {
  const [first, ...rest] = authorizationChecks;
  const firstEither = predicateEither(first);
  const chainedEithers = lodash.map(rest, e => chain(predicateEither(e)));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (<any>pipe)(firstEither(arg), ...chainedEithers);
};

/**
 * Authorization validate function
 */
export const validateAuthorization = <T>(
  arg: T,
  authorizationChecks: AuthorizationCheck<T>[]
): AuthorizationResult => {
  const resultEither = validateAuthorizationEither(arg, authorizationChecks);

  const result = <string>getOrElse(o => o)(resultEither);

  const isAuthorized = isRight(resultEither);

  return isAuthorized ? {isAuthorized} : {isAuthorized, errorCode: result};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const peek = (message: string) => (value: any) => {
  console.log(`<===${message}===>`);
  console.dir(value, {depth: null});
  return value;
};
