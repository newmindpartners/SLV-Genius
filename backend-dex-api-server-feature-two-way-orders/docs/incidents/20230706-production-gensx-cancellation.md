# Production GENSX cancellation related issues

### Date

2023-07-03

### Authors

Shannon I'Ons

### Status

All issues resolved

Temporary solution implemented to handle GENSX asset cancellation issue 6.

### Summary

Issues experienced

1. All Orders on the portfolio page did not resolve their statuses correctly

2. Orders on the portfolio page which had experienced any event failures were hidden

3. Orders on the portfolio page which had experienced any event failures did not resolve their statuses correctly

4. Building a cancellation transaction would fail in the case that an order had experienced an event failure

5. Some orders in permanent pending state

6. Building a cancellation transaction would fail for all GENSX orders

### Impact

All issues affected order visibility on the portfolio page, indirectly or directly preventing users from being able to correctly view and cancel orders.

### Root Causes

1. The query which retrieves the order sales and their associated events did not have an order specified on the events. The order was determined by the postgres query planner which has consistently retrieved in `desc` order. We suspect that the query planner determined a more efficient manner in which to retrieve the data, this new query plan returned the events in the reverse order of what is expected. The order status resolution code assumes the order of events such that the event which is selects is the most recent valid event. Due to the reverse event order however the status resolution code resolved to the oldest event, the open. Meaning all orders would display as open regardless of whether they were in fact in other states.

2. The query which retrieves order sales included a prisma [every](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#every) relation filter. This filter would "Returns all records where all ("every") related records match filtering criteria.", this behavior would exclude all order sales in which a failed event had occurred as not `every` sale event had a valid associated transaction.

3. The query which retrieves order sales did not filter out related failed events, this resulted in the status resolution incorrectly resolving the order sale state to failed states.

4. There exists validation when performing a cancellation which checks whether the order sale is in a valid state to perform a cancellation. This validation code checks the last valid event to determine whether the order is in an `open` state. If the order is in a `fill` or `cancel` state the cancel is failed, throwing an error. This validation function relies on a query which did not filter out failed events. This resulted in cancellations actions being rejected incorrectly for orders that had related failed events.

5. It is not understood why the submitted orders are not on chain. The possibility exists that the order open transaction died in the mem pool. There is no evidence of failure or rollback. The orders were submitted successfully.

6. The launch pad sale made use of a mock token in stead of the GENSX token to facilitate vesting. Shortly after the launch pad sale rewards were scheduled to be deployed. Reward functionality required the real token rather than the mock token. The underlying GENSX asset was updated from the mock token to the real token. It was considered safe as the sale and distribution had already occurred. It was however not a safe assumption to make as it broke the cancellation functionality which is dependent on the token asset value.

### Trigger

1. List order sale query for the portfolio page.

2. List order sale query for the portfolio page, related failed events.

3. List order sale query for the portfolio page, related failed events.

4. Order sale cancellation, where order sale has related failed events.

5. Unknown, likely a transaction in the mempool has exceeded its configured time-to-live and is rejected. This would result in a valid submission, no rollback but no transaction on chain (a valid permanent pending state).

6. Order sale cancellation, post asset update.

### Resolution

1. Order sale event query order enforced explicitly. Resolved in: https://github.com/geniusyield/dex-api-server/pull/1276, by Luca

2. Order sale event query relation filter updated from `every` to `some`. Resolved in: https://github.com/geniusyield/dex-api-server/commit/c373b64872e0db6f6abe66e7c89567da0d54af78, by Shannon

3. Order sale event query conditions updated to exclude failed events while correctly returning the order sale. Resolved in: https://github.com/geniusyield/dex-api-server/commit/2a06cca89015f0b732a529d89e5ef00ee79db032, by Shannon

4. Order sale event query updated to exclude failed events. Resolved in: https://github.com/geniusyield/dex-api-server/commit/bd7a243a501ddaa74e10da4931518c86fe70bc6a, by Shannon

5. Client updated to hide pending state order sales if past distribution. It should be noted that this is not a good long term solution and motivates for the event sourcing systems in the dex to capture failure events. Resolved in: https://github.com/geniusyield/launchpad-client/pull/781/files, by Luca

6. As the old and new assets are required simultaneously a temporary fix was applied. The transaction server consuming client mapper as the last location to prepare data for the order sale requests was updated to map from old asset value to the new. Specifically for order sale related requests only. Once all cancellations are actioned we can remove the temporary fix. Resolved in: https://github.com/geniusyield/dex-api-server/pull/1290/files, by Shannon

### Detection

1. Excessive error logs were detected for cancellations. Reports of failures were also passed on from community managers.

2. Detected by developers during investigation and resolution of issue 1)

3. Detected by developers during investigation and resolution of issue 1)

4. Detected by developers during investigation and resolution of issue 1)

5. Reported by users through community managers.

6. Reported by infrastructure engineers, investigated by transaction server engineers which detect the token discrepancy.

## Action Items

Investigation and resolution of all issues.

## Lessons Learned

The legacy systems (pre-event sourcing) are very fragile and contain a lot of duplicate systems which when not lined up exactly fail to resolve entity statuses correctly. These systems can experience cascading failures. Issue 1) resulted in exposing previously unknown bugs in related systems.

### What went well

All issues were resolved quickly, users were able to cancel their orders in order to re-purchase GENSX tokens via other means. Please see GENSX insufficient distribution tokens incident report.

### What went wrong

Issue 1. resulted in cascading issues (2, 3, 4)

Issue 6 was a suspected issue before the asset was updated. I (Shannon) requested that it be tested and confirmed that the update would not affect cancellation functionality negatively. The requested test were however not performed due to time pressures.

### Where we got lucky

NA

## Timeline

Cancellation issues resolved post distribution. See insufficient token distribution incident report.

```
startDate: new Date('2023-06-29T15:00:00+02:00'),
endDate: new Date('2023-07-01T15:00:00+02:00'),
distributionDate: new Date('2023-07-03T15:00:00+02:00'),
```

## Supporting information

NA
