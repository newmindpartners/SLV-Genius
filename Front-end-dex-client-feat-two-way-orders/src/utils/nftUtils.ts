import { StakingNft } from '~/redux/api';
import { isGreater } from '~/utils/mathUtils';

export const isNftValidToStakeWithCombination = (
  nft: StakingNft,
  nfts: StakingNft[],
): boolean => {
  const stackableWith = nft.stackableWith;

  const ispoType = 'ISPO';
  const nftHasVestingBoost = nft.vestingBoost && isGreater(nft?.vestingBoost, '0');
  const isIspoNftWithFailedChecks = nft.type === ispoType && !nftHasVestingBoost;

  /**
   * Combination is considered valid if `stackableWith` includes the `type` of
   * all other staking NFTs in the collection.
   */
  const isEqual = nfts.find(
    (otherNft) =>
      otherNft.type === nft.type &&
      otherNft.subType === nft.subType &&
      otherNft.assetName === nft.assetName,
  );
  const isValid = nfts.reduce((acc, otherNft) => {
    return acc && stackableWith.includes(otherNft.type);
  }, true);

  return (isValid || !!isEqual) && !isIspoNftWithFailedChecks;
};

export const secondsToDays = (seconds: number): number => {
  const secondsPerDay = 24 * 60 * 60;
  return seconds / secondsPerDay;
};
