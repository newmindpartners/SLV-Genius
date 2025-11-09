import * as Private from '~/domain/models/private';

import {
  AuthorizationResult,
  eligibilityCheckMap,
  validateProjectAuthorization,
} from '~/implementation/authorization';

import {getOrderSaleProjectRoundWhitelistStakeKeyHashes} from '~/domain/utils/project.util';

export interface ProjectService {
  validateUserProject(
    user: Private.User,
    ordersSale: Private.OrderSale[],
    orderSaleProject: Private.OrderSaleProject,
    orderSaleProjectRoundStatus: Private.OrderSaleProjectRound,
    orderSaleProjectCountryBlacklist: Private.OrderSaleProjectCountryBlacklist[]
  ): AuthorizationResult;
}

export class ProjectServiceImplementation implements ProjectService {
  validateUserProject(
    user: Private.User,
    userOrdersSale: Private.OrderSale[],
    orderSaleProject: Private.OrderSaleProject,
    orderSaleProjectRoundStatus: Private.OrderSaleProjectRound,
    orderSaleProjectCountryBlacklist: Private.OrderSaleProjectCountryBlacklist[]
  ): AuthorizationResult {
    const orderSaleProjectRoundWhitelist =
      getOrderSaleProjectRoundWhitelistStakeKeyHashes(
        orderSaleProjectRoundStatus
      );

    return this.validateUserProjectWithCurrentRoundIfThereIs(
      user,
      userOrdersSale,
      orderSaleProject,
      orderSaleProjectRoundStatus,
      orderSaleProjectRoundWhitelist,
      orderSaleProjectCountryBlacklist
    );
  }

  private validateUserProjectWithCurrentRoundIfThereIs(
    user: Private.User,
    userOrdersSale: Private.OrderSale[],
    orderSaleProject: Private.OrderSaleProject,
    orderSaleProjectRoundStatus: Private.OrderSaleProjectRound,
    orderSaleProjectRoundWhitelist: string[],
    orderSaleProjectCountryBlacklist: Private.OrderSaleProjectCountryBlacklist[]
  ) {
    const eligibilityContext = {
      user,
      userOrdersSale,
      orderSaleProject,
      orderSaleProjectRoundStatus,
      orderSaleProjectRoundWhitelist,
      orderSaleProjectCountryBlacklist: orderSaleProjectCountryBlacklist,
    };

    const roundEligibilityChecks =
      eligibilityCheckMap[orderSaleProjectRoundStatus.saleRule];

    const authorizationResult = validateProjectAuthorization(
      eligibilityContext,
      roundEligibilityChecks
    );

    return authorizationResult;
  }
}
