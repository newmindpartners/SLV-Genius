import 'reflect-metadata';

import {inject, injectable, singleton} from 'tsyringe';

import * as Core from '~/domain/models/core';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import * as stakingUtil from '~/domain/utils/staking.util';

import {TransactionalContext} from '~/domain/context';
import {ConfigService, CoreService, StakeVaultService} from '~/domain/services';

import {
  AssetRepository,
  StakeVaultRepository,
  StakingNftRepository,
  StakingProjectRepository,
  TransactionRepository,
} from '~/domain/repositories';

import {now} from '~/domain/utils/date.util';
import {DomainMapper} from '~/implementation/prisma/domain.mapper';
import {filter, flatten, map, reduce} from 'lodash';
import {optional} from '~/domain/utils/object.util';
import {PublicError, PublicErrorCode} from '~/domain/errors';
import * as assetUtil from '~/domain/utils/asset.util';
import {getCardanoTransactionUrl} from '~/domain/utils/url.util';
import {walletAddressHexToStakeKeyHash} from '~/domain/utils/wallet.util';
import {
  fullHexAssetIdToPartialBech32AssetId,
  isAssetIdBech32,
} from '~/domain/utils/asset.util';
import {Bech32} from '~/domain/models/cardano';

@singleton()
@injectable()
export class StakeVaultApplication {
  constructor(
    @inject('StakeVaultRepository')
    private readonly stakeVaultRepository: StakeVaultRepository,

    @inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,

    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper,

    @inject('StakeVaultService')
    private readonly stakeVaultService: StakeVaultService,

    @inject('StakingProjectRepository')
    private readonly stakingProjectRepository: StakingProjectRepository,

    @inject('StakingNftRepository')
    private readonly stakingNftRepository: StakingNftRepository,

    @inject('CoreService')
    private readonly coreService: CoreService,

    @inject('ConfigService')
    private readonly configService: ConfigService
  ) {}

  private async stakeVaultEventToPublicStakingNfts(
    context: TransactionalContext,
    stakeVaultEvent: Private.StakeVaultEvent,
    stakedAsset: Private.Asset,
    ownerWalletStakeKeyHash: string,
    isStakeVaultUnlocked: boolean
  ): Promise<Public.StakingNft[]> {
    const stakeVaultEventNfts: Private.StakeVaultEventNft[] =
      await this.stakeVaultRepository.getStakeVaultEventNftsByStakeVaultEventId(
        context,
        stakeVaultEvent.stakeVaultEventId
      );

    return Promise.all(
      map(
        stakeVaultEventNfts,
        async (stakeVaultEventNft: Private.StakeVaultEventNft) => {
          const mintingData: Private.StakingNftMintingData =
            await this.stakeVaultRepository.getStakingNftMintingDataByStakeVaultEventNft(
              context,
              stakeVaultEventNft
            );

          const stakingNft: Private.StakingNft =
            await this.stakeVaultRepository.getStakingNftByStakeVaultEventNft(
              context,
              stakeVaultEventNft
            );

          const nftVestingAmountOrNull = stakingUtil.isVestingNft(
            stakingNft.type
          )
            ? await this.assetRepository.getStakingAssetVesting(
                context,
                stakedAsset.assetId,
                ownerWalletStakeKeyHash
              )
            : null;

          const vestingBoost =
            isStakeVaultUnlocked || nftVestingAmountOrNull === null
              ? null
              : String(nftVestingAmountOrNull);

          const publicStakingNft: Public.StakingNft =
            this.domainMapper.toPublicStakingNft(
              stakingNft,
              mintingData,
              vestingBoost
            );

          return publicStakingNft;
        }
      )
    );
  }

  /**
   * Ideally we would implement this in the domain mapper, but due to the nested
   * repository calls it's not feasible to make this function synchronous.
   */
  private async toPublicStakeVault(
    context: TransactionalContext,
    stakeVault: Private.StakeVault,
    ownerWalletStakeKeyHash: string
  ): Promise<Public.StakeVault> {
    const isStakeVaultUnstaked =
      await this.stakeVaultRepository.isStakeVaultUnstaked(
        context,
        stakeVault.stakeVaultId
      );

    const stakedAsset: Private.Asset =
      await this.stakeVaultRepository.getAssetByStakeVaultId(
        context,
        stakeVault.stakeVaultId
      );

    const publicAsset: Public.Asset =
      this.domainMapper.toPublicAsset(stakedAsset);

    const isStakeVaultUnlocked =
      this.stakeVaultService.isStakeVaultUnlocked(stakeVault);

    /**
     * Stake vaults can only add assets and NFTs in the 'CREATE' event.
     */
    const CREATE: Private.StakeVaultEvent['eventType'] = 'CREATE';
    const stakeVaultCreateEvents = stakeVault.stakeVaultEvent.filter(
      event => event.eventType === CREATE
    );

    const publicStakingNfts: Public.StakingNft[] = flatten(
      await Promise.all(
        map(
          stakeVaultCreateEvents,
          async stakeVaultEvent =>
            await this.stakeVaultEventToPublicStakingNfts(
              context,
              stakeVaultEvent,
              stakedAsset,
              ownerWalletStakeKeyHash,
              isStakeVaultUnlocked
            )
        )
      )
    );

    const stakingNfts =
      await this.stakeVaultRepository.getStakeVaultStakedNftsByStakeVaultId(
        context,
        stakeVault.stakeVaultId
      );

    const flexOptionInStakingProject: Private.StakingProjectLockOption | null =
      await this.stakingProjectRepository.getStakingProjectLockOption(
        context,
        stakeVault.stakingProjectId,
        'FLEX'
      );

    /**
     * We cannot feasibly determine the NFT APY for the inactive and active
     * reward states. We will only calculate the APY that the NFT is currently
     * adding to the active stake vault.
     * This may in certain conditions communicate to the client that the
     * inactive reward state had a lower NFT APY than it actually did at that
     * point in time (due to NFT having more utility duration left).
     */
    const hasTransitionedIntoFlex =
      stakeVault.type === 'REVENUE_AMPLIFYING' &&
      stakeVault.lockDuration !== 'FLEX' &&
      flexOptionInStakingProject !== null &&
      isStakeVaultUnlocked;

    const isStakeVaultFlex =
      stakeVault.lockDuration === 'FLEX' || hasTransitionedIntoFlex;

    const activeLockPeriod: Private.StakeVaultLockDuration =
      hasTransitionedIntoFlex
        ? flexOptionInStakingProject.lockDuration
        : stakeVault.lockDuration;

    const excludeStakeVaultsStartedAfter: Date = isStakeVaultFlex
      ? now()
      : stakeVault.startedAt;

    const {nftsApySum} = await this.calcStakeVaultNftsApySum(
      context,
      stakingNfts,
      activeLockPeriod,
      /**
       * If the stake vault has transitioned into Flex it's important that we
       * do not exclude the locked stake vault when calculating remaining
       * utility on its NFTs.
       */
      isStakeVaultFlex ? null : stakeVault.stakeVaultId,
      excludeStakeVaultsStartedAfter
    );

    const {inactiveRewardState, activeRewardState} =
      this.stakeVaultService.getStakeVaultRewardState(
        stakeVault,
        flexOptionInStakingProject,
        isStakeVaultUnlocked,
        nftsApySum
      );

    const publicInactiveRewardState: Public.StakeVaultRewardState | null =
      inactiveRewardState
        ? this.domainMapper.toPublicStakeVaultRewardState(inactiveRewardState)
        : null;

    const publicActiveRewardState: Public.StakeVaultRewardState | null =
      activeRewardState
        ? this.domainMapper.toPublicStakeVaultRewardState(activeRewardState)
        : null;

    const stakedAssetAmount =
      await this.stakeVaultRepository.getStakeVaultStakedAssetAmount(
        context,
        stakeVault.stakeVaultId
      );

    const isStakeVaultUnstakable = await this.isStakeVaultUnstakable(
      context,
      stakeVault.stakeVaultId
    );

    const unlocksAt = stakeVault.unlocksAt
      ? stakeVault.unlocksAt.toISOString()
      : null;

    const publicStakeVault: Public.StakeVault = {
      ...(publicInactiveRewardState
        ? {inactiveRewardState: publicInactiveRewardState}
        : {}),
      ...(publicActiveRewardState
        ? {activeRewardState: publicActiveRewardState}
        : {}),
      stakeVaultId: stakeVault.stakeVaultId,
      stakedAsset: publicAsset,
      stakedAssetAmount: String(stakedAssetAmount),
      stakedStakingNfts: publicStakingNfts,
      isUnstaked: isStakeVaultUnstaked,
      isUnstakingEnabled: isStakeVaultUnstakable,
      ...optional({unlocksAt}),
    };

    return publicStakeVault;
  }

  async listStakeVaultsByStakeKeyHash(
    context: TransactionalContext,
    query: Private.StakeVaultsQuery
  ): Promise<Private.PaginatedResults<Public.StakeVault>> {
    const {filterByWalletStakeKeyHash: ownerWalletStakeKeyHash} = query;

    if (ownerWalletStakeKeyHash) {
      const stakeVaults: Private.StakeVault[] =
        await this.stakeVaultRepository.listStakeVaultsByStakeKeyHash(
          context,
          ownerWalletStakeKeyHash
        );

      const publicStakeVaults: Public.StakeVault[] = await Promise.all(
        stakeVaults.map(stakeVault =>
          this.toPublicStakeVault(context, stakeVault, ownerWalletStakeKeyHash)
        )
      );

      const results: Public.StakeVault[] = publicStakeVaults;

      const count = results.length;

      const response: Private.PaginatedResults<Public.StakeVault> = {
        count,
        results,
      };

      return response;
    } else {
      return Private.emptyResults();
    }
  }

  async createStakeVault(
    context: TransactionalContext,
    user: Private.User,
    data: Public.StakeVaultData,
    walletAccount: Public.WalletAccount
  ): Promise<Public.UnsignedStakeVault> {
    const lockDuration = data.lockDuration;
    const startedAt = now();
    const unlocksAt = this.stakeVaultService
      .getLockedUntilDate(startedAt, lockDuration)
      .toISOString();

    const stakingNftsContainVestingNft = data.stakingNfts.reduce(
      (foundVestingNft, stakingNft) =>
        foundVestingNft || stakingUtil.isVestingNft(stakingNft.type),
      false
    );

    if (stakingNftsContainVestingNft) {
      throw new PublicError(
        PublicErrorCode.INVALID_STAKE_VAULT__VESTING_NFTS_NOT_ALLOWED
      );
    }

    const coreStakingRequest: Core.StakeVaultCreateRequest =
      await this.getCoreStakingRequest(
        context,
        {
          stakingProjectId: data.stakingProjectId,
          stakingNfts: data.stakingNfts,
          stakedAssetAmount: data.stakedAssetAmount,
          unlocksAt,
        },
        walletAccount
      );

    /**
     * Make request to Core tx server.
     * Response contains data needed to be signed by wallet and passed to submit endpoint.
     */
    const unsignedTransaction: Private.UnsignedTransaction & Core.Transaction =
      await this.coreService.stakeVaultCreate(coreStakingRequest);

    const transactionUrl = getCardanoTransactionUrl(
      this.configService.getCardanoTransactionUrlTemplate(),
      unsignedTransaction.transactionHash
    );

    const unsignedStakeVault: Public.UnsignedStakeVault = {
      stakeVaultId: unsignedTransaction.transactionId,
      stakingProjectId: data.stakingProjectId,
      stakedAssetAmount: data.stakedAssetAmount,
      lockDuration,
      unlocksAt,
      stakingNfts: data.stakingNfts,
      transactionId: unsignedTransaction.transactionId,
      transactionPayload: unsignedTransaction.transactionPayload,
      transactionUrl,
    };

    const savedStakeVault: Public.UnsignedStakeVault =
      await this.stakeVaultRepository.createStakeVault(
        context,
        user,
        unsignedStakeVault,
        unsignedTransaction,
        startedAt
      );

    return Promise.resolve(savedStakeVault);
  }

  async unstakeStakeVault(
    context: TransactionalContext,
    data: Public.UnstakeStakeVaultData,
    walletAccount: Public.WalletAccount
  ): Promise<Public.UnsignedUnstakeStakeVault> {
    const coreUnstakeRequest: Core.StakingStakeUnstakeRequest =
      await this.getCoreStakingUnstakeRequest(
        context,
        {
          stakeVaultId: data.stakeVaultId,
        },
        walletAccount
      );

    /**
     * Make request to Core tx server.
     * Response contains data needed to be signed by wallet and passed to submit endpoint.
     */
    const unsignedTransaction: Private.UnsignedTransaction & Core.Transaction =
      await this.coreService.stakingStakeVaultUnstake(coreUnstakeRequest);

    const transactionUrl = getCardanoTransactionUrl(
      this.configService.getCardanoTransactionUrlTemplate(),
      unsignedTransaction.transactionHash
    );

    const unsignedStakeVault: Public.UnsignedUnstakeStakeVault = {
      stakeVaultId: data.stakeVaultId,
      transactionUrl,
      transactionId: unsignedTransaction.transactionId,
      transactionPayload: unsignedTransaction.transactionPayload,
    };

    await this.stakeVaultRepository.createStakeVaultUnstakeEvent(
      context,
      data.stakeVaultId,
      unsignedTransaction
    );

    return Promise.resolve(unsignedStakeVault);
  }

  async getStakingRewardsEstimate(
    context: TransactionalContext,
    walletAccount: Public.WalletAccount,
    stakeVaultData: Public.StakeVaultData
  ): Promise<Public.StakeVaultCreateRewardsEstimate> {
    const walletStakeKeyHash = walletAddressHexToStakeKeyHash(
      walletAccount.walletAddress
    );

    if (!walletStakeKeyHash) {
      throw new PublicError(
        PublicErrorCode.INVALID_STAKE_VAULT__WALLET_ADDRESS_MISSING_STAKE_PART
      );
    }

    const stakingNftsContainVestingNft = stakeVaultData.stakingNfts.reduce(
      (foundVestingNft, stakingNft) =>
        foundVestingNft || stakingUtil.isVestingNft(stakingNft.type),
      false
    );

    if (stakingNftsContainVestingNft) {
      throw new PublicError(
        PublicErrorCode.INVALID_STAKE_VAULT__VESTING_NFTS_NOT_ALLOWED
      );
    }

    const lockOption =
      await this.stakingProjectRepository.getStakingProjectLockOption(
        context,
        stakeVaultData.stakingProjectId,
        stakeVaultData.lockDuration
      );

    if (!lockOption) {
      throw new PublicError(
        PublicErrorCode.INVALID_STAKE_VAULT__INVALID_LOCK_DURATION
      );
    }

    const stakingNftAssetIds = map(
      stakeVaultData.stakingNfts,
      ({assetName, policyId}) => assetUtil.assetId(policyId, assetName)
    );

    const stakingNfts =
      await this.stakingNftRepository.getStakingNftsByAssetIds(
        context,
        stakingNftAssetIds
      );

    const {nftsApySum, nftsApyDisclaimer} = await this.calcStakeVaultNftsApySum(
      context,
      stakingNfts,
      stakeVaultData.lockDuration
    );

    const totalApy: number | null =
      this.stakeVaultService.calcTotalStakeVaultApy(lockOption.apy, nftsApySum);

    const totalRevenueAmplifier: number | null = lockOption.revenueAmplifier;

    const stakedAssetAmount =
      BigInt(stakeVaultData.stakedAssetAmount) || BigInt(0);

    const totalRewardForLockDurationAndNfts =
      this.stakeVaultService.getTotalRewardForLockDuration(
        stakeVaultData.lockDuration,
        stakedAssetAmount,
        totalApy || 0
      );

    const rewards: Public.StakeVaultCreateRewardsEstimate = {
      totalAssetAmountReward: String(totalRewardForLockDurationAndNfts),
      ...(totalApy !== null ? {totalApyBoost: String(totalApy)} : {}),
      ...(nftsApySum !== null ? {nftsApyBoost: String(nftsApySum)} : {}),
      ...(totalRevenueAmplifier
        ? {totalRevenueAmplifier: String(totalRevenueAmplifier)}
        : {}),
      nftsApyDisclaimer,
    };

    return rewards;
  }

  async calcStakeVaultNftsApySum(
    context: TransactionalContext,
    stakingNfts: Private.StakingNftWithMintingData[],
    stakeVaultLockDuration: Private.StakeVaultLockDuration,
    /**
     * When calculating the utlity remaining on an NFT it is important that we
     * exclude the stake vault that we are currently calculating the APY for.
     * Otherwise we will display a lower utility that suggests the NFT has been
     * used for longer than it has.
     */
    stakeVaultIdToExclude: string | null = null,
    /**
     * An NFT used in an older stake vault may have a different utility duration
     * than the NFT used in the current stake vault.
     * This parameter allows us to filter out future stake vaults.
     */
    excludeStakeVaultsStartedAfter?: Date
  ): Promise<{nftsApySum: number | null; nftsApyDisclaimer?: string}> {
    if (stakingNfts.length === 0) {
      return {nftsApySum: null};
    }

    const nftsApySumWithDisclaimer = await reduce(
      stakingNfts,
      async (nftsApySumWithDisclaimerP, stakingNft) => {
        const nftsApySumWithDisclaimer = await nftsApySumWithDisclaimerP;
        const nftApyBoost: number = stakingNft.apyBoost || 0;
        const isUtilityDurationNft =
          stakingNft.stakingNftMintingData.utilityDurationSeconds;

        if (typeof isUtilityDurationNft === 'number') {
          const stakeVaults: Private.StakeVaultWithEvents[] =
            await this.stakeVaultRepository.getStakeVaultsByNftAssetId(
              context,
              stakingNft.stakingNftMintingData.assetId
            );

          const stakeVaultsExcluding = filter(
            stakeVaults,
            ({stakeVaultId}) => stakeVaultId !== stakeVaultIdToExclude
          );

          const stakeVaultsCreatedBeforeCurrent = excludeStakeVaultsStartedAfter
            ? filter(
                stakeVaultsExcluding,
                ({startedAt}) => startedAt < excludeStakeVaultsStartedAfter
              )
            : stakeVaultsExcluding;

          // This is the seconds remaining on NFT before staked in current stake vault
          const {secondsRemaining: secondsRemainingOnNft} =
            await this.getStakeVaultNftUsageReport(
              context,
              stakingNft.stakingNftMintingData.assetId,
              stakeVaultsCreatedBeforeCurrent
            );

          const newNftsApySumWithDisclaimer =
            this.stakeVaultService.calcStakeVaultApySum(
              secondsRemainingOnNft,
              stakeVaultLockDuration,
              nftsApySumWithDisclaimer.nftsApySum,
              nftApyBoost
            );

          return Promise.resolve({
            ...nftsApySumWithDisclaimer,
            ...newNftsApySumWithDisclaimer,
          });
        } else {
          return Promise.resolve({
            ...nftsApySumWithDisclaimer,
            nftsApySum: nftsApySumWithDisclaimer.nftsApySum + nftApyBoost,
          });
        }
      },
      Promise.resolve({
        nftsApySum: 0,
      })
    );

    return nftsApySumWithDisclaimer;
  }

  private async isStakeVaultUnstakable(
    context: TransactionalContext,
    stakeVaultId: string
  ): Promise<boolean> {
    const isStakeVaultUnstaked =
      await this.stakeVaultRepository.isStakeVaultUnstaked(
        context,
        stakeVaultId
      );

    if (isStakeVaultUnstaked) {
      return false;
    } else {
      const stakeVault =
        await this.stakeVaultRepository.getStakeVaultByStakeVaultId(
          context,
          stakeVaultId
        );

      const isStakeVaultUnlocked =
        this.stakeVaultService.isStakeVaultUnlocked(stakeVault);

      return isStakeVaultUnlocked === true;
    }
  }

  private async getStakeVaultCreateContractAddressUtxo(
    context: TransactionalContext,
    stakeVaultId: string
  ): Promise<string> {
    const {transactionHash} =
      await this.stakeVaultRepository.getStakeVaultCreateEvent(
        context,
        stakeVaultId
      );

    if (!transactionHash) {
      throw new Error(
        'Stake vault create event does not have a transactionHash'
      );
    }

    const createContractAddress =
      this.stakeVaultService.getStakeVaultCreateContractOnChainAddress();

    const txOutputs =
      await this.transactionRepository.getTransactionOutputByTransactionHashAndScriptAddresses(
        context,
        [createContractAddress],
        transactionHash
      );

    const stakeVaultCreateUtxo =
      this.stakeVaultService.getUtxoAtContractAddress('CREATE', txOutputs);

    if (stakeVaultCreateUtxo === null) {
      throw new Error('Stake vault UTxO not found for existing stake vault');
    }

    return stakeVaultCreateUtxo;
  }

  async getStakeVaultNftUsageReport(
    context: TransactionalContext,
    assetIdUnknownFormat: string,
    stakeVaultsToCheckIfUsedAssetId?: Private.StakeVaultWithEvents[]
  ): Promise<{secondsRemaining: number | null}> {
    const assetId: Bech32 = isAssetIdBech32(assetIdUnknownFormat)
      ? assetIdUnknownFormat
      : fullHexAssetIdToPartialBech32AssetId(assetIdUnknownFormat);

    const stakeVaults =
      stakeVaultsToCheckIfUsedAssetId ||
      (await this.stakeVaultRepository.getStakeVaultsByNftAssetId(
        context,
        assetId
      ));

    const stakingNftMintingData =
      await this.stakingNftRepository.getStakingNftMintingDataByAssetId(
        context,
        assetId
      );

    if (!stakingNftMintingData?.utilityDurationSeconds)
      return {secondsRemaining: null};

    const secondsRemaining =
      this.stakeVaultService.calcNftUtilityInSecondsRemaining(
        stakeVaults,
        stakingNftMintingData.utilityDurationSeconds
      );

    return {secondsRemaining};
  }

  private async getCoreStakingRequest(
    context: TransactionalContext,
    stakeVaultData: Pick<
      Public.StakeVaultData,
      'stakingProjectId' | 'stakingNfts' | 'stakedAssetAmount'
    > &
      Pick<Public.StakeVault, 'unlocksAt'>,
    walletAccount: Public.WalletAccount
  ): Promise<Core.StakeVaultCreateRequest> {
    const stakingProjectAsset =
      await this.stakingProjectRepository.getStakingProjectAsset(
        context,
        stakeVaultData.stakingProjectId
      );

    const mainStakingAsset = {
      policyId: stakingProjectAsset.policyId,
      assetName: stakingProjectAsset.assetName,
      assetAmount: Number(stakeVaultData.stakedAssetAmount),
    };

    const nftStakingAssets = stakeVaultData.stakingNfts.map(
      ({assetName, policyId}) => ({
        policyId,
        assetName,
        assetAmount: 1,
      })
    );

    const stakingAssets = [mainStakingAsset, ...nftStakingAssets];

    const coreStakingRequest: Core.StakeVaultCreateRequest = {
      stakingAssets,
      walletAddress: walletAccount.walletAddress,
      walletUnusedAddresses: walletAccount.walletUnusedAddresses,
      walletUsedAddresses: walletAccount.walletUsedAddresses,
      collateralUtxo: walletAccount.collateralUtxo,
      // TODO: This fallback is needed because core currently requires lockedUntil
      // I believe that's incorrect, as a "flex" stake vault won't be locked.
      lockedUntil: stakeVaultData.unlocksAt || now().toISOString(),
    };

    return coreStakingRequest;
  }

  private async getCoreStakingUnstakeRequest(
    context: TransactionalContext,
    data: Public.UnstakeStakeVaultData,
    walletAccount: Public.WalletAccount
  ): Promise<Core.StakingStakeUnstakeRequest> {
    const stakeVaultCreateUtxo =
      await this.getStakeVaultCreateContractAddressUtxo(
        context,
        data.stakeVaultId
      );

    const coreUnstakeRequest: Core.StakingStakeUnstakeRequest = {
      walletAddress: walletAccount.walletAddress,
      walletUnusedAddresses: walletAccount.walletUnusedAddresses,
      walletUsedAddresses: walletAccount.walletUsedAddresses,
      collateralUtxo: walletAccount.collateralUtxo,
      stakeVaultUtxo: stakeVaultCreateUtxo,
    };

    return coreUnstakeRequest;
  }
}
