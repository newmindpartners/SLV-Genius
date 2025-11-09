# Recover lost production data

## Problem

On the 19th of April 2023 we deployed erroneous code which required us to revert back to a previous prod dump. The error caused a downtime of about 30 minutes, but the backup we had to use was from roughly 6 hours before that. This meant we lost about 6 hours worth of production data.

At this stage the only product with active users was the staking app, so I could inspect the staking smart contract on chain to identify which, if any, created stake vaults weren't present in our production DB due to this revert.

One stake vault with [732 NMKR](https://cexplorer.io/tx/1991ec5b27b93457b72912d57daf4aa2e36dc9cb46da8ec233ce4206b62f415c) and another with [7,500 NMKR](https://cexplorer.io/tx/0946b131c3fbe97653d134a2af3801f8ba806ba2f76ece71e4912bc72715d37c) were identified to be on-chain but not in our DB.


## Solution

We were only able to restore using a dump from 11:20 but had a dump from just before the downtime at 17:57. Because this was just before the downtime, no stake vaults had been created on-chain that had not also been recorded in that dump. So we knew we had all the data we needed.

The challenge then was to produce SQL insert statements for the data that had been recorded in the dump before the incident, and that did not exist in our production DB after the incident.

The approach I went with was to populate a local instance of the API server with the "before" dump, then export this data into a dump with SQL insert statements.

```
PGPASSWORD=password pg_dump -h localhost -p 5432 -U postgres --inserts -f ./before-dump-inserts.sql dex-server-db
```

then I restarted and reset our local API server DB, and did the same procedure with the "after" dump, i.e. data from just after the incident.

```
PGPASSWORD=password pg_dump -h localhost -p 5432 -U postgres --inserts -f ./after-dump-inserts.sql dex-server-db
```

This mean the "before" dump had a few more records in the DB than the "after" dump which made our lives quite easy because there wasn't anything in the "after" dump which did not exist in "before".

The missing entities were:

- 1 user
- 1 user_kyc
- 2 stake_vault
- 2 transaction
- 5 transaction_input
- 6 transaction_output
- 2 stake_vault_event

Our initial attempt was to just insert the generated "before-dump-inserts.sql" into the running instance. While this worked for some entities, it didn't work for all of them. Both transaction_input and transaction_output has an autoincrement on the identifier field, so these had to be changed to DEFAULT.

Because of this, the best approached I found was to diff the two files

```
vimdiff before-dump-inserts.sql after-dump-inserts.sql
```

and attempt to insert one by one in the locally running psql instance.

After lots of trial and error I ended up the correct insert statements. If you have permission to, you can view them in 1Password at "Staking App DB Data" in "Missing data from 190423 incident".

To verify that this was working correctly, I reset and restarted my API server and injected a dump of the latest production data, and tried to insert these lines manually. Then to see that it was being used properly in the app, I changed the `user_id` of these stake vaults in my local DB to a user I was in control of. I then ran the DEX client locally and could see them appear properly in my view of stake vaults.

At this point I felt confident this solution was working.

# Additional resources

Here is an issue from the time, how we tested and implemented this fix.

https://github.com/geniusyield/dex-api-server/issues/1087
