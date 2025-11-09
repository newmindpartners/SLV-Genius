import * as CML from '@dcspark/cardano-multiplatform-lib-nodejs';

export const calculateTransactionHash = (
  transactionPayload: string
): string => {
  const transaction = CML.Transaction.from_cbor_hex(transactionPayload);
  const transactionBody = transaction.body();
  const transactionHash = CML.hash_transaction(transactionBody);

  const hashHex = transactionHash.to_hex();

  transaction.free();
  transactionBody.free();
  transactionHash.free();

  return hashHex;
};
