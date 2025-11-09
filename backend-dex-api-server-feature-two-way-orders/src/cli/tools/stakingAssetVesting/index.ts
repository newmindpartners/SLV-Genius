import * as Prisma from '@prisma/client';
import {randomUUID} from 'crypto';
import {CsvError, parse} from 'csv-parse';
import * as fs from 'fs';
import {flatten} from 'lodash';

import {walletStakeKeyBech32ToStakeKeyHash} from '~/domain/utils/wallet.util';

export type Parameters = {
  assetId: string;
  inputFile: string;
  outputFile: string;
};

export const stakingAssetVestingSql = (parameters: Parameters) => {
  const created = new Date();

  const {assetId, inputFile, outputFile} = parameters;

  const inputFileContent = fs.readFileSync(inputFile);

  // input csv record columns
  const InputStakingAssetVestingCsv = [
    'stake_address',
    'nfts_rewarded',
    'total_gens_rewarded',
  ];

  // 1-1 input csv record
  type InputStakingAssetVestingRecord = {
    stake_address: string;
    nfts_rewarded: string;
    total_gens_rewarded: number;
  };

  parse(
    inputFileContent,
    {
      fromLine: 2,
      quote: '"',
      delimiter: ',',
      columns: InputStakingAssetVestingCsv,
    },
    (
      error: CsvError | undefined,
      records: InputStakingAssetVestingRecord[]
    ) => {
      if (error) throw Error;

      const outputStakingAssetsVesting: Prisma.Prisma.StakingAssetVestingGetPayload<{}>[] =
        flatten(
          records.map(record => {
            const {stake_address, total_gens_rewarded} = record;

            const walletStakeKeyHash =
              walletStakeKeyBech32ToStakeKeyHash(stake_address);

            if (walletStakeKeyHash) {
              const assetAmount = BigInt(
                parseInt(
                  // we keep only 50% because other 50% will be dropped later..
                  ((Number(total_gens_rewarded) / 2) * 1_000_000).toString()
                )
              );

              const stakingAssetVesting: Prisma.StakingAssetVesting = {
                stakingAssetVestingId: randomUUID(),
                assetId,
                assetAmount,
                walletStakeKeyHash,
                created,
                updated: created,
              };

              return stakingAssetVesting;
            } else {
              throw new Error('ISPO_REWARDS__INVALID_STAKE_KEY_HASH');
            }
          })
        );

      const insertStakingAssetsVestingSql = outputStakingAssetsVesting.map(
        ({stakingAssetVestingId, walletStakeKeyHash, assetId, assetAmount}) =>
          'INSERT INTO STAKING_ASSET_VESTING ' +
          '(staking_asset_vesting_id, wallet_stake_key_hash, asset_id, asset_amount) ' +
          `VALUES ('${stakingAssetVestingId}', '${walletStakeKeyHash}', '${assetId}', '${assetAmount}');`
      );

      fs.truncate(outputFile, () => {});

      insertStakingAssetsVestingSql.forEach(insertStakingAssetVestingSql =>
        fs.appendFile(outputFile, `${insertStakingAssetVestingSql}\n`, () => {})
      );
    }
  );
};
