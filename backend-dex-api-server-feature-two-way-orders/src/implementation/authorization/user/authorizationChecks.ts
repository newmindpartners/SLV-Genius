import {container} from 'tsyringe';

import {memoize} from 'lodash';

import {TermsServiceImplementation} from '~/domain/services';

import {AuthUserContext} from '~/implementation/authorization/user';

import {userContextBuilder} from '~/implementation/authorization/user/context.builders';

const termsService = memoize(() =>
  container.resolve(TermsServiceImplementation)
);

/**
 * @NOTE Does *not* test whether user is valid.
 * There are cases in which we wish to return data for `get` requests without blocking the user
 * These endpoints should however only return data for existing users.
 */
export const isUserPresent = {
  errorCode: 'INVALID_OR_OMITTED_USER',
  predicate: ({user}: AuthUserContext) => !!user,
  requestContextBuilder: [userContextBuilder],
};

export const isLatestTermsAccepted = {
  errorCode: 'LATEST_TERMS_NOT_ACCEPTED',
  predicate: ({user}: AuthUserContext) => {
    return !termsService().getLatestUserTerms(
      user?.acceptedTermsVersion || null
    ).isTermsAcceptanceRequired;
  },
  requestContextBuilder: [userContextBuilder],
};

export const isKycValid = {
  errorCode: 'KYC_NOT_VALID',
  predicate: ({user}: AuthUserContext) => {
    return !!user?.userKyc?.isLatestKycValidResult;
  },
  requestContextBuilder: [userContextBuilder],
};
