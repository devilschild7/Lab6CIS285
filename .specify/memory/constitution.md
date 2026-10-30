# SplitSmart Constitution

## Core Principles

### I. Customer requirement fidelity
The product shall satisfy the original customer request in `UserRequirement.md` before any implementation choices are applied. Customer requirements describe what the system must do; project decisions describe how it will be built.

### II. Explicit clarification before implementation
Any ambiguous behavior must be resolved by written clarification decisions before implementation and testing. The project must not silently assume rules that are not stated in the requirements.

### III. Correct financial behavior
All money calculations shall use `BigDecimal` and explicit rounding rules. Expense totals, balances, and payment settlements must remain accurate and deterministic.

### IV. Separation of concerns
Business logic, validation, and balance calculations shall be kept separate from the UI. The interface may collect input and display results, but domain rules must live in model or service logic.

### V. Traceability and review
Every requirement, decision, and implementation artifact must be traceable to the original customer requirement or to a recorded project decision. AI-generated work must be reviewed by a person before acceptance.

## Additional Project Rules

### Group and expense model
- Users must have individual accounts.
- Users may create and manage groups.
- A group contains members selected from registered users.
- Each expense has a payer and may include selected participants.
- A group member is not automatically included in every expense.

### Validation and approval requirements
- Invalid amounts, duplicate participants, missing users, and incorrect percentage totals must be rejected before saving.
- Percentage splits must total 100%.
- Expenses must be approved before they affect balances.

### Balance and payment flow
- Approved expenses alter balances based on the selected split method.
- Payment tracking must reflect settlements accurately.
- Payments and expense adjustments must maintain a consistent balance view for each user.

## Governance

This constitution governs SplitSmart development work. Any change to the project’s interpretation of customer requirements or implementation decisions must be documented in writing, reviewed, and traceable to the original requirement set.

**Version**: 1.0 | **Ratified**: 2026-10-30 | **Last Amended**: 2026-10-30
