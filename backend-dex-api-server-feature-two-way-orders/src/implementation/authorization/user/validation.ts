import {validateAuthorization} from '~/implementation/authorization/eitherUtils';
import {AuthUserContext} from './context.builders';

export const validateUserAuthorization = validateAuthorization<AuthUserContext>;
