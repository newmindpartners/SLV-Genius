import {
  isKycValid,
  isLatestTermsAccepted,
  isUserPresent,
} from '~/implementation/authorization/user/authorizationChecks';

export const userIsPresentAuthorization = [isUserPresent];
export const userIsPresentAndValidAuthorization = [
  isUserPresent,
  isKycValid,
  isLatestTermsAccepted,
];
