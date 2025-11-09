import {CardanoNetwork} from '~/domain/models/cardano';
import {
  walletAddressBech32ToHex,
  walletAddressHexToBech32,
  walletAddressHexToStakeKeyHash,
  walletAddressBech32ToStakeKeyHash,
  walletStakeKeyBech32ToStakeKeyHash,
  walletStakeKeyHashToStakeKeyBech32,
} from '~/domain/utils/wallet.util';

const walletAddressBech32 =
  'addr_test1qr06lwepxjzq420erenkgdyd0kd4uzey8vm7l0fwkfxudade34ql5qevm2tyfnwluwdqa58tjp0fdf2xmhvws4r3nsnsj0p0y3';

const walletAddressHex =
  '00dfafbb2134840aa9f91e6764348d7d9b5e0b243b37efbd2eb24dc6f5b98d41fa032cda9644cddfe39a0ed0eb905e96a546ddd8e854719c27';

test('from hex to bech 32', async () => {
  expect(walletAddressHexToBech32(walletAddressHex)).toBe(walletAddressBech32);
});

test('from bech 32 to hex', async () => {
  expect(walletAddressBech32ToHex(walletAddressBech32)).toBe(walletAddressHex);
});

const eternlBech32Addresses = {
  first:
    'addr_test1qzz6cmahgvr8zm2nvd29larspks3jwtnqsxtvxg6568nuxw5846grsq5h89gkv2ts0dfngntj5t4fxkzqvt4fuxdy49q5t232m',
  second:
    'addr_test1qrkj4v8dzmppm7qunkxgaxg3sppv7hllg6hduspe2uay3dk5846grsq5h89gkv2ts0dfngntj5t4fxkzqvt4fuxdy49qjs6c0j',
  third:
    'addr_test1qrkwy0ywcyr06p2mprhw0wzlmpk38vgygq03mhxwh8thqj75846grsq5h89gkv2ts0dfngntj5t4fxkzqvt4fuxdy49qdta005',
};

const typhonHexAddresses = {
  first: walletAddressBech32ToHex(
    'addr1qy7y5cw70tthngsm5uqy0c9wrlh2xrglrh50gchpgfv3mjp3u3ckskasf4vrvrkavc84nwhl8rw0jtur7nzkszlz6tys68se0e'
  ),
  second: walletAddressBech32ToHex(
    'addr1qxxypju455uu9aprrs090c269c2pwl5t2yly4rtfsyu6v933u3ckskasf4vrvrkavc84nwhl8rw0jtur7nzkszlz6tys7g4csj'
  ),
  third: walletAddressBech32ToHex(
    'addr1qy33serwamlls3s2rpxkvw2j6vaad8hgrxcqyqwxptru8qe3u3ckskasf4vrvrkavc84nwhl8rw0jtur7nzkszlz6tysk0lxv5'
  ),
};

const fullAddressBech32 =
  'addr_test1qzh5dv28h27pn2sfuu4p5jkwy7hvtfr0fp6vx0v5lwghc54hn903fs7em5309zwumv7gfvtayxy9c4y46xr9u9jksflsfxh4g0';
const stakeAddressBech32 =
  'stake_test1uzmejhc5c0va6ghj38wdk0yyk97jrzzu2j2arpj7zetgylc0erxw0';

test('HD wallets provide payment addresses that all have the same stake part', async () => {
  const eternlAddressesStakePart = {
    first: walletAddressBech32ToStakeKeyHash(eternlBech32Addresses.first),
    second: walletAddressBech32ToStakeKeyHash(eternlBech32Addresses.second),
    third: walletAddressBech32ToStakeKeyHash(eternlBech32Addresses.third),
  };

  expect(eternlAddressesStakePart.first).toBe(eternlAddressesStakePart.second);
  expect(eternlAddressesStakePart.first).toBe(eternlAddressesStakePart.third);

  const typhonAddressesStakePart = {
    first: walletAddressHexToStakeKeyHash(typhonHexAddresses.first),
    second: walletAddressHexToStakeKeyHash(typhonHexAddresses.second),
    third: walletAddressHexToStakeKeyHash(typhonHexAddresses.third),
  };

  expect(typhonAddressesStakePart.first).toBe(typhonAddressesStakePart.second);
  expect(typhonAddressesStakePart.first).toBe(typhonAddressesStakePart.third);
});

test('Test stake addresses Bech32 to Stake key hash conversion', async () => {
  expect(walletAddressBech32ToStakeKeyHash(fullAddressBech32)).toBe(
    walletStakeKeyBech32ToStakeKeyHash(stakeAddressBech32)
  );
});

test('Test stake key hash to bech32 conversion', async () => {
  const preprodStakeKeyHashWithoutPrefix =
    '8fd5f5d0386703622c5fd024d1447d5950cedab1f9723138523df1c6';
  const preprodStakeKeyBech32 =
    'stake_test1uz8ataws8pnsxc3vtlgzf52y04v4pnk6k8uhyvfc2g7lr3sa3asv7';

  expect(
    walletStakeKeyHashToStakeKeyBech32(
      preprodStakeKeyHashWithoutPrefix,
      CardanoNetwork.PREPROD
    )
  ).toBe(preprodStakeKeyBech32);

  const mainnetStakeKeyHashWithoutPrefix =
    'e265c8fa16484fcb09f72eeaf98aa7a0dd97b0243f28426e8122f76b';
  const mainnetStakeKeyBech32 =
    'stake1u83xtj86zeyyljcf7uhw47v257sdm9asysljssnwsy30w6c22lhfj';

  expect(
    walletStakeKeyHashToStakeKeyBech32(
      mainnetStakeKeyHashWithoutPrefix,
      CardanoNetwork.MAINNET
    )
  ).toBe(mainnetStakeKeyBech32);

  const mainnetTransactionHash =
    'bdd10b31a6d9d4aabb4960b420a9be1eb2ecb7f5536940dedb689b0e82c4c20b';

  expect(
    walletStakeKeyHashToStakeKeyBech32(
      mainnetTransactionHash,
      CardanoNetwork.MAINNET
    )
  ).toBe(null);
});
