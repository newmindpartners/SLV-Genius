import * as Prisma from '@prisma/client';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';
import {assetId} from '~/domain/utils/asset.util';
import {oneYearInSeconds} from '~/seed/consts/time';

const geniusCommonPolicyIdAssetName = () => {
  const geniusNftCommonMintingData = [
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.COMMON,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303031',
      policyId: '9fc0ae81bcda86207459d12539f45b8b7100303b8f14e328bf2dc054',
    }, // Genius0001
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.COMMON,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303032',
      policyId: 'a455a2d85b538ee92ad516cd69da1253971b598c239fd41936a10c11',
    }, // Genius0002
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.COMMON,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303033',
      policyId: 'b534ad667da9e1c238561678dc988d62a8528e44e7ab8c8b37dfa6cc',
    }, // Genius0003
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.COMMON,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303034',
      policyId: 'b436ba039e034395c1fbcc18bd36a8c8f368dabd744631a8fefbe781',
    }, // Genius0004
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.COMMON,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303035',
      policyId: '0210bac4092101baa7c28e7ffd44dc591c3fd05d52503247c3c8993f',
    }, // Genius0005
  ];

  return geniusNftCommonMintingData;
};

const geniusRarePolicyIdAssetName = () => {
  const geniusNftRareMintingData = [
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.RARE,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303036',
      policyId: '020b5999efc80287faf01d4d0d5010766df2322088d73298dcda166c',
    }, // Genius0006
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.RARE,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303037',
      policyId: 'e6d8e7d276e0d2262424bfaa7d1e86510482868143e8e51cc9e1c150',
    }, // Genius0007
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.RARE,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303038',
      policyId: 'a8130068098abab2fc93089874cb89ff3917e6d1eaa45e3534e42029',
    }, // Genius0008
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.RARE,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303039',
      policyId: 'd9e22fd65b0c4fa67922ba8b857a0dcb7861497eb817b86c5e7f6929',
    }, // Genius0009
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.RARE,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303130',
      policyId: '16919e97b065518b0ede6c0eae7148b4fa3b392a60fb412662e687fa',
    }, // Genius0010
  ];

  return geniusNftRareMintingData;
};

const geniusEpicPolicyIdAssetName = () => {
  const geniusNftEpicMintingData = [
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.EPIC,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303131',
      policyId: 'e68ce2eb8219121e3ee3f3fc7842f7f210db9719e744b534d0d99d50',
    }, // Genius0011
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.EPIC,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303132',
      policyId: '7376e0ef4d2cb86908bca169ec63f8fe18d1150e2d654730cb712f97',
    }, // Genius0012
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.EPIC,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303133',
      policyId: '056e768c781b31d22f6ca6c9dbd29d7b14d7e17ec859238857737aa3',
    }, // Genius0013
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.EPIC,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303134',
      policyId: 'fa071a3c6afe0f8a3d24a3f903ec562a694eb4f2e5a9053d2e84d380',
    }, // Genius0014
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.EPIC,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303135',
      policyId: '41776563b59092a5c9f6a22bdf93b07517bf075314b6888a3e75ef4b',
    }, // Genius0015
  ];

  return geniusNftEpicMintingData;
};

const geniusLegendaryPolicyIdAssetName = () => {
  const geniusNftLegendaryMintingData = [
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.LEGENDARY,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303136',
      policyId: '252bb6028cf0840cb423428aea317fce7e52c12d0917743ac0db7aec',
    }, // Genius0016
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.LEGENDARY,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303137',
      policyId: '618d883fe330afd93dd50e5643bb7e64c7f4c62d8c38a592d789cc57',
    }, // Genius0017
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.LEGENDARY,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303138',
      policyId: '0e591a5b22b17ae4176af05da9db56b97f4469568041dbaf65326db1',
    }, // Genius0018
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.LEGENDARY,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303139',
      policyId: '68fcb68511590eecdf2014425abfa8482d16d5d51a5b2eb8b3bb2bab',
    }, // Genius0019
    {
      type: stakingNftTypes.GENS.GENIUS,
      subType: stakingNftSubTypes.GENS.GENIUS.LEGENDARY,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '47656e69757330303230',
      policyId: '742ecc2ccd75407de36867ab4b4e5ead7dc03c4a5485562ab724f50a',
    }, // Genius0020
  ];

  return geniusNftLegendaryMintingData;
};

export const getGeniusMintingData = () => {
  const policyIdAssetName = [
    ...geniusCommonPolicyIdAssetName(),
    ...geniusRarePolicyIdAssetName(),
    ...geniusEpicPolicyIdAssetName(),
    ...geniusLegendaryPolicyIdAssetName(),
  ];

  const geniusNftMintingData: Prisma.Prisma.StakingNftMintingDataUncheckedCreateInput[] =
    policyIdAssetName.map(
      ({assetName, policyId, type, subType, utilityDurationSeconds}) => ({
        assetId: assetId(policyId, assetName),
        assetName,
        policyId,
        utilityDurationSeconds,
        stakingNftType: type,
        stakingNftSubType: subType,
      })
    );

  return geniusNftMintingData;
};
