# SplitSmart Requirements

## 1. Source requirements
This document is based on the original customer request in `UserRequirement.md` and the clarified project decisions recorded in `SplitSmartPrinciples.md`.

### Customer-facing requirements from `UserRequirement.md`

- CR-01: The system must support multiple users with individual accounts.
- CR-02: Users must be able to create and manage groups for shared expenses.
- CR-03: Users must be able to create expenses including amount, date, description, split method (equally or by %), and optional receipt image.
- CR-04: Each expense must specify which users are involved so balances can be adjusted correctly.
- CR-05: The system must notify users when other group members create new expenses.
- CR-06: The system must include an approval workflow for expenses before they affect balances.
- CR-07: The system must track balances owed between users, considering all entered expenses.
- CR-08: The system must support payment tracking so users can record settlements and keep balances accurate.
- CR-09: The system must provide reports and summaries of expenses, balances, and payments, including date ranges and other filters.
- CR-10: The product must support primary web-based use and also have an app that runs on Android and iOS.

## 2. Clarified project decisions
These decisions resolve ambiguity without changing the original customer request.

- D-01: Expense payer and participants
  - The user who creates the expense is the payer by default.
  - The payer explicitly selects which group members are participants for that expense.
  - The payer is not required to be the only participant.

- D-02: Group membership
  - Users create groups and add members from registered users.
  - Group membership is tracked separately from the users selected for a specific expense.
  - Expenses are shared only among the members selected for that expense.

- D-03: Money rounding
  - All monetary values use `BigDecimal`.
  - Values are rounded to the nearest cent using standard half-up rounding.
  - The final split total must equal the original expense amount after rounding.

- D-04: Invalid amounts and percentage totals
  - Invalid inputs must be rejected before saving.
  - Examples include negative amounts, zero or blank amounts, duplicate participants, missing participants, and percentage totals that do not equal 100%.
  - Validation errors must be shown to the user with clear messages.

- D-05: Approval workflow
  - The system uses a single approval step.
  - New expenses are created in a pending state and do not affect balances until approved.

## 3. Implementation decisions (not customer requirements)
These are project-level choices made to satisfy the customer requirements in a maintainable way.

- Java 21
- Maven
- Java Swing for the desktop UI
- JUnit 5 for tests
- PlantUML for diagrams
- Object-oriented domain modeling
- GUI/business logic separation
- `BigDecimal` for monetary calculations
- Explicit requirement traceability
- Human review of generated output

## 4. Functional requirements summary

- FR-01: The system shall support multiple user accounts.
- FR-02: Users shall be able to create and manage groups.
- FR-03: Users shall be able to create expenses with amount, date, description, split type, and optional receipt image.
- FR-04: Each expense shall specify the payer and selected participants.
- FR-05: The system shall support equal splits and percentage splits.
- FR-06: The system shall validate invalid data before saving an expense.
- FR-07: The system shall notify users when new expenses are created in a group.
- FR-08: The system shall require approval before expenses affect balances.
- FR-09: The system shall calculate and display balances owed between users.
- FR-10: The system shall support payment tracking for settlements.
- FR-11: The system shall provide summaries and reports for expenses, balances, and payments.
- FR-12: The product shall support a web-based primary experience and Android/iOS app support in the product direction.

## 5. Acceptance criteria

- A user can create an account and access only their own account data.
- A user can create a group and add other registered users as members.
- An expense can be created by a payer with selected participants.
- Equal and percentage split calculations work correctly with `BigDecimal` rounding.
- Invalid expenses are prevented with clear validation messages.
- Pending expenses are not included in balances until approved.
- Approved expenses update user balances correctly.
- Settlements can be recorded and reflected in the system.
- Reports can be generated for expense, balance, and payment history.

## 6. Scope note
This requirement set preserves the original customer request while documenting the interpretation choices required for a classroom project. It does not change `UserRequirement.md`.
