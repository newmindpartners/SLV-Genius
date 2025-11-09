import {RoundSaleRule} from '~/domain/models/private';
import {map} from 'lodash';
import {whitelistedStakeKeyHashes} from './walletWhitelist';
import * as Seed from '~/seed/types';
import {assets as ninjazPreprodAssets} from '~/seed/data/projects/ninjaz/projectGroup/preprod/asset';
import {project as ninjazPreprodProject} from '~/seed/data/projects/ninjaz/projectGroup/preprod/project';
import {
  createRound,
  getTotalAllocationAmount,
  getWhiteListConnectOrCreate,
  prepareRoundWhitelist,
} from '~/seed/utils/order';

const feeAddress =
  '00dfafbb2134840aa9f91e6764348d7d9b5e0b243b37efbd2eb24dc6f5b98d41fa032cda9644cddfe39a0ed0eb905e96a546ddd8e854719c27';

// Created by Genius Yield preprod wallet
const sellerPublicKeyHashNinjaz =
  '25195af85c41b9d97da7f4f215d3e74c9cef7f04739d6ba473ba72a2';

export const preparedRoundWhitelist: Seed.RoundWhitelist[] =
  prepareRoundWhitelist(whitelistedStakeKeyHashes);

const createNinjazProject = (
  orderSaleProjectId: string,
  roundIds: string[]
): Seed.OrderSaleProject => {
  const rounds = [
    createRound(ninjazPreprodAssets.ninjaz, {
      roundId: roundIds[0],
      number: 1,
      startDate: new Date('2023-02-07T09:00:00Z'),
      endDate: new Date('2023-02-08T09:00:00Z'),
      isClosed: false,
      isSoldOut: false,
      orderBaseAssetMinAllocation: BigInt(1_800_000_000),
      orderBaseAssetMaxAllocation: BigInt(9_000_000_000),
      baseAssetSubmittedAmount: BigInt(0),
      baseAssetAllocationAmount: BigInt(250_000_000_000_000),
      saleRule: RoundSaleRule.PRIVATE_SALE_MULTI_BUY,
      eligibilityDescription:
        'Available for Genius X ISPO delegators and Danketsu NFT holders (snapshot on Feb 10th)',
      roundWhitelist: getWhiteListConnectOrCreate(
        roundIds[0],
        preparedRoundWhitelist
      ),
    }),
    createRound(ninjazPreprodAssets.ninjaz, {
      roundId: roundIds[1],
      number: 2,
      startDate: new Date('2023-02-08T10:00:00Z'),
      endDate: new Date('2023-02-09T10:00:00Z'),
      isClosed: false,
      isSoldOut: false,
      orderBaseAssetMinAllocation: BigInt(100_000_000),
      orderBaseAssetMaxAllocation: BigInt(9_000_000_000),
      baseAssetSubmittedAmount: BigInt(0),
      baseAssetAllocationAmount: BigInt(0),
      saleRule: RoundSaleRule.PUBLIC_SALE_MULTI_BUY,
      eligibilityDescription: 'Available to all eligible buyers who pass KYC!',
    }),
  ];

  const project: Seed.OrderSaleProject = {
    orderSaleProjectId,

    projectId: ninjazPreprodProject.projectId,

    // set project distribution
    vestingPeriod: '100% TGE',
    // ensure date is later than last round end
    distributionDate: new Date('2023-02-10T10:00:00Z'),
    distributionMethod: 'AIRDROP',

    // set project internals
    webEnabled: true,

    // set project fee, seller public key
    feePercent: 0,
    feeAddress: feeAddress,
    sellerPublicKeyHash: sellerPublicKeyHashNinjaz,

    // Set funding method
    fundingMethod: 'Tokens',
    lockupPeriod: '%100 TGE',

    // set project rounds
    baseAssetTotalTokenSupplyAmount: BigInt(5_000_000_000_000_000),
    baseAssetAllocationAmount: getTotalAllocationAmount(rounds),
    round: {
      connectOrCreate: map(rounds, round => ({
        where: {roundId: round.roundId},
        create: round,
      })),
    },
  };

  return project;
};

export const orderSaleProject = createNinjazProject(
  '4946b31b-bdc9-44de-bc95-a8e02a95aa03',
  [
    'f5cf2cd7-f311-4c93-89df-6d2526488feb',
    'c2ff0797-8eb7-4ea0-9a5f-8cf65bf41618',
  ]
);
