import Big from 'big.js';

type SupportedAssets = 'GENS' | 'GENSX';

/**
 * We make the assumption that both preprod and mainnet assets of the same token
 * has the same total supply.
 */
const ASSET_TOTAL_SUPPLY: Record<SupportedAssets, Big> = {
  GENS: new Big(100_000_000),
  GENSX: new Big(1_000_000_000),
};

/**
 * Source of truth for mainnet treasury addresses and total supply of assets
 *
 * GENS: https://cexplorer.io/tx/46535bb8e163085f8251109b62da67cb03d33bbcb24ee3b9eb0cc54f362734d1
 * GENSX: https://cexplorer.io/tx/cc32d39c8cab08a4113e9fe7405b35ca6a7ba3ed2f4cf7b0d10b8c93cfcd07f3
 *
 */
const MAINNET_ASSET_IDS: Record<SupportedAssets, string> = {
  GENS: 'asset1266q2ewhgul7jh3xqpvjzqarrepfjuler20akr',
  GENSX: 'asset1yg69thkk8j7sd8cdry0h89knea5fmp3dzx9hjq',
};
export const ASSET_TREASURY_MAP_MAINNET: Record<
  string,
  {treasuryAddresses: string[]; totalSupply: Big}
> = {
  [MAINNET_ASSET_IDS.GENS]: {
    treasuryAddresses: [
      'addr1xyjan66zyj6tef93u795axqcqwg353fnx63tzaayursj9ke9m845yf95hjjtreutf6vpsqu3rfznxd4zk9m6fc8pytdsmahfkf',
      'addr1xyr8h2yyn8lgz9epvu8f40e44vtxy7r0nahpj3u75vhe7fqx0w5gfx07sytjzecwn2lnt2ckvfuxl8mwr9reage0nujqyzdx0y',
      'addr1xxwu7tkfvsvmjpecy5s87a9jgpeptrmgq0dkccq4l5zhvm5aeuhvjeqehyrnsffq0a6tysrjzk8ksq7md3sptlg9wehq74j6vl',
      'addr1xx2392yc53nsazxx5z9y40q7gttenemhhgcjaxr5sllugpv4z25f3fr8p6yvdgy2f27puskhn8nh0w3396v8fpllcszs99vzge',
      'addr1xxnv39tyvfvlhl30quelamanyq2exzqwl46y7tr4mzh35j4xez2kgcjel0lz7penlmhmxgq4jvyqalt5fuk8tk90rf9qphswe4',
      'addr1xy9g0r758h52mnnps0eqdrzgy573anh4t0mrmn3w8k95n3g2s78ag00g4h8xrqljq6xysffarm802klk8h8zu0vtf8zsw5shk9',
      'addr1x9wrenxj9acmzfhqns27v7mgdwl2kuull2hdjszyxnr5pwju8nxdytm3kynwp8q4ueaks6a74deel74wm9qygdx8gzaqjap2uz',
      'addr1xysfxc60v6vdwzddeen22ur4u9atdk4k499yfc8e4fsh5u3qjd357e5c6uy6mnnx54c8tct6kmdtd222gns0n2np0feqjzv4eq',
      'addr1xys8w4jtrzqyqhecamqzp9ntlx5ehmt29ehjhf3988nxdweqwatykxyqgp0n3mkqyztxh7dfn0kk5tn09wnz2w0xv6asu4c2g6',
    ],
    totalSupply: ASSET_TOTAL_SUPPLY.GENS,
  },
  [MAINNET_ASSET_IDS.GENSX]: {
    treasuryAddresses: [
      'addr1xyjan66zyj6tef93u795axqcqwg353fnx63tzaayursj9kchdata4q8f4eqmz4pct6uv6evyzxww9w8dg074ucfqwq5q4t8kuv',
      'addr1xyr8h2yyn8lgz9epvu8f40e44vtxy7r0nahpj3u75vhe7fr42hw3w0cr8vuet3jadk2utvas5yyhheezp9f58khuxnrqrd6tj2',
      'addr1xxwu7tkfvsvmjpecy5s87a9jgpeptrmgq0dkccq4l5zhvm3980xlztt3a2ms4m6jrud4q0az7c98fw3js6xmuw28akqssqgkaf',
      'addr1xx2392yc53nsazxx5z9y40q7gttenemhhgcjaxr5sllugp2m4vp8c0f234an9v8nawvy9ncegk70mtkxgguds4ky5vhstvdagc',
      'addr1xxnv39tyvfvlhl30quelamanyq2exzqwl46y7tr4mzh35jk56zy8wwj0qw72mvudnmsuulgrnf0256vd007ay6ww6hls3dk58n',
      'addr1xy9g0r758h52mnnps0eqdrzgy573anh4t0mrmn3w8k95n3gmh6zzwx4wrkuy46zdf72klqzysq5qt0sw984890s6gpaqgjaxd9',
      'addr1x9wrenxj9acmzfhqns27v7mgdwl2kuull2hdjszyxnr5pwhgz867vecgq2x92wm7d6xrt2mm40hvhnujd7m9kg9s2q0sa9tesz',
      'addr1xysfxc60v6vdwzddeen22ur4u9atdk4k499yfc8e4fsh5un95jtfjh09t26uk7tgy5lmup9w0v6ut9qyw2yk9ke3p4qqtcushk',
      'addr1xys8w4jtrzqyqhecamqzp9ntlx5ehmt29ehjhf3988nxdwlxzys005lkhwyk5n9v7wqapsdjzsjy4m6r4knlgwmgw4lsrylmt8',
    ],
    totalSupply: ASSET_TOTAL_SUPPLY.GENSX,
  },
};

/**
 * Source of truth for preprod treasury addresses and total supply of assets
 *
 * GENS: https://preprod.cexplorer.io/asset/asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4
 * GENSX: https://preprod.cexplorer.io/asset/asset1met2lc3a5u33ryl8z2gszze0xsse2us2v3xtpj
 *
 */
const PREPROD_ASSET_IDS: Record<SupportedAssets, string> = {
  GENS: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
  GENSX: 'asset1met2lc3a5u33ryl8z2gszze0xsse2us2v3xtpj',
};
export const ASSET_TREASURY_MAP_PREPROD: Record<
  string,
  {treasuryAddresses: string[]; totalSupply: Big}
> = {
  [PREPROD_ASSET_IDS.GENS]: {
    treasuryAddresses: [
      'addr_test1qqj3jkhct3qmnkta5l60y9wnuaxfemmlq3ee66aywwa89g343f8yzpwq3av7gauswp5ec7nj2e5fxve0nptaknn5904sj9ysa3',
    ],
    totalSupply: ASSET_TOTAL_SUPPLY.GENS,
  },
  [PREPROD_ASSET_IDS.GENSX]: {
    treasuryAddresses: [
      'addr_test1qqj3jkhct3qmnkta5l60y9wnuaxfemmlq3ee66aywwa89g343f8yzpwq3av7gauswp5ec7nj2e5fxve0nptaknn5904sj9ysa3',
    ],
    totalSupply: ASSET_TOTAL_SUPPLY.GENSX,
  },
};
