# Two-Way Orders vs One-Way Orders — Deep Dive

This memo documents how Two-Way Orders (TWO) currently work end-to-end, how they differ from the One-Way Order (OWO) event-stream architecture, and where the main pain points are. Treat this as onboarding material for future maintainers as well as a debugging aid.

---

## 1. Architecture Overview

| Aspect | TWO (current) | OWO (current) |
| --- | --- | --- |
| Primary source of truth | Prisma tables (`two_way_order`, `two_way_order_fill`, …) updated directly | `event` table (event stream); projections are derived views |
| Pending storage | `TwoWayOrderPendingSubmit` / `TwoWayOrderPendingCancel` tables | Event payload (`OPEN_INIT__REQUEST`) + reducer |
| Submit flow | `/DEX/two-way-order/place` → pending row → post-submit handler inserts PENDING order | `/DEX/order/place` emits events → reducer updates projection |
| Oura ingestion | Direct repository calls (create/update rows) | Append `ORDER_SWAP__…` events; projection recomputed |
| Rollback | Manual `deleteMany`/`updateMany` on Prisma tables | Append rollback events + recompute reducer |
| Event log | `TwoWayOrderEvent`: raw Oura JSON only | `event` table: both raw and domain events |

---

## 2. TWO Flow (Maker)

1. **Place** – API receives `Core.TwoWayOrderPlaceRequest` (see `src/domain/models/core/twoWayOrder.ts`), forwards to tx-server (`CoreServiceMapper.toRequestTwoWayOrderPlace`). Response contains unsigned Tx, deposit/fee amounts.
2. **Pending** – `TwoWayOrderMutationFastify.place` stores data in `TwoWayOrderPendingSubmit`. Key fields: `transactionId`, `userId`, asset amounts, straightPrice.
3. **Submit** – `TransactionPostSubmitHandlerTwoWayOrder` pulls pending record, creates row in `two_way_order` with status `PENDING`. UTxO hash comes from signed payload (`calculateTransactionHash`).
4. **Oura CREATE** – `TwoWayOrderOuraEventHandler.handleTransaction` sees inline datum output; calls `markPendingOrderOpened` → row becomes `OPEN`, `utxoReferenceIndex` set. For non-user orders there’s extra heuristics (`enrichOpenOrder`).
5. **User Cancel (new)** – Mutation writes to `TwoWayOrderPendingCancel`, post-submit handler calls `markCancelledByUser` (status → `CANCELLED`, activity log entry).

---

## 3. Taker / Fill Flow

*Currently partially implemented.* On-chain fill events update `two_way_order` totals, but there’s no separate submit path for taker via API. Fills are parsed by heuristics (`markFilledByConsumedUtxo`, `applyFillWithDeltas`).

---

## 4. Rollback Behaviour

- `TwoWayOrderRepository.rollbackToSlot` performs: purge fills/events/activities after slot, revert user orders (`revertUserOrdersOpenedAfterSlot`), delete chain-only orders, rebuild from `TwoWayOrderEvent`.
- Because `TwoWayOrderEvent` contains only raw Oura JSON, user orders cannot be restored purely from events; we rely on the manual revert logic.
- OWO uses `EventStreamRepositoryPrisma.getEventsWhereBlockSlotGreaterThan` + `OrderSwapMutation` to append rollback events, then projection is recalculated. No table surgeries are needed.

---

## 5. Known Issues (2025-10)

1. **Data loss after rollback** – Without event history, we revert to `PENDING` state but may lose user-provided fields (e.g. custom assets). Mitigation applied, but still fragile.
2. **Ghost orders** – Oura rebuild used to insert chain-only orders. Updated logic now skips enrichment when `userId != null`, but requires QA.
3. **Cancel failure** – `/two-way-order/cancel` now persists pending cancel, yet core returns `GYInvalidDatum` (datum mismatch); needs coordination with core team.
4. **Asset accounting** – Maker-only ADA lock; `fromAssetId` remains `"."`. Taker flow doesn’t debit second asset → price math is suspect.

---

## 6. Key Files

- Prisma models: `prisma/schema.prisma` (`TwoWayOrder`, `TwoWayOrderEvent`, `TwoWayOrderPendingSubmit`, `TwoWayOrderPendingCancel`, …).
- Fastify layer: `src/implementation/fastify/twoWayOrder.mutation.ts`, `twoWayOrder.query.ts`.
- Repositories: `twoWayOrder.repository.ts` (core logic), `twoWayOrderPending.repository.ts`, `twoWayOrderPendingCancel.repository.ts`.
- Oura ingest: `src/implementation/event/oura/twoWayOrder/TwoWayOrderOuraEventHandler.ts`.
- Transaction handlers: `src/application/transaction/transactionPostSubmitHandlerTwoWayOrder.ts`.
- Event infrastructure for comparison: `src/domain/events/mutation/orderSwap`, `src/domain/events/reducer/orderSwap`, `src/implementation/prisma/projections/orderSwap`.

---

## 7. Recommended Reading (OWO)

- `src/application/orderSwap.application.ts` – full end-to-end event usage.
- `src/domain/events/mutation/orderSwap/orderSwap.mutation.ts` – event constructors.
- `src/implementation/prisma/projections/orderSwap/orderSwap.projection.ts` – how projections consume event streams.
- `src/application/transaction/transactionPostSubmitHandler.ts` – append post-submit events.

---

## 8. Migration Checklist (Summary)

1. Define TWO event types mirroring OWO.
2. Implement `TwoWayOrderMutation` / reducer.
3. Append events in submit/cancel handlers.
4. Switch Oura handler to emit events.
5. Build projection (`TwoWayOrderEventProjectionPrisma`).
6. Replace rollback logic with event-based rebuild.
7. Coordinate with core for multi-asset datum.

Refer to `TWO_OwoMigrationPlan.md` for detailed roadmap.

