import {inject, injectable, singleton} from 'tsyringe';
import * as dateFns from 'date-fns';
import {clamp, includes, isEmpty, reduce, sum, values} from 'lodash';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import {
  calcMonthsToDays,
  getDaysInLockDuration,
  getMillisecondsInLockDuration,
} from '~/domain/utils/staking.util';

import {CardanoNetwork} from '../models/cardano';
import {ConfigService} from './config.service';
import * as apyRewardUtil from '../utils/apyReward.util';
import {parseStringNumberToBigInt} from '../utils/math.util';
import {PublicError, PublicErrorCode} from '../errors';
import {now} from '../utils/date.util';

export const MINUTE_IN_MILLISECONDS = 60 * 1000;
export const HOUR_IN_MILLISECONDS = 60 * MINUTE_IN_MILLISECONDS;
export const DAY_IN_MILLISECONDS = 24 * HOUR_IN_MILLISECONDS;
export const DAY_IN_MINUTES = 24 * 60;

export interface StakeVaultService {
  getLockedUntilDate(
    start: Date,
    lockDuration: Public.StakeVaultLockDuration
  ): Date;

  getRegularLockedUntilDate(
    start: Date,
    lockDuration: Public.StakeVaultLockDuration
  ): Date;

  calcTotalStakeVaultApy(
    stakeVaultLockApy: number | null,
    stakingNftsApyBoostSum: number | null
  ): number | null;

  getTotalRewardForLockDuration(
    lockDuration: Public.StakeVaultLockDuration,
    stakedAssetAmount: bigint,
    stakeVaultApy: number
  ): bigint;

  isStakeVaultTotalAmountReached<
    StakeVaultCreateRequestBody extends {stakedAssetAmount: string}
  >(
    requestBody: StakeVaultCreateRequestBody,
    aggregateStakingProjectStakedAmounts: Private.AggregateStakingProjectStakedAmounts | null
  ): boolean;

  getUtxoAtContractAddress(
    eventType: Extract<Private.StakeVaultEvent['eventType'], 'CREATE'>,
    txOutputs: Private.TransactionOutput[]
  ): string | null;

  getStakeVaultCreateContractOnChainAddress(): string;

  calcNftUtilityInSecondsRemaining(
    stakeVaults: Private.StakeVaultWithEvents[],
    nftUtilityPeriodSeconds: number
  ): number;

  isStakeVaultUnlocked(stakeVault: Private.StakeVault): boolean;

  calcStakeVaultApySum(
    secondsRemainingOnNft: number | null,
    stakeVaultLockDuration: Private.StakeVaultLockDuration,
    nftsApySum: number,
    nftApyBoost: number
  ): {nftsApySum: number; nftsApyDisclaimer?: string};

  getStakeVaultRewardState(
    stakeVault: Private.StakeVault,
    flexOptionInStakingProject: Private.StakingProjectLockOption | null,
    isStakeVaultUnlocked: boolean,
    nftsApySum: number | null
  ): {
    inactiveRewardState: Private.StakeVaultRewardState | null;
    activeRewardState: Private.StakeVaultRewardState | null;
  };
}

@singleton()
@injectable()
export class StakeVaultServiceImplementation implements StakeVaultService {
  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService
  ) {}

  private lockDurationToMilliseconds(
    lockDuration: Public.StakeVaultLockDuration
  ) {
    const daysInLockDuration = getDaysInLockDuration(lockDuration);

    return daysInLockDuration * DAY_IN_MILLISECONDS;
  }

  private flexDurationInMilliseconds(
    lockedAt: Date,
    currentTime: Date,
    unlockedAt?: Date
  ): number {
    const shouldEnableShorterLockedUntilDuration =
      this.configService.getCardanoNetwork() === CardanoNetwork.PREPROD &&
      this.configService.isStakeVaultShortLockPeriodFeatureEnabled() === true;

    const durationInMilliseconds = unlockedAt
      ? unlockedAt.getTime() - lockedAt.getTime()
      : currentTime.getTime() - lockedAt.getTime();

    const minutesInOneMonth = calcMonthsToDays(1) * DAY_IN_MINUTES;

    return shouldEnableShorterLockedUntilDuration
      ? durationInMilliseconds * minutesInOneMonth
      : durationInMilliseconds;
  }

  private getShorterLockedUntilDate(
    start: Date,
    lockDuration: Public.StakeVaultLockDuration
  ) {
    const minutesInOneMonth = calcMonthsToDays(1) * DAY_IN_MINUTES;

    const regularLockDurationMilliseconds =
      this.lockDurationToMilliseconds(lockDuration);

    const shortLockDurationMilliseconds =
      regularLockDurationMilliseconds / minutesInOneMonth;

    const lockedUntilDate = dateFns.addMilliseconds(
      start,
      shortLockDurationMilliseconds
    );

    return lockedUntilDate;
  }

  getRegularLockedUntilDate(
    start: Date,
    lockDuration: Public.StakeVaultLockDuration
  ) {
    const lockDurationMilliseconds =
      this.lockDurationToMilliseconds(lockDuration);

    const lockedUntilDate = dateFns.addMilliseconds(
      start,
      lockDurationMilliseconds
    );

    return lockedUntilDate;
  }

  getLockedUntilDate(start: Date, lockDuration: Public.StakeVaultLockDuration) {
    const shouldEnableShorterLockedUntilDuration =
      this.configService.getCardanoNetwork() === CardanoNetwork.PREPROD &&
      this.configService.isStakeVaultShortLockPeriodFeatureEnabled() === true;

    if (shouldEnableShorterLockedUntilDuration) {
      return this.getShorterLockedUntilDate(start, lockDuration);
    } else {
      return this.getRegularLockedUntilDate(start, lockDuration);
    }
  }

  calcSumStakingNftsApy(
    stakingNfts: Pick<Private.StakingNft, 'apyBoost'>[]
  ): number {
    const sumNftsApy = stakingNfts.reduce((accApy, stakingNft) => {
      const nftApy = stakingNft.apyBoost ? stakingNft.apyBoost : 0;

      return accApy + nftApy;
    }, 0);

    return sumNftsApy;
  }

  calcTotalStakeVaultApy(
    stakeVaultLockApy: number | null,
    stakingNftsApyBoostSum: number | null
  ): number | null {
    return stakeVaultLockApy === null && stakingNftsApyBoostSum === null
      ? null
      : (stakeVaultLockApy || 0) + (stakingNftsApyBoostSum || 0);
  }

  private calculateStakeVaultReward(
    stakedAssetAmount: bigint,
    stakeVaultApy: number,
    elapsedTime: number
  ): bigint {
    /**
     * For mathematical purposes, it is useful to convert percentages where
     * 0% is 0, 100% is 1 and 150% is 1.5 etc.
     * We have a ticket for changing this in the entire stack:
     * https://github.com/geniusyield/dex-api-server/issues/991
     */
    const apyRate = stakeVaultApy / 100;

    return apyRewardUtil.calculateStakeVaultReward(
      stakedAssetAmount,
      apyRate,
      elapsedTime
    );
  }

  /**
   * This function returns the total reward that a stake vault can accrue
   * based on its lock duration.
   */
  getTotalRewardForLockDuration(
    lockDuration: Public.StakeVaultLockDuration,
    stakedAssetAmount: bigint,
    stakeVaultApy: number
  ): bigint {
    const millisecondsInLockDuration =
      getMillisecondsInLockDuration(lockDuration);

    const totalRewardForLockDuration = this.calculateStakeVaultReward(
      stakedAssetAmount,
      stakeVaultApy,
      millisecondsInLockDuration
    );

    return totalRewardForLockDuration;
  }

  isStakeVaultTotalAmountReached<
    StakeVaultCreateRequestBody extends {stakedAssetAmount: string}
  >(
    requestBody: StakeVaultCreateRequestBody,
    aggregateStakingProjectStakedAmounts: Private.AggregateStakingProjectStakedAmounts | null
  ) {
    if (aggregateStakingProjectStakedAmounts !== null) {
      const {stakedAssetTotalAmount, stakedAssetTotalAmountLimit} =
        aggregateStakingProjectStakedAmounts;

      const newStakedAssetAmount = parseStringNumberToBigInt(
        requestBody.stakedAssetAmount
      );

      if (newStakedAssetAmount === null) {
        /**
         * If we get here, it means that `requestBody.stakedAssetAmount` is not a string
         * that can be converted to a BigInt. This is not valid input and we should notify
         * the client to pass a valid number.
         */
        throw new PublicError(
          PublicErrorCode.INVALID_STAKE_VAULT__STAKED_ASSET_AMOUNT_NOT_NUMBER
        );
      }

      const newStakedAssetTotalAmount =
        stakedAssetTotalAmount + newStakedAssetAmount;

      return newStakedAssetTotalAmount > stakedAssetTotalAmountLimit;
    } else {
      return false;
    }
  }

  getUtxoAtContractAddress(
    eventType: Extract<Private.StakeVaultEvent['eventType'], 'CREATE'>,
    txOutputs: Private.TransactionOutput[]
  ): string | null {
    const eventTypeContractAddressMap: Record<typeof eventType, string> = {
      ['CREATE']: this.getStakeVaultCreateContractOnChainAddress(),
    };

    const contractAddress = eventTypeContractAddressMap[eventType];

    const scriptTxo = txOutputs?.find(txo => txo.address === contractAddress);

    const stakeVaultUtxo = scriptTxo
      ? `${scriptTxo?.transactionHash}#${scriptTxo?.index}`
      : null;

    return stakeVaultUtxo;
  }

  /**
   * Used in staking related logic to locate the stake vault create contract
   */
  getStakeVaultCreateContractOnChainAddress() {
    switch (this.configService.getCardanoNetwork()) {
      case CardanoNetwork.MAINNET:
        return '71c652c19ea10ab025a2b0880682f96a2794d7cea9bc4782645c0e114c';
      case CardanoNetwork.PREPROD:
        return '70c652c19ea10ab025a2b0880682f96a2794d7cea9bc4782645c0e114c';
      case CardanoNetwork.PREVIEW:
        throw new Error('No contract address for preview network');
    }
  }

  private getRewardGeneratingSecondsForStakeVaults = (
    stakeVaults: Private.StakeVaultWithEvents[]
  ): Record<string, number> =>
    reduce(
      stakeVaults,
      (result, stakeVault) => {
        const {
          type,
          startedAt,
          unlocksAt,
          lockDuration,
          stakeVaultId,
          stakeVaultEvent,
        } = stakeVault;

        const unstakedAt: Date | undefined = stakeVaultEvent.find(
          event => event.eventType === 'UNSTAKE'
        )?.eventDate;

        const isStakeVaultUnlocked = this.isStakeVaultUnlocked(stakeVault);

        /**
         * We are assuming that all revenue amplifying vaults automatically
         * transition into Flex after being locked.
         */
        const hasTransitionedIntoFlex =
          type === 'REVENUE_AMPLIFYING' &&
          lockDuration !== 'FLEX' &&
          isStakeVaultUnlocked;

        const lockDurationInMilliseconds =
          lockDuration === 'FLEX'
            ? this.flexDurationInMilliseconds(startedAt, new Date(), unstakedAt)
            : this.lockDurationToMilliseconds(lockDuration);

        const additionalTimeInMilliseconds =
          unlocksAt && hasTransitionedIntoFlex
            ? this.flexDurationInMilliseconds(unlocksAt, new Date(), unstakedAt)
            : null;

        const lockDurationInSeconds = lockDurationInMilliseconds / 1_000;

        const additionalTimeInSeconds = additionalTimeInMilliseconds
          ? additionalTimeInMilliseconds / 1_000
          : 0;

        return {
          ...result,
          [stakeVaultId]: lockDurationInSeconds + additionalTimeInSeconds,
        };
      },
      {}
    );

  calcNftUtilityInSecondsRemaining = (
    stakeVaults: Private.StakeVaultWithEvents[],
    nftUtilityPeriodSeconds: number
  ): number => {
    if (!isEmpty(stakeVaults)) {
      const stakeVaultsRewardGeneratingSeconds =
        this.getRewardGeneratingSecondsForStakeVaults(stakeVaults);

      const totalUsageSeconds = sum(values(stakeVaultsRewardGeneratingSeconds));

      const secondsRemaining = nftUtilityPeriodSeconds - totalUsageSeconds;

      return clamp(secondsRemaining, 0, nftUtilityPeriodSeconds);
    } else {
      return nftUtilityPeriodSeconds;
    }
  };

  /**
   * Caution: This must never be removed unless another solution is in place to
   * handle this edge case.
   *
   * Due to a bug early on when we launched the NFT vesting feature
   * we allowed for the same user to create multiple stake vaults with
   * vesting NFTs.
   * This was a mistake and should be limited to 1 per user.
   *
   * Read more at
   * https://github.com/geniusyield/dex-api-server/issues/1111#issuecomment-1531177487
   */
  private isDuplicateVestingStakeVault(stakeVaultId: string): boolean {
    const identifiedAsDuplicateVestingNftStakeVaultId = [
      // Original created at 2023-01-02 13:47:16.478 - ISPO - FOMO
      // stake_vault_id: '39e513b9-a77d-45de-a04f-b5a882dfd7d4'
      // tx url: https://cexplorer.io/tx/010b42d9acc14bdc6a663766d8166265a0c328d75a27b3e20be078b410672c03
      // Duplicate created at 2023-01-02 13:54:34.875 - ISPO - SHARK
      // tx url: https://cexplorer.io/tx/9140faf609b116603d7d79be238fd140d22398d5f8dd147a7010f6af2489fff0
      '03001247-f07e-4837-97c8-d8279f8b35a6',

      // Original created at 2023-04-24 19:51:17.456 - ISPO - HODLER
      // stake_vault_id: 'd0146e5d-a6c5-4711-9374-237100eced1d'
      // tx url: https://cexplorer.io/tx/eec828109c2423487d356f8455866461767ab963c5ccbd5d8218ffbe75ca82dc
      // Duplicate created at 2023-04-24 19:52:32.6 - ISPO - DEGEN
      // tx url: https://cexplorer.io/tx/4e6cc2daafb1dad93393a66c29e23c633f044e8c73813fc0d4ca95b4a7172b12
      'df9c14b4-9971-4063-8e09-08d592810f4b',
    ];

    const isDuplicate: boolean = includes(
      identifiedAsDuplicateVestingNftStakeVaultId,
      stakeVaultId
    );

    return isDuplicate;
  }

  isStakeVaultUnlocked(stakeVault: Private.StakeVault): boolean {
    const currentTime = now();

    if (stakeVault.unlocksAt !== null) {
      return currentTime >= stakeVault.unlocksAt;
    } else {
      /**
       * The only reason a stake vault would not have an unlock date is if it
       * was created on-chain without one, which would mean that it is unlocked.
       */
      return true;
    }
  }

  private determineNftsApyDisclaimer(
    remainingUtilityRatio: number
  ): string | null {
    if (remainingUtilityRatio === 0) {
      return "The NFT you selected has run out of utility! This means it won't add any additional APY to new stake vaults.";
    } else if (remainingUtilityRatio === 1) {
      return null;
    } else {
      return 'The NFT you selected does not have full utility. This has resulted in a lower total APY for the selected lock period. Please use the NFT dashboard to see the exact remaining utility.';
    }
  }

  calcStakeVaultApySum(
    secondsRemainingOnNft: number,
    stakeVaultLockDuration: Private.StakeVaultLockDuration,
    nftsApySum: number,
    nftApyBoost: number
  ): {nftsApySum: number; nftsApyDisclaimer?: string} {
    const lockDurationInSeconds =
      getMillisecondsInLockDuration(stakeVaultLockDuration) / 1000;

    /**
     * If the stake vault is in Flex mode, we should consider the NFT to give
     * full utility until the NFT completely expires.
     */
    const remainingUtilityRatioFlex = secondsRemainingOnNft > 0 ? 1 : 0;

    const remainingUtilityRatioLocked =
      secondsRemainingOnNft !== null
        ? clamp(secondsRemainingOnNft / lockDurationInSeconds, 0, 1)
        : 1;

    const remainingUtilityRatio =
      stakeVaultLockDuration === 'FLEX'
        ? remainingUtilityRatioFlex
        : remainingUtilityRatioLocked;

    const newSumNftsApy = nftsApySum + nftApyBoost * remainingUtilityRatio;

    const nftsApyDisclaimer = this.determineNftsApyDisclaimer(
      remainingUtilityRatio
    );

    return {
      nftsApySum: newSumNftsApy,
      ...(nftsApyDisclaimer
        ? {
            nftsApyDisclaimer,
          }
        : {}),
    };
  }

  getStakeVaultRewardState(
    stakeVault: Private.StakeVault,
    flexOptionInStakingProject: Private.StakingProjectLockOption | null,
    isStakeVaultUnlocked: boolean,
    nftsApySum: number | null
  ): {
    inactiveRewardState: Private.StakeVaultRewardState | null;
    activeRewardState: Private.StakeVaultRewardState | null;
  } {
    const originalRewardState: Private.StakeVaultRewardState = {
      lockDuration: stakeVault.lockDuration,
      lockApy: stakeVault.lockApy,
      nftsApy: nftsApySum,
      revenueAmplifier: stakeVault.revenueAmplifier,
      totalStakeVaultApy: this.calcTotalStakeVaultApy(
        stakeVault.lockApy,
        nftsApySum
      ),
    };

    /**
     * For revenue amplifying stake vaults, we automatically transition to
     * Flex (if staking project supports Flex) when the stake vault is unlocked.
     * For APY stake vaults, there are no active rewards, these stake vaults
     * need re-staking to continue earning rewards.
     */
    const flexRewardState: Private.StakeVaultRewardState | null =
      flexOptionInStakingProject
        ? {
            lockDuration: flexOptionInStakingProject.lockDuration,
            lockApy: flexOptionInStakingProject.apy,
            nftsApy: nftsApySum,
            revenueAmplifier: flexOptionInStakingProject.revenueAmplifier,
            totalStakeVaultApy: this.calcTotalStakeVaultApy(
              flexOptionInStakingProject.apy,
              nftsApySum
            ),
          }
        : null;

    /**
     * `inactiveRewardState` indicates a set of state that are no longer active.
     * `activeRewardState` indicates a set of state that are currently active.
     * A stake vault can be in one of three states which is demonstrated below.
     */
    const unchangedRewardState = {
      inactiveRewardState: null,
      activeRewardState: originalRewardState,
    };

    const lockedStakeVaultHasUnlocked: boolean =
      isStakeVaultUnlocked && originalRewardState.lockDuration !== 'FLEX';

    const fixedApyRewardState = lockedStakeVaultHasUnlocked
      ? {
          inactiveRewardState: originalRewardState,
          activeRewardState: null,
        }
      : unchangedRewardState;

    const revenueAmplifyingRewardState = lockedStakeVaultHasUnlocked
      ? {
          inactiveRewardState: originalRewardState,
          activeRewardState: flexRewardState,
        }
      : unchangedRewardState;

    /**
     * Revenue amplifying stake vaults that have "Flex" as a lock option
     * automatically go into Flex mode when unlocked.
     */
    return stakeVault.type === 'REVENUE_AMPLIFYING'
      ? revenueAmplifyingRewardState
      : fixedApyRewardState;
  }
}
