# CIS 285 Lab 7 — Architecture Decision and Consolidation Instructions

**Decision:** Select Architecture #2 (hosted web/mobile client/server architecture)  
**Decision maker:** Student, in ChatGPT conversation, 2026-11-05  
**Scope:** Lab 7 documentation consolidation on branch `lab7-architecture`  
**Decision status:** Student-selected for documentation; course/project-owner approval of the change from Swing desktop to web/mobile is not evidenced. Do not claim product implementation approval.

## Inputs and evidence

- `specs/002-lab7-baseline/spec.md` — the baseline, FR-001–FR-011, NFR-001–NFR-006, and acceptance scenarios.
- `specs/002-lab7-baseline/architecture-1.md` — preserved Spec Kit desktop proposal.
- `specs/002-lab7-baseline/architecture-2.md` — selected hosted web/mobile proposal.
- `specs/002-lab7-baseline/chatgpt-architecture-review.md` — comparison and conditional recommendation.
- `UserRequirement.md`, `requirements.md`, `SplitSmartPrinciples.md`, `.specify/memory/constitution.md`, and earlier `specs/001-splitsmart/spec.md` — original requirements, decisions and unresolved conflicts.

## Rationale

Architecture #2 more directly targets customer CR-10 / NFR-006: primarily web use with Android and iOS applications. Its central authorization and storage permit authorized group members to share data across devices, while its financial journal, transactional command processing, and outbox notifications provide explicit consistency and delivery boundaries. It costs more to build, host, maintain and test than Architecture #1. This is a **design selection**, not a verified or deployed system.

The prior Swing classroom choice conflicts with this selection. Document the proposed change and route it for the necessary course/project approval. Do not silently rewrite historical requirements or pretend authorization has already been granted.

## Consolidation instructions for Codex (Step 7)

1. **Synchronize and protect work.** Operate only on `lab7-architecture`; pull latest remote changes before editing. Do not modify, delete or overwrite Architecture #1, Architecture #2, the ChatGPT review, or the original requirement artifacts. Make a separate, clearly named consolidated document set. Do not modify application code.
2. **Record selection and scope.** Add an architecture decision record with chosen Architecture #2, alternatives considered, tradeoffs, student decision, unresolved scope approval, and migration away from Swing only if authorized. Reflect web-first plus actual separate Android/iOS app targets. A responsive website alone does not satisfy mobile-app delivery.
3. **Consolidate requirements.** Prepare `consolidated-requirements.md` traceable to baseline FR-001–FR-011, NFR-001–NFR-006 and CR-01–CR-10. Preserve account/group membership, explicit participant selection, equal/percentage splits with exact monetary totals, pending-before-approval, notifications, balances, recorded settlements (not bank transfers), optional images, reports/date ranges, validation and personal-data access. Mark platform and unresolved product policies as decisions pending approval, not settled facts.
4. **Consolidate architecture.** Prepare `consolidated-architecture.md` with component responsibilities, trust boundaries, data flows, error/consistency expectations, infrastructure, deployment topology and Mermaid component/deployment diagrams. Selected target: Flutter browser/Android/iOS clients, HTTPS API and session adapter, Java 21/Spring Boot backend and pure financial domain, PostgreSQL relational data plus append-only pair-obligation journal, private object storage for receipts, durable outbox worker and server inbox, OIDC identity integration. Treat vendor choices/dependency versions as proposals until confirmed.
5. **Consolidate design.** Prepare `consolidated-design.md` with logical class/domain model and UML class/activity diagrams where appropriate, entity relations, interface contracts, expense approval/payment transaction boundaries, split and journal invariants, duplicate/retry behavior, receipt staging/cleanup, notification delivery and access-control checks. Mark details not yet decided as TODO/decision gates instead of inventing defaults.
6. **Resolve existing document inconsistencies with explicit traceability.** Produce a decision/issue table explaining conflicts between the baseline desktop choices, customer web/mobile requirement, Architecture #1 and selected Architecture #2. Do not erase source history. Any modifications to governance/constitution or pre-existing decisions require human approval first; propose changes separately.
7. **Define verification.** Add `consolidated-validation.md` mapping each FR/NFR to test cases; include cents-sum, invalid inputs, group isolation, approval state, journal balance, idempotency, outbox retries, receipt authorization and web/Android/iOS delivery checks. These are planned tests, not executed test results.
8. **Check before completing.** Validate internal links and Mermaid syntax; check documents are consistent and complete. Provide a final summary of created files, unresolved approvals, and verification limitations. Keep all changes on the lab branch. Do not assert that any application code, tests or deployment exists.

## Open decisions / implementation gates

- Student selection of Architecture #2 is recorded, but responsible reviewer must approve changing the recorded Swing project direction and any scope/cost/timeline effects.
- Exact group/account visibility, membership changes, reviewer eligibility, enrollment/identity provider and user access policy.
- Residual-cent allocation for uneven splits, precision/currency, reversals, payment edge cases and reporting date semantics.
- Receipt limits/retention and secure deletion; notification channel and expectations; operational targets for recovery, accessibility, load and availability.
- Provider/runtime versions, hosted environment, iOS/Android build and distribution procedures, budget and security review.

## Completion criteria

The five new consolidated artifacts (decision record, requirements, architecture, design, validation) exist on branch `lab7-architecture`; each is linked from an index/README; architecture source and comparison remain intact; contradictions and unknowns are explicitly marked; there are no claims that an unimplemented application has passed tests. Commit and push the artifacts for Lab 7 repository-link submission.
