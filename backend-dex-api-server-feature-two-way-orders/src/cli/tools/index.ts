import 'reflect-metadata';

import {Command} from 'commander';

import {container} from './dependencyContext';
import {memoize} from 'lodash';
import {CliToolsApplication} from './application';

/**
 * ~~~ Tools CLI commands ~~~
 *
 * These commands do not require an active DB connection.
 * Generally these scripts perform some reading and writing of files but anything
 * can be put here that is intended to be run locally rather than on a hosted
 * environment.
 */

const program = new Command();

/**
 * Unless called dynamically, injected dependencies have not yet been initialized
 * and thus resolve to `undefined`.
 */
const getCliToolsApplication = memoize(() =>
  container.resolve(CliToolsApplication)
);

/**
 * Asset Id is GENS
 * Input file has a certain structure, see code for more info
 * Output file contains SQL insert statements that can be copy-pasted
 *
 * Example:

 yarn cli:tools staking-asset-vesting-sql \
 --asset-id asset1266q2ewhgul7jh3xqpvjzqarrepfjuler20akr \
 --input-file gy_whitelist_all.csv \
 --output-file staking-asset-vesting-gens.sql

 */
program
  .command('staking-asset-vesting-sql')
  .requiredOption('--asset-id <assetId>')
  .requiredOption('--input-file <inputFile>')
  .requiredOption('--output-file <outputFile>')
  .action(parameters => {
    getCliToolsApplication().stakingAssetVestingSql(parameters);
  });

/**
 * Used for fetching on-chain data and parsing into a format that can be used to
 * insert found NFT data into our DB.
 *
 * Output file is used as input to `staking-nft-minting-data-sql` command
 *
 * Example:

 yarn cli:tools staking-parse-blockfrost-nft-data \
 --network MAINNET \
 --project-name GENS \
 --output-file gens-mainnet-nft-data.csv

 */
program
  .command('staking-parse-blockfrost-nft-data')
  .requiredOption('--network <network>')
  .requiredOption('--project-name <projectName>')
  .requiredOption('--output-file <outputFile>')
  .action(parameters => {
    getCliToolsApplication().parseBlockfrostForNftMintingData(parameters);
  });

/**
 * Used for generating SQL insert statements for `StakingNftMintingData` model.
 *
 * Input file is generated output by `staking-parse-blockfrost-nft-data` command
 *
 * Example:

 yarn cli:tools staking-nft-minting-data-sql \
 --input-file gens-mainnet-nft-data.csv \
 --output-file gens-staking-nft-minting-data.sql

 */
program
  .command('staking-nft-minting-data-sql')
  .requiredOption('--input-file <inputFile>')
  .requiredOption('--output-file <outputFile>')
  .action(parameters => {
    getCliToolsApplication().generateStakingNftMintingDataSql(parameters);
  });

program.parse();
