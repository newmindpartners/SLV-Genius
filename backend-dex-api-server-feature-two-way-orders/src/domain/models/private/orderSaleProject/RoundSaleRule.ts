/**
 * @warning any updates here should be accompanied with a prisma schema update to add the rule to the db enum
 */
export enum RoundSaleRule {
  PUBLIC_SALE_SINGLE_BUY = 'PUBLIC_SALE_SINGLE_BUY',
  PRIVATE_SALE_SINGLE_BUY = 'PRIVATE_SALE_SINGLE_BUY',
  PUBLIC_SALE_MULTI_BUY = 'PUBLIC_SALE_MULTI_BUY',
  PRIVATE_SALE_MULTI_BUY = 'PRIVATE_SALE_MULTI_BUY',
}
