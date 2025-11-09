import 'reflect-metadata';

import {Command} from 'commander';

import {container} from './dependencyContext';
import * as _ from 'lodash';
import {CliServerApplication} from './application';

/**
 * ~~~ Server CLI commands ~~~
 *
 * These commands require a DB connection to read/write data.
 */

const program = new Command();

/**
 * Unless called dynamically, injected dependencies have not yet been initialized
 * and thus resolve to `undefined`.
 */
const getCliServerApplication = _.memoize(() =>
  container.resolve(CliServerApplication)
);

/**
 * Rebuilds all order swap projection records
 * Example:
 * yarn cli:server order-swap --rebuild-all
 */
program
  .command('order-swap')
  .option('--rebuild-all')
  .option('--rebuild-by-id <rebuildOrderSwapId>')
  .action(parameters => {
    getCliServerApplication().orderSwap(parameters);
  });

/**
 * Required for setting price of a `Round` which is a pre-requisite for order sales.
 * This command read/writes data in a running DB instance.
 *
 * Example:

 yarn cli:server set-round-price --round-code CRU/1 --price-usd 100 --price-lovelace 2300000

 */
program
  .command('set-round-price')
  .requiredOption('--round-code <roundCode>')
  .requiredOption('--price-usd <priceUsd>')
  .requiredOption('--price-lovelace <priceLovelace>')
  .action(parameters => {
    getCliServerApplication().setRoundPrice(parameters);
  });

/**
 * Iterate through all TradingWallet entities in the DB and update fields which represent
 * the profitability of a TradingWallet over a time range from now into the past.
 * Options exist to control the bin interval for the querying of this information.
 * The batch size option control how many entities are updated at a time.
 *
 * Example:

 yarn cli:server batch-update-all-trading-wallet-profitability-metrics --window-interval 3mo --bin-interval 1w --batch-size 10

 */
program
  .command('batch-update-all-trading-wallet-profitability-metrics')
  .requiredOption('--window-interval <WindowInterval>')
  .requiredOption('--bin-interval <binInterval>')
  .requiredOption('--batch-size <batchSize>')
  .action(async parameters => {
    try {
      await getCliServerApplication().batchUpdateAllTradingWalletProfitabilityMetrics(
        parameters
      );
    } catch (error) {
      console.error(
        `Batch updating trading wallet profitability metrics failed with inputs: ` +
          `batchSize: ${parameters.batchSize}, ` +
          `windowInterval: ${parameters.windowInterval}, ` +
          `binInterval: ${parameters.binInterval} ` +
          `Error:`,
        error
      );
    }
  });

program.parseAsync();
