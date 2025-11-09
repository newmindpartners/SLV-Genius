import {RoundSaleRule} from '~/domain/models/private';
import {map} from 'lodash';
import * as Seed from '~/seed/types';
import {assets as cgvAsset} from '~/seed/data/projects/cgv/projectGroup/mainnet/asset';
import {project as cgvProject} from '~/seed/data/projects/cgv/projectGroup/mainnet/project';
import {createRound, getTotalAllocationAmount} from '~/seed/utils/order';

const feeAddress = '612348920e86ffccdfb286da62ceadb34cc16063905019b6ce4b4d3a48';

// Used the same wallet from Gens Mainnet needs to be double checked
const sellerPublicKeyHashCgv =
  '2348920e86ffccdfb286da62ceadb34cc16063905019b6ce4b4d3a48';

const createCgvProject = (
  orderSaleProjectId: string,
  roundIds: string[]
): Seed.OrderSaleProject => {
  const rounds = [
    createRound(cgvAsset.cgv, {
      roundId: roundIds[0],
      number: 1,
      startDate: new Date('2023-05-29T11:00:00+02:00'),
      endDate: new Date('2023-05-30T11:00:00+02:00'),
      isClosed: false,
      isSoldOut: false,
      orderBaseAssetMinAllocation: BigInt(1_250_000_000),
      orderBaseAssetMaxAllocation: BigInt(625_000_000_000),
      baseAssetSubmittedAmount: BigInt(0),
      baseAssetAllocationAmount: BigInt(8_750_000_000_000),
      saleRule: RoundSaleRule.PUBLIC_SALE_MULTI_BUY,
      eligibilityDescription: 'Available to all eligible buyers who pass KYC!',
    }),
  ];

  const project: Seed.OrderSaleProject = {
    orderSaleProjectId,

    projectId: cgvProject.projectId,

    // set project distribution
    vestingPeriod:
      '15% initial unlock, 3 months cliff, 18 months linear vesting',
    // ensure date is later than last round end
    distributionDate: new Date('2023-06-02T10:30:00+02:00'),
    distributionMethod: 'AIRDROP',

    // set project internals
    webEnabled: true,

    // set project fee, seller public key
    feePercent: 0,
    feeAddress: feeAddress,
    sellerPublicKeyHash: sellerPublicKeyHashCgv,

    // Set funding method
    fundingMethod: 'Tokens',
    lockupPeriod: '18 months linear release',

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

export const orderSaleProject = createCgvProject(
  'd3d086ac-ecd2-489d-9060-c5ba23e37057',
  ['cf71d544-587a-44e2-be81-57af91efcbcc']
);
