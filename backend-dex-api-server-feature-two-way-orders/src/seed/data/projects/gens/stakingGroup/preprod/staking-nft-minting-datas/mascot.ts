import * as Prisma from '@prisma/client';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';
import {assetId} from '~/domain/utils/asset.util';
import {oneYearInSeconds} from '~/seed/consts/time';

const parseMascotPolicyIdAssetName = async () => {
  const mascotNftMintingData = [
    {
      type: stakingNftTypes.GENS.MASCOT,
      subType: stakingNftSubTypes.GENS.MASCOT.MASCOT,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '536572656e697479',
      policyId: 'ae5e7966d35e154a3b5bdffe5c1b8a1ea981b4c35dd2352fc96766e0',
    }, // Serenity
    {
      type: stakingNftTypes.GENS.MASCOT,
      subType: stakingNftSubTypes.GENS.MASCOT.MASCOT,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '506c616e7473',
      policyId: 'ae5e7966d35e154a3b5bdffe5c1b8a1ea981b4c35dd2352fc96766e0',
    }, // Plants
    {
      type: stakingNftTypes.GENS.MASCOT,
      subType: stakingNftSubTypes.GENS.MASCOT.MASCOT,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '50616e6461',
      policyId: 'ae5e7966d35e154a3b5bdffe5c1b8a1ea981b4c35dd2352fc96766e0',
    }, // Panda
    {
      type: stakingNftTypes.GENS.MASCOT,
      subType: stakingNftSubTypes.GENS.MASCOT.MASCOT,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '5069726174657341747461636b',
      policyId: 'ae5e7966d35e154a3b5bdffe5c1b8a1ea981b4c35dd2352fc96766e0',
    }, // PiratesAttack
    {
      type: stakingNftTypes.GENS.MASCOT,
      subType: stakingNftSubTypes.GENS.MASCOT.MASCOT,
      utilityDurationSeconds: oneYearInSeconds,
      assetName: '456e646c657373506f73736962696c6974696573',
      policyId: 'ae5e7966d35e154a3b5bdffe5c1b8a1ea981b4c35dd2352fc96766e0',
    }, // EndlessPossibilities
  ];

  return Promise.resolve(mascotNftMintingData);
};

export const getMascotMintingData = async () => {
  const policyIdAssetName = await parseMascotPolicyIdAssetName();

  const mintingData: Prisma.Prisma.StakingNftMintingDataUncheckedCreateInput[] =
    policyIdAssetName.map(({assetName, policyId, type, subType}) => ({
      assetId: assetId(policyId, assetName),
      assetName,
      policyId,
      stakingNftType: type,
      stakingNftSubType: subType,
    }));

  return mintingData;
};
