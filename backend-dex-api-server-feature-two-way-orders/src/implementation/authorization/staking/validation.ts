import {validateAuthorization} from '~/implementation/authorization/eitherUtils';
import {StakingEligibilityContext} from './types';

export const validateProjectAuthorization =
  validateAuthorization<StakingEligibilityContext>;
