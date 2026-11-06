# Consolidated Validation Plan — Selected Architecture #2

Date: 2026-11-05. [Index](README.md), [requirements](consolidated-requirements.md), [architecture](consolidated-architecture.md), [design](consolidated-design.md), [decision gates](architecture-decision-record.md).

## Scope and evidence status

Documentation validation is distinct from application acceptance. No application implementation, test suite, hosted system or mobile binary is verified. All T-cases below are PLANNED / NOT EXECUTED. Business cases requiring open gates are BLOCKED pending their recorded answers, not failed tests. Document checks and their actual results appear separately at the end.

## Requirement-to-component-to-test traceability

Baseline scenario references use spec.md story numbering. C-IDs identify components in consolidated-architecture.md; class names identify the proposed logical model, not existing classes.

| Requirement | Original source | Component / class | Acceptance case | Baseline / open gates |
| --- | --- | --- | --- | --- |
| FR-001 | CR-01 | C-ID/C-EDGE/C-CMD; UserAccount | T-01 | Story 1.1; G-02 |
| FR-002 | CR-02 | C-CMD; ExpenseGroup/Membership | T-02 | Story 1.2; G-05 |
| FR-003 | CR-03/CR-04 | C-CMD/C-DOM; Expense/ParticipantShare | T-03 | Stories 1.3/2.1; G-05 |
| FR-004 | CR-03 | C-CMD/C-REC; Expense/Receipt | T-04 | Story 2.1; G-09 |
| FR-005 | CR-03/CR-07 | C-DOM; SplitPolicy/ParticipantShare | T-05 | Stories 2.2-2.4; G-04 |
| FR-006 | CR-03/CR-04 | C-DOM/C-UI; Expense validation | T-06 | Story 2.5 |
| FR-007 | CR-05 | C-WORK/C-DB; OutboxEvent/InboxNotice | T-07 | Story 3.2; G-06 |
| FR-008 | CR-06/CR-07 | C-CMD/C-DOM; Approval/JournalBatch | T-08 | Stories 3.1/3.3; G-03 |
| FR-009 | CR-07 | C-QRY; ObligationEntry/BalanceView | T-09 | Stories 3.3/4.1; G-07 |
| FR-010 | CR-08 | C-CMD; Payment/JournalBatch | T-10 | Story 4.1; G-07 |
| FR-011 | CR-09 | C-QRY; ReportView | T-11 | Stories 4.2/4.3; G-08 |
| NFR-001 | D-03/constitution III | C-DOM/C-DB; journal/source invariants | T-05/T-09/T-12 | G-04/G-07 |
| NFR-002 | D-04 | C-UI/C-CMD; safe errors | T-06 | Before save |
| NFR-003 | Personal-data acceptance | C-ID/C-CMD/C-QRY/C-REC; AccessPolicy | T-01/T-13 | G-02 |
| NFR-004 | Constitution IV | C-UI/C-DOM; dependency boundaries | T-14 | Proposed architecture review |
| NFR-005 | Constitution V | All design artifacts/review | T-15 | Human acceptance pending |
| NFR-006 | CR-10 | C-UI/C-EDGE and deployment | T-16 | G-01/G-10 |

All CR-01..CR-10 are covered above. Coverage means an identified planned check, not an implementation or passing result.

## Planned acceptance cases

| Case | Setup and action | Expected result | Method / status |
| --- | --- | --- | --- |
| T-01 | Register/login two fixture accounts through selected provider, view personal data, logout/reuse old session | Correct identity, approved visibility, revoked/expired sessions denied per G-02; credentials not exposed | Identity/API/UI integration; NOT EXECUTED |
| T-02 | Registered A/B/C; A creates group and adds B/C | Correct memberships, duplicates handled by reviewed policy; unrelated user cannot act | API/database; NOT EXECUTED |
| T-03 | Group A/B/C; create expense selecting only A/B | Creator default payer; C no share; membership distinct from participation | Domain/API; NOT EXECUTED |
| T-04 | Save required fields with/without valid staged image; attempt unrelated receipt attachment/download | Optionality retained; ownership/group/content/limit checks; unauthorized receipt denied; no public key exposure | API/object-store; G-09 BLOCKED, NOT EXECUTED |
| T-05 | Equal 30.00/3; 40.00 at 25/75%; 10.00/3 repeated with fixed input | 10.00 each; 10.00/30.00; exact 10.00 total and approved deterministic residual allocation | Domain/property tests; G-04 BLOCKED, NOT EXECUTED |
| T-06 | Independently try negative, zero, blank amount, absent/duplicate participants and total other than 100% | All six rejected before any expense/share/outbox/attachment is saved; clear safe field/message feedback | Parameterized API/UI/store; NOT EXECUTED |
| T-07 | Commit expense, stop/restart worker during processing, expire lease and replay event | Other-member inbox per approved audience; one event/recipient notice, no notice for rollback; unauthorized detail hidden | Worker/database fault injection; G-06 BLOCKED, NOT EXECUTED |
| T-08 | Create pending expense; approve as allowed reviewer; race/retry approval with stale version/unrelated actor | Pending zero postings; one approved state/batch/effect atomically; others conflict/deny | API/database concurrency; G-03 BLOCKED, NOT EXECUTED |
| T-09 | Post reviewed expense debt 20.00, payer-participant/nonparticipant cases, pair queries | Canonical sign correct, no self-debt, no pending debt, source postings reconcile | Domain/SQL snapshot; G-07 BLOCKED, NOT EXECUTED |
| T-10 | Record 5.00 against 20.00 debt, retry same key and changed payload; timeout then query/retry | 15.00 remaining, one payment/batch; changed payload conflicts; no bank transfer | API/database; G-07 BLOCKED, NOT EXECUTED |
| T-11 | Fixtures before/on/inside/after date range and approval dates, accepted filters | Correct authorized rows/totals with agreed date/as-of semantics, not arbitrary timestamp filtering | Query integration; G-08 BLOCKED, NOT EXECUTED |
| T-12 | Fail writes mid expense/approval/payment, race finance commands, reconcile and restart | Whole transaction rollback, no approved-without-batch or duplicate source, consistent committed reads | Real PostgreSQL fault/concurrency tests; NOT EXECUTED |
| T-13 | Two unrelated groups/accounts; attempt ID tampering, report/receipt access, spoofed actor, missing CSRF cookie mutation | Server denies per approved policy, no data leak; app does not trust UI/token alone for permissions | Security/API/platform; G-02 BLOCKED, NOT EXECUTED |
| T-14 | Inspect dependency graph and test pure domain without network/UI/database | Financial rules independent of presentation/HTTP/JDBC; clients delegate authoritative work | Static review/domain tests; NOT EXECUTED |
| T-15 | Review requirement-to-design-to-test matrix and generated decisions | All 11 FR/6 NFR/10 CR represented; responsible human acceptance recorded before implementation | Human review; NOT EXECUTED / acceptance pending |
| T-16 | Build and run web, signed Android and iOS targets using shared hosted API | Actual separately verified clients, authorized cross-device views, agreed distribution; responsive site alone insufficient | Target-device acceptance; G-01/G-10 BLOCKED, NOT EXECUTED |
| T-17 | Race expired-stage cleanup with attachment, fail metadata after object upload, restore DB/objects | No committed attachment deleted, orphan reconciliation, referenced receipt restoration | Store/fault/recovery; G-09 BLOCKED, NOT EXECUTED |
| T-18 | Simulate DB/object/identity/worker failure and bounded load/accessibility review | Safe availability messages/retries, no duplicate finance, notices recover; measured targets only after approval | Operations/platform; G-10 BLOCKED, NOT EXECUTED |

## Future execution prerequisites

Record gated policies and human implementation approval, implement clients/API/schema/security, pin dependencies/providers and define environment/config/test fixtures. Use isolated test users, PostgreSQL and private object store, never real personal data. No current build/run command can prove acceptance: no application build descriptors, code or tests exist. Future execution records must include command/build, environment, dataset, expected/actual result and failures. Do not fabricate outputs or convert this matrix into passed tests.

Unit tests target money/sign rules; integration tests target actual PostgreSQL constraints/transactions and object lifecycle; API contracts target decimal serialization, authorization/errors and retries; web/Android/iOS tests target real delivery/accessibility; recovery tests restore database plus objects. No numeric performance or recovery thresholds are invented.

## Documentation verification record

The documentation checks below concern this consolidation set only; they are not application acceptance. Actual results will be recorded after validation. Mermaid parsing/rendering and PlantUML verification are reported separately. Preservation is checked by SHA-256 hashes of pre-existing baseline/design inputs. Git publication is checked independently and reported at completion.

### Actual documentation results (2026-11-05)

| Check | Actual result | Limit |
| --- | --- | --- |
| Synchronization/branch | lab7-architecture; pre-edit git pull --ff-only reported Already up to date | Remote publication checked at completion |
| Files/index | Five consolidated artifacts plus README index created separately | Existing historical files retained |
| Internal links/fences | All six new documents checked; local links resolve and Markdown fences balance | No live external-link availability guarantee |
| Requirement coverage | Requirements and validation contain all FR-001..FR-011, NFR-001..NFR-006 and CR-01..CR-10; matrix maps to components/classes and T-cases | Coverage is documentation, not implemented tests |
| Mermaid syntax | All four blocks parsed successfully with Mermaid 12.3.0 in temporary validator environment: component, deployment, class and activity view | Diagram images/browser rendering not verified |
| UML activity syntax | Official PlantUML jar -checkonly succeeded on extracted activity source | PlantUML image rendering/layout not verified |
| Source preservation | All 12 pre-existing files under baseline directory retain original SHA-256 hashes | No originals overwritten; includes both architectures, review, instructions, baseline and earlier supporting files |
| Application/governance preservation | git diff --name-only empty for tracked pre-existing files; only six named new docs are staged for this task | Unrelated pre-existing Microsoft directory excluded |
| Consistency review | #2 selected for documentation, #1 comparison; G-01/G-02..G-12 explicit; pending never posts, retries/source uniqueness and receipt recovery consistent across artifacts | Responsible human acceptance and implementation policies still pending |
| Product tests/deployment | NOT EXECUTED / NOT IMPLEMENTED | No application acceptance or delivery claim |

Temporary diagram tools were installed outside the repository; no application dependency/build file was added. Documentation validation does not close business/approval gates. Commit and push results are reported separately after publication; no application code is included in the commit.
