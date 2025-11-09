import {validateAuthorization} from '~/implementation/authorization/eitherUtils';
import {ProjectEligibilityContext} from './types';

export const validateProjectAuthorization =
  validateAuthorization<ProjectEligibilityContext>;
