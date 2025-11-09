import {AuthorizationCheck} from '~/implementation/authorization';

import {AuthUserContext} from '~/implementation/authorization/user';

import {
  OrdersSaleContext,
  OrderSaleProjectContext,
  OrderSaleWithProjectContext,
  OrderSaleProjectRoundStatusContext,
  OrderSaleProjectCountryBlacklistContext,
} from '~/implementation/authorization/project/context.builders';

export type ProjectEligibilityContext = Pick<AuthUserContext, 'user'> &
  OrdersSaleContext &
  OrderSaleProjectContext &
  OrderSaleProjectRoundStatusContext &
  OrderSaleProjectCountryBlacklistContext;

export type OrderSaleCancellationContext = AuthUserContext &
  OrderSaleWithProjectContext;

export type ProjectAuthorizationCheck =
  AuthorizationCheck<ProjectEligibilityContext>;
