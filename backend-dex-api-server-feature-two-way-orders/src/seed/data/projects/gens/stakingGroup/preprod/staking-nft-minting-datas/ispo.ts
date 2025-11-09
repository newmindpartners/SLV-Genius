import * as Prisma from '@prisma/client';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';
import {assetId} from '~/domain/utils/asset.util';

const parseIspoApePolicyIdAssetName = () => {
  const ispoNftApeMintingData = [
    {
      type: stakingNftTypes.GENS.ISPO,
      subType: stakingNftSubTypes.GENS.ISPO.APE,
      assetName: '417065303031',
      policyId: 'e8a29470731f2f0824cf3bb7f1a8c0ab020b8b8b105cec78f0debf97',
    }, // Ape001
    {
      type: stakingNftTypes.GENS.ISPO,
      subType: stakingNftSubTypes.GENS.ISPO.APE,
      assetName: '417065303032',
      policyId: '63f7e8ca2d092ea30e89c2ad7fe01e662ea855449ae613ae31020b9f',
    }, // Ape002
    {
      type: stakingNftTypes.GENS.ISPO,
      subType: stakingNftSubTypes.GENS.ISPO.APE,
      assetName: '417065303033',
      policyId: '71d07c0eb560f7b5756d9d5bc878489b4f9f119f09dd2708f027588e',
    }, // Ape003
    {
      type: stakingNftTypes.GENS.ISPO,
      subType: stakingNftSubTypes.GENS.ISPO.APE,
      assetName: '417065303034',
      policyId: 'aaf6e509b38d840a49696a082e52dcbe4f9f49d2ffbbb9fe49cb0aa6',
    }, // Ape004
    {
      type: stakingNftTypes.GENS.ISPO,
      subType: stakingNftSubTypes.GENS.ISPO.APE,
      assetName: '417065303035',
      policyId: '3542aa645d93b10512e7c3f2a66e2fef84fcb08cddd859750dc784e3',
    }, // Ape005
  ];

  return ispoNftApeMintingData;
};

const parseIspoDiamondHandsPolicyIdAssetName = () => {
  const ispoNftDiamondHandsMintingData = [
    {
      type: stakingNftTypes.GENS.ISPO,
      subType: stakingNftSubTypes.GENS.ISPO.DIAMOND_HANDS,
      assetName: '4469616d6f6e6448616e647331',
      policyId: '56e04379abf92ac29f575c5a43389e82fcc8f843807cb8cf841c54d1',
    }, // DiamondHands1
    {
      type: stakingNftTypes.GENS.ISPO,
      subType: stakingNftSubTypes.GENS.ISPO.DIAMOND_HANDS,
      assetName: '4469616d6f6e6448616e647332',
      policyId: '2629769c753f3deacc5e08af93f020befa06b7c0a85a7b09f0a0d652',
    }, // DiamondHands2
    {
      type: stakingNftTypes.GENS.ISPO,
      subType: stakingNftSubTypes.GENS.ISPO.DIAMOND_HANDS,
      assetName: '4469616d6f6e6448616e647333',
      policyId: '3bc25a5f1e7b42dfab212542ea9365ae3b2355aed6e1f9e409489963',
    }, // DiamondHands3
    {
      type: stakingNftTypes.GENS.ISPO,
      subType: stakingNftSubTypes.GENS.ISPO.DIAMOND_HANDS,
      assetName: '4469616d6f6e6448616e647334',
      policyId: 'f2a2dbfb71729dad0a8a631e3181b6b0f4dbdf2bf1cd005eab7ec19f',
    }, // DiamondHands4
    {
      type: stakingNftTypes.GENS.ISPO,
      subType: stakingNftSubTypes.GENS.ISPO.DIAMOND_HANDS,
      assetName: '4469616d6f6e6448616e647335',
      policyId: '7a3f01351e1c48a70f3821e1a2018914d6ec923625ea778ebafe2a84',
    }, // DiamondHands5
  ];

  return ispoNftDiamondHandsMintingData;
};

export const getIspoMintingData = () => {
  const apePolicyIdAssetName = parseIspoApePolicyIdAssetName();
  const diamondHandsPolicyIdAssetName =
    parseIspoDiamondHandsPolicyIdAssetName();

  const policyIdAssetName = [
    ...apePolicyIdAssetName,
    ...diamondHandsPolicyIdAssetName,
  ];

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
