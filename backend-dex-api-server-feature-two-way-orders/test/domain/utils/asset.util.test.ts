import {assetId, assetName, shortName} from '~/domain/utils/asset.util';

test('asset name from short name', () => {
  expect(assetName('ADA')).toBe('414441');
  expect(assetName('CRU')).toBe('435255');
});

test('short name from asset name', () => {
  expect(shortName('414441')).toBe('ADA');
  expect(shortName('435255')).toBe('CRU');
});

test('asset id from policy id and asset name', () => {
  expect(assetId('', assetName(''))).toBe(
    'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj'
  );
});
