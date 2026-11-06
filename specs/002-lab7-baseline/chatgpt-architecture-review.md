# CIS 285 Lab 7 — ChatGPT Architecture Comparison and Review

**Repository:** devilschild7/Lab6CIS285  
**Branch:** lab7-architecture  
**Review date:** 2026-11-05  
**Review status:** Design review only; no application implementation or acceptance tests verified.

## Scope and evidence

Reviewed `specs/002-lab7-baseline/spec.md`, `architecture-1.md`, and `architecture-2.md`. The baseline describes SplitSmart, an expense-sharing system with users, groups, explicit expense participants, equal/percentage allocations, pending approval, balances, recorded settlements, receipts, notifications, and reports. The repository analysis reports an empty Visual Studio solution and no verified application source. This review evaluates **proposed** designs, not tested software.

## Comparison

| Criterion | Architecture #1: local desktop | Architecture #2: hosted clients/server |
|---|---|---|
| Architectural style | Layered single-process modular monolith | Three-tier networked system plus asynchronous worker |
| Presentation | Java 21 Swing | Flutter web, Android and iOS |
| Backend and logic | Java services, pure domain rules, JDBC | Java/Spring Boot API and pure domain rules |
| Storage | Embedded H2 with receipt BLOBs | PostgreSQL with private receipt object storage |
| Financial balances | Derived from approved expenses and payments | Committed append-only pair-obligation journal |
| Notifications | Durable local in-app records | Transactional outbox with worker and server inbox |
| Deployment | Workstation/JAR; no remote shared state | Hosted API, worker, database, web assets and mobile builds |
| Security boundary | Application policy plus local OS/file controls | Server authorization, HTTPS, identity provider and private data services |
| Complexity and operations | Lower complexity; local backup and maintenance | Higher complexity; hosting, identity, recovery, mobile distribution |
| CR-10 platform requirement | Does not deliver primary web plus Android/iOS | Explicitly targets web and native mobile delivery; not yet implemented |

## Strengths and limitations

### Architecture #1

**Strengths:** matches recorded classroom Java/Swing direction; clearer development and test scope; direct transactions covering expenses, approvals, images, and local notices; derived balances avoid a separately mutable total. Pure Java domain rules are independently testable.

**Limitations:** local data on each installation does not support shared access from multiple devices or true remote group coordination; local login is not a defense against someone who can access or alter its database files; does not satisfy customer web/Android/iOS requirement CR-10 without an approved scope change.

### Architecture #2

**Strengths:** central data supports authorized multi-device group sharing; targets customer platform requirement; server-owned financial authorization and transactions; immutable posting journal aids traceability; transactional outbox makes notification retries explicit; private object storage handles growing receipt files separately.

**Limitations:** significantly more components and operational obligations; expense/receipt lifecycle spans PostgreSQL and object storage without distributed atomicity; asynchronous notifications have delayed visibility; journal must reconcile with source records; identity, network availability, API security, hosting and app distribution require substantial implementation and testing. Flutter target support alone is not proof that Android/iOS apps have been delivered.

## Requirements fit

Both proposals address FR-001 through FR-011 conceptually, including accounts, groups, shares, validation, approval-before-balance, settlements and reporting; none is implemented or verified. Architecture #1 has a significant unresolved NFR-006/CR-10 platform gap. Architecture #2 better fits the original customer platform objective but conflicts with the recorded Swing project decision. Neither may be declared approved for implementation without a human scope decision.

## Shared unresolved decisions and risks

1. Determine whether the classroom deliverable is Swing desktop or the customer's web plus Android/iOS target; record approval and update the affected requirement/design decision.
2. Define group permissions, account security, approval eligibility, membership changes and information visibility.
3. Specify deterministic leftover-cent allocation, accepted monetary precision, currency and payment edge cases.
4. Define receipt size/types/retention, notification expectations and report/date-range semantics.
5. Set testable operational goals (security, backup/recovery, performance/accessibility) appropriate to selected scope.
6. Trace each finalized choice to baseline requirements and acceptance checks; do not treat design documents as evidence of running features.

## Recommendation

**Conditional recommendation: Architecture #2** if the project owner confirms that original web, Android and iOS delivery is the governing target, and the team accepts the added implementation and operational scope. Its centralized shared-data model better supports real expense-sharing across devices. A staged web-first implementation may be planned, but must not be claimed to complete the mobile app requirement until both target apps are built and verified.

**Fallback: Architecture #1** if the course explicitly requires the recorded Swing desktop implementation, or if the approved time/resources cannot support hosted/mobile development. In that case document CR-10 as deferred or changed with approval, rather than quietly assuming it has been satisfied.

**Human decision:** Pending. This review recommends but does not choose on the student's behalf.

## Consolidation handoff (after human selection)

Preserve both original proposals and the baseline as comparison evidence. Add an architecture decision record with selected candidate, justification, rejected tradeoffs, approval, unresolved issues and affected CR/FR/NFR references. Update the requirements, overall architecture, component/deployment diagrams, data model, security boundaries, interface contracts, implementation plan and validation matrix to reflect the chosen design consistently. Do not introduce unapproved rules or modify application code as part of documentation consolidation.
