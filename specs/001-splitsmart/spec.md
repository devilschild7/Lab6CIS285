# SplitSmart Feature Specification

## 1. Feature summary
SplitSmart is a shared expense management application for groups of users. It allows users to create accounts, manage groups, create expenses, validate split rules, approve expenses, track balances, record payments, and generate reports.

## 2. Background and source
This specification is derived from:
- `UserRequirement.md` as the original customer request
- `SplitSmartPrinciples.md` as the project interpretation and implementation decisions
- The five confirmed clarification decisions recorded for SplitSmart

## 3. Customer requirements (preserved from source)

- CR-01: Multiple users with individual accounts.
- CR-02: Group creation and management for shared expenses.
- CR-03: Expense creation with amount, date, description, split method, and optional receipt image.
- CR-04: Each expense must specify involved users so balances can be adjusted correctly.
- CR-05: Notification when group members create new expenses.
- CR-06: Approval workflow before expenses affect balances.
- CR-07: Balance tracking between users for all expenses.
- CR-08: Payment tracking for settlement records.
- CR-09: Reports and summaries for expenses, balances, and payments.
- CR-10: Primary web-based product with Android and iOS app support.

## 4. Clarified behavior

### 4.1 Payer and participants
- The user who creates the expense is the payer by default.
- The payer selects which group members are participants in the expense.
- The payer does not have to be the only participant.

### 4.2 Group membership
- Users create groups and add members from registered users.
- Expenses are shared only among the users selected for that specific expense.
- Group membership is tracked separately from the users involved in an individual expense.

### 4.3 Money handling
- All money values use `BigDecimal`.
- Monetary values are rounded to the nearest cent using standard half-up rounding.
- The final total of a split must equal the original expense amount after rounding.

### 4.4 Validation rules
- Negative amounts are rejected.
- Zero and blank amounts are rejected.
- Duplicate participants are rejected.
- Missing participants are rejected.
- Percentage totals must equal exactly 100%.
- Clear validation messages are shown to the user.

### 4.5 Approval workflow
- New expenses begin in a pending state.
- Pending expenses do not affect balances until approved.
- A single approval step is used for this classroom project.

## 5. Core user stories

### User story 1: User account access
As a user, I want a personal account so that I can access my own data and manage expenses safely.

### User story 2: Group management
As a user, I want to create and manage groups so that expenses can be shared with the right people.

### User story 3: Expense creation
As a payer, I want to create an expense with a selected set of participants and a valid split method so that balances are calculated correctly.

### User story 4: Validation
As a user, I want invalid split entries to be rejected before saving so that my totals and balances remain accurate.

### User story 5: Approval
As a group member, I want expenses reviewed before they update balances so that incorrect entries do not affect amounts owed.

### User story 6: Balance tracking
As a user, I want to see balances owed between users so that I know what is due and what has been paid.

### User story 7: Payment tracking
As a user, I want to record payments so that settled balances are reflected in the system.

### User story 8: Reporting
As a user, I want reports and summaries so that I can review expenses, balances, and payment history.

## 6. Requirements summary

### Functional requirements
- FR-01: The system shall support multiple user accounts.
- FR-02: Users shall be able to create and manage groups.
- FR-03: Users shall be able to create expenses with required fields and an optional receipt image.
- FR-04: Expenses shall include a payer and selected participants.
- FR-05: The system shall support equal and percentage split methods.
- FR-06: The system shall validate input before saving.
- FR-07: The system shall notify users when new expenses are created in their group.
- FR-08: The system shall include an approval step before expenses affect balances.
- FR-09: The system shall track user-to-user balances.
- FR-10: The system shall support payment settlement tracking.
- FR-11: The system shall provide reports and summaries.
- FR-12: The system shall support web-based use and mobile app direction for Android and iOS.

### Non-functional / implementation decisions
- Java 21 shall be used for implementation.
- Maven shall be used for build and dependency management.
- Java Swing shall be used for the desktop UI.
- JUnit 5 shall be used for automated tests.
- `BigDecimal` shall be used for all monetary calculations.
- Business logic shall be separated from the Swing interface.
- Requirement traceability shall be maintained.

## 7. Acceptance criteria
- A new user can create an account.
- A user can create a group and add members from registered users.
- A user can create an expense where the creator is the payer and selected members are participants.
- Equal and percentage splits are calculated correctly.
- Invalid amounts and invalid percentage totals are rejected.
- Pending expenses do not affect balances until approved.
- Approved expenses update balances correctly.
- Payment settlement records update the balance view.
- Reports present current expense and payment information.

## 8. Out of scope for this project version
- Full production-grade multi-role authentication and authorization beyond basic user/account management
- Real-time push notifications across external systems
- Full multi-platform mobile app deployment
- Advanced reporting customization beyond project-level requirements

This specification preserves the original customer requirements while documenting the clarified project decisions required for a classroom implementation.
