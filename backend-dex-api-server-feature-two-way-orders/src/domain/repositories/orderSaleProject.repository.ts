import 'reflect-metadata';

import {TransactionalContext} from '~/domain/context';

import {Hex} from '~/domain/models/cardano';

import * as Private from '~/domain/models/private';

export interface OrderSaleProjectRepository {
  /**
   * Get all projects' assets
   *
   * @param context transactional context
   */
  getProjectBaseAssets(context: TransactionalContext): Promise<Private.Asset[]>;

  /**
   * Get all projects' script addresses
   *
   * @param context transactional context
   */
  getProjectScriptAddresses(context: TransactionalContext): Promise<Hex[]>;

  /**
   * Get a project by projectId
   *
   * @param context transactional context
   * @param projectId project id
   * @param walletStakeKeyHash wallet stake key hash
   *
   * @return project
   **/
  getOrderSaleProjectByOrderSaleProjectId(
    context: TransactionalContext,
    projectId: string,
    walletStakeKeyHash?: string,
    webEnabled?: boolean
  ): Promise<Private.OrderSaleProject | null>;

  /**
   * Get a round id by round number and assetShortName
   * @param prisma
   * @param roundNumber
   * @param assetShortName
   */
  getRoundIdByAssetShortNameAndNumber(
    prisma: TransactionalContext,
    assetShortName: string,
    roundNumber: number
  ): Promise<string | null>;

  /**
   * Get a project by saleProjectRoundId
   *
   * @param context transactional context
   * @param saleProjectRoundId sale project's round id
   * @param walletStakeKeyHash wallet stake key hash
   *
   * @return project
   */
  getOrderSaleProjectByRoundId(
    context: TransactionalContext,
    saleProjectRoundId: string,
    walletStakeKeyHash?: string
  ): Promise<Private.OrderSaleProject | null>;

  /**
   * List Projects
   *
   * @param context transactional context
   * @param query order sale project query
   *
   * @return list of paginated order sale projects
   **/
  listOrderSaleProjects(
    context: TransactionalContext,
    query: Private.OrderSaleProjectQuery,
    walletStakeKeyHash?: string
  ): Promise<Private.PaginatedResults<Private.OrderSaleProject>>;

  /**
   * Add or remove from raised amount oder sale amount in ADA
   *
   * @param context transactional context
   * @param saleOrder open or cancel order
   */
  updateOrderSaleProjectRoundAmountWithOrderSale(
    context: TransactionalContext,
    saleOrder: Private.OrderSale
  ): Promise<void>;

  /**
   * Update the properties price USD/Lovelace and scriptAddress from a round.
   *
   * @param context transactional context
   * @param projectRound project round reference
   * @param setPrice set price usd and lovelace
   * @param setScriptAddress set script address
   */
  updateOrderSaleProjectRoundPriceAndScriptAddress(
    context: TransactionalContext,
    projectRound: Private.OrderSaleProjectRound,
    setPrice: Private.OrderSaleProjectRoundSetPrice,
    setScriptAddress: Private.OrderSaleProjectRoundSetScriptAddress
  ): Promise<void>;
}
