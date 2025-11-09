import {filter, flatten, includes, isEmpty} from 'lodash';

import {container} from 'tsyringe';

import {RoundSaleRule} from '~/domain/models/private';

import {CountryServiceImplementation} from '~/domain/services';

import {
  AuthorizationCheck,
  ProjectEligibilityContext,
  OrderSaleCancellationContext,
} from '~/implementation/authorization';

import {
  AuthUserContext,
  isUserPresent,
} from '~/implementation/authorization/user';

import {
  cancellationContextBuilder,
  projectContextBuilder,
  OrderSaleProjectRoundStatusContext,
  orderSaleContextBuilder,
} from '~/implementation/authorization/project/context.builders';

import {userContextBuilder} from '~/implementation/authorization/user/context.builders';

import {getOrderSaleProjectRoundWhitelistStakeKeyHashes} from '~/domain/utils/project.util';

import {isAfter, isEqual} from 'date-fns';

const projectUserCtxBuilders = [projectContextBuilder, userContextBuilder];

const projectUserOrderSaleCtxBuilders = [
  orderSaleContextBuilder,
  ...projectUserCtxBuilders,
];

const countryService = () => container.resolve(CountryServiceImplementation);

/**
 * @param {ProjectEligibilityContext}  - ProjectEligibilityContext
 * @returns {boolean} - true if the user, project and saleOrders exist
 * A function that takes an object as input and checks that all attributes are present
 */
function authPreConditions({
  user,
  userOrdersSale,
  orderSaleProject,
  orderSaleProjectRoundStatus,
}: ProjectEligibilityContext): boolean {
  const isUserExist = !!user;
  const isRoundExists = !!orderSaleProjectRoundStatus;
  const isProjectExist = !!orderSaleProject;
  const isOrdersSaleExist = !!userOrdersSale;
  return isUserExist && isRoundExists && isProjectExist && isOrdersSaleExist;
}

/**** predicates ****/

/**
 * isPreviousRoundWhitelistedPredicate
 */
const isPreviousRoundWhitelistedPredicate = ({
  user,
  orderSaleProjectRoundStatus,
  orderSaleProject: {round: rounds},
}: ProjectEligibilityContext) => {
  const earlierRounds = filter(
    rounds,
    otherRound => otherRound.number < orderSaleProjectRoundStatus.number
  );

  const earlierRoundWhitelistWalletAddresses = flatten(
    earlierRounds.map(getOrderSaleProjectRoundWhitelistStakeKeyHashes)
  );

  const isPreviousRoundWhitelisted = includes(
    earlierRoundWhitelistWalletAddresses,
    user?.walletStakeKeyHash
  );

  return isPreviousRoundWhitelisted;
};

/**
 * isCurrentRoundWhitelistedPredicate
 */
export const isCurrentRoundWhitelistedPredicate = ({
  user,
  orderSaleProjectRoundStatus: {roundWhitelist},
}: AuthUserContext & OrderSaleProjectRoundStatusContext) => {
  const walletStakeKeyHash = user?.walletStakeKeyHash;

  const roundWhitelistWalletStakeKeyHash = roundWhitelist.map(
    roundWhitelist => roundWhitelist.walletStakeKeyHash
  );

  const isCurrentRoundWhitelisted = walletStakeKeyHash
    ? includes(roundWhitelistWalletStakeKeyHash, walletStakeKeyHash)
    : false;

  return isCurrentRoundWhitelisted;
};

/**
 * isNoCurrentRoundPurchase
 */
const isNoCurrentRoundPurchasePredicate = (
  projectEligibilityContext: ProjectEligibilityContext
) => {
  const {orderSaleProjectRoundStatus, userOrdersSale} =
    projectEligibilityContext;
  const {roundId: currentRoundId} = orderSaleProjectRoundStatus;

  const preConditions = authPreConditions(projectEligibilityContext);

  const isNoCurrentOrderSale = !includes(
    userOrdersSale.map(({roundId}) => roundId),
    currentRoundId
  );

  return preConditions && isNoCurrentOrderSale;
};

/**
 * isUserOrderOwner
 */
export const isUserOrderOwner = (
  orderSaleCancellationContext: OrderSaleCancellationContext
) => {
  const {user, orderSaleEntityWithOrderSaleProject} =
    orderSaleCancellationContext;

  const orderOwnerId = orderSaleEntityWithOrderSaleProject.user.userId;

  const userCheck = orderOwnerId === user?.userId;

  return userCheck;
};

/**
 * isDistributionDatePast
 */
export const isDistributionDatePast = (
  orderSaleCancellationContext: OrderSaleCancellationContext
) => {
  const {orderSaleProject} =
    orderSaleCancellationContext.orderSaleEntityWithOrderSaleProject.round;

  const distributionDateCheck =
    isAfter(new Date(), orderSaleProject.distributionDate) ||
    isEqual(new Date(), orderSaleProject.distributionDate);

  return distributionDateCheck;
};

/**** AuthorizationChecks ****/

export const isNoPreviousProjectRoundPurchase: AuthorizationCheck<ProjectEligibilityContext> =
  {
    errorCode: 'PREVIOUS_PROJECT_ROUND_PURCHASE',
    predicate: (projectEligibilityContext: ProjectEligibilityContext) => {
      const {userOrdersSale} = projectEligibilityContext;
      const preConditions = authPreConditions(projectEligibilityContext);

      const isNoPreviousOrderSaleExists = isEmpty(userOrdersSale);

      return preConditions && isNoPreviousOrderSaleExists;
    },
    requestContextBuilder: projectUserOrderSaleCtxBuilders,
  };

export const isUserNotCountryBlacklisted: AuthorizationCheck<ProjectEligibilityContext> =
  {
    errorCode: 'USER_COUNTRY_BLACKLISTED',
    predicate: (projectEligibilityContext: ProjectEligibilityContext) => {
      const {user, orderSaleProjectCountryBlacklist} =
        projectEligibilityContext;

      return countryService().validateUserCountryEligibility(
        user!,
        orderSaleProjectCountryBlacklist
      );
    },
    requestContextBuilder: projectUserCtxBuilders,
  };

export const isPreviousRoundWhitelisted: AuthorizationCheck<ProjectEligibilityContext> =
  {
    errorCode: 'USER_NOT_PREVIOUS_ROUND_WHITELISTED',
    predicate: isPreviousRoundWhitelistedPredicate,
    requestContextBuilder: projectUserCtxBuilders,
  };

export const isCurrentRoundWhitelisted: AuthorizationCheck<ProjectEligibilityContext> =
  {
    errorCode: 'USER_NOT_ROUND_WHITELISTED',
    predicate: isCurrentRoundWhitelistedPredicate,
    requestContextBuilder: projectUserCtxBuilders,
  };

export const isNoCurrentRoundPurchase: AuthorizationCheck<ProjectEligibilityContext> =
  {
    errorCode: 'ONLY_ONE_ORDER_PER_ROUND_ALLOWED',
    predicate: isNoCurrentRoundPurchasePredicate,
    requestContextBuilder: projectUserOrderSaleCtxBuilders,
  };

export const isCancellationValid: AuthorizationCheck<OrderSaleCancellationContext> =
  {
    errorCode: 'CANCELLATION_INVALID',
    predicate: (orderSaleCancellationContext: OrderSaleCancellationContext) =>
      isUserOrderOwner(orderSaleCancellationContext) &&
      isDistributionDatePast(orderSaleCancellationContext),
    requestContextBuilder: [userContextBuilder, cancellationContextBuilder],
  };

/**
 * Authorization check collections for project statusRound eligibility
 */
const defaultEligibilityChecks: (
  | AuthorizationCheck<ProjectEligibilityContext>
  | AuthorizationCheck<AuthUserContext>
)[] = [isUserPresent, isUserNotCountryBlacklisted];

export const eligibilityCheckMap = {
  [RoundSaleRule.PRIVATE_SALE_SINGLE_BUY]: [
    ...defaultEligibilityChecks,
    isNoCurrentRoundPurchase,
    isCurrentRoundWhitelisted,
  ],

  [RoundSaleRule.PUBLIC_SALE_SINGLE_BUY]: [
    ...defaultEligibilityChecks,
    isNoCurrentRoundPurchase,
  ],

  [RoundSaleRule.PUBLIC_SALE_MULTI_BUY]: [
    ...defaultEligibilityChecks,
    isUserPresent,
  ],

  [RoundSaleRule.PRIVATE_SALE_MULTI_BUY]: [
    ...defaultEligibilityChecks,
    isUserPresent,
    isCurrentRoundWhitelisted,
  ],
};
