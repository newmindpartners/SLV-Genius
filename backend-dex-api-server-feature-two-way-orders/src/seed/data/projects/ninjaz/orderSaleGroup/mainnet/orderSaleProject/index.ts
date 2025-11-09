import {RoundSaleRule} from '~/domain/models/private';
import {map} from 'lodash';
import {whitelistedStakeKeyHashes} from './walletWhitelist';
import * as Seed from '~/seed/types';
import {assets as ninjazMainnetAssets} from '~/seed/data/projects/ninjaz/projectGroup/mainnet/asset';
import {project as ninjazMainnetProject} from '~/seed/data/projects/ninjaz/projectGroup/mainnet/project';
import {
  createRound,
  getTotalAllocationAmount,
  getWhiteListConnectOrCreate,
  prepareRoundWhitelist,
} from '~/seed/utils/order';

// bech32 'addr1vy353yswsmluehajsmdx9n4dkdxvzcrrjpgpndkwfdxn5jqnfeq20' same value as Gens Mainnet
const feeAddress = '612348920e86ffccdfb286da62ceadb34cc16063905019b6ce4b4d3a48';

// Used the same wallet from Gens Mainnet needs to be double checked
const sellerPublicKeyHashNinjaz =
  '2348920e86ffccdfb286da62ceadb34cc16063905019b6ce4b4d3a48';

export const preparedRoundWhitelist: Seed.RoundWhitelist[] =
  prepareRoundWhitelist(whitelistedStakeKeyHashes);

const createNinjazProject = (
  orderSaleProjectId: string,
  roundIds: string[]
): Seed.OrderSaleProject => {
  const rounds = [
    createRound(ninjazMainnetAssets.ninjaz, {
      roundId: roundIds[0],
      number: 1,
      startDate: new Date('2023-02-13T14:00:00Z'),
      endDate: new Date('2023-02-27T12:00:00Z'),
      isClosed: false,
      isSoldOut: false,
      orderBaseAssetMinAllocation: BigInt(180_000_000_000),
      orderBaseAssetMaxAllocation: BigInt(9_000_000_000_000),
      baseAssetSubmittedAmount: BigInt(0),
      baseAssetAllocationAmount: BigInt(250_000_000_000_000),
      saleRule: RoundSaleRule.PRIVATE_SALE_MULTI_BUY,
      eligibilityDescription:
        'Available for Genius X ISPO delegators and Danketsu NFT holders (snapshot on Feb 10th)',
      // whitelist will be implemented after Feb 10th
      roundWhitelist: getWhiteListConnectOrCreate(
        roundIds[0],
        preparedRoundWhitelist
      ),
    }),
    createRound(ninjazMainnetAssets.ninjaz, {
      roundId: roundIds[1],
      number: 2,
      startDate: new Date('2023-02-27T14:00:00Z'),
      endDate: new Date('2023-03-13T12:00:00Z'),
      isClosed: false,
      isSoldOut: false,
      orderBaseAssetMinAllocation: BigInt(50_000_000_000),
      orderBaseAssetMaxAllocation: BigInt(9_000_000_000_000),
      baseAssetSubmittedAmount: BigInt(0),
      baseAssetAllocationAmount: BigInt(0),
      eligibilityDescription: 'Available to all eligible buyers who pass KYC!',
      saleRule: RoundSaleRule.PUBLIC_SALE_MULTI_BUY,
    }),
  ];

  const project: Seed.OrderSaleProject = {
    orderSaleProjectId,

    projectId: ninjazMainnetProject.projectId,

    // set project distribution
    vestingPeriod: '100% TGE',
    // ensure date is later than last round end
    distributionDate: new Date('2023-03-17T14:00:00Z'),
    distributionMethod: 'AIRDROP',

    // set project internals
    webEnabled: true,

    // set project fee, seller public key
    // TODO update fee still waiting response from partners
    feePercent: 0,
    feeAddress: feeAddress,
    sellerPublicKeyHash: sellerPublicKeyHashNinjaz,

    // Set funding method
    fundingMethod: 'Tokens',
    lockupPeriod: 'N/A',

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
  '43e0ce50-7208-42e7-bdd7-b9c8ccf1ae42',
  [
    '70f0bcbd-15cb-4dfa-88b7-d375a24060a1',
    '4c68e304-4307-4544-afd6-7552129611c5',
  ]
);
