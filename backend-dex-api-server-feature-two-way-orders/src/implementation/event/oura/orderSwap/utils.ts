import * as Oura from '~/domain/models/oura';

import * as fs from 'fs';

// fs
export const devStoreTransactionEvent = (
  isDevelopmentEnvironment: boolean,
  subDirPath: string,
  event: Oura.TransactionEvent
) => {
  if (isDevelopmentEnvironment) {
    fs.mkdirSync(`.temp/oura/${subDirPath}/`, {
      recursive: true,
    });

    fs.writeFileSync(
      `.temp/oura/${subDirPath}/${event.transaction.hash}.json`,
      JSON.stringify(event)
    );
  }
};
