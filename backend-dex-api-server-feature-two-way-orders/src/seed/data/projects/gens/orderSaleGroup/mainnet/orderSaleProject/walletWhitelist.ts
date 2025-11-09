import {walletAddressBech32ToStakeKeyHash} from '~/domain/utils/wallet.util';

/**
 * These are copied from the document of addresses which should be whitelisted for internal testing.
 */
export const whitelistedStakeKeyHashes = [
  // Laurent
  'addr_test1qpggg4sykeulu6ypydn4r7kkmf2y409gr5l9hk35xqgu5xnhwnw7yjr84f9tmdf3au56el6zqrs0e9lwfxch3j2p78nqmrpnx6',
  // Genius Yield preprod
  'addr_test1qqj3jkhct3qmnkta5l60y9wnuaxfemmlq3ee66aywwa89g343f8yzpwq3av7gauswp5ec7nj2e5fxve0nptaknn5904sj9ysa3',
  // Shannon
  'addr_test1qr9p7fqe4l53at8jh3zyykfyrf0dgrshnp8p56tupamse5q95ayy00t6f57gfwrn79jtlazangaluxtpkurn8sy52k4sqnxev4',
  // Valentin BIESSE
  'addr_test1qqp0mh5w3pr4uyrm7gm2susr7khznjmuvmwtmxk4hup83agn46mx0ffadh5g59ancl8lyk2wnckzc4gcnhrak5vd3xjq68e9er',
  // Duncan LYNCH
  'addr_test1qp5ef9wj0zkktekv5qwzvuk859892grenm7w2u0xgcxc6qtjhjzufs8q68d8m237lmqhn8u8vpacm8dr3nsp747zsqlqyrc9pv',
  // Saurabh GUPTA
  'addr_test1qr8gqvz3vux44d5nhjttejuus6lhhx2l0kz9se408y3j5tzarkqzd2y2hm7z8ljwty8p7ma0h7fyzn02le7pgzl8rs8qn30xzx',
  // Maria Eugenia Giacinti Costa
  'addr_test1qpvvk7qeayk988wjymygssqzmvjaagvmnq75dc8ntl39ewxlcw4q7gd5dh5nlyha5hxjw47s9a9g6vn4zarzt0sa87rqcrp64x',
  // Pascal SAMA
  'addr_test1qzhzhxer4nhrsyjjnskt793477qqwps47gd69r7sglt4ut3kxx3rs9qrzhnkas0y5ksj9h2e5f0wucl084gypn6uja5qxvmu00',
  // Šimen Škrlep
  'addr_test1qpha94jtgxp6n8qzmhcxsqss4s7wu44czwg6ljuwxh9peg35mw4vdr954k55fm4rsayvt3usl5e09tx9ygsj3mffjq4sy2tete',
  // Dikemba BALOGU
  'addr_test1qzecwqy9hvdf2ca4uxt4ewqur099xk0u0yg55pwgfnpsxwlmqtu8wzhmvgrv0ywmxjnfty7j4h7x4kd65ffuccep2p6swn49sx',
  // Rohit Sud (primary)
  'addr_test1qrttsu66jk2jdn8yn9mtlsd9xp0ufaas58z25e8kkvyqwcw7ehsuervw6xq9p6qfy65e32sf3yp3uv2qlk98hsw64jnq2da7pr',
  // Rohit Sud (Ledger)
  'addr_test1qp3cn6fthael20m56fkrhuu8sz6qmpx39tyfc3q84n038r53jysq2ae83h07g0kudyzpmrz5wwfch4fn5h5f92mmkwrsxanmgv',
  // Michael Stinson (primary)
  'addr_test1qrkpegz27luklednsd0rche0jrrfqe5758ka4ncnyx23tz4q0ktgtz7j6recumjx0kddkjs3a5p7yxgscqhz66j00w3syv9f26',
  // Michael Stinson (Ledger/eternl)
  'addr_test1qz3u60zzgp56h2lrpwr8jz646kelf7hvv8fjw8t47wmcyess3de69x0n8gjchjx4v6nrsnfjzvvyyftx70u0e20v92zsv0dscl',
  // Laurent Bellandi
  'addr_test1qr9m9njlj8djm44ydwj934e3y5n95my5g702u7ajeq86v7yny90c93jt8fxvynswswvgw2gtc6hcrxhpwlhhl3f5kw3s4kxfka',
  // Varderes Barsegyan
  'addr_test1qp06ch5twc5hawn7fal8yxhlsruedf8nqcdrz2cfx62cnaxejkgyqzjwkjvndmtnzp7nf07h4vsnzx4ck479p9tk809q68c38q',
  'addr_test1qrh0fw37hjjjke5sac0zrgs85tn8v5g0vc3dqpm76sete9jv628k6qp5wad2zm3c549dawsdp7nqrelq2n2ssye09destgx79k',
  // Tiffany Monteverde
  'addr_test1qzex0pn4qeheshmjrhetf5j2yut8e8ne4fq34x7a5nwwhlruxq4d2zkdsvd04k29madealuazhghd09qg8w2fkev3xesffg5tr',
  // Bartosz ANTONIAK
  'addr_test1qr7r35vqq8ztc32mjvz00j2t0ut7y82eex4gnvammen4x44ttgz4ar3rceym2xm064j32jdamjk0m802zzdgcsg8ge4qmx0v74',
  // Arthur Contreras
  'addr_test1qzenftn3w66d87ldznq9mc8aufsjuu7fttlcsvqkgc93j8p0l60qdf38fmtvzt53nvh0qtsgp3q2xvj7v6rcmy3dstsqaemruk',
  // Christofer Ärleryd
  'addr_test1qz5gr43kn7nnzdmastvqdkx7kgr8s7qjnf0zm7tvyhj6prjr4fq3q7yn6tgmx08xxq390qyu7asdf2qlngrhghts8uysdfed6a',
  'addr_test1qzz6cmahgvr8zm2nvd29larspks3jwtnqsxtvxg6568nuxw5846grsq5h89gkv2ts0dfngntj5t4fxkzqvt4fuxdy49q5t232m',
  'addr_test1qpugscr9exwczrham3vfl7mkpqs72uc5l5mkqf3s8zsjp9hnyylpjsp0lx74n5x9q6nj0s62ujcj440tnjtsdhhefkuqd323q4',
  'addr_test1qqrus0ye9vknz0u0jk2d05hwjdvtaywksej829xwatashn5g7jz5puw4r0d76t3a8rqthra7j6zz0ejggzgs93gezatsgwrt4e',
  // Shannanigans
  'addr_test1qzsuzd5pzf9ehn3c8jwny6zlns5mwajehklk0dukxscqyq4lpgyhe48246el4tfpew82k7n2fdtvjgtttw2v4cmq6u8ss2am4g',
  // Marvin Bertin
  'addr_test1qpwhlky6dfpvk9swz8acusdg582xnzqa33dtfyeun4jnx2pexdqlp0f9r056tpkl7arv0h6tsl8nf0snu0aftaujttcqq8d58v',
  'addr_test1qq24z8kdgaj9wnw6cvvxl5tneka0lhpkrmwwj9lu0k5nkfgry9mdcl6y07t0etych54093u7k39s05ydnqgx3ysuv3aqu9z5jk',
  // Marvin Bertin HD wallet
  'addr_test1qrqqgyaja7uecfhyazx3fdfl3qz7u2kwmey0jqvaf4cdvlfga8wl2p6w2nsdta5nwdh5fhmz6n3tprvvhxs74tyuu67shy93z5',
  // Attila
  'addr_test1qz96la9s5xa0ad67vvprdrl8dw79gs7nqf58czr409xynscttpxxc9w2gmdewjwzlv8lx255q7z3mqymv0umkygycskqyf227e',
  'addr_test1qqm06dxw60at4647jczdm984w2vh62up452j368ynsmf2a9am2e9jau0cddywaajwykdvlzn67ewa5azqpzug75vj0sqvel6m6',
  // Piyush
  'addr_test1qruxukp4fdncrcnxds6ze2afcufs8w4a6m02a0u7yucppwfx23xw3uj9gkatk450ac7hec80ujfyvk3c97f7n8eljjrq74zl3e',
  // LEXR lawfirm
  'addr_test1qy4dcp3a6l6ual8hj6przypgwkdx9gpkkkqagwhgk25tga9r8nh79fjddfuz2nerdv3wwu55fnv2fvsrg0wl824kzzrqxhw8mk',
  // Shared wallet: PREPROD-TEST-WALLET-1
  'addr_test1qrc0779h8hv0dfqq20l40gx67svdqnr6n7fra0cy7tee6v7cwmglza464tlyz6rm64lvnxpjjpsn0n6w74yzxdl6087sh4yhzj',
  // Shared wallet: PREPROD-TEST-WALLET-2
  'addr_test1qrmv73dl37snpj4whdxfl9c40hrlcnhkdvrejlnu9mlymmm54jqxztlrw3uawaww68qx6af2a50udfexy6ty6e8sjl6qhzjgyu',
  // Shared wallet: PREPROD-TEST-WALLET-3
  'addr_test1qrm42u79w2n0ym7kkq8tascrjfxc4csy8fqww0knem34ymdj826upatycxcqw55pk63qaphtv9lqkncehhtlj3hzxt8q9nmryy',
  // Shared wallet: PREPROD-TEST-WALLET-4
  'addr_test1qq5vc293j26xeqvklz459gzwkj0e30fht0un8sfawtk4jd8kuv20p78042fgck26w56wj04aunwh4w7ctj00ctune64q5cfu9a',
  // Shared wallet: PREPROD-TEST-WALLET-5
  'addr_test1qzmghvwjutk330vq0pwp75su6ee4k2qxwqy3qrzn4cnhlyuhtwc6ma0xmeg7avgdz00kmcxugc4a9flf4u5scfkvakhsldc2aj',
  // Shared wallet: PREPROD-PENTEST-WALLET-1
  'addr_test1qravv8v85eyzr8ng4lpe7pvgq4u2yyk68g9t0fj67r4gesh5ky83gdx0kw26wfqrt3dazmthfadu2a7fahf8jmv8qn7q8glwjd',
  // Shared wallet: PREPROD-PENTEST-WALLET-2
  'addr_test1qpt2xqnhc5wfee0eg6eltsdphygjzx54cayh7y482ern3z7zlekcjer3elxzakvxkduusf4me7q30h3ll00sqr3mctasx2cs8d',
  // Luca
  'addr_test1qzl30kpmmxt6hqam8t8c4258fwxj75slq6y5kf7c637tl07774qajujzu6snh5zyjfg6d0yjsfuu5rss3y0w6psgk98sp9544n',
  // Haluk
  'addr_test1qrgt026gr94f2vfx6eggf5qzr566uql2geaf2wsz7775qe4hn903fs7em5309zwumv7gfvtayxy9c4y46xr9u9jksfls8yxfnx',
  // Lars
  'addr_test1qzd97sklev6v36xvxsq5w25fkethtae2su5fe54k70xqj0daavghhj8e4rryf0xyth5yj0yu7lcxulk6rqhwfvel7p0q6easjp',
  'addr_test1qqnedn7k9s522qwvguxwf8elef28kuh6355f0yyuyzfukxr28fhuwjc2alhlkv34md5mryyqrnsyw688rvfnwqugnyzqs4u6dq',
  // Filip
  'addr_test1qr6xjlyxatvftq20k6pp66jwc8ru5dujp97hqv33749jl64zp3uz8jm2zxwc7excgemccguhyughk860mu0pcsas04ys730ykw',
  // Sourabh
  'addr_test1qpedjqt8hexcl9hs56npm7g2akf7j20smxz2xl5f9ln3we09dnd4g7u6lu28axrx43w34qnmz77k3plznurfcc99tzgsetazy6',
].reduce((result: string[], value: string) => {
  const stakeKeyHexHash = walletAddressBech32ToStakeKeyHash(value);
  if (!stakeKeyHexHash)
    console.error(
      `Seed: Whitelisted wallet stake key hash ${value} was unexpectedly undefined`
    );
  return stakeKeyHexHash ? [...result, stakeKeyHexHash] : result;
}, []);
