# Proposed Data Model — Architecture #1

Status: logical design only; no classes, schema or migrations exist. Requirements: [spec.md](spec.md); unresolved rules: [research.md](research.md). Field choices below are proposed technical design, not discovered implementation.

## Representation and Relationships

Use stable UUID identifiers for persisted entities; local date for business expense/payment dates; instants for creation/approval technical timestamps. Money is BigDecimal with two-decimal persisted amounts; percentages are decimal, with precision/range set by U-04. Currency must be fixed and explicitly agreed under U-07 before mixing amounts. No conversion is proposed.

| Entity | Proposed fields | Relationships / purpose |
| --- | --- | --- |
| UserAccount | id, loginIdentifier, displayName, passwordVerifier with salt/algorithm/parameters, version | One account has many memberships and may be payer/participant/payment party; fields and identity policy U-02 |
| ExpenseGroup | id, name, createdBy, createdAt, version, financialRevision | Many memberships/expenses/payments; createdBy records provenance, does not imply admin authority |
| Membership | groupId, userId, joinedAt | Unique group/user; removing members/history rules U-05 |
| Expense | id, groupId, createdBy, payerId, amount, expenseDate, description, splitMethod, state, createdAt, version, commandId | PENDING or APPROVED; one or more participant shares, optional receipt, zero/one approval |
| ParticipantShare | expenseId, userId, percentage nullable, allocatedAmount | Unique expense/user; percentage required for percentage method, absent for equal; snapshots preserved |
| Receipt | id, expenseId, originalName, mediaType, byteLength, imageBytes | Zero/one per expense; BLOB held in same store; filename is display metadata, never a filesystem path |
| Approval | expenseId, reviewerId, approvedAt | At most one approval, saved with state transition; eligibility U-03 |
| Payment | id, groupId, fromUserId, toUserId, amount, paymentDate, recordedBy, recordedAt, commandId | Recorded settlement, no bank transaction; lifecycle/permissions U-07 |
| Notification | id, expenseId, recipientId, createdAt | Proposed persisted notice; unique expense/recipient; read-state field deferred to U-06 |
| SessionContext | actorId, session identifier | In-memory only; logout invalidates it; session policy U-02 |
| BalanceView | groupId, debtorId, creditorId, amount, snapshot/revision | Derived query result, not authoritative mutable row |
| ReportView | applied selection, rows, totals, snapshot reference | Derived result; date/balance meaning U-08 |
| SchemaVersion | version, appliedAt | Technical metadata for future versioned schema upgrades |

Membership is not participation. A user may pay without being a selected participant; behavior of payer changes is unresolved. A group has many expenses and payments. Each notice references a committed expense and recipient. Use foreign keys with restrictive deletion initially; deletion/correction must wait for accepted lifecycle rules.

## Invariants

1. Reject blank, zero or negative expense amounts before save. Reject missing/duplicate participants. Participants must be selected from registered group members at creation.
2. Percentage shares sum to exactly 100%; decimal comparison uses numeric equality. Negative individual percentages, maximum precision and amount normalization rules require U-04.
3. Allocated amounts sum exactly to expense amount; shares are rounded to cents using HALF_UP plus an accepted residual adjustment policy. No residual algorithm is selected. Example: 10.00/3 totals 10.00 after adjustment, but cent recipient remains undecided.
4. New expense is PENDING; only APPROVED expenses contribute to balances. Approved state and Approval record change atomically.
5. Proposal: final approved shares/history are immutable; membership changes never rewrite them. U-05 must confirm editing/history policy.
6. Proposed commandId uniqueness guards expense/payment submission; same ID and same actor/payload may return original outcome, changed payload returns conflict. Store enough request identity to validate replay.
7. Proposed optimistic versions and group financial revision guard approval/payment races. Increment revision within financial mutation transactions; validate expected revision when rules read current balance.
8. All rows for expense, shares, receipt and notices commit together. Service-level validation enforces cross-row sums; foreign keys/uniqueness alone are insufficient.
9. Store credential verifiers only; private fields excluded from result models/logs. Every read/write applies accepted access policy.
10. No payment amount validation beyond the documented normal settlement example is inferred as an agreed business rule; U-07 must settle positive amounts, limits and exceptional payments before implementation.

## State Transitions

```text
Valid expense creation -> PENDING
PENDING -- authorized single approval + matching version --> APPROVED
APPROVED -- duplicate approval --> no second change/effect (proposed technical guard)
```

No rejected/cancelled/deleted states are added. Unsupported transitions return a conflict or unsupported-operation result, not invented financial effects. Payment correction/reversal states remain undefined.

## Derived Balances

Proposed group-local signed pair calculation, pending U-07 acceptance:

For ordered users A,B, calculate contributions from approved shares A owes B minus shares B owes A, then subtract recorded A->B payments and add B->A payments. Positive result means A owes B, negative means B owes A, zero means settled. Exclude payer's own share from debt. Display each unordered pair once; do not double-count reciprocal views. Do not combine currencies or net groups automatically.

Balances and report totals use a consistent read snapshot. Pending expenses remain visible only where authorized and clearly labeled, but never enter financial totals. No denormalized balance table is proposed initially.

## Persistence and Index Candidates

Proposed uniqueness: account identifier (normalization U-02), membership pair, participant pair, approval expense, notice expense/recipient and mutation command ID. Candidate indexes: expense(group,state,date), share(user,expense), payment(group,date,from,to), notice(recipient,createdAt). Tune only after measurement. Precision/length limits, retention, migration tooling and recovery tests remain implementation decisions; no SQL DDL is generated in planning.
