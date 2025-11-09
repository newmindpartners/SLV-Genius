import {RoundSaleRule} from '~/domain/models/private';
import {map} from 'lodash';
import * as Seed from '~/seed/types';
import {assets as gensxAsset} from '~/seed/data/projects/gensx/projectGroup/mainnet/asset';
import {project as gensxProject} from '~/seed/data/projects/gensx/projectGroup/mainnet/project';
import {createRound, getTotalAllocationAmount} from '~/seed/utils/order';

const feeAddress = '612348920e86ffccdfb286da62ceadb34cc16063905019b6ce4b4d3a48';

// Used the same wallet from Gens Mainnet needs to be double checked
const sellerPublicKeyHashGensx =
  '2348920e86ffccdfb286da62ceadb34cc16063905019b6ce4b4d3a48';

const createGensxProject = (
  orderSaleProjectId: string,
  roundIds: string[]
): Seed.OrderSaleProject => {
  const rounds = [
    createRound(gensxAsset.gensx, {
      roundId: roundIds[0],
      number: 1,
      startDate: new Date('2023-06-29T15:00:00+02:00'),
      endDate: new Date('2023-07-01T15:00:00+02:00'),
      isClosed: false,
      isSoldOut: false,
      orderBaseAssetMinAllocation: BigInt(5_555_000_000),
      orderBaseAssetMaxAllocation: BigInt(5_555_555_000_000),
      baseAssetSubmittedAmount: BigInt(0),
      baseAssetAllocationAmount: BigInt(19_444_440_000_000),
      saleRule: RoundSaleRule.PUBLIC_SALE_MULTI_BUY,
      eligibilityDescription: 'Available to all eligible buyers who pass KYC!',
    }),
  ];

  const project: Seed.OrderSaleProject = {
    orderSaleProjectId,

    projectId: gensxProject.projectId,

    // set project distribution
    vestingPeriod: '20% initial unlock then 12-month linear vesting',
    // ensure date is later than last round end
    distributionDate: new Date('2023-07-03T15:00:00+02:00'),
    distributionMethod: 'AIRDROP',

    // set project internals
    webEnabled: true,

    // set project fee, seller public key
    feePercent: 0,
    feeAddress: feeAddress,
    sellerPublicKeyHash: sellerPublicKeyHashGensx,

    // Set funding method
    fundingMethod: 'Tokens',
    lockupPeriod: '12-month linear release',

    // set project rounds
    baseAssetTotalTokenSupplyAmount: BigInt(1_000_000_000_000_000),
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

export const orderSaleProject = createGensxProject(
  '015de1c2-f57a-4d27-9e87-63173c2ccc80',
  ['8e47fe38-b9bf-416d-9a6d-4dc4596952db']
);
