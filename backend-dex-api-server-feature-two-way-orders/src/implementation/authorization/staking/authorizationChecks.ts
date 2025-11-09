import lodash, {pick} from 'lodash';
import {StakingEligibilityContext} from './types';
import {
  StakeVaultCreateContext,
  StakingNftsContext,
  stakingNftsContextBuilder,
  isStakedAssetTotalAmountLimitReachedContextBuilder,
  stakeVaultContextBuilder,
  StakeVaultCreateEligibilityContext,
  CreateStakeVaultEnabledContext,
  CreateStakeVaultContextBuilder,
  StakingProjectContext,
  stakingProjectContextBuilder,
} from './context.builders';
import {AuthorizationCheck} from '../types';
import {userContextBuilder} from '../user';

/**** predicates ****/

/**
 * isStakingNftsUniquePredicate
 */
const isStakingNftsUniquePredicate = (
  stakingNftsContext: StakingNftsContext
) => {
  const {stakingNfts} = stakingNftsContext;
  const uniqueStakingNfts = lodash.uniqWith(
    stakingNfts,
    (x, y) =>
      x.type === y.type &&
      x.subType === y.subType &&
      x.assetName === y.assetName
  );

  const isListUnique = stakingNfts.length === uniqueStakingNfts.length;

  return isListUnique;
};

/**
 * isValidStakingNftCombinationPredicate
 */
const isValidStakingNftCombinationPredicate = (
  stakingNftsContext: StakingNftsContext
) => {
  const {stakingNfts} = stakingNftsContext;

  return stakingNfts.reduce((isAllValid, stakingNft) => {
    const otherStakingNfts = stakingNfts.filter(
      anyStakingNft =>
        !(
          anyStakingNft.type === stakingNft.type &&
          anyStakingNft.subType === stakingNft.subType &&
          anyStakingNft.assetName === stakingNft.assetName
        )
    );

    const stackableWith = stakingNft.stackableWith;
    const otherStakingNftsTypes = otherStakingNfts.map(({type}) => type);

    const isValid = otherStakingNftsTypes.reduce(
      (allIsValid, stakingNftType) => {
        return allIsValid && stackableWith.includes(stakingNftType);
      },
      true
    );

    return isAllValid && isValid;
  }, true);
};

/**
 * isStakedAssetTotalLimitNotReached
 */
const isStakedAssetTotalLimitNotReached = (
  createStakeVaultContext: StakeVaultCreateContext
) => createStakeVaultContext.isStakedAssetTotalAmountLimitReached === false;

const isCreateStakeVaultEnabledPredicate = (
  rewardsValidationEligibilityContext: CreateStakeVaultEnabledContext
): boolean =>
  rewardsValidationEligibilityContext.isCreateStakeVaultEnabled === true;

const isStakingProjectWebEnabledPredicate = (
  stakingProjectEligibilityContext: StakingProjectContext
): boolean =>
  stakingProjectEligibilityContext.stakingProject.webEnabled === true;

const isUserStakeVaultCreatorPredicate = (
  stakeVaultCreatorEligibilityContext: StakeVaultCreateEligibilityContext
): boolean => {
  const {user, stakeVault} = stakeVaultCreatorEligibilityContext;

  const requestingUserId = user?.userId;
  const creatorUserId = stakeVault.userId;

  return requestingUserId === creatorUserId;
};

/**** AuthorizationChecks ****/

export const isStakingNftsUnique: AuthorizationCheck<StakingEligibilityContext> =
  {
    errorCode: 'INVALID_STAKE_VAULT__NFT_DUPLICATES',
    predicate: isStakingNftsUniquePredicate,
    requestContextBuilder: [stakingNftsContextBuilder],
  };

export const isValidStakingNftCombination: AuthorizationCheck<StakingEligibilityContext> =
  {
    errorCode: 'INVALID_STAKE_VAULT__NFT_COMBINATION',
    predicate: isValidStakingNftCombinationPredicate,
    requestContextBuilder: [stakingNftsContextBuilder],
  };

export const isValidStakedAssetAmount: AuthorizationCheck<StakingEligibilityContext> =
  {
    errorCode: 'INVALID_STAKE_VAULT__STAKED_ASSET_TOTAL_AMOUNT_LIMIT_REACHED',
    predicate: isStakedAssetTotalLimitNotReached,
    requestContextBuilder: [isStakedAssetTotalAmountLimitReachedContextBuilder],
  };

export const isUserStakeVaultCreator: AuthorizationCheck<StakeVaultCreateEligibilityContext> =
  {
    errorCode: 'INVALID_STAKE_VAULT__USER_NOT_CREATOR',
    predicate: isUserStakeVaultCreatorPredicate,
    requestContextBuilder: [userContextBuilder, stakeVaultContextBuilder],
  };

export const isCreateStakeVaultEnabled: AuthorizationCheck<StakeVaultCreateEligibilityContext> =
  {
    errorCode: 'INVALID_STAKE_VAULT__CREATE_STAKE_VAULT_DISABLED',
    predicate: context =>
      isCreateStakeVaultEnabledPredicate(
        pick(context, ['isCreateStakeVaultEnabled'])
      ),
    requestContextBuilder: [CreateStakeVaultContextBuilder],
  };

export const isStakingProjectWebEnabled: AuthorizationCheck<StakingEligibilityContext> =
  {
    errorCode: 'INVALID_STAKE_VAULT__STAKING_PROJECT_WEB_DISABLED',
    predicate: context =>
      isStakingProjectWebEnabledPredicate(pick(context, ['stakingProject'])),
    requestContextBuilder: [stakingProjectContextBuilder],
  };
