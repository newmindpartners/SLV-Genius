# Dex-api whitelist endpoint

This private endpoint takes in a CSV file with a column that contains either stake addresses or stake key hashes of users, deduplicates the file then convert the values to hex(if not in hex format). Then it creates a roundWhitelist object from the data and replaces the esxiting one.

## Prerequisetes:

    - Basic authentication configured on the .local.env
    - A csv file with a column named "stake_address" that includes walletStakeKeyHashes or Stake addresses. (There is no support for BECH32 addresses at this time)

## Usage:

```
curl --location -g --request PUT '{target-env-url}/order-sale/project/round/{roundId}/whitelist' \
--header 'Content-Type: multipart/form-data' \
-u $BASIC_AUTH_USER:$BASIC_AUTH_PASSWORD \
--form 'file=@"/path/to/file.csv"'
```

## Examples:

Request:

```
curl --location -g --request PUT 'http://localhost:3000/order-sale/project/round/df804411-d6d3-43b1-93e0-5a2f6625ac1b/whitelist' \
--header 'Content-Type: multipart/form-data' \
-u user:pass \
--form 'file=@"whitelist.csv"'
```

Whitelist.csv:

```
stake_address
stake1uyjkcc32u6em9zjaksr88fu4r4atp4jw9fusfadznkfm7uc540hf9
stake1u8nzxgq3x44cjh9z88pz2my56x79z5s5vj36we47xnzjm3g89svet
stake1u9d6kpad65s02m9vv9d48fgup454m7sgnlr2r685mauzrdqchxm46
stake1u9d6kpad65s02m9vv9d48fgup454m7sgnlr2r685mauzrdqchxm46
```

With this example request the endpoint will deduplicate the CSV file deleting the last row in this example, then it will convert the addresses to walletStakeKeyHash which then will be converted into RoundWhitelist objects. The existing whitelist will be deleted(if there is one) and will be replaced with the addresses in the whitelist.csv.

The input file should have a column named "stake_address" and its contents should either be stake addresses wallet stake key hashes or a combination of the two. Endpoint will fail with any other format and no columns will be rejected as this is user data.

## TODO

    - Add CLI support
    - Add support for BECH32 input
