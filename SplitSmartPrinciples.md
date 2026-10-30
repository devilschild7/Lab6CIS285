# SplitSmart Engineering Principles

This document is based on `UserRequirement.md` as the original customer request for SplitSmart. It separates the customer’s requirements from the implementation decisions chosen for the project.

## 1) Customer requirements from `UserRequirement.md`

The following are customer-facing requirements. They describe what the product must do, not how the team must implement it.

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

These are customer requirements. They are intentionally independent of Java, Swing, Maven, or testing frameworks.

## 1.1 Clarified project decisions from requirement review

The following decisions were confirmed during the clarification process and are now part of the project-level specification for SplitSmart. They resolve ambiguous behavior without changing the original customer request in `UserRequirement.md`.

- D-01: Expense payer and participants
  - Decision: The user who creates the expense is the payer by default.
  - The payer may explicitly select which group members are participants in that expense.
  - The payer is not required to be the only participant.
  - Traceability: Supports CR-03 and CR-04.

- D-02: Group membership
  - Decision: Groups are created by users and contain members selected from registered users.
  - Expenses are shared only among the members selected for that specific expense.
  - Group membership is not assumed to include all users in every expense.
  - Traceability: Supports CR-02 and CR-04.

- D-03: Money rounding
  - Decision: All monetary values use `BigDecimal`.
  - Currency is rounded to the nearest cent using standard half-up rounding.
  - The final total of a split must equal the original expense amount after rounding.
  - Traceability: Supports CR-03, CR-07, and CR-08.

- D-04: Invalid amounts and percentage totals
  - Decision: The system must reject invalid input before saving it.
  - Examples include negative amounts, zero or blank amounts, missing participants, duplicate participants, and percentage totals that do not add to 100%.
  - Validation errors must be shown to the user in plain language.
  - Traceability: Supports CR-03 and CR-04.

- D-05: Approval workflow
  - Decision: The project uses a single approval step.
  - New expenses are created in a pending state and do not affect balances until approved.
  - This matches a classroom-friendly workflow without requiring multiple approval roles.
  - Traceability: Supports CR-06 and CR-07.

### 1.2 Updated requirement interpretation

The customer request is satisfied through the following clarified behavior:

- A user with an account can create a group and add other registered users as group members.
- An expense is created by a payer and includes a date, description, amount, split method, and optional receipt image.
- The expense includes selected participants for that expense.
- The system validates invalid data before saving.
- Approved expenses adjust balances using `BigDecimal` rounding rules.
- Pending expenses do not affect balances.
- Group members are notified when a new expense is created.

These clarifications are project decisions that make the original requirements implementable and testable in a classroom project, while leaving `UserRequirement.md` unchanged.

## 2) Implementation decisions and project principles

The following are not customer requirements; they are project decisions chosen to satisfy the requirements in a maintainable, testable, and reviewable way.

### 2.1 Java 21

- Decision: Use Java 21 as the implementation language.
- Principle: Prefer Java 21 features that improve clarity, safety, and maintainability while remaining compatible with the course environment.
- Purpose: Supports modern OO design, better language features, and a robust platform for business logic and GUI code.
- Traceability: Supports CR-01 through CR-09 by enabling a strong foundation for domain modeling and application structure.

### 2.2 Maven

- Decision: Use Maven as the build and dependency management tool.
- Principle: All dependencies, test configuration, and application packaging must be declared in `pom.xml`.
- Purpose: Ensures repeatable builds, consistent dependency versions, and clear project structure.
- Traceability: Supports all requirements by making the project reproducible and easier to review.

### 2.3 Java Swing

- Decision: Use Java Swing for the desktop user interface.
- Principle: Swing is the GUI framework for the application interface; the GUI is an interaction layer, not the core of the business logic.
- Purpose: Allows a Java desktop implementation that is straightforward to build and run in a classroom and lab setting.
- Important distinction: Swing is an implementation choice, not a customer requirement. The customer requirement is a usable application that manages expenses and balances; the chosen UI technology is a project decision.
- Traceability: Supports CR-01 through CR-09 at the presentation layer.

### 2.4 JUnit 5

- Decision: Use JUnit 5 for automated tests.
- Principle: Test business logic and domain rules with JUnit 5. Keep tests focused on correctness and maintainability.
- Purpose: Validation of split calculations, balance rules, approval logic, and payment tracking.
- Standard: Tests should be deterministic, small, and tied to requirements.
- Traceability: Requirements CR-03, CR-04, CR-06, CR-07, CR-08, and CR-09 should have direct or indirect automated test coverage.

### 2.5 PlantUML

- Decision: Use PlantUML for architecture and design diagrams.
- Principle: Diagrams are part of the design record and must correspond to actual code structure and requirements.
- Purpose: Communicate use cases, classes, and interactions clearly for reviewers and maintainers.
- Standard: PlantUML diagrams should be maintained alongside the code and updated when requirements or architecture change.
- Traceability: Helps map business flows and domain objects to requirements, especially CR-02, CR-03, CR-06, CR-07, and CR-08.

### 2.6 Object-oriented design

- Decision: Model the system using object-oriented design principles.
- Principle: Use classes and responsibilities that reflect real domain concepts such as `User`, `Group`, `Expense`, `Payment`, `Balance`, and `Approval`.
- Purpose: Improves maintainability, extensibility, and clarity.
- Standards:
  - Classes should have a single purpose.
  - Behavior belongs with the domain object or a dedicated service where appropriate.
  - Reuse common logic through methods and shared abstractions.
- Traceability: Supports all customer requirements by organizing the implementation around the domain rather than UI widgets.

### 2.7 Separation of GUI and business logic

- Decision: Keep the Swing interface separate from business rules and domain logic.
- Principle: The GUI should collect input, show results, and trigger actions; business logic should live in domain/model/service classes.
- Purpose: Prevents the UI from becoming the repository of calculations and rules, which would make testing and maintenance harder.
- Standard:
  - Swing panels and dialogs should not directly perform complex balance calculations.
  - Domain services should handle expense validation, split rules, approval, and balance updates.
  - UI code should delegate to service methods and display results.
- Traceability: Directly supports CR-03, CR-04, CR-06, CR-07, CR-08, and CR-09.

### 2.8 BigDecimal for money

- Decision: Use `BigDecimal` for all monetary values.
- Principle: Money must be represented using `BigDecimal` to avoid floating-point errors and maintain predictable rounding behavior.
- Purpose: Ensures correct calculation for expense amounts, balances, and payment settlements.
- Standard:
  - Use exact decimal values instead of `double`.
  - Define rounding strategy explicitly when needed.
  - Keep monetary values consistent across the domain and UI.
- Traceability: Essential for CR-03, CR-07, CR-08, and CR-09.

### 2.9 Requirement traceability

- Decision: Maintain explicit traceability between requirements and implementation artifacts.
- Principle: Every customer requirement should be traceable to a design decision, class, test, or user interaction.
- Purpose: Makes review easier and helps confirm completeness.
- Standard:
  - Keep a requirement list such as CR-01 through CR-10.
  - Map each requirement to relevant classes, methods, tests, and UI flows.
  - Update traces when the system changes.
- Example traceability:
  - CR-03: Expense creation -> `Expense`, `ExpenseService`, Swing form, JUnit tests
  - CR-07: Balance tracking -> `BalanceCalculator` or equivalent, domain model, tests
  - CR-06: Approval workflow -> approval service, status model, tests
- Traceability is a project practice, not a customer requirement.

### 2.10 Human review of AI output

- Decision: Treat AI-generated code, tests, and diagrams as drafts that require human review.
- Principle: AI output must be checked for correctness, quality, design fit, and requirement traceability before acceptance.
- Purpose: Reduces mistakes, prevents incorrect assumptions, and ensures the solution meets the original customer request.
- Standard:
  - Review AI output for requirement alignment.
  - Verify calculations, structure, and test quality.
  - Confirm that generated diagrams reflect the actual implementation.
  - Reject or revise output that is untraceable, misleading, or not aligned with the domain.
- Traceability: This principle applies to every requirement and every implementation artifact.

## 3) Requirement-to-implementation summary

Customer requirements (must-haves):
- User accounts
- Group management
- Expense creation with split rules and optional receipt image
- Expense involvement tracking
- Notifications
- Approval workflow
- Balance tracking
- Payment tracking
- Reporting
- Web and mobile support

Implementation decisions (chosen approach):
- Java 21
- Maven
- Java Swing desktop GUI
- JUnit 5 testing
- PlantUML diagrams
- OO domain modeling
- GUI/business separation
- `BigDecimal` for money
- Requirement traceability
- Human review of AI-generated work

## 4) Final principle statement

The project must satisfy the customer’s original SplitSmart request while using a disciplined engineering approach. The customer states what the system should do; the project team decides how to build it. All implementation choices must remain traceable to the customer requirements and must be reviewed by a person before being accepted.
