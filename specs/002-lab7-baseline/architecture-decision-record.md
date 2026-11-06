# ADR-L7-001 — Select Architecture #2 for Step 7 Documentation

**Date**: 2026-11-05. **Decision maker**: Student, explicit conversation selection. **Branch**: lab7-architecture.
**Status**: Selected for Lab 7 documentation; course/project-owner approval for implementation and change from Swing remains unrecorded.
**Inputs**: [instructions](consolidation-instructions.md), [baseline](spec.md), [Architecture #2](architecture-2.md), [Architecture #1](architecture-1.md), [review](chatgpt-architecture-review.md). [Index](README.md).

## Context and decision

SplitSmart requires personal accounts, groups, explicit participants, accurate equal/percentage splitting, pending approval, notifications, balances, recorded settlements, receipts and reports. CR-10 requests primary web use plus Android/iOS apps. Existing principles choose Swing and earlier scope excludes full mobile deployment. Neither alternative is implemented.

The student officially selected Architecture #2. Consolidate around Flutter web/Android/iOS clients, hosted HTTPS API and web session adapter, Java 21/Spring Boot pure financial domain, PostgreSQL records and append-only pair-obligation journal, private receipt objects, OIDC integration and durable outbox worker/server inbox. Concrete providers, runtime/dependency versions, environment and final product policies remain proposals.

This decision records selection, not authorization to change governance, implement code or deploy. Preserve all source documents. Proposed governance change, only after responsible approval: replace the Swing desktop presentation decision with web-first plus actual Android/iOS targets; retain financial correctness, domain separation and human review. No data/code migration is currently possible because no implementation exists. If later authorized, migration is a future design/implementation task, not a claimed completed action.

## Alternatives and consequences

| Alternative | Benefits | Costs / disposition |
| --- | --- | --- |
| Architecture #1: desktop layered monolith, Swing/H2 | Smaller classroom scope, one-process transactions, simpler local operation | Per-installation state; does not deliver CR-10; preserved comparison, not selected |
| Architecture #2: hosted clients/server plus worker/journal | Better platform alignment, shared authorized state, explicit financial posting and delivery boundaries | Hosting/security/mobile release complexity, journal reconciliation, receipt cleanup; selected |
| Full microservices/event sourcing | Independent services and replay possibilities | Unnecessary distributed consistency/operations for current scope; not selected |

Web-first staging is acceptable as a proposed milestone but does not complete mobile delivery. A responsive site is not an Android/iOS app. The financial journal is not banking integration or a full double-entry ledger. Notifications may lag; balances use committed journal reads. Database and object store have no shared ACID transaction.

## Conflicts and issue register

IDs below are authoritative gates for this consolidated set; they carry forward, rather than resolve, the open questions in [research.md](research.md).

| Gate | Evidence / inconsistency | Consolidated disposition | Responsible reviewer / impact |
| --- | --- | --- | --- |
| G-01 | Customer CR-10/NFR-006 vs principles Swing, earlier mobile exclusion, Architecture #1 | Student chooses #2; propose reviewed platform/scope change; no historical rewrite | Course/project owner; platform implementation approval open |
| G-02 | Accounts own-data requirement vs shared groups; identity details unspecified | Server enforces explicit access policy; provider authenticates but grants no business permission | Customer/security reviewer; enrollment, sessions, sharing and visibility open |
| G-03 | Single approval documented but approver/self-approval/rejection unspecified | Preserve PENDING -> APPROVED only, no invented role hierarchy | Customer; approval permissions and other transitions open |
| G-04 | Half-up cent rounding/exact totals without residual rule | No arbitrary cent recipient; require deterministic approved allocation, precision and limits | Customer/domain reviewer; full split behavior open |
| G-05 | Group management/participant selection without edit/history rules | Snapshot shares proposed; no edit/delete/remove policy invented | Customer; payer override, membership/history changes open |
| G-06 | Notifications required, channel/timing unspecified | Selected design proposes asynchronous server inbox; no external push/email | Customer; audience timing, read status, delivery expectations open |
| G-07 | Settlement requirements without currency/exceptional payments | Pair journal/group-local netting and one currency remain candidates | Customer/domain reviewer; netting, overpay/self-pay/refund/corrections open |
| G-08 | Reports/date ranges without date/as-of meaning | Separate activity selection and balance interpretation | Customer; boundaries, filters, posting/business time open |
| G-09 | Optional receipt without formats/size/retention | Private staged objects with recovery, not desktop BLOBs | Customer/security/operator; limits, deletion and recovery open |
| G-10 | No quality/operations numbers, hosting or version choices | No invented SLA/capacity; pin/verify versions and plan platform distribution | Course/project/operator; budget, region, accessibility, recovery/load goals open |
| G-11 | Original principles name PlantUML; instructions request Mermaid architecture diagrams | Mermaid component/deployment/class views plus a UML activity PlantUML source are included in the new design; no source diagram policy changed | Reviewer; Mermaid syntax is checked separately; rendering status is explicit |
| G-12 | Old review says human selection pending; earlier plan/model/contracts assume desktop | Historical source preserved; this ADR records later student selection and new consolidated interfaces | Student selection resolved; responsible implementation approval still open |

## Constitution review

I: Customer fidelity preserved by targeting CR-10 and retaining all requirements; platform approval remains G-01. II: No missing policy silently resolved; affected implementation blocked by gates. III: BigDecimal, total preservation, approval isolation and atomic journal design proposed; untested. IV: Thin clients and pure domain separate concerns. V: requirement/test matrices and immutable source preservation support traceability; human acceptance of generated synthesis remains pending.

## Acceptance and follow-up

Approve consolidated documents and record gated answers before implementation tasks. Do not mark student selection as course approval. No constitution/principles changes, application migration, code, test execution or deployment is part of this task. Use [validation plan](consolidated-validation.md) for review and future evidence. [Architecture](consolidated-architecture.md) and [design](consolidated-design.md) specify the selected target, conditional where required.
