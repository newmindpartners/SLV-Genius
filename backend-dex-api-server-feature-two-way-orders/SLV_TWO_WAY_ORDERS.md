## Smart Liquidity Vault (SLV) – Two-Way Orders E2E Handling

This document captures the current state, design decisions, and implementation details for handling Two-Way Orders (TWO) in SLV, including on-chain ingestion with Oura, DB projections, API shape, PnL, and human-readable history. It is intended to bootstrap new contributors quickly.

### Scope

- Events: CREATE (open), FILL (partial/final), CANCEL (redemption)
- Indexing from Oura → DB projections (Prisma) → API for frontend
- Human‑readable order history with execution deltas and PnL
- SLV balance aggregation

### Key Files (edited)

- `prisma/schema.prisma`
  - Models: `TwoWayOrder`, `TwoWayOrderEvent`, `TwoWayOrderFill`, `TwoWayOrderActivity`
  - New fields:
    - `TwoWayOrderFill`: `toAssetAmountUserReceived`, `fromAssetAmountUserPaid`, `toAssetFeeAmount`, `fromAssetFeeAmount`
    - `TwoWayOrder`: `toAssetNetReceived`, `pnlToAbs`, `pnlToPct`
- Oura handler: `src/implementation/event/oura/twoWayOrder/TwoWayOrderOuraEventHandler.ts`
  - Compute deltas from outputs and log `[TWO-PARSE][FILL-DELTA]`
- Repository: `src/implementation/prisma/repositories/twoWayOrder.repository.ts`
  - `applyFillWithDeltas` updates totals, fill breakdown, accumulators, and activity
  - Rollback cascade for fills/activities before orders
- API:
  - Routes: `src/implementation/fastify/plugin/routes.ts`
  - Query: `src/implementation/fastify/twoWayOrder.query.ts`
  - Schemas: `src/implementation/fastify/schemas/public/*`
    - `TwoWayOrderListSchema.json`, `TwoWayOrderResultSchema.json`, `TwoWayOrderHistorySchema.json`, `SlvBalanceSchema.json`

### Event Handling (Design)

1. CREATE

- Detect outputs with inline datum (contract UTxO) → record CREATE event
- Upsert `TwoWayOrder` with `OPEN`, store initial `from/to`, price, effective dates

2. FILL

- Match consumed input to the order by `(txHash#index)`
- Find contract change output (heuristic: `inline_datum` present; later: whitelist of script addresses)
- Compute deltas:
  - `prevTo/prevFrom` = current totalsRemaining
  - If change exists: `changeTo = lovelace(amount)`, `changeFrom = amount of fromAssetId`
    - `toFilled = max(0, prevTo - changeTo)`, `fromFilled = max(0, prevFrom - changeFrom)`
  - Else (final fill): `toFilled = prevTo`, `fromFilled = prevFrom`
- Compute user/fee breakdown from non‑contract outputs:
  - `userReceiveTo = Σ lovelace of all non-contract outputs`
  - `userPayFrom = Σ fromAssetId of all non-contract outputs`
  - `feeTo = max(0, toFilled − userReceiveTo)`, `feeFrom = max(0, fromFilled − userPayFrom)`
- Persist:
  - Update `TwoWayOrder`: decrease totalsRemaining, increase totalsFilled
  - Accumulate `toAssetNetReceived` with net delta (see PnL below)
  - Status: `FILLED` only when both remaining go to zero; else keep `OPEN`
  - `TwoWayOrderFill`: store filled amounts + breakdown
  - `TwoWayOrderActivity`: add FILL (human‑readable history)

3. CANCEL (redemption)

- Mark order `CANCELLED`, keep activity record
- UPDATE vs CANCEL: planned — when user triggers “update”, store expected new NFT; if on-chain we see CANCEL + CREATE with this NFT, tag as UPDATE

### PnL and Net Delta (toAsset)

- Base currency: `toAssetId`
- Net delta per FILL:
  - If `userReceiveTo > 0`: `netToDelta = min(userReceiveTo, toFilled)`
  - Else: `netToDelta = max(0, toFilled − feeTo)`
- Accumulate `toAssetNetReceived += netToDelta`
- PnL:
  - `pnlToAbs = toAssetNetReceived − initialToDeposit`
  - `pnlToPct = (pnlToAbs / initialToDeposit) * 100` (rounded to 2 decimals)

### API (public)

- `GET /two-way-order`: list of orders with PnL fields (`toAssetNetReceived`, `pnlToAbs`, `pnlToPct`)
- `GET /two-way-order/:id`: single order with PnL fields
- `GET /two-way-order/:id/history` (no paging):
  - OPEN: message: "Order opened"
  - FILL: message: "Order filled" and fields: `fromFilled`, `toFilled`, `userReceiveTo`, `userPayFrom`, `feeTo`, `feeFrom`, `userReceiveToNet`, `userPayFromNet`, `pnlToAbs`, `pnlToPct`
  - CANCEL: message: "Order cancelled"
  - All bigint values are strings (frontend formats them via token decimals)
- `GET /slv/balance`: aggregate `toAssetAmountTotalRemaining` for OPEN orders (by `toAssetId`)

### Logging (diagnostics)

- `[TWO-PARSE][FILL-DELTA] orderId=<..> tx=<..> inIdx=<..> prevTo=<..> prevFrom=<..> changeTo=<..> changeFrom=<..> toFilled=<..> fromFilled=<..>`
- `[TWO-REPO][FILL] ...` with fill and order snapshots
- Rollbacks: `[TWO-REPO][ROLLBACK] ...`, `[TWO-ROLLBACK] ...`

### Known constraints / TODO

- Change output detection uses inline datum heuristic; optional improvement: whitelist of contract addresses
- Fee attribution by address optional; we use residual method now (robust without address lists)
- UPDATE vs CANCEL: implement “expected new NFT” tracking to mark updates correctly
- Tests: integration (partial/final FILL, CANCEL, UPDATE), idempotency and rollbacks

### Example logs (FILL)

```
[TWO-PARSE][FILL-DELTA] orderId=... tx=... inIdx=0 prevTo=1792960 prevFrom=1 changeTo=1792960 changeFrom=1 toFilled=0 fromFilled=0
```

### Frontend formatting

- All amounts are bigint strings; format them on FE by token decimals
- ADA(lovelace): 6; NFT/one‑unit tokens: 0; others — from metadata
