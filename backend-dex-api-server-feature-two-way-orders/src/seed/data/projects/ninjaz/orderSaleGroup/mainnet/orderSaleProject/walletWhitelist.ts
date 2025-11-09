import {walletAddressBech32ToStakeKeyHash} from '~/domain/utils/wallet.util';

/**
 * These are copied from the document of addresses which should be whitelisted for internal testing.
 */
export const whitelistedStakeKeyHashes = [
  // Christofer
  'addr_test1qz5gr43kn7nnzdmastvqdkx7kgr8s7qjnf0zm7tvyhj6prjr4fq3q7yn6tgmx08xxq390qyu7asdf2qlngrhghts8uysdfed6a',
  'addr_test1qzz6cmahgvr8zm2nvd29larspks3jwtnqsxtvxg6568nuxw5846grsq5h89gkv2ts0dfngntj5t4fxkzqvt4fuxdy49q5t232m',
  'addr_test1qpugscr9exwczrham3vfl7mkpqs72uc5l5mkqf3s8zsjp9hnyylpjsp0lx74n5x9q6nj0s62ujcj440tnjtsdhhefkuqd323q4',
  'addr_test1qqrus0ye9vknz0u0jk2d05hwjdvtaywksej829xwatashn5g7jz5puw4r0d76t3a8rqthra7j6zz0ejggzgs93gezatsgwrt4e',
  // Shannon
  'addr_test1qzsuzd5pzf9ehn3c8jwny6zlns5mwajehklk0dukxscqyq4lpgyhe48246el4tfpew82k7n2fdtvjgtttw2v4cmq6u8ss2am4g',
  // Piyush
  'addr_test1qruxukp4fdncrcnxds6ze2afcufs8w4a6m02a0u7yucppwfx23xw3uj9gkatk450ac7hec80ujfyvk3c97f7n8eljjrq74zl3e',
  // Luca
  'addr_test1qzl30kpmmxt6hqam8t8c4258fwxj75slq6y5kf7c637tl07774qajujzu6snh5zyjfg6d0yjsfuu5rss3y0w6psgk98sp9544n',
  // Haluk
  'addr_test1qrgt026gr94f2vfx6eggf5qzr566uql2geaf2wsz7775qe4hn903fs7em5309zwumv7gfvtayxy9c4y46xr9u9jksfls8yxfnx',
  // Lars
  'addr_test1qzd97sklev6v36xvxsq5w25fkethtae2su5fe54k70xqj0daavghhj8e4rryf0xyth5yj0yu7lcxulk6rqhwfvel7p0q6easjp',
  'addr_test1qqnedn7k9s522qwvguxwf8elef28kuh6355f0yyuyzfukxr28fhuwjc2alhlkv34md5mryyqrnsyw688rvfnwqugnyzqs4u6dq',
].reduce((result: string[], value: string) => {
  const stakeKeyHexHash = walletAddressBech32ToStakeKeyHash(value);
  if (!stakeKeyHexHash)
    console.error(
      `Seed: Whitelisted wallet stake key hash ${value} was unexpectedly undefined`
    );
  return stakeKeyHexHash ? [...result, stakeKeyHexHash] : result;
}, []);
