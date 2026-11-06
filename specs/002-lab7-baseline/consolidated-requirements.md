# Consolidated Requirements — Selected Architecture #2

Date: 2026-11-05. Status: documentation consolidation, unimplemented. [Index](README.md). Selection and open policy gates: [ADR-L7-001](architecture-decision-record.md). Requirements derive from [baseline](spec.md), [original request](../../UserRequirement.md), [consolidated source](../../requirements.md), [principles](../../SplitSmartPrinciples.md) and [constitution](../../.specify/memory/constitution.md). No source is rewritten.

## Scope and actors

Users sharing costs may act as group member, expense creator/payer, selected participant, reviewer or payment recorder. These describe responsibilities, not new access roles. Product scope includes accounts, groups, expense entry/splits/approval, notices, balances, settlement records, optional receipts and reports. Actual bank transfers, conversion, offline mutations, external push/email, advanced analytics and automatic cross-group settlement are not added.

Selected target is web-first plus actual Android/iOS apps. It is student-selected, not implemented or approved by course/project owner to replace Swing. All rows below are required behavior, not delivered features. Acceptance case IDs link to [validation](consolidated-validation.md); component/class mappings are there as well.

## Functional requirements and source trace

| Baseline ID | Consolidated requirement | Customer source | Acceptance / gates |
| --- | --- | --- | --- |
| FR-001 | Support individual accounts and login, accessing authorized personal expense/balance information. | CR-01 | T-01; G-02 |
| FR-002 | Create/manage groups and add registered users; other management actions unspecified. | CR-02 | T-02; G-05 |
| FR-003 | Identify payer and explicitly selected group participants; creator defaults to payer; membership is not participation. | CR-03, CR-04; D-01/D-02 | T-03; G-05 |
| FR-004 | Create expenses with amount, date, description, equal/percentage method and optional receipt image. | CR-03 | T-04; G-09 |
| FR-005 | Calculate equal/percentage shares using half-up cents and preserve exact expense total. | CR-03, CR-07; D-03 | T-05; G-04 |
| FR-006 | Before saving reject negative/zero/blank amounts, missing/duplicate participants and percentage total other than exactly 100%; show clear errors. | CR-03, CR-04; D-04 | T-06 |
| FR-007 | Notify other group members of newly created group expenses. | CR-05 | T-07; G-06 |
| FR-008 | Create PENDING expenses; single approval required before balance impact. | CR-06, CR-07; D-05 | T-08; G-03 |
| FR-009 | Track/display amounts owed between users from approved expenses and settlements. | CR-07 | T-09; G-07 |
| FR-010 | Record payments made to settle balances and reflect them accurately; no money transfer. | CR-08 | T-10; G-07 |
| FR-011 | Provide expense/balance/payment summaries and reports including date ranges; other filters and advanced customization unspecified. | CR-09 | T-11; G-08 |

D-01 through D-05 are the existing documented payer, membership, rounding, validation and single-approval clarifications, not decisions made during consolidation. No residual-allocation rule is hidden in FR-005.

## Nonfunctional requirements

| Baseline ID | Consolidated quality requirement / constraint | Source / validation |
| --- | --- | --- |
| NFR-001 | Financial results deterministic, exact and total-preserving at cent precision. | D-03, constitution III; T-05/T-09/T-12 |
| NFR-002 | Clear user-facing validation errors before saving invalid records. | D-04; T-06 |
| NFR-003 | Personal account information restricted by approved access policy; shared group visibility must be resolved. | Source acceptance criteria; T-01/T-13; G-02 |
| NFR-004 | UI/input/display separate from validation, calculations and financial rules. | Constitution IV; T-14 |
| NFR-005 | Requirements/design/tests traceable, AI-generated artifacts reviewed by a human. | Constitution V; T-15 |
| NFR-006 | Preserve customer primary web plus Android/iOS requirement and explicitly resolve Swing conflict. | CR-10; T-16; G-01 |

No numeric latency/load/availability/recovery targets, accessibility standard, retention period or supported platform versions are established. G-10 requires those decisions; proposed architecture controls do not become new accepted quality targets.

## Customer coverage cross-check

CR-01 -> FR-001; CR-02 -> FR-002; CR-03 -> FR-003/004/005/006; CR-04 -> FR-003/006; CR-05 -> FR-007; CR-06 -> FR-008; CR-07 -> FR-005/008/009; CR-08 -> FR-010; CR-09 -> FR-011; CR-10 -> NFR-006 and actual web/Android/iOS target acceptance. All ten remain represented; none is waived.

## Boundaries, data and unresolved behavior

Domain entities are UserAccount, Group/Membership, Expense/ParticipantShare, Approval, Payment and optional Receipt. Journal, outbox, inbox and command receipts are selected technical mechanisms, not added customer features. [Design](consolidated-design.md) defines proposed relationships and interfaces.

Edge cases awaiting approval: uneven-cent recipient, decimal input/percentage limits, currency, reviewer/self-approval, rejected/edited expenses, membership history, overpay/self-pay/refunds, date boundaries/as-of balances, notice timing/read state, receipt limits/deletion, hosting/security/operational criteria. Use G-01..G-12 in the ADR, rather than inventing defaults. No functionality is implemented or tested by this requirements document.
