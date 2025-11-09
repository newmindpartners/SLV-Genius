import {Command} from 'commander';
import {isError} from '~/implementation/utils/typescript';
import {loggerService, prismaClient} from '~/server.dependencyContext';

type Options = {schema: string};

type Sequence = {
  sequence_name: string;
};

const dbSchemaProgram = new Command();

export const archiveSchema = async ({schema}: Options) => {
  const date = new Date().toISOString();
  const archiveSchemaName = `${schema}_old-backup-${date}`;

  loggerService.info(`Archiving ${schema} to ${archiveSchemaName}`);

  try {
    await prismaClient.$transaction(async tx => {
      await tx.$executeRawUnsafe(`CREATE SCHEMA "${schema}_new";`);

      await tx.$executeRawUnsafe(
        `GRANT ALL ON SCHEMA "${schema}_new" TO "dex-api";`
      );
      await tx.$executeRawUnsafe(
        `GRANT USAGE ON SCHEMA "${schema}_new" TO "read-only";`
      );

      await tx.$executeRawUnsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE "dex-api" IN SCHEMA "${schema}_new"
          GRANT ALL ON TABLES TO "dex-api";`);

      await tx.$executeRawUnsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE "dex-api" IN SCHEMA "${schema}_new"
          GRANT SELECT ON TABLES TO "read-only";`);

      await tx.$executeRawUnsafe(
        `ALTER SCHEMA "${schema}" RENAME TO "${archiveSchemaName}";`
      );
      await tx.$executeRawUnsafe(
        `ALTER SCHEMA "${schema}_new" RENAME TO "${schema}";`
      );
    });
    loggerService.info(`Archiving ${schema} COMPLETE`);
  } catch (err) {
    if (isError(err)) loggerService.error(err, `Archiving ${schema} FAILED!`);
    else throw err;
  }
};

export const grantSelectSequence = async ({schema}: Options) => {
  loggerService.info(`Granting select permission on ${schema} sequences`);

  try {
    await prismaClient.$transaction(async tx => {
      // Grant select permission on all sequences
      const sequences: Sequence[] =
        await tx.$queryRaw`SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = ${schema}`;

      for (const seq of sequences) {
        const sql = `GRANT SELECT ON SEQUENCE "${schema}".${seq.sequence_name} TO "read-only"`;
        await tx.$executeRawUnsafe(sql);
      }
    });
    loggerService.info(
      `Granting select permissions on sequences for ${schema} COMPLETE`
    );
  } catch (err) {
    if (isError(err))
      loggerService.error(
        err,
        `Granting select permissions on sequences for ${schema} FAILED`
      );
    else throw err;
  }
};

dbSchemaProgram
  .command('archive')
  .option('-s, --schema <schema>', 'Specify the target schema', 'public')
  .action(archiveSchema);

dbSchemaProgram
  .command('grantSelectSequence')
  .option('-s, --schema <schema>', 'Specify the target schema', 'public')
  .action(grantSelectSequence);

dbSchemaProgram.parse();
