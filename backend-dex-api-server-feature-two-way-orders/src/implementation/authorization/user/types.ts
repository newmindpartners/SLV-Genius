import {
  AuthorizationCheck,
  AuthUserContext,
} from '~/implementation/authorization';

export type UserAuthorizationCheck = AuthorizationCheck<AuthUserContext>;
