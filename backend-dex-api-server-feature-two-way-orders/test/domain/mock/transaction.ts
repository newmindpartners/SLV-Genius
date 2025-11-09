// eslint-disable-next-line node/no-unpublished-import
import {createMock} from 'ts-auto-mock';

import * as Oura from '~/domain/models/oura';

export const mockOuraMintAsset = (
  value: Partial<Oura.MintAsset>
): Oura.MintAsset => ({
  ...createMock<Oura.MintAsset>(),
  ...value,
});

export const mockOuraTransaction = (
  value: Partial<Oura.Transaction>
): Oura.Transaction => ({
  ...createMock<Oura.Transaction>(),
  ...value,
});

export const mockOuraTransactionInput = (
  value: Partial<Oura.TransactionInput>
): Oura.TransactionInput => ({
  ...createMock<Oura.TransactionInput>(),
  ...value,
});

export const mockOuraTransactionOutput = (
  value: Partial<Oura.TransactionOutput>
): Oura.TransactionOutput => ({
  ...createMock<Oura.TransactionOutput>(),
  ...value,
});

export const mockOuraOutputAsset = (
  value: Partial<Oura.OutputAsset>
): Oura.OutputAsset => ({
  ...createMock<Oura.OutputAsset>(),
  ...value,
});
