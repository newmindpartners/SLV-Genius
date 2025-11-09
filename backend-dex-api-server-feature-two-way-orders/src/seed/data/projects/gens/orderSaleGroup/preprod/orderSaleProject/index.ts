import {RoundSaleRule} from '~/domain/models/private';
import {map} from 'lodash';
import * as Seed from '~/seed/types';
import {
  getTotalAllocationAmount,
  getWhiteListConnectOrCreate,
  prepareRoundWhitelist,
} from '~/seed/utils/order';
import {whitelistedStakeKeyHashes} from './walletWhitelist';
import {project as gensPreprodProject} from '~/seed/data/projects/gens/projectGroup/preprod/project';

// WARNING TODO: must be replaced with actual feeAddress
const feeAddress =
  '00dfafbb2134840aa9f91e6764348d7d9b5e0b243b37efbd2eb24dc6f5b98d41fa032cda9644cddfe39a0ed0eb905e96a546ddd8e854719c27';
// Created by Genius Yield preprod wallet
const sellerPublicKeyHashGens =
  '25195af85c41b9d97da7f4f215d3e74c9cef7f04739d6ba473ba72a2';

const preparedRoundWhitelist: Seed.RoundWhitelist[] = prepareRoundWhitelist(
  whitelistedStakeKeyHashes
);

const createGensOrderSaleProject = (
  orderSaleProjectId: string,
  roundIds: string[]
): Seed.OrderSaleProject => {
  const round1: Seed.Round = {
    roundId: roundIds[0],
    number: 1,
    startDate: new Date('2022-11-03T13:00:00Z'),
    endDate: new Date('2022-11-05T13:00:00Z'),
    isClosed: false,
    isSoldOut: false,
    baseAssetSubmittedAmount: BigInt(0),
    quoteAssetRaisedAmount: BigInt(0),
    baseAssetAllocationAmount: BigInt(1_000_000_000_000),
    orderBaseAssetMinAllocation: BigInt(50_000_000),
    orderBaseAssetMaxAllocation: BigInt(10_000_000_000),
    saleRule: RoundSaleRule.PRIVATE_SALE_SINGLE_BUY,
    roundWhitelist: getWhiteListConnectOrCreate(
      roundIds[0],
      preparedRoundWhitelist
    ),
    eligibilityDescription: 'Available to internal testers',
  };

  const round2: Seed.Round = {
    roundId: roundIds[1],
    number: 2,
    startDate: new Date('2022-11-05T13:00:00Z'),
    endDate: new Date('2022-11-07T13:00:00Z'),
    isClosed: false,
    isSoldOut: false,
    baseAssetSubmittedAmount: BigInt(0),
    quoteAssetRaisedAmount: BigInt(0),
    baseAssetAllocationAmount: BigInt(1_000_000_000_000),
    orderBaseAssetMinAllocation: BigInt(50_000_000),
    orderBaseAssetMaxAllocation: BigInt(10_000_000_000),
    saleRule: RoundSaleRule.PUBLIC_SALE_SINGLE_BUY,
    eligibilityDescription: 'Available to internal testers',
  };

  const rounds = [round1, round2];

  const gensOrderSaleProject: Seed.OrderSaleProject = {
    orderSaleProjectId,

    projectId: gensPreprodProject.projectId,

    // set project distribution
    vestingPeriod: '100% TGE',
    distributionDate: new Date('2022-11-09T13:00:00Z'),
    distributionMethod: 'AIRDROP',

    // set project internal
    webEnabled: true,

    // set project fee, seller public key
    feePercent: 0,
    feeAddress: feeAddress,
    sellerPublicKeyHash: sellerPublicKeyHashGens,

    // Set funding method
    fundingMethod: 'Tokens',
    lockupPeriod: '10 days',

    // set project rounds
    baseAssetTotalTokenSupplyAmount: BigInt(100_000_000_000),
    baseAssetAllocationAmount: getTotalAllocationAmount(rounds),
    round: {
      connectOrCreate: map(rounds, round => ({
        where: {roundId: round.roundId},
        create: round,
      })),
    },
  };

  return gensOrderSaleProject;
};

export const orderSaleProject = createGensOrderSaleProject(
  '44324507-ab72-4d03-9c41-759c5ca29b9b',
  [
    'e710cb34-2d84-4d35-9168-bef53d328108',
    'efb10ed3-4f7a-4df1-893e-ff24b238a7e0',
  ]
);
