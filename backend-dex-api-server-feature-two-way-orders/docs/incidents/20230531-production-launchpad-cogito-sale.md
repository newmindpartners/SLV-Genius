# Production launch pad Cogito sale incident (is_submitted false negative)

### Date

2023-05-31

### Authors

Shannon I'Ons

### Status

- Production data issues resolved.
- Issue cause identified and addressed.

### Summary

Distribution orders did not match the valid application orders. After investigation it was revealed that all orders with related events with related transactions with the is_submitted flag set to false were false negatives.

It would appear that there is more than one bug. All affected orders with `is_submitted=false` were false negatives, however we are aware of a transaction signing issue which is intermittent and causes submission to fail. There is evidence in our queue worker logs that that we experienced the signing bug during the sale. This indicates that there are missing `is_submitted=True` orders.

### Impact

- Incorrect distribution risk increased
- Raised quote asset amount tally was calculated incorrectly
- Submitted base asset amount tally was calculated incorrectly
- Affected user orders were not represented on their portfolio page
- Client relation affected negatively
- End user confidence affected negatively

### Root Causes

The issue is intermittent as only a subset of orders were affected. Suspects at the time of incident include:

- ~Request to core times out but is submitted on chain successfully~
- ~Error thrown on core, maestro or dex api after successful submission~
- A Dex api bug~, perhaps relating to the queue retry handling~

After investigation:

In some order cases the calculation which determines the orderQuoteAssetRaisedAmount which performs a division attempts to convert a resulting float to a bigint in order for the value to be persisted to the database. The conversion fails and throws an error. The uncaught error causes the database transaction to roll back. All submission related database persistence is omitted. The BullMQ job fails and triggers a retry. The retry is then responsible for updating the transaction is_submitted as a failure as the subsequent request is rejected as a duplicate by the transaction server.

```
RangeError: The number 1800000000.04 cannot be converted to a BigInt because it is not an integer
    at BigInt (<anonymous>)
    at OrderSaleProjectRepositoryPrisma.computeProjectDerivedAmounts (/usr/src/app/src/implementation/prisma/orderSaleProject.repository.ts:306:43)
```

It is worth noting that is error is available in the redis database which the job queue makes use of. The failure was not correctly logged.

### Trigger

The bug is triggered when the calculated value of orderQuoteAssetRaisedAmount is a float which fails to convert to BigInt.

### Resolution

Production data issues:
Shannon, Luca, Haluk and Piyush investigate the issue and ran mutative queries against production to correct the situation.

Shannon investigated and created a fix for the conversion bug. Additional effort has been performed to improve our logging transparency.

#### Total orders

```sql
select count(*) from order_sale where round_id = 'cf71d544-587a-44e2-be81-57af91efcbcc';
```

```
+-------+
| count |
|-------|
| 340   |
+-------+
```

#### Total order events

```sql
select count(distinct order_sale_event.event_id)

from order_sale

inner join order_sale_event on order_sale_event.order_sale_id = order_sale.order_sale_id

where order_sale.round_id = 'cf71d544-587a-44e2-be81-57af91efcbcc'
```

```
+-------+
| count |
|-------|
| 340   |
+-------+
```

#### Failed submit orders (False negative)

```sql
select count(distinct order_sale.order_sale_id)

from order_sale

inner join order_sale_event on order_sale_event.order_sale_id = order_sale.order_sale_id

inner join transaction as tx on order_sale_event.transaction_hash = tx.transaction_hash

inner join block on block.block_hash = tx.block_hash

where tx.is_submitted = False and order_sale.round_id = 'cf71d544-587a-44e2-be81-57af91efcbcc'
```

```
+-------+
| count |
|-------|
| 59    |
+-------+
```

#### Rolled back

```sql
select count(distinct order_sale.order_sale_id)

from order_sale

inner join order_sale_event on order_sale_event.order_sale_id = order_sale.order_sale_id

inner join transaction as tx on order_sale_event.transaction_hash = tx.transaction_hash

inner join block on block.block_hash = tx.block_hash

where block.is_roll_back = True and order_sale.round_id = 'cf71d544-587a-44e2-be81-57af91efcbcc'
```

```
+-------+
| count |
|-------|
| 0     |
+-------+
```

#### Valid order (Incorrect)

```sql
select count(distinct order_sale.order_sale_id)

from order_sale

inner join order_sale_event on order_sale_event.order_sale_id = order_sale.order_sale_id

inner join transaction as tx on order_sale_event.transaction_hash = tx.transaction_hash

inner join block on block.block_hash = tx.block_hash

where tx.is_submitted = True and block.is_roll_back = False and order_sale.round_id = 'cf71d544-587a-44e2-be81-57af91efcbcc'
```

```
+-------+
| count |
|-------|
| 92    |
+-------+
```

#### No block hash

```sql
select count(distinct order_sale_event.event_id)

from order_sale

inner join order_sale_event on order_sale_event.order_sale_id = order_sale.order_sale_id

full join transaction as tx on order_sale_event.transaction_hash = tx.transaction_hash

where order_sale.round_id = 'cf71d544-587a-44e2-be81-57af91efcbcc' and tx.block_hash is null and tx.is_submitted = True;
```

```
+-------+
| count |
|-------|
| 189   |
+-------+
```

#### Determine is_submit false transactions not in on chain data

All is submit false orders are included in on chain data

```sql
select tx.transaction_hash

from order_sale

inner join order_sale_event on order_sale_event.order_sale_id = order_sale.order_sale_id

inner join transaction as tx on order_sale_event.transaction_hash = tx.transaction_hash

inner join block on block.block_hash = tx.block_hash

where tx.is_submitted = False and order_sale.round_id = 'cf71d544-587a-44e2-be81-57af91efcbcc' and tx.transaction_hash not in (
'00b102784bc9c4b543f24c4737b20d7d41d40a58a2945e9e8feaac305c01d87e',
'01bdb61e7cf2b700ea93f587cbf05c4ed51736a0f3010a97bb99345e0d3f045a',
'03411d9fb0e5d078efd511eed60948e25f71a8b48905121e54d5b49c19131d7f',
'038801336a78cc51a392b1bac679a576bc3ed864e13f2739fabfbf32785912a5',
'0649a45149906b51f1feecc2e9a04b11cad379fb820f67422c20e0f6a6b1ea0d',
'0684d3874b65d6b68463cb7c363d0c9e1c7238196007b219d2cf639e9d5106eb',
'09f05661b0079fc57fdee8632cefdd5615a0ccae9f640a5a8592eac1a54ee33c',
'0b4b434f193cded0222ca2c72fa5e007f18b7cf9b41de14d253998a4746d5a4d',
'0f222c8f9db3e48204e269e9a963ce88bb6106c07f8b2a1b0f69a67fa749de5d',
'16ad5c5db95a065d42f6321ebfe7d3dca2e1e9b3015e51083129b3f54db5fd78',
'16afdb4ce0eb6f58a6434b7416c675c9b48433b2f9da765ef8683b42451e0a33',
'1738796730c4a3843fc8a902ad9d858e097b70e3e360e3673d7d08172c0d7ce2',
'18f0b2b130474d6b10a235e13b15ff57f1135b24ade1b52b4b2f204b53449a5c',
'197ba93e510eede1fc09509573a31481d0b96f48c7a94da3a7cef3fd3e7bb907',
'198ab5b8ffd3c3a03ec6871a8ae1eef43a07f6f3cd00b094f497527c777d0955',
'1a3c5fd0cbd183f93af0a8023cbfd0a432aab5d80f469042757be181d219f66c',
'1b880a41b2b58cb034f49ede4e5a6810bfda310ef19dd74737fff51c7da60420',
'1c7672ca58f42a4414e581717a1477f2b03d078403b37fee8f32b586d5c1cf9b',
'1edc1da62e9a2b4816a6ac83944202fd3a5f60f541b56dffbe0387f200f1e0bb',
'220650c1d9909260f8196caf9e5bc3e47736188e312e29da1b15878fac414bac',
'228b93644303e15623eec8bca87f9b566c90c907c8054f452a12a72542cf0d61',
'26f7d7ce69cb1b31f20ec3d1c9ee48f66ce5a8020bd0426fb7c10361360e2608',
'28b84a9bb585c2015efb7e817df65e49877b0db3123f40498f092b0abfc70904',
'29116fc50720757387bad890791addc6d53d645ed5cac929a64d7483f8ee0bd8',
'29b8742fcca61ad342d206d32f23ec1f6513227963eb370fbb835905bdeefa3b',
'2cfd3ba0e950e501a3482f6958ff3b2694ce85c00b92cb3f12af5a873bdfaead',
'2e39499541f37459ec6034db90455984f4c0c279b33683b888cb16db170cf745',
'2f412eed0c6fa96e4da0b5f605331ca235007df16bbbddb84f0b2e854311234d',
'324f7357fd104d8f662eb570d3c4e92d63629f3630e48e34f567673388f8b0a9',
'3431deeff1c01ade0f817838d24c6bd07207330d73fc9601ea2be694947708aa',
'347609b30d696af80130c96f4cb978b0ff9811dcb9fd96fe640632822a2929ba',
'36607ec5193bb7a77e5f0002a160a2623acda10a3278ed095f2e9e77b5f284da',
'3666d65f7a9dc6d69cc1994064cb171a28b2d40ccc728717aea6263de412e9a1',
'373b01122c60bd55c1fdb358bedf29215a122b8471d55bc3d1d73fa28db814b7',
'3981b253b57f4e2f9c9304193c93d8359b69998ec37f5ad2b791720f3867fb77',
'3d53adf7a4348de5c18796e7d1f1d2b5d79942d7649b3d3f4ab1d10cfe758648',
'442dc8278f11c8f1307a6717da9f3beed1acb88d76e9fd7bfba7931c6907d4b9',
'4728d9d2169bfaada781d66545cc1f1fca6268a766bd0bc8225201fdfc65995d',
'475e950709e4e35c497edffb2316acd84d76c6311527782b301cc0b96ae1d82a',
'4b018b118345ebd4816a22759bc2a9e31fb0199cdbdf52638782e50a5f54a6b3',
'4b34be3b36ab7c4375fedb2bfe0331b21097859ea6c34f8f8e6f99604be477e6',
'4e1d38c8ee4513819b352927bcc348874e60904f51d62c2d0725098cb63e9bca',
'4e6294e948dbb8cb4530277233b8b71fd972137dc68a222c751b68b0aa960125',
'51dbf765c94abdc3ac36b451c48990142a1e20009b82a071a5d07f4d891d627e',
'526ff8b3b41b864407e9f0e8c7bdd73af031b353c4f4f33022a5a1b8f5850ebe',
'554c99bd0a93f031c520f4d690ed3566a17a14ca0a93187fa9184143277160c7',
'55e60ee87c4fe24528ea534b25658148602d2b300d65aadcc9638dcce5b2748f',
'5710b1a1acbe92682a23d1e2001a8757e88a83e55e7f03339eec35c5d206390a',
'57b11f1ac01c5be95359408c8466a654411cfe07d54b71e92e0a1102c0021c6f',
'5949d2c2d51eaef90bf34606f7d95d8edae9b85ae5deeeefe85b4e220d5d442f',
'59ba5595f6413f33fb78a705f9fdfb310216c0174a7726324e7a4a9ebd535a04',
'5a2e5add65b1cc12ea39319ae6e0ee570885b7af8e6af6bab3dc2b8bd065d85b',
'5bf4d46bba276cc4bf1e9f6a72ee630150dda950bb1478dea2169a4f52ba9fa0',
'5e19113ac012271aecd0255aa34ee07f298375d4b0a4fa79f11e1419ab6e9f61',
'5f1be99f3cf4f668a5d6cfacaaf7f8f8a2236f4dee42b17d267c5e2b0a7378f6',
'5ff1a27556b750b823c4b9ee63bc53527016d7b2ade0003c4a045010e8f2957f',
'5ff787e6c751f2c835315a6cda48a316d035ad53c5bca6355953cc466d116ff2',
'615cf880a8f0da09469de0daf5e168220fa91e1c2a9dc209f9ad577c55ca29aa',
'6200d54b10870fd6d651d78dbdb9fc30fc696b381976083204213d5703eea96b',
'63472054618fd36d93a5110a12a9a9166ee0b5c93743774874c567b7a500b1c1',
'6609f656781576c1f60c26c07b11e0a38537f0e6ec2d2931e0d5f42833cdc6ad',
'66739b5f7fcd0f73784a847e4b008be73b5e1565e0dfb6d3c8dd37c34975711f',
'67eeb8d55e935388bbac0c8ca1a64d92cf1fd021bd2906ef09b438360afe8d68',
'6c00f948abbbfd6be664d73edff4f091af843887770cec07a9faab017d0a1018',
'6df453b3dacb200caf7387d29e72b9235cecaee1cec3657cf01f8b9fa801d459',
'70f79bb776770af6b4e0c23dead74f9e2c434929fa433eedf5fa4fa4c52bd86c',
'723d9a84fb7df823eee0bc33df68a4796a513126fe929c6d510a658218e66c39',
'734f27c30a8252a23b370cb60d77c116bc8871b3b46f379e76d9d7bb8fc6fc71',
'737cbe3a5a4dea0bd6bc8f8047e5268b972c7f4a495a3531a421e64563ec223a',
'7482c7637cfa655d09a4d98f5f4ec15c4c74922b0b84653af1e18cf1def94774',
'77fb4ae2c6c21c9414227635706cb6856978cc0448b7f064af1036fe17419b51',
'782186f8bf5898652760de5dc6177861b14dd2c2287b04481d89c07a8b50ba5d',
'786f28d3607ea87930b1892a5673c510f9be40e46e779f7563e8aa548808d359',
'78c9861162d442988f9e1463b2e5e736dc904aa5d8a9287441af1ad415090f39',
'7c552f1673316843602d5ce1c27b19dc254a8815f673155adbb89e7611fa4165',
'7cfa2d70fa9a2c2965912cf9910d82d6736eb0e00f8863c9666e11456b045dbb',
'8302eaa444fdb9e17c887e9dc66152c652dc17413e43ae766db474c846155e05',
'838f581c05a655d5a5e1a90177b11be06e94dfd1e8ef0f97e08720438a1c1cda',
'85a2b4487123adbb493267838660db53f445104a12146f62e02ed39e6be3886f',
'86853605eb03a32e03e95a682dde226c521f327abdf427832ffe9b67a27b3d1a',
'8844f0e481deb516f4ac9a8755fd72e6d973d8f77cdf5b0f4388f44ce3a929ff',
'8abb516ead1e79fb5dd8b5fd9aebc1606ce0999bf86ba28e7716802da66a5429',
'8d21a9c4bf5a4bca7b4d4e327bc9d8ecf9fe5a0dece10a28b6801b8625eba2c9',
'8f4664a35cd2062612731752566188fb85612e5f05af54298e21aaa815adbbfe',
'90eea7c6ed1ad51e7565068325c10907da6f51aadf19cf4776900ffc55e629ea',
'9146e6cd458919f7cb25d1262f8bdc34ddd8a31f0f1376fe16168585a340b729',
'92513bac6c98056629b2be1076c696d6854793a98f456d144715bd791cfce0eb',
'928d6d103fcfa5bd14c88e63b6190ecb2b053233dcc80aa53ff9ccda741304c6',
'92a140ebbd2c8031f39f20074e332aa5213161fcf999e7984dfd23ee90727dbf',
'938adb2547eb1ffa4b8a27de068a09dd1489431b0f177657a9d47457e4835dbe',
'958cb6a122f2a7900263d895590cfd3834e02af0a98acf0542c490502fae421e',
'95d68485e11e9f13ec91f0e90b5308a21b1db59c77e5c79e03cedab3af3689b8',
'96448cc5cf8969d92892f286ecfa5dca62489a21493a2c277e310f945e000ffb',
'9664a7ac8a765fac759ebb52563159f8bf432f29fbfb8e1f840e988a9cd0a2f5',
'988779ca82c15531e4ae8e395c4081c3fcbcdf0a2ef01dd604de106aeca977d0',
'98aaf362cf956f59dc3c557cad173dba91d8f57825320bd96dc8a9d47901d4b9',
'a1f664d669962862c4afa02e97e7022b201dd9ee614f3f9e4b914a34ca8b1825',
'a34afd76127ac8c38afd62b1ee020e66b1a12cd7ffccc1d9c9adebbf0993b79b',
'a43bc661c7b1e6405807175d6e5781229c2eae2b7b063e97b27c457cf8e2d43f',
'a504c9cd8551677be3d1586a47612d218bb80cea7af8a2b7b6d654511df0a903',
'a6ff94f42a52b7414d20b911139e2dcf73928b442b636a4f83bfd934386743d2',
'ab939788b6d865e1395a74e099b46c99fa088165feb8158112fbf2c2253ae82f',
'ac33f25de94ac81b7e7e421c20719bf9c84da25816dc6635bf616441806b4eb8',
'adb9de7aa794792992b92ffc9a6e006193cf929ea16bc808b31446b4a6552faf',
'ae30be3f450612bdfabc45520373c9a066104e42e7d5767fe15af609f116f0ec',
'b2a4054fc9aafef07ceec394b7a5086b653b3dd8e04158a17ec5ff8570552033',
'b373f336b3b442ded4da7fc9545588a95f44164ca7dac0ca3bac0fc5b889689c',
'b5d6ae7a7468319b3b775122fa74aa8593bbf5d195db7e1a107e21d0d7482d24',
'b80d4c84efa2f27ddbabf07cca3aa97acbe02dd2d180f39d6f697ee291f0f987',
'ba06174d4bfbca38abd717bdcf2fa9fda68d3624d438c4120b6bc8acf40c6015',
'bbf5d29455c31a7a31d0e86a71d025b20c550301c467fcc5423c1af862527213',
'bcd87080e8ba6a6db3082f78ee8528b00905325645c0d2583b6fbce069e52047',
'bd8a5aab60b1b0990d8ec1ba7fdd16e001be0451c90025052172aaa6351547f0',
'bef6a4c4b264fd5d7cee595c71ecd6e8f7eda0337d8e4c6ade15787b8233c9a0',
'c26c69a76bb3939248aca48a5ba6589de2b3e193ee94ed8416f3eefd4a7c3418',
'c5b7d01838bcbb64976ce9f74ab721fc1725f348fbec57a467b7d539b3a58276',
'c7ec6aa701241a649e8fad85ce9b82978b6001960e10530331a93cfdd01fddbe',
'c81c07e0de5a2d9d8760df7cd749b19053fbe09ee78aa65252cd2e5875032413',
'ca8f7b24d3c743b8b665166a9cbe11c476c77af29b4775d9835f376b6016c1b3',
'cae75dd82c46e36f5e69b720ce9bd11b629f15958a08b0b1d7bcee8a92a9d93b',
'cc70b6b39e23ffabe6c9d832b0a64d60bc7dd09426104bd016666cbc4f9c62ec',
'd02443dc0421e5e1fd51f8982850ee8192ebb81f5f66819e3ed3fe346da963fa',
'd0f70b6ca8f16b679a923b1ddbcf2c2327e130dc1459d660a606a0c105b41250',
'd3b522b0c527775367121ca883ade79838cadf1d7632d8aec61b5bb4035929c4',
'd3d6a2ca3ee7e248b1c2370836e86ecda1911fb0f50f30c77d622e84b6a8d39d',
'dcbb4bddcce85580bd936f0bf7071a23a5a23aab47d65591ad79ea6f1c146b89',
'dd7176257b7bea51b10f92da740deebdbe7b5a025889d0a8c9cda9a96d1e3212',
'dd753bdfd5e87e8ada5f63a89a51078c76fd3dfcae2f8d5cc23af67233a29adc',
'de8fad1d0c4b35abfe1b23bf7c70dbc47f4e10eb24fc1882934823661dc982ce',
'df19deef9d5026733b8f2d388130446219837eb41c6a298528fdd5a10f9966f8',
'e1b17e3c50972f5691fe04f501092c1cb4dc77acf089bd455bf41490c12aa69c',
'e1d9e3ba696f38bf4b8426955d96f4edf2d3501fbec5a62d006bc6b90dc92e66',
'e22380c25f91b466b231eb809fa4d6b45f5af47457f89d2d93dc50ce17205ff3',
'e283e6b3f5f220f315676b5b662e702c391043b51716a8721a95d7acb6debde1',
'e4cb5a4d6e59da5aac079083f09762135a74a3c9299da2397c1c8db165f2a266',
'e5b55b9a6188e73000e8f679f2677023bc655b69f632eba56c1ad19c06f31a85',
'e7310610800e4bfb38d4c84d56c9b4db8309c5b649109b0b4ba6985147f40503',
'e9b1ff1f8d3dda7630e404fe93f4b07f2ce33798df89464eaa36108efe4d3aa4',
'e9fc1fb2fc4c3d9cc9d952301e56b4fe63e6db731ead3f99608a800fc6cdf454',
'eb4d12ff0454a009397382da3390d5cc16525171684d3a9bea2fcc48a7561a40',
'ec297460f511dc4aa81722fe3d5dc7eb109d3149f1b087e4176881d59975d5e9',
'ec3de3eff4a0d8946598a589c025e76498bd9c3d28956c2e02805dc5cae9808e',
'ef41207e90eea5da22209c5fe4df7850cc13b286dbd6c981b86ca4c3d96bfef2',
'f0cc5f9138bc0cca641da966ccc4c92e08150ef0dc4e6570ddaa8a444da697d4',
'f11389358f2894e994df7edc4822431868d11447374202a72da7e2a1ff4debbb',
'f392a93553e6fffa391992a2ee4aaf3c297825d4cdcbeeeb2a53f3fb55f2041c',
'f45d06c131afa02ffd71b9ee72456f312512066e1dc57f5e74bd873557cff602',
'f47887c83ce1a215da6e8322cc9da81e52000f7d4fa857e622446ab47f2a0801',
'f62032aef7e820e9d96d547657bd201075e2772fc111712b3be201c030600720',
'f88b49e29a970458d97cafc4942509a406a73b169c2335de62ae0e123a08d580',
'f88e9c7c12413bceb91df17c589f24e221bdb68ebb0a17629cdb76240524e82a'
)
```

#### Determine if all on chain orders are present in application

A diff was performed on the ordered transaction application (including is_submitted=false) hashes vs the ordered transaction on chain hashes to determine that they matched completely. They did match perfectly.

#### Update cogito is_submitted to true

```sql
BEGIN;

UPDATE transaction
SET is_submitted = True
WHERE transaction_hash IN (
   SELECT tx.transaction_hash
   FROM Project
   INNER JOIN order_sale_project ON project.project_id = order_sale_project.project_id
   INNER JOIN round ON round.order_sale_project_id = order_sale_project.order_sale_project_id
   INNER JOIN order_sale ON order_sale.round_id = round.round_id
   INNER JOIN order_sale_event ON order_sale_event.order_sale_id = order_sale.order_sale_id
   INNER JOIN transaction AS tx ON order_sale_event.transaction_hash = tx.transaction_hash
   INNER JOIN block ON block.block_hash = tx.block_hash
   WHERE project.name = 'Cogito Protocol' AND tx.is_submitted = False AND block.is_roll_back = False
);

ROLLBACK;
```

```
UPDATE 59
```

#### Update round base asset submit amount

```sql
BEGIN;

update round
set base_asset_submitted_amount = (
  SELECT SUM (order_sale_event.base_asset_amount)

  from Project

  inner join order_sale_project on  project.project_id = order_sale_project.project_id

  inner join round on round.order_sale_project_id = order_sale_project.order_sale_project_id

  inner join order_sale on order_sale.round_id = round.round_id

  inner join order_sale_event on order_sale_event.order_sale_id = order_sale.order_sale_id

  inner join transaction as tx on order_sale_event.transaction_hash = tx.transaction_hash

  inner join block on block.block_hash = tx.block_hash

  where project.name = 'Cogito Protocol' and block.is_roll_back = False and order_sale_event.event_type = 'OPEN'

  group by round.number, project.name

  order by round.number asc
) where round.round_id = (
  SELECT round.round_id
  FROM Project
  INNER JOIN order_sale_project ON project.project_id = order_sale_project.project_id
  INNER JOIN round ON round.order_sale_project_id = order_sale_project.order_sale_project_id
  WHERE project.name = 'Cogito Protocol'
);

ROLLBACK;
```

```
UPDATE 1
```

#### Update round quote asset raised amount

```sql
BEGIN;

update round
set quote_asset_raised_amount = (
  SELECT SUM (order_sale_event.base_asset_amount)

  from Project

  inner join order_sale_project on  project.project_id = order_sale_project.project_id

  inner join round on round.order_sale_project_id = order_sale_project.order_sale_project_id

  inner join order_sale on order_sale.round_id = round.round_id

  inner join order_sale_event on order_sale_event.order_sale_id = order_sale.order_sale_id

  inner join transaction as tx on order_sale_event.transaction_hash = tx.transaction_hash

  inner join block on block.block_hash = tx.block_hash

  where project.name = 'Cogito Protocol' and block.is_roll_back = False and order_sale_event.event_type = 'OPEN'

  group by round.number, project.name

  order by round.number asc
) * 0.11
where round.round_id = (
  SELECT round.round_id
  FROM Project
  INNER JOIN order_sale_project ON project.project_id = order_sale_project.project_id
  INNER JOIN round ON round.order_sale_project_id = order_sale_project.order_sale_project_id
  WHERE project.name = 'Cogito Protocol'
);

ROLLBACK;
```

```
UPDATE 1
```

#### Query sale order summary

```sql
\copy (
select
  order_sale_event.event_id,
  order_sale_event.transaction_hash,
  order_sale_event.created,
  tx.is_submitted,
  order_sale.user_id
from order_sale
inner join order_sale_event on order_sale_event.order_sale_id = order_sale.order_sale_id
inner join transaction as tx on order_sale_event.transaction_hash = tx.transaction_hash
inner join block on block.block_hash = tx.block_hash
where order_sale.round_id = 'cf71d544-587a-44e2-be81-57af91efcbcc'
order by order_sale_event.created asc
) to '/home/shan/Downloads/cogito_false_negative_submit_tx_hashes.csv' csv header;
```

```csv
event_id,transaction_hash,created,is_submitted,user_id
3831f137-01cb-4742-938d-e4fa96852ac2,0b4b434f193cded0222ca2c72fa5e007f18b7cf9b41de14d253998a4746d5a4d,2023-05-29 09:01:05.418,t,d548cb7d-1044-4cb9-a969-d0f0144fa53b
5af65881-b10b-4934-8b71-e80873ba014e,a34afd76127ac8c38afd62b1ee020e66b1a12cd7ffccc1d9c9adebbf0993b79b,2023-05-29 09:01:12.032,f,9761ac7b-8899-4505-8d31-ad73383eb7a5
7a882052-ef41-4f53-9e54-0204614d3c1e,ae30be3f450612bdfabc45520373c9a066104e42e7d5767fe15af609f116f0ec,2023-05-29 09:01:23.987,f,eb849f56-5e5e-4afc-bae5-c326e6246d80
7e23a6a3-1b6c-4566-835d-9f41f31d96f7,197ba93e510eede1fc09509573a31481d0b96f48c7a94da3a7cef3fd3e7bb907,2023-05-29 09:01:36.832,f,94cfd9fa-9a2e-4407-ac2f-147fa3489126
39e062d2-4ac7-4e1c-b72f-24eb8d429c28,8d21a9c4bf5a4bca7b4d4e327bc9d8ecf9fe5a0dece10a28b6801b8625eba2c9,2023-05-29 09:01:42.071,f,4909b00e-6ab6-4e74-951f-d6377ffdacbf
c3e2b37e-8817-4e68-9011-391a66ea94a3,de8fad1d0c4b35abfe1b23bf7c70dbc47f4e10eb24fc1882934823661dc982ce,2023-05-29 09:01:44.333,f,4d2ae353-7f57-4c34-a844-fa22259c53e9
c138000f-a8f6-490a-860d-5e4cb92dcbc2,ca8f7b24d3c743b8b665166a9cbe11c476c77af29b4775d9835f376b6016c1b3,2023-05-29 09:02:26.623,t,15fde243-036f-4315-a8a7-a8612fa98ae4
3de1db9e-e66f-4774-83fb-05822a68d42c,a6ff94f42a52b7414d20b911139e2dcf73928b442b636a4f83bfd934386743d2,2023-05-29 09:03:25.883,f,273f9684-a51b-4c97-b346-17f15fdc865d
f1194b16-b04f-41e5-8156-3a4af222ddcd,5949d2c2d51eaef90bf34606f7d95d8edae9b85ae5deeeefe85b4e220d5d442f,2023-05-29 09:03:28.755,t,71c35436-b6ca-4b9d-8820-516f3e76e0ec
c00ea7a8-4330-4dd9-9259-8e4860170cd0,347609b30d696af80130c96f4cb978b0ff9811dcb9fd96fe640632822a2929ba,2023-05-29 09:03:45.98,f,f6a7c392-9bc7-45c0-8ba3-2260c32a11a7
4792168c-5ed6-4d05-ba94-73e6aca0938f,5710b1a1acbe92682a23d1e2001a8757e88a83e55e7f03339eec35c5d206390a,2023-05-29 09:04:14.509,t,1e4a9b19-913e-4b2d-94ee-e06e9612721f
58329a0f-0658-4d8a-9284-1608b8956c7f,cc70b6b39e23ffabe6c9d832b0a64d60bc7dd09426104bd016666cbc4f9c62ec,2023-05-29 09:05:41.215,t,07adb4e3-6c02-4294-95f3-b109435569c5
93f76172-a37f-41d5-b941-90e76215c9c0,ab939788b6d865e1395a74e099b46c99fa088165feb8158112fbf2c2253ae82f,2023-05-29 09:06:38.529,t,96e49624-806f-4efc-b070-8f8d6ce0cf5e
67211237-b7ca-4e2d-ae48-db5b36fdfecd,0f222c8f9db3e48204e269e9a963ce88bb6106c07f8b2a1b0f69a67fa749de5d,2023-05-29 09:07:02.707,f,ed053dc0-6437-423d-94e8-2f303a6f0542
e33c84ff-e4ab-43f2-a3a1-1246ec9c8bd5,f11389358f2894e994df7edc4822431868d11447374202a72da7e2a1ff4debbb,2023-05-29 09:07:13.038,f,ea06fc0e-ed25-4a24-8887-208c05be714a
b90ae31e-b2ee-4b3b-8299-905acc207005,928d6d103fcfa5bd14c88e63b6190ecb2b053233dcc80aa53ff9ccda741304c6,2023-05-29 09:11:45.72,f,ed053dc0-6437-423d-94e8-2f303a6f0542
ec2a3eeb-1e64-4aa9-ac4d-a9c6e4e9a3f1,03411d9fb0e5d078efd511eed60948e25f71a8b48905121e54d5b49c19131d7f,2023-05-29 09:16:27.234,f,ce3c8a1b-ef27-4819-90af-b892eadc67f2
15ed259a-4e47-42d7-bc9e-bf2be2fb9760,dd7176257b7bea51b10f92da740deebdbe7b5a025889d0a8c9cda9a96d1e3212,2023-05-29 09:18:29.513,t,7238f98e-d94a-429f-9c96-4df878ef324b
709a2086-2d1a-4e90-8159-7b81c8f6fbca,e7310610800e4bfb38d4c84d56c9b4db8309c5b649109b0b4ba6985147f40503,2023-05-29 09:19:44.161,t,49c120b4-f367-481e-b8ac-8b8283b3827a
d2b75875-8448-454f-a4ca-d43094476ba2,e5b55b9a6188e73000e8f679f2677023bc655b69f632eba56c1ad19c06f31a85,2023-05-29 09:19:51.354,f,ef715ce6-7b3b-4ee8-8384-f6a110ab2b73
d4b42715-16b2-4bb7-9925-f08909dba250,9664a7ac8a765fac759ebb52563159f8bf432f29fbfb8e1f840e988a9cd0a2f5,2023-05-29 09:23:09.136,t,49c120b4-f367-481e-b8ac-8b8283b3827a
1d500370-a3e8-4643-b509-0efdd3b76e9f,16ad5c5db95a065d42f6321ebfe7d3dca2e1e9b3015e51083129b3f54db5fd78,2023-05-29 09:23:24.608,f,79e0e65f-05d1-4be0-a553-3df54bff313d
2c390e45-bf3b-4b9d-a2f5-c7933c50e9aa,8abb516ead1e79fb5dd8b5fd9aebc1606ce0999bf86ba28e7716802da66a5429,2023-05-29 09:29:39.12,t,6a38f7ab-a29f-474e-b263-cd71f6cb5f60
c5445efd-27d3-4be5-aa14-aefb2284b1e7,c26c69a76bb3939248aca48a5ba6589de2b3e193ee94ed8416f3eefd4a7c3418,2023-05-29 09:31:11.542,t,6a38f7ab-a29f-474e-b263-cd71f6cb5f60
465204cf-95b5-485f-a39a-0eb6562817d5,4b34be3b36ab7c4375fedb2bfe0331b21097859ea6c34f8f8e6f99604be477e6,2023-05-29 09:31:41.197,t,c90d6535-68af-4414-a713-6c4d6dda54a5
8f5d2267-1eae-49c0-b289-a7d3f1a99833,dcbb4bddcce85580bd936f0bf7071a23a5a23aab47d65591ad79ea6f1c146b89,2023-05-29 09:32:10.81,t,49c120b4-f367-481e-b8ac-8b8283b3827a
a2cdd74c-f65f-4643-96fb-3e86a904d938,96448cc5cf8969d92892f286ecfa5dca62489a21493a2c277e310f945e000ffb,2023-05-29 09:32:50.642,t,49c120b4-f367-481e-b8ac-8b8283b3827a
ce27fbba-6853-4862-87f6-64e7f4b4bab8,18f0b2b130474d6b10a235e13b15ff57f1135b24ade1b52b4b2f204b53449a5c,2023-05-29 09:33:31.955,t,49c120b4-f367-481e-b8ac-8b8283b3827a
92ec0339-190a-4f4f-af91-c9891e19f90d,ec297460f511dc4aa81722fe3d5dc7eb109d3149f1b087e4176881d59975d5e9,2023-05-29 09:33:49.509,f,cbd44ef8-44e1-4479-947d-f076ca2c2a1a
64a74e7a-fe51-48fa-bf1b-cd625a8707f8,228b93644303e15623eec8bca87f9b566c90c907c8054f452a12a72542cf0d61,2023-05-29 09:36:00.686,t,49c120b4-f367-481e-b8ac-8b8283b3827a
86312e26-974f-4470-9747-0ec1c891d6b9,988779ca82c15531e4ae8e395c4081c3fcbcdf0a2ef01dd604de106aeca977d0,2023-05-29 09:36:31.688,t,49c120b4-f367-481e-b8ac-8b8283b3827a
01f14b0c-c26a-4e38-a1b5-97157e070f1e,01bdb61e7cf2b700ea93f587cbf05c4ed51736a0f3010a97bb99345e0d3f045a,2023-05-29 09:37:07.798,t,49c120b4-f367-481e-b8ac-8b8283b3827a
026dcd20-3594-4542-9687-534bd03590ab,bbf5d29455c31a7a31d0e86a71d025b20c550301c467fcc5423c1af862527213,2023-05-29 09:39:31.493,t,6a38f7ab-a29f-474e-b263-cd71f6cb5f60
7fb4d2db-3a88-4260-af17-93c4e44cc5aa,70f79bb776770af6b4e0c23dead74f9e2c434929fa433eedf5fa4fa4c52bd86c,2023-05-29 09:45:18.012,t,35ac8736-a296-4d71-8ff1-b39803fd6afa
a8db540e-96bc-4ba7-a8a1-f6fa38a43891,f47887c83ce1a215da6e8322cc9da81e52000f7d4fa857e622446ab47f2a0801,2023-05-29 10:00:20.183,t,75d90e63-e0a9-43eb-853b-b0b0d563536c
eba1db95-52f2-4fb7-b011-a454b7e2e7b3,1b880a41b2b58cb034f49ede4e5a6810bfda310ef19dd74737fff51c7da60420,2023-05-29 10:01:34.941,t,15fde243-036f-4315-a8a7-a8612fa98ae4
2dfe57c6-67ae-4bea-ac02-f55e1398f786,f45d06c131afa02ffd71b9ee72456f312512066e1dc57f5e74bd873557cff602,2023-05-29 10:13:05.97,t,3d3d3c14-f6a0-461a-ad3a-d0633efeb4b8
f1411e19-f0a8-4999-b28f-622725b601cd,442dc8278f11c8f1307a6717da9f3beed1acb88d76e9fd7bfba7931c6907d4b9,2023-05-29 10:27:02.88,f,9761ac7b-8899-4505-8d31-ad73383eb7a5
2f112ffc-ba2c-4e1a-a299-7466654aca91,26f7d7ce69cb1b31f20ec3d1c9ee48f66ce5a8020bd0426fb7c10361360e2608,2023-05-29 10:30:20.886,t,ccccc6da-9d58-4ea5-9987-87bb0aec1155
05d0cd94-4e39-4944-8a14-bbeb4b6143de,723d9a84fb7df823eee0bc33df68a4796a513126fe929c6d510a658218e66c39,2023-05-29 10:34:25.683,t,eead00d2-f998-44a6-945d-353c068c3910
b7a85136-a679-41a3-bda1-98778263e290,4e1d38c8ee4513819b352927bcc348874e60904f51d62c2d0725098cb63e9bca,2023-05-29 10:39:49.79,t,9e9874eb-3720-4404-80b0-35411b1147b7
bf4a5f8d-fb45-480b-a707-1eef75e48352,e9fc1fb2fc4c3d9cc9d952301e56b4fe63e6db731ead3f99608a800fc6cdf454,2023-05-29 10:41:43.934,t,d1c48dde-8f89-40ba-a111-73a86e9f9aa5
1f07e138-7e2a-40e4-aae0-1f2fb7d62bc4,55e60ee87c4fe24528ea534b25658148602d2b300d65aadcc9638dcce5b2748f,2023-05-29 10:42:50.516,f,fded897c-b667-4124-a8cb-28394c7ceb91
6d1a8cfa-c7f9-49a1-816f-0b9afb454e45,09f05661b0079fc57fdee8632cefdd5615a0ccae9f640a5a8592eac1a54ee33c,2023-05-29 10:43:14.421,t,d1c48dde-8f89-40ba-a111-73a86e9f9aa5
65d19f2f-789a-46e1-a480-2d7876abc287,d3d6a2ca3ee7e248b1c2370836e86ecda1911fb0f50f30c77d622e84b6a8d39d,2023-05-29 10:44:14.954,t,d1c48dde-8f89-40ba-a111-73a86e9f9aa5
11973eb8-09f6-4e74-a91d-080d676c0f6d,4728d9d2169bfaada781d66545cc1f1fca6268a766bd0bc8225201fdfc65995d,2023-05-29 10:44:52.425,t,d1c48dde-8f89-40ba-a111-73a86e9f9aa5
c5b2e8f1-8663-4a26-adc1-dbd3d70b5e81,d0f70b6ca8f16b679a923b1ddbcf2c2327e130dc1459d660a606a0c105b41250,2023-05-29 10:47:06.547,t,d1c48dde-8f89-40ba-a111-73a86e9f9aa5
1e41afcb-751d-4dd3-b14c-abfd3ab1757b,eb4d12ff0454a009397382da3390d5cc16525171684d3a9bea2fcc48a7561a40,2023-05-29 10:47:36.034,t,e2c3550e-947e-4026-b6dd-690e21cd0f05
9d221d78-8b5a-425e-a1db-b2f013d2ecb3,e283e6b3f5f220f315676b5b662e702c391043b51716a8721a95d7acb6debde1,2023-05-29 10:52:02.222,f,3af49446-03a7-464c-ab91-3335d4f5d9c0
aa5cd99e-a763-46b5-9191-374a21284824,59ba5595f6413f33fb78a705f9fdfb310216c0174a7726324e7a4a9ebd535a04,2023-05-29 11:10:59.611,f,163a6b8d-f4c2-4e57-90d3-8ba7bf044de2
58348a2e-662c-42b5-87d3-c4b99c55bf7e,5f1be99f3cf4f668a5d6cfacaaf7f8f8a2236f4dee42b17d267c5e2b0a7378f6,2023-05-29 11:14:25.607,t,d1c48dde-8f89-40ba-a111-73a86e9f9aa5
90900959-b111-44b3-a90a-a24d08885600,ef41207e90eea5da22209c5fe4df7850cc13b286dbd6c981b86ca4c3d96bfef2,2023-05-29 11:15:00.939,t,d1c48dde-8f89-40ba-a111-73a86e9f9aa5
a1f38778-cb54-4b54-ae73-142bec5c9d7d,8302eaa444fdb9e17c887e9dc66152c652dc17413e43ae766db474c846155e05,2023-05-29 11:20:28.747,f,3008a0fe-777a-4e20-9647-310368bb3b7c
e9e2c59c-8f02-4dfb-a5c5-d0579de8a82d,16afdb4ce0eb6f58a6434b7416c675c9b48433b2f9da765ef8683b42451e0a33,2023-05-29 11:21:16.602,t,cf81bfb4-7bcd-4549-9e24-20df516425ca
0c550e99-ce70-41ea-a78e-706c2f819c04,4b018b118345ebd4816a22759bc2a9e31fb0199cdbdf52638782e50a5f54a6b3,2023-05-29 11:21:56.435,t,d1c48dde-8f89-40ba-a111-73a86e9f9aa5
25d7f253-8060-4939-ba47-dd429b9acfb6,9146e6cd458919f7cb25d1262f8bdc34ddd8a31f0f1376fe16168585a340b729,2023-05-29 11:23:44.606,f,589af625-6942-43ad-9444-59bc9693b86c
5965181d-5076-4ed7-9130-28b4fe1db9ed,df19deef9d5026733b8f2d388130446219837eb41c6a298528fdd5a10f9966f8,2023-05-29 11:34:37.871,t,d9a550f8-23d1-4a0b-893e-aa99c13ca676
29a453cb-4c53-4bf2-9a19-a28a40b01f20,cae75dd82c46e36f5e69b720ce9bd11b629f15958a08b0b1d7bcee8a92a9d93b,2023-05-29 11:54:51.667,f,0b33db93-c53f-4359-bc40-8f281ba9a6ad
a256c108-95fa-4b2e-b27b-f3c211fee0f3,373b01122c60bd55c1fdb358bedf29215a122b8471d55bc3d1d73fa28db814b7,2023-05-29 12:08:47.851,f,cd2938e0-19f0-4d9b-8822-b77078a5f3aa
674059c5-9236-4d97-acea-bc7eed9749a2,958cb6a122f2a7900263d895590cfd3834e02af0a98acf0542c490502fae421e,2023-05-29 12:14:27.893,t,327de0dc-f80d-46e7-90ca-786b3e3ffa66
f00c8eaa-2508-4849-8fbe-2aff7b7de697,1edc1da62e9a2b4816a6ac83944202fd3a5f60f541b56dffbe0387f200f1e0bb,2023-05-29 12:14:40.636,f,a76ceb47-c6d3-4694-833f-965bd13839b3
7e4e5b2e-7aae-4fb5-b32a-62f81bb62add,0649a45149906b51f1feecc2e9a04b11cad379fb820f67422c20e0f6a6b1ea0d,2023-05-29 12:21:07.324,t,3ae4c1bb-65ed-4ebe-8b5d-db9981de1667
99382f2e-9308-4a05-8113-00f98b191567,f62032aef7e820e9d96d547657bd201075e2772fc111712b3be201c030600720,2023-05-29 12:32:03.356,t,1b3dbfeb-22fa-4e70-877c-15ee137be6a4
90a4dcb5-b3de-4cd6-9aeb-c986ee22d947,b80d4c84efa2f27ddbabf07cca3aa97acbe02dd2d180f39d6f697ee291f0f987,2023-05-29 12:38:22.717,f,d7149de1-6666-482a-a7a3-6a7e74f20f18
a272bc72-1377-4208-ab27-c520d0369e33,4e6294e948dbb8cb4530277233b8b71fd972137dc68a222c751b68b0aa960125,2023-05-29 12:42:52.024,f,8ad5a8fe-02d1-406e-a47e-18980b8c4ae0
cae8023b-f976-4b50-a2f1-41852ddb2b50,6200d54b10870fd6d651d78dbdb9fc30fc696b381976083204213d5703eea96b,2023-05-29 12:48:06.966,t,3e186e22-f986-4448-aa49-13cc8c04b9c2
db74be84-c324-4712-82b8-446fca0c6d3b,92513bac6c98056629b2be1076c696d6854793a98f456d144715bd791cfce0eb,2023-05-29 12:51:35.226,t,251e4e9e-2772-4029-a536-340e57768478
36352049-d2ce-4610-85e2-f104c123d9df,3431deeff1c01ade0f817838d24c6bd07207330d73fc9601ea2be694947708aa,2023-05-29 13:10:12.222,f,d0752b26-27e2-4f5f-ba1a-fd6795f19c16
1a2bb8ed-f4d3-410a-8c03-8217db2923fe,adb9de7aa794792992b92ffc9a6e006193cf929ea16bc808b31446b4a6552faf,2023-05-29 13:12:02.408,f,d0752b26-27e2-4f5f-ba1a-fd6795f19c16
6ae02f7a-2493-45d3-8d69-2628b0a8e3be,220650c1d9909260f8196caf9e5bc3e47736188e312e29da1b15878fac414bac,2023-05-29 13:19:36.491,t,f97f73c7-8fad-43d0-912f-7c75f9d3c636
5044349b-e9b9-449d-a6b0-519a87b8afb7,ba06174d4bfbca38abd717bdcf2fa9fda68d3624d438c4120b6bc8acf40c6015,2023-05-29 13:34:30.31,t,4ecbfade-da21-4247-90db-49af1f0b4dea
b52f0650-a945-49ae-8dbc-99584692ce9b,2e39499541f37459ec6034db90455984f4c0c279b33683b888cb16db170cf745,2023-05-29 13:48:55.655,f,75d90e63-e0a9-43eb-853b-b0b0d563536c
a7ba241b-f0f0-4837-b8d5-c6396593b177,7cfa2d70fa9a2c2965912cf9910d82d6736eb0e00f8863c9666e11456b045dbb,2023-05-29 14:10:04.903,t,99afc250-2da4-4374-805f-61855fc26231
a47859be-b476-4eef-9519-a23d7e085c36,8f4664a35cd2062612731752566188fb85612e5f05af54298e21aaa815adbbfe,2023-05-29 14:15:21.672,t,a4a02210-1813-40a4-9a33-33e007d29436
9c5b0cad-dceb-4597-b251-67a0de710b6a,00b102784bc9c4b543f24c4737b20d7d41d40a58a2945e9e8feaac305c01d87e,2023-05-29 14:20:18.373,t,a4a02210-1813-40a4-9a33-33e007d29436
e78e5721-6db1-4678-bf15-4f39b2ab4786,5ff1a27556b750b823c4b9ee63bc53527016d7b2ade0003c4a045010e8f2957f,2023-05-29 14:25:30.97,t,a4a02210-1813-40a4-9a33-33e007d29436
4350daa3-cb9b-408d-bcae-a3a6973ddfcf,85a2b4487123adbb493267838660db53f445104a12146f62e02ed39e6be3886f,2023-05-29 14:45:43.591,t,c8ad5f45-ba38-49a1-b6cd-ecb28f43f446
4faa8a79-47bc-4461-8ed1-33ee96a0f995,f0cc5f9138bc0cca641da966ccc4c92e08150ef0dc4e6570ddaa8a444da697d4,2023-05-29 14:53:13.907,t,c89c99bc-46dc-40b2-b643-2b76ad6c6541
3040018e-0a4f-4495-9560-3615c0d02340,786f28d3607ea87930b1892a5673c510f9be40e46e779f7563e8aa548808d359,2023-05-29 15:40:11.246,f,daa3c2c8-d0d3-47dc-b221-22ef6f659589
2296bab5-f36f-4a48-b400-0f8f4a8a21d8,0684d3874b65d6b68463cb7c363d0c9e1c7238196007b219d2cf639e9d5106eb,2023-05-29 15:43:53.982,t,102f09dc-36e3-4382-beb7-fb9502cf309e
81a9aa07-f31c-4626-a9eb-750b9d203688,36607ec5193bb7a77e5f0002a160a2623acda10a3278ed095f2e9e77b5f284da,2023-05-29 15:56:23.72,t,f89534b5-b93d-4063-b7c9-5bbb055d7237
f365b29c-0e01-44cf-913d-e7362f22dd7c,734f27c30a8252a23b370cb60d77c116bc8871b3b46f379e76d9d7bb8fc6fc71,2023-05-29 16:05:48.31,t,873f2c2a-d333-4b9c-a013-3bd14d93963f
a7bc7070-ace7-4eb5-ba13-cd008b99fb1a,e4cb5a4d6e59da5aac079083f09762135a74a3c9299da2397c1c8db165f2a266,2023-05-29 16:06:18.992,t,d141b62d-ef61-4eda-a72f-bffd79d95c4c
5c40b5c9-d898-4acd-b888-5c91da4a9baf,77fb4ae2c6c21c9414227635706cb6856978cc0448b7f064af1036fe17419b51,2023-05-29 16:19:51.692,f,f6b6d7e6-d5b4-4009-be6b-03762029cf7d
b91fa720-c3c2-4a75-9e57-303877c8fde4,782186f8bf5898652760de5dc6177861b14dd2c2287b04481d89c07a8b50ba5d,2023-05-29 16:21:43.589,t,731b4381-c5b9-4ad4-9269-a149586fecae
c6912c40-c94d-44fa-b580-690513b39268,95d68485e11e9f13ec91f0e90b5308a21b1db59c77e5c79e03cedab3af3689b8,2023-05-29 16:56:37.145,t,55068aa0-1aa5-4105-a24b-bd558489ad27
7bd71e19-b1a2-40d4-a217-bde8d2bcf954,66739b5f7fcd0f73784a847e4b008be73b5e1565e0dfb6d3c8dd37c34975711f,2023-05-29 17:13:54.805,f,de3ba135-feaf-43a8-8367-683dca2166c4
d9322f36-1659-44b7-81ce-52a5404a2fcd,3981b253b57f4e2f9c9304193c93d8359b69998ec37f5ad2b791720f3867fb77,2023-05-29 17:17:20.189,t,c8fc3638-b04c-442e-bb08-70cc8141bade
fac74b18-550e-4bf4-889f-dea09c685a86,2f412eed0c6fa96e4da0b5f605331ca235007df16bbbddb84f0b2e854311234d,2023-05-29 17:33:02.592,f,1ac1a5dc-5096-422e-b5b7-65567c8cacea
ecb383b1-9cfa-4548-a9df-5a3e8fd367d6,a504c9cd8551677be3d1586a47612d218bb80cea7af8a2b7b6d654511df0a903,2023-05-29 17:55:06.54,f,96ce192a-76e9-440b-a25c-056650f6cbee
5037f85d-e7e8-4767-b7df-2f6afbac36e0,2cfd3ba0e950e501a3482f6958ff3b2694ce85c00b92cb3f12af5a873bdfaead,2023-05-29 17:57:30.616,t,70dc22f2-3be4-4397-a926-8088bdedb429
46e75733-8f2f-44f6-9dcb-e94f6f6240f1,938adb2547eb1ffa4b8a27de068a09dd1489431b0f177657a9d47457e4835dbe,2023-05-29 18:06:46.289,f,9a82a0dd-1544-4474-a429-a16b0d950450
130e102b-9032-4be0-9f79-b365b607b1c0,5e19113ac012271aecd0255aa34ee07f298375d4b0a4fa79f11e1419ab6e9f61,2023-05-29 18:09:49.42,t,d968f690-e33b-47f0-940a-59a5381c12e3
886ac5c7-7068-49ec-b83e-44a8fb1d2b35,3d53adf7a4348de5c18796e7d1f1d2b5d79942d7649b3d3f4ab1d10cfe758648,2023-05-29 18:19:11.241,f,3a04d1b5-be14-4c45-9cb7-cda486db86a9
87822ed1-3a26-4fed-a4e1-f8d93596f8c8,7482c7637cfa655d09a4d98f5f4ec15c4c74922b0b84653af1e18cf1def94774,2023-05-29 18:20:21.361,f,b0e4390f-bb9f-48cd-9a9b-c42c63ba594b
5bc63916-e387-49d1-9817-1c26af5ac8d2,475e950709e4e35c497edffb2316acd84d76c6311527782b301cc0b96ae1d82a,2023-05-29 18:37:03.665,t,5a29a6a1-9c1d-46e0-acb1-af1573b87688
e29559c8-db76-418d-a9db-f99498fb2bdf,6609f656781576c1f60c26c07b11e0a38537f0e6ec2d2931e0d5f42833cdc6ad,2023-05-29 18:52:58.243,f,6d1caf81-f3f1-4676-b0f2-4522f99f41d9
cc39ada9-dc0e-401f-adff-9b2de25c136b,bcd87080e8ba6a6db3082f78ee8528b00905325645c0d2583b6fbce069e52047,2023-05-29 19:02:26.436,t,1c0cbbe7-52ee-412c-8b0a-fbb5c552bc1e
5b5ecb51-61c8-4da0-a9f0-ee82ac8a6826,8844f0e481deb516f4ac9a8755fd72e6d973d8f77cdf5b0f4388f44ce3a929ff,2023-05-29 19:18:51.197,t,d6376107-cad4-45f5-a0ee-e9e983aaa819
58aaac45-42cb-43d4-9dd4-065fd8363464,038801336a78cc51a392b1bac679a576bc3ed864e13f2739fabfbf32785912a5,2023-05-29 19:19:23.603,t,9c29b810-29be-4662-9023-f321221019ca
20bc51a5-4a74-4476-9da3-bceb270829c4,c5b7d01838bcbb64976ce9f74ab721fc1725f348fbec57a467b7d539b3a58276,2023-05-29 19:30:06.863,f,167d292e-6ef5-4d64-bfb5-87dba7d16b4c
6bdf6a64-7313-4570-8548-1d14fc2b38ee,5ff787e6c751f2c835315a6cda48a316d035ad53c5bca6355953cc466d116ff2,2023-05-29 19:44:08.119,f,3db29f00-16e9-4aa9-8245-5e6d97a51977
fc279bad-2630-4c8c-8394-3b7e47fbd890,b5d6ae7a7468319b3b775122fa74aa8593bbf5d195db7e1a107e21d0d7482d24,2023-05-29 19:53:27.816,t,fbdda980-dc87-4f87-9ee8-b4bbe297ca6f
34664232-1cb4-4fc1-be65-b6f069e3d097,a1f664d669962862c4afa02e97e7022b201dd9ee614f3f9e4b914a34ca8b1825,2023-05-29 21:10:36.627,f,23e8ddd7-a1a1-49db-af5d-0d3b0d53589e
7988d5a5-48e0-452f-967a-912daa3e9351,5bf4d46bba276cc4bf1e9f6a72ee630150dda950bb1478dea2169a4f52ba9fa0,2023-05-29 21:25:51.057,f,3e8c483a-8af4-4b7b-b4ce-4871285e8a45
77659987-17f2-4486-9f2b-95ba0b2f4a1f,838f581c05a655d5a5e1a90177b11be06e94dfd1e8ef0f97e08720438a1c1cda,2023-05-29 21:29:53.358,t,bd1a76b3-2fe8-4a67-ae3a-38db1142fd8b
9c12143a-54e2-4e85-9b48-a24e3cc5ce19,63472054618fd36d93a5110a12a9a9166ee0b5c93743774874c567b7a500b1c1,2023-05-29 21:42:05.078,t,a5a2577d-37db-4d0b-846b-4d84d9f5eeb5
c8a975ad-593e-4f0b-820f-6258a549f87e,ac33f25de94ac81b7e7e421c20719bf9c84da25816dc6635bf616441806b4eb8,2023-05-29 21:45:53.813,t,67a14ab6-a13d-4d02-8f38-ab1d77110ec7
1537665a-ea1b-47d5-ab96-2b2536c88c44,b373f336b3b442ded4da7fc9545588a95f44164ca7dac0ca3bac0fc5b889689c,2023-05-29 21:48:00.887,t,d5a5a86f-cd5c-473b-905f-b360fa91b2ad
15baf8f4-07f2-4ce0-a938-4bbf35651256,e22380c25f91b466b231eb809fa4d6b45f5af47457f89d2d93dc50ce17205ff3,2023-05-29 22:00:45.062,t,310d166e-c61f-4e45-be2f-c878d5a9950b
7e0b7cbf-ad2a-4706-8fc6-4354f1af85c9,57b11f1ac01c5be95359408c8466a654411cfe07d54b71e92e0a1102c0021c6f,2023-05-29 22:01:04.523,f,8e5ae166-351c-4f5f-8648-46c543fe12bc
c6a1b335-11eb-40bd-9407-87144b3d2792,51dbf765c94abdc3ac36b451c48990142a1e20009b82a071a5d07f4d891d627e,2023-05-29 22:29:58.021,t,95ad3c48-a1e1-40b5-b470-bd6c8e541f78
70e6f80a-5135-4d61-bf2c-1a0ce6f214da,28b84a9bb585c2015efb7e817df65e49877b0db3123f40498f092b0abfc70904,2023-05-29 22:34:04.371,f,9b826e27-6ddc-4367-a00d-19f0069655c0
055efad8-0179-4491-a3f1-a3c97ab3e898,3666d65f7a9dc6d69cc1994064cb171a28b2d40ccc728717aea6263de412e9a1,2023-05-29 22:36:09.916,t,d27ca44b-bfb1-439b-951f-6466a46e416c
f42f68bc-eb83-493f-b8e8-66cd4dac31d0,554c99bd0a93f031c520f4d690ed3566a17a14ca0a93187fa9184143277160c7,2023-05-29 23:14:22.247,t,65027e63-382c-4f60-bfb7-0e94f8d5c191
aec2cd45-a39e-457f-9c56-795c451a1ed5,324f7357fd104d8f662eb570d3c4e92d63629f3630e48e34f567673388f8b0a9,2023-05-29 23:16:50.704,t,65027e63-382c-4f60-bfb7-0e94f8d5c191
d27c38d7-3c10-4da5-9ddb-8431e83c702f,6c00f948abbbfd6be664d73edff4f091af843887770cec07a9faab017d0a1018,2023-05-29 23:26:01.984,f,3818568e-6260-48fe-b635-2bc5a5224d8e
e45f51c8-fde0-4d17-8457-081f7e8fb4ef,67eeb8d55e935388bbac0c8ca1a64d92cf1fd021bd2906ef09b438360afe8d68,2023-05-29 23:28:50.707,f,7ba3712c-818e-45dd-8d16-f13f821f6c1e
eabab69d-717b-4142-8d9b-b4b4bf0587d6,7c552f1673316843602d5ce1c27b19dc254a8815f673155adbb89e7611fa4165,2023-05-29 23:46:57.133,t,1974615d-1154-4f6c-b620-050af9e70e45
091b4ecc-1145-42d0-8432-459ef537b916,615cf880a8f0da09469de0daf5e168220fa91e1c2a9dc209f9ad577c55ca29aa,2023-05-30 00:34:53.342,f,ed9505a0-0f24-4f52-bd64-f5277957b5fd
9ad1b8a1-707d-426a-b953-10282356059c,526ff8b3b41b864407e9f0e8c7bdd73af031b353c4f4f33022a5a1b8f5850ebe,2023-05-30 00:56:15.259,t,8cc5450f-9699-41bf-aca2-2f87a28a2746
c1549367-b607-434d-b24b-a5ce3bd882e6,90eea7c6ed1ad51e7565068325c10907da6f51aadf19cf4776900ffc55e629ea,2023-05-30 01:01:09.557,f,2b12039b-40a8-40e1-829a-34e2a6c0e785
b4510260-a72c-49b5-b4ae-a5fd6e6646c5,6df453b3dacb200caf7387d29e72b9235cecaee1cec3657cf01f8b9fa801d459,2023-05-30 01:25:12.428,f,61d07aa1-b49e-4ff5-ae48-785d5550d4c8
d00f014f-ea33-45e5-b11b-91d4d36085b4,86853605eb03a32e03e95a682dde226c521f327abdf427832ffe9b67a27b3d1a,2023-05-30 01:50:36.407,f,1559e0ef-da7a-4eea-9d79-33acf137dffc
736e5f09-abd2-43d8-9ee6-ff1c03587567,dd753bdfd5e87e8ada5f63a89a51078c76fd3dfcae2f8d5cc23af67233a29adc,2023-05-30 01:55:06.534,f,1559e0ef-da7a-4eea-9d79-33acf137dffc
78e8f4bc-0d3a-4a19-b1e2-2ec87bfd62b2,e1b17e3c50972f5691fe04f501092c1cb4dc77acf089bd455bf41490c12aa69c,2023-05-30 01:59:00.087,t,1559e0ef-da7a-4eea-9d79-33acf137dffc
2d2e40f1-b1bf-47c1-90ee-1d4a8a2f3f96,f88b49e29a970458d97cafc4942509a406a73b169c2335de62ae0e123a08d580,2023-05-30 02:18:04.698,t,8efb41c6-de9b-48d1-9734-4db7ca95aa9d
267e407f-0002-44ed-9e2e-1229a61d3798,bd8a5aab60b1b0990d8ec1ba7fdd16e001be0451c90025052172aaa6351547f0,2023-05-30 02:21:24.715,t,0f4d9e82-27ac-4df4-85d9-133a977a03ca
60fdc406-6e26-4fbc-9c9d-72c34802fe91,ec3de3eff4a0d8946598a589c025e76498bd9c3d28956c2e02805dc5cae9808e,2023-05-30 04:12:15.06,f,58900bd2-eecc-4e68-affc-21fbdb4a64f6
283dbb47-2bb8-4624-99a2-8e8d2731c6f9,b2a4054fc9aafef07ceec394b7a5086b653b3dd8e04158a17ec5ff8570552033,2023-05-30 04:25:24.27,f,28db76ef-7aa3-4723-82c9-2e133763bdb9
6b7efc14-cd22-4fe6-b650-59ac0e871e5d,1c7672ca58f42a4414e581717a1477f2b03d078403b37fee8f32b586d5c1cf9b,2023-05-30 04:41:01.771,t,986cfa9f-7f81-4c60-8784-914157c96cf7
48231b89-89fe-4242-bfa6-8e98bc956898,737cbe3a5a4dea0bd6bc8f8047e5268b972c7f4a495a3531a421e64563ec223a,2023-05-30 05:30:15.638,f,39c80ed2-842f-41f9-9281-8464ace6e9e4
2cab3a05-15cb-4d6f-9ed0-1426dc893a32,5a2e5add65b1cc12ea39319ae6e0ee570885b7af8e6af6bab3dc2b8bd065d85b,2023-05-30 05:51:10.263,f,edcf645a-e8f0-4fab-ad23-9124d0ce9260
69f684c4-8b0b-4278-8dd7-3fc2a5a84ee9,1a3c5fd0cbd183f93af0a8023cbfd0a432aab5d80f469042757be181d219f66c,2023-05-30 06:33:33.455,t,07bfe299-d766-40a7-b015-59b0f506b35d
76f91712-fed2-4bc8-a4fd-e5156aad1fbb,d02443dc0421e5e1fd51f8982850ee8192ebb81f5f66819e3ed3fe346da963fa,2023-05-30 06:37:20.353,t,0e1ff5fa-abf8-40ce-901e-fcd667b100d3
524b3f0e-0075-4118-b572-2ce15778d0f0,c7ec6aa701241a649e8fad85ce9b82978b6001960e10530331a93cfdd01fddbe,2023-05-30 07:09:34.944,t,433f1620-9bd8-49c5-a962-d7e394872515
b865d573-169c-4104-a91f-b799b040c460,1738796730c4a3843fc8a902ad9d858e097b70e3e360e3673d7d08172c0d7ce2,2023-05-30 07:26:33.197,f,eca40b3d-704c-4539-a09c-b408f82e08e3
372553c5-e6f7-46aa-b231-c9fe39a1e913,98aaf362cf956f59dc3c557cad173dba91d8f57825320bd96dc8a9d47901d4b9,2023-05-30 07:26:46.514,t,0e1ff5fa-abf8-40ce-901e-fcd667b100d3
2555dc8d-a64b-4417-abf7-8f00cea253e9,bef6a4c4b264fd5d7cee595c71ecd6e8f7eda0337d8e4c6ade15787b8233c9a0,2023-05-30 07:42:10.616,t,b1ea2d2e-15f8-48c1-91a9-4f32a37707b4
30510e1c-ed51-4951-b131-47c177c47855,198ab5b8ffd3c3a03ec6871a8ae1eef43a07f6f3cd00b094f497527c777d0955,2023-05-30 07:42:59.998,t,589a5f28-7100-4ad3-9aa3-fe20fefd34d0
a6025164-ab75-40ca-a01f-cd527b0c91f5,29116fc50720757387bad890791addc6d53d645ed5cac929a64d7483f8ee0bd8,2023-05-30 07:43:38.429,f,34ef5697-33fa-4e90-97d9-cb87bb0ce53d
810e1773-95a4-4d25-b48b-b17cafb11c88,e9b1ff1f8d3dda7630e404fe93f4b07f2ce33798df89464eaa36108efe4d3aa4,2023-05-30 07:45:36.793,t,ff5402f6-a0e5-4a50-9a1b-0b74614481a6
a6a36073-a18a-40fa-be77-a14759a62c70,f88e9c7c12413bceb91df17c589f24e221bdb68ebb0a17629cdb76240524e82a,2023-05-30 08:15:12.355,t,73526239-1f63-4d78-b9fc-7e2980488a5a
f5c883bb-900a-4454-9eb3-3eae5d051db2,29b8742fcca61ad342d206d32f23ec1f6513227963eb370fbb835905bdeefa3b,2023-05-30 08:28:06.602,f,0e1ff5fa-abf8-40ce-901e-fcd667b100d3
c927aa2b-b274-4ef4-a2b7-4d27982a15f9,d3b522b0c527775367121ca883ade79838cadf1d7632d8aec61b5bb4035929c4,2023-05-30 08:28:19.297,t,733e0fbe-63a2-4d80-906e-a984d663917a
b8539e74-a39e-43f2-96c6-dfc85de0eb49,a43bc661c7b1e6405807175d6e5781229c2eae2b7b063e97b27c457cf8e2d43f,2023-05-30 08:32:12.14,t,b1664b43-76e9-41e9-9995-c0af0ad221df
f0930ca7-08fc-4ae8-b31d-620e27dd9a5c,92a140ebbd2c8031f39f20074e332aa5213161fcf999e7984dfd23ee90727dbf,2023-05-30 08:37:30.608,t,733e0fbe-63a2-4d80-906e-a984d663917a
c141ff34-8e81-46ea-9586-574fb31d5a5e,f392a93553e6fffa391992a2ee4aaf3c297825d4cdcbeeeb2a53f3fb55f2041c,2023-05-30 08:42:43.527,f,9a82a0dd-1544-4474-a429-a16b0d950450
eb9804c2-11d3-47d1-8362-2250e6112d67,78c9861162d442988f9e1463b2e5e736dc904aa5d8a9287441af1ad415090f39,2023-05-30 08:43:09.621,t,cba9d0b9-11e9-4b2c-b318-79b978b1962c
d36360f3-a0b3-42fd-bc00-9b1467611ed7,e1d9e3ba696f38bf4b8426955d96f4edf2d3501fbec5a62d006bc6b90dc92e66,2023-05-30 08:45:40.729,t,64ac0808-b775-499e-9ed4-78280cb7def3
ecca1270-c0cc-4a12-92b3-89eb9394169f,c81c07e0de5a2d9d8760df7cd749b19053fbe09ee78aa65252cd2e5875032413,2023-05-30 08:53:59.889,f,d5a5a86f-cd5c-473b-905f-b360fa91b2ad

```

#### BullMQ UI

All bullMQ ui jobs which match transaction with isSubmitted false flags include RangeErrors. See example:

```
RangeError: The number 1800000000.04 cannot be converted to a BigInt because it is not an integer
    at BigInt (<anonymous>)
    at OrderSaleProjectRepositoryPrisma.computeProjectDerivedAmounts (/usr/src/app/src/implementation/prisma/orderSaleProject.repository.ts:306:43)
    at OrderSaleProjectRepositoryPrisma.updateOrderSaleProjectRoundAmountWithSaleOrder (/usr/src/app/src/implementation/prisma/orderSaleProject.repository.ts:252:12)
Error: FailureResponse (Request {requestPath = (BaseUrl {baseUrlScheme = Https, baseUrlHost = "mainnet.gomaestro-api.org", baseUrlPort = 443, baseUrlPath = ""},"/submit/tx"), requestQueryString = fromList [], requestBody = Just ((),application/cbor), requestAccept = fromList [application/json;charset=utf-8,application/json], requestHeaders = fromList [("api-key","N2YzMmI2ZGExM2JlYTgyMzEzOGEzN2Rj")], requestHttpVersion = HTTP/1.1, requestMethod = "POST"}) (Response {responseStatusCode = Status {statusCode = 400, statusMessage = "Bad Request"}, responseHeaders = fromList [("Transfer-Encoding","chunked"),("X-RateLimit-Remaining-Second","499"),("X-RateLimit-Limit-Second","500"),("RateLimit-Limit","500"),("RateLimit-Remaining","499"),("RateLimit-Reset","1"),("X-RateLimit-Remaining-Day","491622"),("X-RateLimit-Limit-Day","500000"),("date","Tue, 30 May 2023 08:54:49 GMT"),("server","Warp/3.3.22"),("Access-Control-Allow-Origin","*"),("X-Moesif-Transaction-Id","f437c114-b333-471b-bfcc-1b662544c800"),("Via","1.1 google"),("Alt-Svc","h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000")], responseHttpVersion = HTTP/1.1, responseBody = "\"transaction submit error ShelleyTxValidationError ShelleyBasedEraBabbage (ApplyTxError [UtxowFailure (UtxoFailure (FromAlonzoUtxoFail (UtxosFailure (CollectErrors [BadTranslation (TranslationLogicMissingInput (TxIn (TxId {_unTxId = SafeHash \\\"4ed0c577283400e2db82eb24f1085eca0b4ba5cbeacbed163244e57c102e2565\\\"}) (TxIx 0)))])))),UtxowFailure (UtxoFailure (FromAlonzoUtxoFail (ValueNotConservedUTxO (Value 0 (fromList [(PolicyID {policyID = ScriptHash \\\"431a066b5ceee7934686eb2e6ff9c42972d97ff1c41c3c793d65d0e9\\\"},fromList [(4759,1)])])) (Value 1818269257 (fromList [(PolicyID {policyID = ScriptHash \\\"431a066b5ceee7934686eb2e6ff9c42972d97ff1c41c3c793d65d0e9\\\"},fromList [(4759,1)])]))))),UtxowFailure (UtxoFailure (FromAlonzoUtxoFail (BadInputsUTxO (fromList [TxIn (TxId {_unTxId = SafeHash \\\"4ed0c577283400e2db82eb24f1085eca0b4ba5cbeacbed163244e57c102e2565\\\"}) (TxIx 0),TxIn (TxId {_unTxId = SafeHash \\\"b373f336b3b442ded4da7fc9545588a95f44164ca7dac0ca3bac0fc5b889689c\\\"}) (TxIx 1),TxIn (TxId {_unTxId = SafeHash \\\"b373f336b3b442ded4da7fc9545588a95f44164ca7dac0ca3bac0fc5b889689c\\\"}) (TxIx 2)]))))])\""})
    at CoreServiceAxios.resolveCoreError (/usr/src/app/src/implementation/client/core.service.ts:194:11)
    at /usr/src/app/src/implementation/client/core.service.ts:220:40
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at CoreServiceAxios.post (/usr/src/app/src/implementation/client/core.service.ts:137:13)
    at CoreServiceAxios.transactionSubmit (/usr/src/app/src/implementation/client/core.service.ts:129:26)
    at TransactionApplication.submitTransaction (/usr/src/app/src/application/transaction.application.ts:108:34)
    at Proxy._transactionWithCallback (/usr/src/app/node_modules/@prisma/client/runtime/index.js:35858:18)
    at Worker.processFn (/usr/src/app/src/queueProcessors/transactionSubmit/index.ts:48:22)
    at Worker.processJob (/usr/src/app/node_modules/bullmq/src/classes/worker.ts:644:22)
    at Worker.retryIfFailed (/usr/src/app/node_modules/bullmq/src/classes/worker.ts:774:16)
Error: FailureResponse (Request {requestPath = (BaseUrl {baseUrlScheme = Https, baseUrlHost = "mainnet.gomaestro-api.org", baseUrlPort = 443, baseUrlPath = ""},"/submit/tx"), requestQueryString = fromList [], requestBody = Just ((),application/cbor), requestAccept = fromList [application/json;charset=utf-8,application/json], requestHeaders = fromList [("api-key","N2YzMmI2ZGExM2JlYTgyMzEzOGEzN2Rj")], requestHttpVersion = HTTP/1.1, requestMethod = "POST"}) (Response {responseStatusCode = Status {statusCode = 400, statusMessage = "Bad Request"}, responseHeaders = fromList [("Transfer-Encoding","chunked"),("X-RateLimit-Remaining-Second","499"),("X-RateLimit-Limit-Second","500"),("RateLimit-Limit","500"),("RateLimit-Remaining","499"),("RateLimit-Reset","1"),("X-RateLimit-Remaining-Day","491621"),("X-RateLimit-Limit-Day","500000"),("date","Tue, 30 May 2023 08:54:52 GMT"),("server","Warp/3.3.22"),("Access-Control-Allow-Origin","*"),("X-Moesif-Transaction-Id","1472f53e-c61e-4449-a84a-75ef963a4e01"),("Via","1.1 google"),("Alt-Svc","h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000")], responseHttpVersion = HTTP/1.1, responseBody = "\"transaction submit error ShelleyTxValidationError ShelleyBasedEraBabbage (ApplyTxError [UtxowFailure (UtxoFailure (FromAlonzoUtxoFail (UtxosFailure (CollectErrors [BadTranslation (TranslationLogicMissingInput (TxIn (TxId {_unTxId = SafeHash \\\"4ed0c577283400e2db82eb24f1085eca0b4ba5cbeacbed163244e57c102e2565\\\"}) (TxIx 0)))])))),UtxowFailure (UtxoFailure (FromAlonzoUtxoFail (ValueNotConservedUTxO (Value 0 (fromList [(PolicyID {policyID = ScriptHash \\\"431a066b5ceee7934686eb2e6ff9c42972d97ff1c41c3c793d65d0e9\\\"},fromList [(4759,1)])])) (Value 1818269257 (fromList [(PolicyID {policyID = ScriptHash \\\"431a066b5ceee7934686eb2e6ff9c42972d97ff1c41c3c793d65d0e9\\\"},fromList [(4759,1)])]))))),UtxowFailure (UtxoFailure (FromAlonzoUtxoFail (BadInputsUTxO (fromList [TxIn (TxId {_unTxId = SafeHash \\\"4ed0c577283400e2db82eb24f1085eca0b4ba5cbeacbed163244e57c102e2565\\\"}) (TxIx 0),TxIn (TxId {_unTxId = SafeHash \\\"b373f336b3b442ded4da7fc9545588a95f44164ca7dac0ca3bac0fc5b889689c\\\"}) (TxIx 1),TxIn (TxId {_unTxId = SafeHash \\\"b373f336b3b442ded4da7fc9545588a95f44164ca7dac0ca3bac0fc5b889689c\\\"}) (TxIx 2)]))))])\""})
    at CoreServiceAxios.resolveCoreError (/usr/src/app/src/implementation/client/core.service.ts:194:11)
    at /usr/src/app/src/implementation/client/core.service.ts:220:40
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at CoreServiceAxios.post (/usr/src/app/src/implementation/client/core.service.ts:137:13)
    at CoreServiceAxios.transactionSubmit (/usr/src/app/src/implementation/client/core.service.ts:129:26)
    at TransactionApplication.submitTransaction (/usr/src/app/src/application/transaction.application.ts:108:34)
    at Proxy._transactionWithCallback (/usr/src/app/node_modules/@prisma/client/runtime/index.js:35858:18)
    at Worker.processFn (/usr/src/app/src/queueProcessors/transactionSubmit/index.ts:48:22)
    at Worker.processJob (/usr/src/app/node_modules/bullmq/src/classes/worker.ts:644:22)
    at Worker.retryIfFailed (/usr/src/app/node_modules/bullmq/src/classes/worker.ts:774:16)
```

### Detection

Pre sale token distribution reports were run to confirm total sale amounts as well as to confirm distribution orders vs application orders.

## Action Items

- Investigation
- Issue identification
- Issue resolution
- Improve distribution process

## Lessons Learned

Distribution process is fragile and requires improved cross team validation process.

### What went well

Core team member Piyush was available to assist with distribution details and transaction hashes for all on chain orders.

### What went wrong

Distribution was performed in the midst of the incident. The distribution amounts / orders were correct. However this was coincidental. The distribution query did not take the is_submitted flag into account, which is incorrect. By pure chance all orders flagged as is_submitted false were in fact false negatives. If there were any that were correctly flagged as false distribution would have been incorrect.

We should have detected this issue earlier in the sale.

### Where we got lucky

The actual token is being distributed via a vesting schedule and has not yet been distributed. We have been able to resolve the data issue before the distribution event.

## Timeline

- Seed details

```
startDate: new Date('2023-05-29T11:00:00+02:00')
endDate: new Date('2023-05-30T11:00:00+02:00')
distributionDate: new Date('2023-06-02T10:30:00+02:00')
```

- Incident discovery: 30 May 2023 15:50 CET
- Distribution of fake token: 30 May 2023 19:53 CET (approximately)
- Data issue resolution: 30 May 2023 20:20 CET
- Bug fix: **Ongoing investigation**

## Supporting information

NA
