import 'reflect-metadata';

import {TransactionalContext} from '~/domain/context';

import * as Core from '~/domain/models/core';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

export interface StakeVaultRepository {
  listStakeVaultsByStakeKeyHash(
    context: TransactionalContext,
    ownerWalletStakeKeyHash: string
  ): Promise<Private.StakeVault[]>;

  getStakeVaultByStakeVaultId(
    context: TransactionalContext,
    stakeVaultId: string
  ): Promise<Private.StakeVault>;

  getStakeVaultByTxHashAndIndex(
    context: TransactionalContext,
    txHash: string,
    txIndex: number
  ): Promise<Private.StakeVault>;

  getStakeVaultCreateEvent(
    context: TransactionalContext,
    stakeVaultId: string
  ): Promise<Private.StakeVaultEvent>;

  isStakeVaultUnstaked(
    context: TransactionalContext,
    stakeVaultId: string
  ): Promise<boolean>;

  getStakeVaultBlockSlotDate(
    context: TransactionalContext,
    stakeVaultId: string,
    eventType?: Private.StakeVaultEvent['eventType']
  ): Promise<Private.Block['slotDate']>;

  getStakeVaultEventBlockContextTimestamp(
    context: TransactionalContext,
    stakeVaultEventId: string
  ): Promise<Private.Block['slotDate']>;

  getAssetByStakeVaultId(
    context: TransactionalContext,
    stakeVaultId: string
  ): Promise<Private.Asset>;

  getStakeVaultStakedNftsByStakeVaultId(
    context: TransactionalContext,
    stakeVaultId: string
  ): Promise<Private.StakingNftWithMintingData[]>;

  getStakeVaultEventNftsByStakeVaultEventId(
    context: TransactionalContext,
    stakeVaultEventId: string
  ): Promise<Private.StakeVaultEventNft[]>;

  getStakingNftByStakeVaultEventNft(
    context: TransactionalContext,
    stakeVaultEventNft: Private.StakeVaultEventNft
  ): Promise<Private.StakingNftWithMintingData>;

  getStakingNftMintingDataByStakeVaultEventNft(
    context: TransactionalContext,
    stakeVaultEventNft: Private.StakeVaultEventNft
  ): Promise<Private.StakingNftMintingData>;

  /**
   * Some staking projects have a total limit of their token that can be locked.
   * If that limit is reached, we have to prevent further tokens from being staked.
   */
  getAggregateStakeVaultEventsStakedAmountByStakingProjectId(
    context: TransactionalContext,
    stakingProjectId: string
  ): Promise<Private.AggregateStakingProjectStakedAmounts | null>;

  userHasStakedVestingNft(
    context: TransactionalContext,
    ownerWalletStakeKeyHash: string
  ): Promise<boolean>;

  createStakeVault(
    context: TransactionalContext,
    user: Private.User,
    unsignedStakeVault: Pick<
      Public.UnsignedStakeVault,
      'stakedAssetAmount' | 'stakingProjectId' | 'stakingNfts' | 'lockDuration'
    >,
    unsignedTransaction: Private.UnsignedTransaction & Core.Transaction,
    startedAt: Date
  ): Promise<Public.UnsignedStakeVault>;

  createStakeVaultUnstakeEvent(
    context: TransactionalContext,
    stakeVaultId: string,
    unsignedTransaction: Private.UnsignedTransaction & Core.Transaction
  ): Promise<Private.StakeVaultEvent>;

  getStakeVaultStakedAssetAmount(
    context: TransactionalContext,
    stakeVaultId: string
  ): Promise<bigint>;

  getStakeVaultsByNftAssetId(
    prisma: TransactionalContext,
    assetId: string
  ): Promise<Private.StakeVaultWithEvents[]>;
}
