# Research and Design Decisions — Architecture #1

Status: proposed, not approved changes to requirements. Research and independent design review completed 2026-11-05. Unknown business rules remain open as requested; research cannot authorize policy.

## Evidence and Technical Research

Inspected: baseline, original customer requirements, consolidated requirements, principles, constitution, earlier spec, solution, setup/resolution scripts, feature pointer and repository inventory. No runnable implementation, deployment or architecture was found. Branch: lab7-architecture. Feature: specs/002-lab7-baseline. No extension hooks, template overrides, presets or applicable AGENTS.md were found. Windows execution policy blocked setup-plan.ps1; the local active template was copied manually without changing policy.

Primary documentation checked:

- [Java 21 BigDecimal](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html): decimal arithmetic and explicit rounding. Design inference: use decimal text input and explicit normalization; total preservation still needs a residual rule.
- [Java 21 Swing](https://docs.oracle.com/en/java/javase/21/docs/api/java.desktop/javax/swing/package-summary.html): Swing threading constraints. Design inference: update views on event dispatch thread, perform storage/report work in workers.
- [H2 features](https://h2database.github.io/html/features.html): embedded JDBC operation and transactions. Design inference: candidate local transactional store; actual compatibility, durability settings and performance remain unverified.
- [Maven standard layout](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html): source/test/resource conventions used in the proposed tree.
- [JUnit 5 guide](https://docs.junit.org/5.14.0/user-guide/): reference for existing test-framework direction, not a dependency version pin.

No libraries were installed, benchmarks run, database created, tests executed or diagrams rendered. Exact versions/licenses are implementation review work. Research resolves candidate technology direction, not unresolved customer policy.

## ADR-01 — Platform (Conditional)

**Decision**: Propose a desktop classroom candidate preserving recorded Java/Swing choices; do not declare CR-10 satisfied.

**Rationale**: Original web/mobile requirement and desktop project direction conflict. Both must remain visible.

**Alternatives considered**: Web-first service (closer to CR-10, overrides Swing direction); parallel desktop/web/mobile (larger unapproved scope); treating Java portability as delivered mobile apps (unsupported).

**Consequence**: U-01 blocks platform implementation and complete acceptance. Conditional server/client path is documented in architecture-1.md.

## ADR-02 — Layered Single Deployable

**Decision**: One process with presentation, application, pure domain, ports, infrastructure and composition layers.

**Rationale**: Minimal local deployment complexity with testable rules and replaceable adapters.

**Alternatives considered**: Rules/SQL in Swing (violates separation); microservices (unjustified network complexity); multiple Maven modules (possible later, unnecessary initial overhead).

**Consequence**: Enforce boundaries by review/tests; this is not a distributed service.

## ADR-03 — Embedded Persistence (New Proposal)

**Decision**: File-backed H2 through JDBC; receipt BLOBs and metadata in the same transaction as expense data; explicit schema versions.

**Rationale**: Relational integrity and one transaction avoid orphan image-file recovery. Existing requirements select no database.

**Alternatives considered**: In-memory (history lost); JSON (manual integrity); SQLite (different driver); external database (installation burden); separate receipt files (requires cleanup/recovery design).

**Consequence**: Verify dependency versions, compatibility, backup and crash behavior later. U-09 sets image limits; data growth/performance is unmeasured.

## ADR-04 — Derived Balances / Atomic Mutations

**Decision**: Persist final shares, approval state and payment records; derive balances. Use transactions, expected versions, command IDs and proposed group financial revision checks.

**Rationale**: Avoid divergent mutable totals and double effects from repeated approval or submission.

**Alternatives considered**: Mutable balance table (drift); double-entry ledger (extra model beyond classroom scope); event sourcing (unnecessary infrastructure).

**Consequence**: Measure query costs. Netting/corrections depend on U-07; residual allocation depends on U-04. Proposed identifiers/revisions are technical safeguards, not new user features.

## ADR-05 — Local In-App Notices (Conditional)

**Decision**: Save notices transactionally with expense creation and query them for recipient accounts.

**Rationale**: No external provider configured; no notice for rolled-back expense.

**Alternatives considered**: Ephemeral popup (misses later sessions); email/push (new delivery dependencies).

**Consequence**: Same-store accounts only, no remote transport or delivery SLA. U-06 decides channel, recipients and read-state policy.

## ADR-06 — Service Authorization / Local Trust

**Decision**: Actor context plus policy checks on every command/query; replaceable credential-verifier adapter; no persisted plaintext passwords.

**Rationale**: UI hiding alone cannot enforce access; shared policy enforcement helps future service hosting.

**Alternatives considered**: UI-only checks (bypassable); invented administrator hierarchy (unsupported); external identity provider (not selected).

**Consequence**: U-02/U-03 settle account/password parameters and sharing/reviewer policies. Login cannot protect database files from the host OS user. No security compliance is claimed.

## Unresolved Requirements and Assumptions

Owners are proposed reviewer roles, not accepted assignments. Answers must be recorded before affected implementation. No deadline or business rule is invented.

| ID | Question | Planning candidate, not approved policy | Reviewer / impact |
| --- | --- | --- | --- |
| U-01 | Classroom desktop or primary web plus Android/iOS apps? | Desktop Architecture #1; server/client alternative described | Customer/course owner; platform implementation and full acceptance blocked |
| U-02 | Private versus shared data; login identifiers, password mechanism/parameters, registration/session rules? | Service/credential ports; absent policy fails closed | Customer/security reviewer; account and shared read/write policy blocked |
| U-03 | Who approves, can payer approve self, and what about rejection/retries? | Only PENDING -> APPROVED documented; duplicate guard proposed | Customer/group-policy owner; reviewer rights and other transitions blocked |
| U-04 | Residual cents, input precision, amount limits and percentage bounds? | Half-up cents/exact total; no tie-breaker chosen | Domain/customer reviewer; complete split policy blocked |
| U-05 | Group management, payer override, membership changes, expense edits/deletes? | Add registered members; preserve approved snapshots proposed | Customer; additional lifecycle behavior blocked |
| U-06 | Notification audience/channel/timing/read status/failures? | Same-store persisted in-app notice candidate | Customer; final notice contract blocked |
| U-07 | Currency, payment permissions, pair/group netting, overpayments/self-payments/refunds/corrections? | One agreed currency per store; group-local pair netting candidate, no conversion | Customer/domain reviewer; settlement rules blocked |
| U-08 | Filters, date inclusivity, current versus historical balance semantics? | Separate activity from balance-as-of meaning | Customer; final report queries blocked |
| U-09 | Receipt size/formats/access/retention; data directory and backup needs? | Transactional BLOB, private local directory outside synced checkout | Deployment/customer reviewer; receipt/operation policies blocked |
| U-10 | Latency/capacity, availability, accessibility, OS and distribution acceptance? | Measure candidate without numeric promises | Customer/course owner; quality/release signoff blocked |

Independent research agent review highlighted transactions, residual ambiguity, host-file trust, derived balances and local notice limitations; incorporated in the design. Technical candidates are documented, while these requirements remain explicit implementation gates under constitution II.
