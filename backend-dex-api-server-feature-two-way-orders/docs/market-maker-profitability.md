# Definition of Scope of ROI Measurement

The ROI according to [Investopedia](https://www.investopedia.com/terms/r/returnoninvestment.asp) is calculated as follows

<img width="400" alt="Screenshot 2024-07-09 at 15 18 14" src="https://github.com/geniusyield/dex-api-server/assets/3730014/1bab8c27-8f4f-4536-9091-c032c78ee648">

Many methods for calculating ROI look at deposits and withdrawals in and out an account. This is not feasible for us as we do not have this data and it would also significantly grow the complexity of the problem we're trying to solve.
We have chosen to only look at the **trades made by the wallet**. More specifically, we look at **fills made on opened limit orders** created by a wallet in a **single pair of assets**.

# Data Collection Methodology

## Fills are aggregated into bins

Fills represent trades between token T and ADA.
Fills are grouped within an interval setting, for example fills within 1 day of each other.
These groups are referred to as "bins" and it's by analysing a series of bins over a period of time that we reach a final ROI for that time period.
Below are some example calculations.

## Calculating ROI over multiple bins (i.e. producing a graph)

Finally, we look at an example with multiple bins (fills are reduced into a single bought and sold amount for simplicity)

- Bin t=0. Bought 110 T + 150 ADA. Sold 50 T + 240 ADA. Market price: 2 ADA.
- Bin t=1. Bought 100 T + 160 ADA. Sold 30 T + 290 ADA. Market price: 1.9 ADA.
- Bin t=2. Bought 280 T + 0 ADA. Sold 130 T + 310 ADA. Market price: 2.2 ADA.

To calculate ROI at a particular **bin t** we accumulate all bins up to this point within our time window and determine the final ADA valuation of these assets by the market price at **bin t**.

### Calculating ROI at **t=0**

**Current value of investment (tokens bought)**: 110 T + 150 ADA = 370 ADA\
**Cost of investment (tokens sold)**: 50 T + 240 ADA = 340 ADA\
**ROI**: (370 - 340) / 340 = 0.08823 = **8.823%**

### Calculating ROI at **t=1**

**Current value of investment (tokens bought)**: (110+100) T + (150+160) ADA = (210 \* 1.9) + 310 = 772 ADA\
**Cost of investment (tokens sold)**: (50+30) T + (240+290) ADA = (80 \* 1.9) + 530 = 706 ADA\
**ROI**: (772 - 706) / 706 = 0.09348 = **9.348%**

### Calculating ROI at **t=2**

**Current value of investment (tokens bought)**: (110+100+280) T + (150+160+0) ADA = (490 \* 2.2) + 310 = 1388 ADA.\
**Cost of investment (tokens sold)**: (50+30+130) T + (240+290+310) ADA = (210 \* 2.2) + 840 = 1302 ADA.\
**ROI**: (1388 - 1302) / 1302 = 0.06605 = **6.605%**

<img width="285" alt="Screenshot 2024-07-09 at 18 44 37" src="https://github.com/geniusyield/dex-api-server/assets/3730014/b80a9617-784a-41d5-96d1-f99e38f2a7a3">

# Real-world Example

Example of our [MMB wallet](https://cexplorer.io/stake/stake1u83xtj86zeyyljcf7uhw47v257sdm9asysljssnwsy30w6c22lhfj) trading ADA/HUNT.

Below is the data for the first 3 day populated bins, meaning that limit orders were filled on those days.

<img width="1000" alt="Screenshot 2024-07-10 at 14 31 15" src="https://github.com/geniusyield/dex-api-server/assets/3730014/9a1b9789-0b94-45c7-870c-131fe0f71f0d">

## Final ROI data to be rendered in chart

```
"data": [
        ...3 empty earlier bins
        {
            "earnedPriceAssetAmount": "-13.35833043449486",
            "price": 0.27059500000000003,
            "roiPercent": -0.013153441525096926,
            "timestamp": 1712966400
        },
        {
            "earnedPriceAssetAmount": "-29.541140852264107",
            "price": 0.265364,
            "roiPercent": -0.008131023924106117,
            "timestamp": 1713052800
        },
        {
            "earnedPriceAssetAmount": "14.3928591116603",
            "price": 0.26809,
            "roiPercent": 0.0021116329548469762,
            "timestamp": 1713139200
        },
        ...~24 more bins
];
```

## Filled limit orders to calculate ROI for

During this time window of 3 days (between `2024-04-13T00:00:00Z` and `2024-04-16T00:00:00Z`), 3 were fully filled, 94 were cancelled, of which 4 were partially filled before being cancelled. That gives us a total of 7 fills and partial fills which you can view below.

<details>

  <summary>Filled order at 2024-04-13T17:49:25.150Z</summary>

```json
{
    "created": "2024-04-13T17:25:33.000Z",
    "updated": "2024-04-13T18:50:38.887Z",
    "orderId": "636aee9b-5191-42e1-9850-91de5c2bc4f6",
    "baseAssetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
    "baseAssetAmount": "5835120729",
    "quoteAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
    "quoteAssetAmount": "1600000000",
    "status": "CANCELLED",
    "statusTransactionId": "152c19a8fdaeffa0df499448177876190a838f44cc218632915b0d995069c6d5",
    "transactions": [
        {
            "transactionId": "71d02306-ca91-4846-941b-859c5767e1c5",
            "transactionUrl": "https://cexplorer.io/tx/da6f580f1386a594aa3dd04eaae56527612a67dd0b8251ca8133ef81d5a42246",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-13T17:25:58.004Z",
            "transactionHash": "da6f580f1386a594aa3dd04eaae56527612a67dd0b8251ca8133ef81d5a42246",
            "transactionType": "OPEN",
            "baseAssetAmountFilled": null,
            "quoteAssetAmountFilled": null
        },
        {
            "transactionId": "65af1543-02c9-4123-a832-e5f0806cdd74",
            "transactionUrl": "https://cexplorer.io/tx/61248a325557706a8438b983f60cb5afcd8e2a2182e0bc09a7c2af6fc5472fb2",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-13T17:49:25.150Z",
            "transactionHash": "61248a325557706a8438b983f60cb5afcd8e2a2182e0bc09a7c2af6fc5472fb2",
            "transactionType": "FILL",
            "baseAssetAmountFilled": "1015576829",
            "quoteAssetAmountFilled": "3703758379"
        },
        {
            "transactionId": "a864c9ed-1605-4c2b-880c-f6d9db19c016",
            "transactionUrl": "https://cexplorer.io/tx/152c19a8fdaeffa0df499448177876190a838f44cc218632915b0d995069c6d5",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-13T18:50:38.865Z",
            "transactionHash": "152c19a8fdaeffa0df499448177876190a838f44cc218632915b0d995069c6d5",
            "transactionType": "CANCEL",
            "baseAssetAmountFilled": null,
            "quoteAssetAmountFilled": null
        }
    ],
    "orderType": "LIMIT",
    "baseAsset": {
        "assetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
        "assetName": "48554e54",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/images/projects/HUNT/asset.png",
        "longName": "HUNT",
        "policyId": "95a427e384527065f2f8946f5e86320d0117839a5e98ea2c0b55fb00",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "HUNT"
    },
    "quoteAsset": {
        "assetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
        "assetName": "",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/ADA.png",
        "longName": "Cardano",
        "policyId": "",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "ADA"
    },
    "minFillQuoteAssetAmount": "1",
    "minFillBaseAssetAmount": "1",
    "baseAssetAmountFilled": "3703758379",
    "quoteAssetAmountFilled": "1015576829",
    "baseAssetAmountRemaining": "2131362350",
    "quoteAssetAmountRemaining": "584423171",
    "transactionFeeAmount": "287525",
    "makerQuoteAssetFeeAmount": "0",
    "transactionTotalFeesAmount": "287525"
},
```

</details>

<details>

  <summary>Filled order at 2024-04-14T11:18:10.715Z</summary>

```json
{
  "created": "2024-04-14T09:01:15.000Z",
  "updated": "2024-04-14T16:51:45.691Z",
  "orderId": "487f85d2-97ff-4b22-88f7-b21ad0333efb",
  "baseAssetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
  "baseAssetAmount": "6075697357",
  "quoteAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
  "quoteAssetAmount": "1600000000",
  "status": "CANCELLED",
  "statusTransactionId": "06f9245a69ced2c59c0536e5011d410cf8e608ea4309edcfd0a049f0503afb8f",
  "transactions": [
      {
          "transactionId": "69c1cc6c-f00a-4985-be2b-fddd08bd4acb",
          "transactionUrl": "https://cexplorer.io/tx/7d5bd49c7ea29d52eb394126f805ee5c13bebf39b8213c27f56d242d39d992bf",
          "isTransactionConfirmed": true,
          "transactionDate": "2024-04-14T09:01:31.462Z",
          "transactionHash": "7d5bd49c7ea29d52eb394126f805ee5c13bebf39b8213c27f56d242d39d992bf",
          "transactionType": "OPEN",
          "baseAssetAmountFilled": null,
          "quoteAssetAmountFilled": null
      },
      {
          "transactionId": "a24b286a-f1d4-40d7-9581-b0b6d76ace61",
          "transactionUrl": "https://cexplorer.io/tx/e22a13fc71d6be69fa6beb4ecf25fc005f8a284d3aa511cda87c09da6aa65f4e",
          "isTransactionConfirmed": true,
          "transactionDate": "2024-04-14T11:18:10.715Z",
          "transactionHash": "e22a13fc71d6be69fa6beb4ecf25fc005f8a284d3aa511cda87c09da6aa65f4e",
          "transactionType": "FILL",
          "baseAssetAmountFilled": "1598762978",
          "quoteAssetAmountFilled": "6070999999"
      },
      {
          "transactionId": "e33783d8-49d1-4698-a0a0-44357c5ca04b",
          "transactionUrl": "https://cexplorer.io/tx/06f9245a69ced2c59c0536e5011d410cf8e608ea4309edcfd0a049f0503afb8f",
          "isTransactionConfirmed": true,
          "transactionDate": "2024-04-14T16:51:45.660Z",
          "transactionHash": "06f9245a69ced2c59c0536e5011d410cf8e608ea4309edcfd0a049f0503afb8f",
          "transactionType": "CANCEL",
          "baseAssetAmountFilled": null,
          "quoteAssetAmountFilled": null
      }
  ],
  "orderType": "LIMIT",
  "baseAsset": {
      "assetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
      "assetName": "48554e54",
      "decimalPrecision": 6,
      "enabled": true,
      "iconUrl": "/cdn/images/projects/HUNT/asset.png",
      "longName": "HUNT",
      "policyId": "95a427e384527065f2f8946f5e86320d0117839a5e98ea2c0b55fb00",
      "referenceAssetAmount": "",
      "referenceAssetId": "",
      "shortName": "HUNT"
  },
  "quoteAsset": {
      "assetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
      "assetName": "",
      "decimalPrecision": 6,
      "enabled": true,
      "iconUrl": "/cdn/ADA.png",
      "longName": "Cardano",
      "policyId": "",
      "referenceAssetAmount": "",
      "referenceAssetId": "",
      "shortName": "ADA"
  },
  "minFillQuoteAssetAmount": "1",
  "minFillBaseAssetAmount": "1",
  "baseAssetAmountFilled": "6070999999",
  "quoteAssetAmountFilled": "1598762978",
  "baseAssetAmountRemaining": "4697358",
  "quoteAssetAmountRemaining": "1237022",
  "transactionFeeAmount": "287525",
  "makerQuoteAssetFeeAmount": "0",
  "transactionTotalFeesAmount": "287525"
},
```

</details>

<details>

  <summary>Filled order at 2024-04-14T18:45:38.596Z</summary>

```json
{
    "created": "2024-04-14T18:21:47.000Z",
    "updated": "2024-04-14T18:46:11.362Z",
    "orderId": "fb1dd7a2-dd56-4258-9f23-cc19854e5eea",
    "baseAssetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
    "baseAssetAmount": "5975773974",
    "quoteAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
    "quoteAssetAmount": "1600000000",
    "status": "CANCELLED",
    "statusTransactionId": "6da9bc2318877ebb1356736f1552a0a8bcdc988388049052968e0d02ac0fa957",
    "transactions": [
        {
            "transactionId": "84e80c2d-801a-47f0-bcc4-d27f2feab738",
            "transactionUrl": "https://cexplorer.io/tx/715182ea635d4daa4264e371c60a33bf3ca10c19a0f5b6e0b9e8b2c39df1b4a4",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-14T18:21:56.339Z",
            "transactionHash": "715182ea635d4daa4264e371c60a33bf3ca10c19a0f5b6e0b9e8b2c39df1b4a4",
            "transactionType": "OPEN",
            "baseAssetAmountFilled": null,
            "quoteAssetAmountFilled": null
        },
        {
            "transactionId": "e0951a1e-92d1-43c9-bfc9-673d3e58b9f4",
            "transactionUrl": "https://cexplorer.io/tx/0bc659ec3bed6d2ff71a2c7e4eb5b96f7ca8420fce10de74b270c781f775b99a",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-14T18:45:38.596Z",
            "transactionHash": "0bc659ec3bed6d2ff71a2c7e4eb5b96f7ca8420fce10de74b270c781f775b99a",
            "transactionType": "FILL",
            "baseAssetAmountFilled": "1018799282",
            "quoteAssetAmountFilled": "3805071396"
        },
        {
            "transactionId": "0bd2c804-d42d-4a77-a70e-6bd9440e50ba",
            "transactionUrl": "https://cexplorer.io/tx/6da9bc2318877ebb1356736f1552a0a8bcdc988388049052968e0d02ac0fa957",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-14T18:46:11.322Z",
            "transactionHash": "6da9bc2318877ebb1356736f1552a0a8bcdc988388049052968e0d02ac0fa957",
            "transactionType": "CANCEL",
            "baseAssetAmountFilled": null,
            "quoteAssetAmountFilled": null
        }
    ],
    "orderType": "LIMIT",
    "baseAsset": {
        "assetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
        "assetName": "48554e54",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/images/projects/HUNT/asset.png",
        "longName": "HUNT",
        "policyId": "95a427e384527065f2f8946f5e86320d0117839a5e98ea2c0b55fb00",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "HUNT"
    },
    "quoteAsset": {
        "assetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
        "assetName": "",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/ADA.png",
        "longName": "Cardano",
        "policyId": "",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "ADA"
    },
    "minFillQuoteAssetAmount": "1",
    "minFillBaseAssetAmount": "1",
    "baseAssetAmountFilled": "3805071396",
    "quoteAssetAmountFilled": "1018799282",
    "baseAssetAmountRemaining": "2170702578",
    "quoteAssetAmountRemaining": "581200718",
    "transactionFeeAmount": "323869",
    "makerQuoteAssetFeeAmount": "0",
    "transactionTotalFeesAmount": "323869"
},
```

</details>

<details>

  <summary>Filled order at 2024-04-15T04:20:07.103Z</summary>

```json
{
    "created": "2024-04-15T03:41:57.000Z",
    "updated": "2024-04-15T04:20:07.127Z",
    "orderId": "af717e14-2a00-49cf-8277-4d5d66c9de99",
    "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
    "baseAssetAmount": "932235192",
    "quoteAssetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
    "quoteAssetAmount": "3500000000",
    "status": "FILLED",
    "statusTransactionId": "0755c17559c2b5c4bdb7646fbe67791079269d24b29fa41a741527715980f9fd",
    "transactions": [
        {
            "transactionId": "033a76c8-435b-4319-837e-e9da02d67a46",
            "transactionUrl": "https://cexplorer.io/tx/5f6574b3973f4f6a82ae49e80b6847f926ef9133f0f5526c64032309728257de",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-15T03:42:23.506Z",
            "transactionHash": "5f6574b3973f4f6a82ae49e80b6847f926ef9133f0f5526c64032309728257de",
            "transactionType": "OPEN",
            "baseAssetAmountFilled": null,
            "quoteAssetAmountFilled": null
        },
        {
            "transactionId": "ab1d1ac7-07d9-44db-b513-f4e8a3995f3c",
            "transactionUrl": "https://cexplorer.io/tx/0755c17559c2b5c4bdb7646fbe67791079269d24b29fa41a741527715980f9fd",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-15T04:20:07.103Z",
            "transactionHash": "0755c17559c2b5c4bdb7646fbe67791079269d24b29fa41a741527715980f9fd",
            "transactionType": "FILL",
            "baseAssetAmountFilled": "3500000000",
            "quoteAssetAmountFilled": "932235192"
        }
    ],
    "orderType": "LIMIT",
    "baseAsset": {
        "assetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
        "assetName": "",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/ADA.png",
        "longName": "Cardano",
        "policyId": "",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "ADA"
    },
    "quoteAsset": {
        "assetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
        "assetName": "48554e54",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/images/projects/HUNT/asset.png",
        "longName": "HUNT",
        "policyId": "95a427e384527065f2f8946f5e86320d0117839a5e98ea2c0b55fb00",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "HUNT"
    },
    "minFillQuoteAssetAmount": "1",
    "minFillBaseAssetAmount": "1",
    "baseAssetAmountFilled": "932235192",
    "quoteAssetAmountFilled": "3500000000",
    "baseAssetAmountRemaining": "0",
    "quoteAssetAmountRemaining": "0",
    "transactionFeeAmount": "293573",
    "transactionTotalFeesAmount": "293573"
},
```

</details>

<details>

  <summary>Filled order at 2024-04-15T04:20:57.385Z</summary>

```json
{
    "created": "2024-04-15T04:15:59.000Z",
    "updated": "2024-04-15T04:20:57.408Z",
    "orderId": "f3b375fd-096d-473a-b4c2-1ae1f3e04c9f",
    "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
    "baseAssetAmount": "939135961",
    "quoteAssetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
    "quoteAssetAmount": "3500000000",
    "status": "FILLED",
    "statusTransactionId": "86f86d123b39df2b45ffeb603102d6246fce46a824f850b00bf6dd98472b4b9a",
    "transactions": [
        {
            "transactionId": "3c14604d-a636-4705-938e-4ee5094af235",
            "transactionUrl": "https://cexplorer.io/tx/db99f313fc254b1d02d5dbaded13ea33365103690aae5ca11d922889e875ea62",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-15T04:16:09.489Z",
            "transactionHash": "db99f313fc254b1d02d5dbaded13ea33365103690aae5ca11d922889e875ea62",
            "transactionType": "OPEN",
            "baseAssetAmountFilled": null,
            "quoteAssetAmountFilled": null
        },
        {
            "transactionId": "3b75b700-34d6-4b61-8f66-65883bc1f16f",
            "transactionUrl": "https://cexplorer.io/tx/86f86d123b39df2b45ffeb603102d6246fce46a824f850b00bf6dd98472b4b9a",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-15T04:20:57.385Z",
            "transactionHash": "86f86d123b39df2b45ffeb603102d6246fce46a824f850b00bf6dd98472b4b9a",
            "transactionType": "FILL",
            "baseAssetAmountFilled": "3500000000",
            "quoteAssetAmountFilled": "939135961"
        }
    ],
    "orderType": "LIMIT",
    "baseAsset": {
        "assetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
        "assetName": "",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/ADA.png",
        "longName": "Cardano",
        "policyId": "",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "ADA"
    },
    "quoteAsset": {
        "assetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
        "assetName": "48554e54",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/images/projects/HUNT/asset.png",
        "longName": "HUNT",
        "policyId": "95a427e384527065f2f8946f5e86320d0117839a5e98ea2c0b55fb00",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "HUNT"
    },
    "minFillQuoteAssetAmount": "1",
    "minFillBaseAssetAmount": "1",
    "baseAssetAmountFilled": "939135961",
    "quoteAssetAmountFilled": "3500000000",
    "baseAssetAmountRemaining": "0",
    "quoteAssetAmountRemaining": "0",
    "transactionFeeAmount": "293397",
    "transactionTotalFeesAmount": "293397"
},
```

</details>

<details>

  <summary>Filled order at 2024-04-15T04:26:22.908Z</summary>

```json
{
    "created": "2024-04-15T04:23:04.000Z",
    "updated": "2024-04-15T04:26:30.858Z",
    "orderId": "08850c69-2895-4630-a4fd-8fbd01da1c3b",
    "baseAssetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
    "baseAssetAmount": "5884188809",
    "quoteAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
    "quoteAssetAmount": "1600000000",
    "status": "CANCELLED",
    "statusTransactionId": "027c20d6a03499b61759375588f85949103e74ebdc9127336aaaa08cc783be19",
    "transactions": [
        {
            "transactionId": "30d1c3d3-172b-4204-aaa5-1c5aea22bd7a",
            "transactionUrl": "https://cexplorer.io/tx/3e1be1a925195c1888b4ca41cd358285fd1ed0ff3e9cc1edc694217133005b7f",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-15T04:23:37.370Z",
            "transactionHash": "3e1be1a925195c1888b4ca41cd358285fd1ed0ff3e9cc1edc694217133005b7f",
            "transactionType": "OPEN",
            "baseAssetAmountFilled": null,
            "quoteAssetAmountFilled": null
        },
        {
            "transactionId": "6fc6287d-a0df-422a-acef-c8bee789c28c",
            "transactionUrl": "https://cexplorer.io/tx/92ed9e5996560338efeb6eaea8fa16db022b37ea8c7a4a8510d65efe1163ca75",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-15T04:26:22.908Z",
            "transactionHash": "92ed9e5996560338efeb6eaea8fa16db022b37ea8c7a4a8510d65efe1163ca75",
            "transactionType": "FILL",
            "baseAssetAmountFilled": "367901179",
            "quoteAssetAmountFilled": "1353000000"
        },
        {
            "transactionId": "3c6b3994-3da2-4d0e-a9fe-1d0b2f5590e4",
            "transactionUrl": "https://cexplorer.io/tx/027c20d6a03499b61759375588f85949103e74ebdc9127336aaaa08cc783be19",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-15T04:26:30.834Z",
            "transactionHash": "027c20d6a03499b61759375588f85949103e74ebdc9127336aaaa08cc783be19",
            "transactionType": "CANCEL",
            "baseAssetAmountFilled": null,
            "quoteAssetAmountFilled": null
        }
    ],
    "orderType": "LIMIT",
    "baseAsset": {
        "assetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
        "assetName": "48554e54",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/images/projects/HUNT/asset.png",
        "longName": "HUNT",
        "policyId": "95a427e384527065f2f8946f5e86320d0117839a5e98ea2c0b55fb00",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "HUNT"
    },
    "quoteAsset": {
        "assetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
        "assetName": "",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/ADA.png",
        "longName": "Cardano",
        "policyId": "",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "ADA"
    },
    "minFillQuoteAssetAmount": "1",
    "minFillBaseAssetAmount": "1",
    "baseAssetAmountFilled": "1353000000",
    "quoteAssetAmountFilled": "367901179",
    "baseAssetAmountRemaining": "4531188809",
    "quoteAssetAmountRemaining": "1232098821",
    "transactionFeeAmount": "311813",
    "makerQuoteAssetFeeAmount": "0",
    "transactionTotalFeesAmount": "311813"
},
```

</details>

<details>

  <summary>Filled order at 2024-04-15T05:17:00.221Z</summary>

```json
{
    "created": "2024-04-15T04:28:42.000Z",
    "updated": "2024-04-15T05:17:00.244Z",
    "orderId": "9c7f53ea-d9ae-4cf1-87d5-cddbd1f17585",
    "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
    "baseAssetAmount": "955664640",
    "quoteAssetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
    "quoteAssetAmount": "3500000000",
    "status": "FILLED",
    "statusTransactionId": "6f123d8b41178b7b632361feda49df1d1078820356b05d39b5bc414bdd234218",
    "transactions": [
        {
            "transactionId": "b787be44-32a3-4a66-8d36-369c1098c30a",
            "transactionUrl": "https://cexplorer.io/tx/e1036649e89b3625824ff468acebdcd9beced8770270f5a5b9ea8a78774a4bc4",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-15T04:28:53.751Z",
            "transactionHash": "e1036649e89b3625824ff468acebdcd9beced8770270f5a5b9ea8a78774a4bc4",
            "transactionType": "OPEN",
            "baseAssetAmountFilled": null,
            "quoteAssetAmountFilled": null
        },
        {
            "transactionId": "f98ff3ce-e076-4708-ac12-bbef6345e9f1",
            "transactionUrl": "https://cexplorer.io/tx/6f123d8b41178b7b632361feda49df1d1078820356b05d39b5bc414bdd234218",
            "isTransactionConfirmed": true,
            "transactionDate": "2024-04-15T05:17:00.221Z",
            "transactionHash": "6f123d8b41178b7b632361feda49df1d1078820356b05d39b5bc414bdd234218",
            "transactionType": "FILL",
            "baseAssetAmountFilled": "3500000000",
            "quoteAssetAmountFilled": "955664640"
        }
    ],
    "orderType": "LIMIT",
    "baseAsset": {
        "assetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj",
        "assetName": "",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/ADA.png",
        "longName": "Cardano",
        "policyId": "",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "ADA"
    },
    "quoteAsset": {
        "assetId": "asset1v0wqvqh243xp0rkfp0fz8rv5k653v6nkdhv0cw",
        "assetName": "48554e54",
        "decimalPrecision": 6,
        "enabled": true,
        "iconUrl": "/cdn/images/projects/HUNT/asset.png",
        "longName": "HUNT",
        "policyId": "95a427e384527065f2f8946f5e86320d0117839a5e98ea2c0b55fb00",
        "referenceAssetAmount": "",
        "referenceAssetId": "",
        "shortName": "HUNT"
    },
    "minFillQuoteAssetAmount": "1",
    "minFillBaseAssetAmount": "1",
    "baseAssetAmountFilled": "955664640",
    "quoteAssetAmountFilled": "3500000000",
    "baseAssetAmountRemaining": "0",
    "quoteAssetAmountRemaining": "0",
    "transactionFeeAmount": "287369",
    "transactionTotalFeesAmount": "287369"
},
```

</details>

## Fills made on limit orders, aggregated into bins

### Fills in bin `2024-04-13T00:00:00.000Z`

```
{
    "transactionId": "65af1543-02c9-4123-a832-e5f0806cdd74",
    "transactionUrl": "https://cexplorer.io/tx/61248a325557706a8438b983f60cb5afcd8e2a2182e0bc09a7c2af6fc5472fb2",
    "isTransactionConfirmed": true,
    "transactionDate": "2024-04-13T17:49:25.150Z",
    "transactionHash": "61248a325557706a8438b983f60cb5afcd8e2a2182e0bc09a7c2af6fc5472fb2",
    "transactionType": "FILL",
    "baseAssetAmountFilled": "1015576829",
    "quoteAssetAmountFilled": "3703758379"
},
```

**Bin summary**:

- 1015.576829 ADA sold for 3703.758379 HUNT
- External Maestro (source is MinSwap) market price for the bin: 0.270595 ADA

### Fills in bin `2024-04-14T00:00:00.000Z`

```
{
    "transactionId": "a24b286a-f1d4-40d7-9581-b0b6d76ace61",
    "transactionUrl": "https://cexplorer.io/tx/e22a13fc71d6be69fa6beb4ecf25fc005f8a284d3aa511cda87c09da6aa65f4e",
    "isTransactionConfirmed": true,
    "transactionDate": "2024-04-14T11:18:10.715Z",
    "transactionHash": "e22a13fc71d6be69fa6beb4ecf25fc005f8a284d3aa511cda87c09da6aa65f4e",
    "transactionType": "FILL",
    "baseAssetAmountFilled": "1598762978",
    "quoteAssetAmountFilled": "6070999999"
},
...
{
    "transactionId": "e0951a1e-92d1-43c9-bfc9-673d3e58b9f4",
    "transactionUrl": "https://cexplorer.io/tx/0bc659ec3bed6d2ff71a2c7e4eb5b96f7ca8420fce10de74b270c781f775b99a",
    "isTransactionConfirmed": true,
    "transactionDate": "2024-04-14T18:45:38.596Z",
    "transactionHash": "0bc659ec3bed6d2ff71a2c7e4eb5b96f7ca8420fce10de74b270c781f775b99a",
    "transactionType": "FILL",
    "baseAssetAmountFilled": "1018799282",
    "quoteAssetAmountFilled": "3805071396"
},
```

**Bin summary**:

- 2617.56226 ADA sold for 9876.071395 HUNT
- External Maestro (source is MinSwap) market price for the bin: 0.265364 ADA

### Fills in bin `2024-04-15T00:00:00.000Z`

```
{
    "transactionId": "ab1d1ac7-07d9-44db-b513-f4e8a3995f3c",
    "transactionUrl": "https://cexplorer.io/tx/0755c17559c2b5c4bdb7646fbe67791079269d24b29fa41a741527715980f9fd",
    "isTransactionConfirmed": true,
    "transactionDate": "2024-04-15T04:20:07.103Z",
    "transactionHash": "0755c17559c2b5c4bdb7646fbe67791079269d24b29fa41a741527715980f9fd",
    "transactionType": "FILL",
    "baseAssetAmountFilled": "3500000000",
    "quoteAssetAmountFilled": "932235192"
}
...
{
    "transactionId": "3b75b700-34d6-4b61-8f66-65883bc1f16f",
    "transactionUrl": "https://cexplorer.io/tx/86f86d123b39df2b45ffeb603102d6246fce46a824f850b00bf6dd98472b4b9a",
    "isTransactionConfirmed": true,
    "transactionDate": "2024-04-15T04:20:57.385Z",
    "transactionHash": "86f86d123b39df2b45ffeb603102d6246fce46a824f850b00bf6dd98472b4b9a",
    "transactionType": "FILL",
    "baseAssetAmountFilled": "3500000000",
    "quoteAssetAmountFilled": "939135961"
}
...
{
    "transactionId": "6fc6287d-a0df-422a-acef-c8bee789c28c",
    "transactionUrl": "https://cexplorer.io/tx/92ed9e5996560338efeb6eaea8fa16db022b37ea8c7a4a8510d65efe1163ca75",
    "isTransactionConfirmed": true,
    "transactionDate": "2024-04-15T04:26:22.908Z",
    "transactionHash": "92ed9e5996560338efeb6eaea8fa16db022b37ea8c7a4a8510d65efe1163ca75",
    "transactionType": "FILL",
    "baseAssetAmountFilled": "367901179",
    "quoteAssetAmountFilled": "1353000000"
},
...
{
    "transactionId": "f98ff3ce-e076-4708-ac12-bbef6345e9f1",
    "transactionUrl": "https://cexplorer.io/tx/6f123d8b41178b7b632361feda49df1d1078820356b05d39b5bc414bdd234218",
    "isTransactionConfirmed": true,
    "transactionDate": "2024-04-15T05:17:00.221Z",
    "transactionHash": "6f123d8b41178b7b632361feda49df1d1078820356b05d39b5bc414bdd234218",
    "transactionType": "FILL",
    "baseAssetAmountFilled": "3500000000",
    "quoteAssetAmountFilled": "955664640"
}
```

**Bin summary**:

- 10500 HUNT sold for 2827.035793 ADA
- 367.901179 ADA sold for 1353 HUNT
- External Maestro (source is MinSwap) market price for the bin: 0.26809 ADA

## Calculating ROI for each bin

### Bin `2024-04-13T00:00:00.000Z`

#### Summary

- 1015.576829 ADA sold for 3703.758379 HUNT
- Market price: 0.270595 ADA

**Current value of investment (tokens bought):** (3703.758379 \* 0.270595) = 1002.218499 ADA\
**Cost of investment (tokens sold):** 1015.576829 ADA\
**ROI:** (1002.218499 - 1015.576829) / 1015.576829 = -0.01315344109 = **-1.315344109%**\
**Earned:** 1002.218499 - 1015.576829 = **-13.35833 ADA**

### Bin `2024-04-14T00:00:00.000Z`

#### Summary

- 2617.56226 ADA sold for 9876.071395 HUNT
- Market price: 0.265364 ADA

**Current value of investment (tokens bought):** ((9876.071395 + 3703.758379) \* 0.265364) = 3603.59794815 ADA\
**Cost of investment (tokens sold):** 1015.576829 + 2617.56226 = 3633.139089 ADA\
**ROI:** (3603.59794815 - 3633.139089) / 3633.139089 = -0.00813102392 = **-0.813102392%**\
**Earned:** 3603.59794815 - 3633.139089 = **-29.54114085 ADA**

### Bin `2024-04-15T00:00:00.000Z`

#### Summary

- 10500 HUNT sold for 2827.035793 ADA
- 367.901179 ADA sold for 1353 HUNT
- Market price: 0.26809 ADA

**Current value of investment (tokens bought):** ((9876.071395 + 3703.758379 + 1353) \* 0.26809) + 2827.035793 = 6830.37812711 ADA\
**Cost of investment (tokens sold):** (10500 \* 0.26809) + 1015.576829 + 2617.56226 + 367.901179 = 6815.985268 ADA\
**ROI:** (6830.37812711 - 6815.985268) / 6815.985268 = 0.00211163295 = **0.211163295%**\
**Earned:** 6830.37812711 - 6815.985268 = **14.39285911 ADA**

# Resources

The approach to use current market price for previously traded assets was inspired by an article written by the Hummingbot team titled ["A Blended Consensus"](https://hummingbot.org/academy-content/managing-your-bots-performance/#a-blended-consensus).
