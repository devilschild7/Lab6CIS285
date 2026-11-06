# Proposed Application and UI Contracts

Status: design only; these are in-process service/UI contracts, not implemented endpoints or public Java signatures. Model: [data-model.md](../data-model.md). Gates: [research.md](../research.md). No HTTP API exists or is specified for this desktop candidate.

## Common Envelope

Authenticated commands/queries receive actor context established by AccountService, not a caller-selected user ID. Commands that create financial records receive unique commandId; updates carry expected record version and, where balance validation requires it, expected group financial revision. Dates are business dates; monetary inputs use decimal text and percentages decimal numbers. UI converts neither money to binary floating point nor financial rules into view logic.

Success returns an immutable result view containing only authorized fields, generated IDs/state/version and persisted command outcome. Queries return authorized records with selection/snapshot metadata. Failure returns stable category, safe message and optional field errors: VALIDATION, UNAUTHENTICATED, FORBIDDEN, NOT_FOUND, CONFLICT, POLICY_UNRESOLVED or STORAGE_FAILURE. Whether inaccessible records use NOT_FOUND to avoid disclosure depends on U-02. Never include SQL, password/verifier, image bytes unless explicitly requested and authorized, or filesystem paths in errors.

All mutation success means commit completed; failure leaves no partial records. Same commandId with same actor/payload returns original committed result; different payload yields conflict. This is a proposed retry guarantee to implement/test, not existing behavior. Queries may retry; failed mutations are retried only with the original command ID. Missing accepted policy must not default to permission granted.

## Use-Case Contracts

| Operation | Input | Success | Preconditions / errors | Trace |
| --- | --- | --- | --- | --- |
| RegisterAccount | identifier, display data, credentials according to U-02 | public account ID/view | accepted identity policy; validation/duplicate conflict; never return verifier | FR-001 |
| Login / Logout | credentials / current session | actor context / session cleared | login generic failure; U-02 mechanism/session rules | FR-001 |
| CreateGroup | actor, group name | group view/ID | accepted create permission; clear validation | FR-002 |
| AddMember | actor, groupId, registered userId, expected version | updated membership view | access policy; existing user; duplicate conflict | FR-002 |
| CreateExpense | actor, commandId, groupId, amount, date, description, split method, explicit participant IDs, percentages if used, optional receipt | committed PENDING expense ID/state/shares/version | authorize; membership; six documented invalid-input checks; U-04/U-09 policies | FR-003..006 |
| ApproveExpense | actor, expenseId, expected version | APPROVED view/reviewer/time | U-03 reviewer policy, PENDING state; stale/duplicate conflicts have no new effect | FR-008 |
| ListExpenses / GetExpense | actor, permitted group/personal scope, selection | authorized expense views | U-02 shared visibility; pending clearly labeled | FR-001/004 |
| GetReceipt | actor, expenseId | authorized bytes/media metadata | policy and receipt presence; no raw file paths | FR-004 |
| ListNotices | actor, selection | proposed notices for that actor | U-06 channel/read-state policy; no remote delivery implied | FR-007 |
| GetBalances | actor, scope | pair balances and snapshot/revision | access policy; approved shares and payments only; U-07 scope/netting | FR-009 |
| RecordPayment | actor, commandId, groupId, from/to user IDs, amount, date, expected financial revision | committed payment ID and refreshed balance reference | U-07 permissions/currency/limits; stale revision conflict | FR-010 |
| GenerateReport | actor, scope, date selection and accepted filters | rows/totals/selection/snapshot | U-08 date and balance meaning; reject unsupported filter | FR-011 |

No remove-member, edit/delete/reject expense, password recovery, report export, notification marking or payment reversal API is invented. Extend contracts only after corresponding decisions.

## UI Interaction Contract

- Account view collects accepted credentials and displays safe login/registration errors. Logout clears previous personal content.
- Group view lists only authorized groups/members and separates membership from expense participants.
- Expense form requires amount, date, description, split method and explicit participants; percentage mode collects shares. Receipt is optional. Domain/service validates; field errors preserve entered values without persisting invalid expense.
- Review view labels PENDING versus APPROVED and exposes approval only according to accepted policy; service rechecks permission regardless of button visibility.
- Balance view distinguishes debtor/creditor and selection. Payment entry records settlement only; never implies bank transfer.
- Report view displays applied dates/filters and meaning of balances after U-08. Notice view is same-installation proposal pending U-06.
- Presenter runs storage/report operations off the event dispatch thread and marshals updates to it. Disable duplicate submission while pending, retain command ID across retry and reload stale views on conflict. No latency target is implied.

## Persistence/Policy Port Expectations

Repository ports load/save users, groups/memberships, expenses/shares/receipts/approvals, payments and notices. UnitOfWork commits or rolls back all related changes. AccessPolicy supplies authorization for actor/resource/action; ApprovalPolicy supplies reviewer eligibility; MonetaryPolicy supplies accepted scale/residual behavior; PaymentPolicy and ReportPolicy encode reviewed semantics. CredentialVerifier creates/checks verifier records without exposing raw secrets. Policies may be interfaces or dedicated domain services; no framework is mandated.

Adapters use parameterized statements and never return database handles to presentation. Receipt metadata/bytes and notification rows share the expense transaction. Version conflicts report CONFLICT. Query services use consistent snapshots. Future remote APIs require separate transport/authentication contracts; in-process contracts alone are insufficient.

## Contract Validation

Planned checks: denied cross-account actions/reads; six invalid expense categories persist nothing; pending never changes balances; approve twice yields one effect; partial store failure rolls back expense/share/receipt/notice; payment retry records once; stale financial revision fails; reports have consistent authorized totals. These are not executed tests.
