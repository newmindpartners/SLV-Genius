import 'reflect-metadata';

import {TransactionalContext} from '~/domain/context';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import {StakingProjectsQuery} from '~/domain/models/private';

export interface StakingProjectRepository {
  getStakingProjectByStakingProjectId(
    context: TransactionalContext,
    stakingProjectId: string
  ): Promise<Private.StakingProject>;

  getStakingProjectByAssetShortName(
    context: TransactionalContext,
    assetShortName: string
  ): Promise<Private.StakingProject | null>;

  /**
   * Get the Asset of a Staking Project
   */
  getStakingProjectAsset(
    context: TransactionalContext,
    stakingProjectId: string
  ): Promise<Public.Asset>;

  /**
   * List all staking projects used to create stake vaults
   *
   * @param context transactional context
   * @param query
   *
   * @return list of all staking projects
   */
  listStakingProjects(
    context: TransactionalContext,
    query: StakingProjectsQuery
  ): Promise<Public.StakingProject[]>;

  /**
   * List all staking projects used to create stake vaults
   *
   * @param context transactional context
   * @param stakingProjectId id for which staking project the nfts belong to
   *
   * @return list of all nfts that can be staked in a stake vault for this project
   */
  listStakingProjectNfts(
    context: TransactionalContext,
    stakingProjectId: string
  ): Promise<Private.StakingNft[]>;

  listStakingProjectLockOptions(
    prisma: TransactionalContext,
    stakingProjectId: string
  ): Promise<Private.StakingProjectLockOption[]>;

  getStakingProjectLockOption(
    prisma: TransactionalContext,
    stakingProjectId: string,
    lockDuration: Private.StakeVaultLockDuration
  ): Promise<Private.StakingProjectLockOption | null>;

  getSigningServerUrl(
    context: TransactionalContext,
    stakingProjectId: string
  ): Promise<string | null>;
}
