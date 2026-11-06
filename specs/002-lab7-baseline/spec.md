# Feature Specification: Lab 7 SplitSmart Baseline

**Feature Branch**: `lab7-architecture`

**Created**: 2026-11-05

**Status**: Draft baseline; ready for architecture planning with recorded limitations

**Input**: Analyze the existing Lab6CIS285 workspace and document existing features, functional and nonfunctional requirements, and system boundaries without inventing features or modifying application code.

## User Scenarios & Testing *(mandatory)*

This is a baseline of the existing project record, not a claim that an application exists. Inspection found requirements, principles, an earlier specification, and an empty solution with no project entries. No application sources, application build descriptor, executable entry point, automated application tests, persistence configuration, or architecture artifacts were found outside tooling/editor metadata. All product capabilities below are **documented requirements, implementation unverified**. Acceptance scenarios describe the documented intended behavior; none was executed against a running application.

### User Story 1 - Access personal accounts and groups (Priority: P1)

As a person sharing expenses with friends, roommates, family, or coworkers, I need my own account and groups containing registered users so I can organize shared costs.

**Why this priority**: Accounts and group membership identify whose expenses and balances are involved.

**Independent Test**: With registered users available, create a group, add members, and verify membership separately from expense participation. Product test is pending implementation.

**Acceptance Scenarios**:

1. **Given** a person without an account, **When** they create an account and log in, **Then** they can access their own expense and balance information. (FR-001)
2. **Given** registered users, **When** a user creates a group and adds selected registered users, **Then** the group contains those members. (FR-002)
3. **Given** a group containing three members, **When** an expense selects only two members, **Then** only those selected members participate in that expense. (FR-003)

### User Story 2 - Record valid expenses and split costs (Priority: P1)

As a payer, I need to record an expense and select its participants and split method so the intended people share the correct amount.

**Why this priority**: Valid expense data and accurate shares underpin balances.

**Independent Test**: Enter equal and percentage expenses with selected participants; verify accepted fields, totals, and rejected invalid inputs. Product test is pending implementation.

**Acceptance Scenarios**:

1. **Given** a group, **When** a member creates an expense, **Then** it records amount, date, description, split method, selected participants, and an optional receipt image; the creator is the payer by default. (FR-003, FR-004)
2. **Given** an expense of 30.00 with three selected participants, **When** it is split equally, **Then** each share is 10.00. (FR-005)
3. **Given** an expense of 40.00 with shares of 25% and 75%, **When** it is split by percentage, **Then** the shares are 10.00 and 30.00. (FR-005)
4. **Given** an expense of 10.00 split equally among three people, **When** shares are rounded to cents, **Then** the final shares total exactly 10.00; the recipient of any residual cent is unspecified. (FR-005, NFR-001)
5. **Given** a negative, zero, or blank amount, missing or duplicate participants, or percentages totaling other than 100%, **When** saving is attempted, **Then** the expense is rejected before saving and a clear validation message is shown. (FR-006)

### User Story 3 - Review expenses and track balances (Priority: P1)

As a group member, I need new expenses reviewed before they change balances so amounts owed reflect approved expenses.

**Why this priority**: Approval controls when financial effects become visible.

**Independent Test**: Create a pending expense, inspect balances, approve it, and inspect balances again. Verify notification of other group members. Product test is pending implementation.

**Acceptance Scenarios**:

1. **Given** an expense is newly created, **When** its status and balances are viewed, **Then** it is pending and has no effect on balances. (FR-008)
2. **Given** a new group expense, **When** it is created, **Then** other group members are notified; channel and delivery timing are unspecified. (FR-007)
3. **Given** a pending expense, **When** it completes the single approval step, **Then** balances reflect its payer, selected participants, and split amounts. Approver eligibility is unspecified. (FR-008, FR-009)

### User Story 4 - Record settlements and review history (Priority: P2)

As a user, I need to record payments and review expenses, balances, and payments so I can see what remains owed.

**Why this priority**: Settlement records and summaries make ongoing shared costs understandable.

**Independent Test**: Record a payment against a known balance and compare the updated balance and report to the recorded activity. Product test is pending implementation.

**Acceptance Scenarios**:

1. **Given** one person owes another 20.00, **When** a payment of 5.00 settling that debt is recorded, **Then** the remaining amount owed is 15.00. (FR-010)
2. **Given** recorded expenses, balances, and payments, **When** a user requests a report or summary, **Then** it presents the relevant recorded information. (FR-011)
3. **Given** records inside and outside a chosen date range, **When** a report is filtered by that range, **Then** it includes matching records. Other filter types and date-boundary rules are unspecified. (FR-011)

### Edge Cases

- Uneven cent splits must preserve the original total; residual allocation is not defined in the existing decisions.
- Group membership does not imply participation in every expense. Treatment of later membership changes is unspecified.
- Pending expenses must not change balances. Rejection, cancellation, repeated approval, expense editing, and deletion rules are unspecified.
- The receipt is optional. File size, formats, storage, and retention are unspecified.
- Zero, blank, and negative amounts, missing participants, duplicates, and non-100% percentage totals are explicitly invalid. Rules for negative individual percentages are not explicitly documented.
- Overpayments, self-payments, refunds, currencies, conversion, notification failures, and simultaneous updates have no documented behavior; this baseline does not add it.

## Requirements *(mandatory)*

### Functional Requirements

All requirements in this section are documented intentions with no verified implementation in this workspace. Existing identifiers are preserved in source references rather than implying completion.

| ID | Documented requirement | Existing source | Acceptance |
| --- | --- | --- | --- |
| FR-001 | The system shall support individual accounts and login to access the user's own expenses and balances. | UserRequirement.md: accounts; requirements.md: CR-01, acceptance criteria | Story 1.1 |
| FR-002 | Users shall create and manage groups, adding members selected from registered users. Other management operations are unspecified. | requirements.md: CR-02, D-02 | Story 1.2 |
| FR-003 | Each expense shall identify its payer and explicitly selected group participants; the creator is payer by default and group membership remains distinct from participation. | requirements.md: D-01, D-02 | Stories 1.3, 2.1 |
| FR-004 | Users shall create expenses with amount, date, description, equal or percentage split method, and an optional receipt image. | UserRequirement.md: expense creation; requirements.md: CR-03 | Story 2.1 |
| FR-005 | The system shall calculate equal and percentage shares, round to cents using half-up rounding, and preserve the original expense total after rounding. | requirements.md: D-03, FR-05 | Stories 2.2-2.4 |
| FR-006 | The system shall reject invalid expenses before saving, including negative, zero, or blank amounts, missing or duplicate participants, and percentages not totaling exactly 100%, with clear messages. | requirements.md: D-04; constitution: validation | Story 2.5 |
| FR-007 | The system shall notify other group members when a new group expense is created. | UserRequirement.md: notification; requirements.md: CR-05 | Story 3.2 |
| FR-008 | New expenses shall begin pending and require a single approval step before affecting balances. | requirements.md: D-05 | Stories 3.1, 3.3 |
| FR-009 | The system shall track and display balances owed from each user to other users, reflecting approved expenses and recorded settlements. | requirements.md: CR-07, FR-09; constitution: balance flow | Stories 3.3, 4.1 |
| FR-010 | Users shall record payments made to settle balances, and those records shall update amounts owed. Recording does not imply transferring funds. | UserRequirement.md: payment tracking; requirements.md: CR-08 | Story 4.1 |
| FR-011 | The system shall provide reports and summaries of expenses, balances, and payments. Date ranges are included in the existing consolidated requirements; other filters and advanced customization remain unspecified. | requirements.md: CR-09; earlier spec: sections 3, 8 | Stories 4.2-4.3 |

### Nonfunctional Requirements

These are existing quality requirements or constraints, not measured properties of a running system.

- **NFR-001 — Financial accuracy**: Monetary results shall be deterministic, rounded to cents using half-up rounding, with split totals equal to the expense amount. Verify using Story 2 examples and repeated identical inputs. Source: requirements.md D-03; constitution III.
- **NFR-002 — Understandable validation**: Each documented invalid-input category shall produce a clear user-facing error before saving. Verify Story 2.5 for each category. Source: requirements.md D-04.
- **NFR-003 — Personal data access**: Users shall access only their own account data as required by the existing acceptance criteria. The policy for shared group information and enforcement mechanism are unspecified; no security verification exists. Source: requirements.md section 5.
- **NFR-004 — Maintainability**: Input/display responsibilities shall be separated from validation, calculations, and balance rules. Verify responsibility separation during architecture review. Source: constitution IV.
- **NFR-005 — Traceability and review**: Requirements and design artifacts shall be traceable to customer requirements or recorded decisions; generated artifacts require human review before acceptance. Verify trace links and review record. Source: constitution V and Governance.
- **NFR-006 — Platform direction, unresolved constraint**: The customer requires primary web use plus Android and iOS apps, while project decisions specify a desktop interface and the earlier specification excludes full mobile deployment. These statements are not evidence of delivered platform support. Architecture planning must explicitly record the conflict and seek a scope decision before platform implementation. Source: UserRequirement.md OS supported; requirements.md CR-10 and section 3; earlier spec section 8.

No documented response-time target, concurrent-user capacity, availability target, backup/recovery objective, accessibility standard, retention period, or supported browser/device version was found. None is invented here.

### Key Entities *(include if feature involves data)*

These are concepts in the requirements, not existing classes or storage structures.

- **User/account**: An individual who accesses personal expense and balance information and can belong to groups. Credential and profile fields are unspecified.
- **Group/membership**: A collection of registered users for tracking shared expenses; membership is separate from expense participation.
- **Expense**: Amount, date, description, split method, optional receipt image, payer, selected participants, and approval state.
- **Participant share**: A selected user's allocated portion, equal or based on a specified percentage; monetary portions total the expense amount.
- **Approval**: The single review step moving an expense from pending to approved; reviewer permissions are unspecified.
- **Balance**: Amount owed between two users after approved expenses and settlements.
- **Payment**: A recorded settlement between users that changes a balance; detailed fields are unspecified.
- **Notification**: Notice to other group members of a newly created expense; transport and persistence are unspecified.
- **Report/summary**: A view of expenses, balances, and payments, with date-range selection in the consolidated requirements; storage is not implied.

### System Boundaries

- **Inside the intended product**: Account access, groups and membership, expense entry and validation, participant splits, notification of new expenses, single-step approval, user-to-user balances, payment recording, and reports/summaries.
- **Human actors**: Individual account holders, group members, expense creators/payers, participants, payment recorders, and an expense reviewer. These describe responsibilities, not an invented role hierarchy; reviewer eligibility is unresolved.
- **Inputs**: Account and group information, expense fields, selected participants, percentage shares, optional receipt images, approval actions, payment records, and report selections.
- **Outputs**: Personal expense/balance views, validation messages, membership records, pending/approved expense status, new-expense notices, updated balances, and reports.
- **External to the documented product**: Actual transfer of money. The request supports recording payments; it defines no payment provider or banking connection.
- **No established integrations**: No identity provider, notification delivery service, database, receipt store, hosting service, or external contract is configured in application files. Architecture must not describe any as already present.
- **Earlier specification exclusions**: Production-grade multi-role security beyond basic accounts, real-time external push notifications, full mobile deployment, and advanced reporting customization. These are recorded project-version exclusions, not cancellation of conflicting customer requirements.
- **Current deliverable boundary**: Specification and its validation checklist only. Application implementation, architecture generation, new product behavior, and changes to previous requirements are outside this invocation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

These criteria assess baseline completeness and documented acceptance outcomes; they do not claim executed product tests or invent operational targets.

- **SC-001**: All 10 existing customer requirements are accounted for: CR-01 through CR-09 by FR-001 through FR-011, and CR-10 by the explicit platform conflict in NFR-006.
- **SC-002**: Every one of the 11 functional requirements has a source reference, an acceptance scenario, and the explicit implementation-unverified status.
- **SC-003**: The documented calculation examples yield 10.00 per person for 30.00/3, 10.00 and 30.00 for 25%/75% of 40.00, and shares totaling 10.00 for 10.00/3; these are expected results awaiting implementation tests.
- **SC-004**: All six invalid-input categories (negative, zero, blank, missing participants, duplicate participants, non-100% percentage total) have rejection and clear-message acceptance coverage.
- **SC-005**: Reviewers can identify from this document the approval boundary, settlement effect, external money-transfer boundary, and platform conflict without assuming any deployed feature. Human acceptance remains pending review under the constitution.
- **SC-006**: The baseline introduces zero application-code changes and zero claims of successfully executed application tests.

## Assumptions

- The supplied workspace is the complete available evidence for this analysis. Missing code may exist elsewhere, but no external repository or absent application is assumed.
- Lab 7 begins with requirements and first-architecture preparation. The earlier spec's present-tense feature descriptions express intentions rather than verified working functionality.
- Sources take precedence over industry defaults: no authentication method, persistence approach, notification channel, reviewer policy, or performance target is added.
- Existing decisions specify monetary precision and total preservation but not residual-cent allocation. Acceptance examples deliberately avoid deciding that missing rule.
- Product test scenarios are acceptance definitions, not completed tests. Documentation inspection was the validation method used for this baseline.

### Evidence and Planning Handoff

| Artifact inspected | Finding and use |
| --- | --- |
| UserRequirement.md | Original customer request for all 10 capability/platform areas. |
| requirements.md | Consolidated requirements, five clarified decisions, acceptance criteria, and separate implementation choices. |
| SplitSmartPrinciples.md | Clarified behavior, engineering choices, and traceability expectations. |
| specs/001-splitsmart/spec.md | Earlier intended feature set and classroom-version exclusions; retained unchanged. |
| .specify/memory/constitution.md | Financial correctness, separation of concerns, explicit clarification, traceability, and human-review governance. |
| Lab6CIS285.sln | Solution metadata only; contains no project declarations and establishes no runnable application. |
| Workspace file inventory and tracked-file inventory | No application source/build/test artifacts found. Spec Kit scripts, agent skills, editor metadata, and module cache are tooling rather than SplitSmart functionality. |

The active template resolves to `.specify/templates/spec-template.md`: no project overrides or installed presets were present. The resolver script could not execute under Windows execution policy, so its resolution rules and available directories were inspected directly. No `.specify/extensions.yml` exists; neither pre- nor post-specification hooks are registered.

Existing engineering choices remain in the constitution and principles: Java 21, Maven, a Swing desktop interface, JUnit 5, PlantUML, decimal money representation, and object-oriented modeling. These are recorded constraints for architecture planning, not evidence of implemented components or new design decisions made by this baseline.

Architecture planning may proceed from these documented requirements. Before implementing affected behavior, resolve the platform scope conflict, account/shared-data access rules, reviewer eligibility, rounding residual allocation, report date boundaries and filters, notification expectations, and payment edge cases through recorded decisions. No architecture is prescribed here and no source document is superseded.
