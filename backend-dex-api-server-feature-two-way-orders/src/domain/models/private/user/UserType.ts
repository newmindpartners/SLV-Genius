import * as Public from '~/domain/models/public';

export const UserType: {
  [type in Public.UserType]: Public.UserType;
} = {
  COMPANY: 'COMPANY',
  INDIVIDUAL: 'INDIVIDUAL',
};
