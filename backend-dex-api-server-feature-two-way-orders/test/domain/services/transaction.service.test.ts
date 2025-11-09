import 'reflect-metadata';

// eslint-disable-next-line node/no-unpublished-import
import {createMock} from 'ts-auto-mock';

import {mockAsset} from '../mock/asset';

import {assetName} from '~/domain/utils/asset.util';

import {TransactionalContext} from '~/domain/context';

import * as Oura from '~/domain/models/oura';
import * as Core from '~/domain/models/core';

import {TransactionRepository} from '~/domain/repositories';

import {
  GY_ASSET_NAME,
  TransactionServiceImplementation,
} from '~/domain/services';

import {
  mockOuraMintAsset,
  mockOuraOutputAsset,
  mockOuraTransaction,
  mockOuraTransactionInput,
  mockOuraTransactionOutput,
} from '../mock/transaction';

const baseAssets = [
  mockAsset({
    policyId: '694b0381aa5c7a6fb6dd1436f0bbff5c4baa28dbaa985a35b4d19f30',
    assetName: assetName('tGENS'),
  }),
];

test('is a fill transaction', async () => {
  const {policyId: baseAssetPolicyId, assetName: baseAssetName} = baseAssets[0];

  await assertFillTransaction(
    true,
    [
      mockOuraTransactionOutput({
        assets: [
          mockOuraOutputAsset({
            policy: baseAssetPolicyId,
            asset: baseAssetName,
          }),
        ],
      }),
    ],
    [
      mockOuraMintAsset({
        asset: GY_ASSET_NAME,
        quantity: -1,
      }),
    ]
  );
});

/* private */ const assertFillTransaction = async (
  expectedResult: boolean,
  outputs: Oura.TransactionOutput[],
  mintAssets: Oura.MintAsset[]
) => {
  const transactionRepository = mockTransactionRepository();

  const transactionService = new TransactionServiceImplementation(
    transactionRepository
  );

  const ouraTransaction = mockOuraTransaction({
    mint: mintAssets,
    inputs: [
      mockOuraTransactionInput({
        tx_id:
          '02607c9398aeb9e2e02db8ead3e1518d1ff48fda10a5037c95309744404a8f47',
        index: 1,
      }),
    ],
    outputs,
  });

  const scriptAddresses = [
    '7050a6aec0fbc0e64ee0f3459f1f8345769a51065fec3211d796dd9e4e',
  ];

  expect(
    await transactionService.isFillTransaction(
      createMock<TransactionalContext>(),
      baseAssets,
      scriptAddresses,
      ouraTransaction
    )
  ).toBe(expectedResult);
};

function mockTransactionRepository() {
  return {
    transactionExistsByTxInputHash: () => Promise.resolve(true),
    getTransactionOutputByTransactionHashAndScriptAddresses: () =>
      Promise.resolve([{} as Core.TransactionOutput]),
  } as unknown as TransactionRepository;
}
