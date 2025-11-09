# Two-Way Orders → Event-Sourced (OWO) Migration Plan

This document captures the follow-up work needed to migrate Two-Way Orders (TWO) to the same event-sourced architecture used by One-Way Orders (OWO). The goal is to ditch ad-hoc DB writes and rollbacks in favor of event streams, deterministic projections, and cleaner integrations with Oura.

## Current Situation (2025-10)

- TWO requests create rows directly in `two_way_order` (via `pending` table + post-submit handler).
- Oura handlers upsert (and occasionally create) orders when observing on-chain transactions.
- Rollbacks run a cascade of `deleteMany`/`updateMany`, which is hard to reason about when orders are user-owned.
- There is no event log for TWO; status and amounts live only in the projection.
- `TwoWayOrderEvent` currently stores raw Oura payloads (no domain events), so rebuild relies on best-effort heuristics.
- Maker-side collateral is ADA-only; the from-asset is not locked (core gap), which breaks true “two-way” semantics.
- Cancel flow exists in API but fails on core (`GYInvalidDatum`) until datum support lands.

Pain points:

1. Rollbacks cannot safely reconstruct user orders (no event history).
2. Oura ingestion must avoid creating brand-new rows and instead “find-or-update”, which is easy to break.
3. Pending orders need to survive rollbacks; current workaround resets them manually.
4. Logic diverges from OWO, increasing maintenance overhead.

## Target Architecture (mirror OWO)

1. **Event Types** (Prisma `EventType`, `TwoWayOrderEvent` stream)
   - `TWO__OPEN_INIT__REQUEST/SUCCESS/FAILURE`
   - `TWO__OPEN_SUBMIT__SUCCESS/FAILURE`
   - `TWO__OPEN_ONCHAIN__SUCCESS/FAILURE`
   - `TWO__FILL_*` (INIT/SUBMIT/ONCHAIN)
   - `TWO__CANCEL_*`
   - Optionally `TWO__ROLLBACK_*` markers.
   - Consider `TWO__STRAIGHT_PRICE_UPDATE` if we later allow off-chain edits.

2. **Event Stream Repository**
   - Reuse existing infrastructure (`EventStreamRepositoryPrisma`) by adding a new identifier (e.g. `TWO_ORDER_IDENTIFIER`).
   - Save events via mutations; fetch stream by `twoWayOrderId`.

3. **Domain Models**
   - `TwoWayOrderEvent` (similar to `OrderSwapEvent`).
   - `TwoWayOrderMutation` (append events).
   - `TwoWayOrderReducer` (reduce event stream → domain state).

4. **Projection**
   - `TwoWayOrderEventProjection` (writes rows to Prisma using reducer output).
   - Replace direct writes in repositories with projection-driven updates.

5. **Application Flow**
   - `TransactionApplication` + post-submit handler append events (instead of direct DB writes).
   - Submit failure handlers append failure events.
   - On-chain Oura handlers append on-chain events (instead of calling repo functions directly).

6. **Pending Submit**
   - Either keep `TwoWayOrderPendingSubmit` for quick lookup, or encode pending payload in `OPEN_INIT__REQUEST` event payload.
   - Projection will create the initial PENDING record from events.

7. **Rollbacks**
   - On rollback, fetch affected event streams (like OWO’s `updateEventStreamsAffectedByRollBack`).
   - Append rollback/failure events.
   - Re-run projection to rebuild DB state.
   - No manual delete/re-insert.

8. **DB Changes**
   - Prisma `EventType` enum additions.
   - Possibly new tables for `two_way_order_event` stream, or reuse generic `event` table.
   - Ensure `two_way_order` projection schema has all fields needed by reducer (totals, fees, pnl, effective dates, activity metadata).

9. **Oura Handler Updates**
   - Replace repo calls (`createOpenFromTx`, `markFilledByConsumedUtxo`, etc.) with event mutations.
   - Oura only appends on-chain events; projection handles materialization.

10. **Testing**
   - Unit tests for reducer/mutations.
   - Integration tests for submit + on-chain ingest + rollback.
   - Migration tests (backfill events for existing orders?).
   - E2E cancel/fill once core unlocks datum.

## Migration Strategy

1. **Incremental Implementation**
   - Introduce new events + mutation layer while still writing to current tables.
   - Flip projection once event flow is stable.
2. **Backfill**
   - Decide whether to retroactively generate event streams for existing TWO data (optional if we only care about future orders).
   - Option: dual-write events while still updating tables, then cut over.
3. **Switch**
   - Update application code to rely solely on projection.
   - Delete legacy direct-writes/rollback logic.
4. **Cleanup**
   - Remove `pending` table if event payload suffices.
   - Document new flow for frontend/backend.

## Open Questions

- Do we need to rebuild historical TWO orders into event streams?
- Should we unify OWO/TWO event infrastructures (shared base)?
- How to handle partial adoption (feature-flagged rollout)?
- How to migrate existing `TwoWayOrderEvent` raw payloads (keep for forensic purposes or compress into archived table)?
- What is the plan for maker locking of from-asset on core?

## Next Steps

1. Spec event payloads (fields per event type).
2. Extend Prisma `EventType` + regenerate client.
3. Implement `TwoWayOrderEvent` + reducer/mutation skeleton.
4. Update transaction submit path to append events.
5. Update Oura handler to append on-chain events.
6. Build projection + migrate existing API queries to use reducer output.
7. Replace rollback logic with event-based rebuild.
8. Regression testing.
9. Align with core team on datum structure so second asset can be locked/unlocked.
10. Plan feature-flag or staged rollout (dual-write events + legacy tables until stable).

This document should serve as the starting guide when we have capacity to migrate TWO to the event-sourced pattern.
