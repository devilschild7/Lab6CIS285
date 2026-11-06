# Implementation Plan: Architecture #1 — SplitSmart

**Branch**: `lab7-architecture` | **Date**: 2026-11-05 | **Spec**: [Lab 7 baseline](spec.md)

**Input**: `specs/002-lab7-baseline/spec.md`, original requirements, principles, constitution, earlier specification, solution and repository inventory.

**Status**: Complete proposed design package; pending human review. Implementation readiness is BLOCKED on the decisions recorded in research.md. No application functionality, deployment or tests have been verified.

## Summary

Architecture #1 proposes a layered Java desktop modular monolith following the recorded classroom choices. Swing calls application services; domain rules implement financial behavior; JDBC adapters persist to a proposed embedded H2 database. Balances derive from approved expense shares and payments. In-app notices are proposed for accounts sharing the installation. No money-transfer integration is included.

This candidate does not satisfy CR-10's primary web experience and Android/iOS apps. It cannot be accepted as a complete customer solution without a recorded platform scope decision. The user requested a proposed architecture with unresolved requirements documented; this package is therefore conditional design, not a passing implementation gate.

Start with [architecture-1.md](architecture-1.md). Supporting documents: [research.md](research.md), [data-model.md](data-model.md), [application contracts](contracts/application-contracts.md), [quickstart.md](quickstart.md), and [PlantUML views](diagrams/architecture-1.puml).

## Technical Context

**Language/Version**: Java 21, an existing project decision; no Java application exists in the workspace.

**Primary Dependencies**: Swing, JDBC and BigDecimal from Java; proposed H2 driver. Maven, JUnit 5 and PlantUML are recorded project choices. Exact dependency/plugin versions must be pinned and compatibility verified during implementation.

**Storage**: Proposed embedded file-backed H2; relational records and receipt BLOBs in one transaction boundary. In-memory store for isolated tests only. No schema or migration currently exists.

**Testing**: Proposed JUnit 5 unit, application-contract and real-H2 integration tests, plus Swing acceptance checks. None exists or has run.

**Target Platform**: Conditional classroom desktop deployment on Java 21-capable workstations. Windows is the workspace environment; supported OS versions are unspecified. Web/mobile remains open.

**Project Type**: One Maven desktop application with package-level layers. No server, mobile project, network API or synchronization in this candidate.

**Performance Goals**: No numeric requirements exist. Measure save/report latency with dataset sizes and workstation configuration; acceptance thresholds require a requirement decision. Keep storage/report work off the Swing event dispatch thread.

**Constraints**: Decimal money, half-up cent rounding, total preservation, pending expense isolation, explicit participants, service access checks and human review. Unresolved policies remain implementation gates.

**Scale/Scope**: Proposed one local process/store per installation, multiple registered accounts using it sequentially. No production capacity, availability or cross-device collaboration claim.

## Constitution Check

| Principle | Before research | After design | Disposition |
| --- | --- | --- | --- |
| I. Customer fidelity | Implementation BLOCKED | Implementation BLOCKED | Desktop leaves CR-10 unmet; U-01 must resolve scope. |
| II. Explicit clarification | Affected implementation BLOCKED | Affected implementation BLOCKED | U-01 through U-10 remain written decisions to obtain. |
| III. Financial correctness | Design obligation | Addressed in proposal, untested | Exact decimals, immutable shares, transactions, derived balances; U-04 residual rule open. |
| IV. Separation of concerns | Design obligation | Addressed in proposal, untested | Presentation -> application -> domain; infrastructure implements ports. |
| V. Traceability and review | Review pending | Review pending | Coverage matrix, source references; human acceptance not recorded. |

Research resolves candidate technical choices and identifies business questions it cannot answer. Per the user's explicit request to document unresolved requirements, gate failures block implementation/release, not delivery of these architecture documents. No waiver is granted.

## Project Structure

### Documentation (this feature)

```text
specs/002-lab7-baseline/
  spec.md                         # existing, unchanged
  checklists/requirements.md      # existing, unchanged
  plan.md
  architecture-1.md
  research.md
  data-model.md
  contracts/application-contracts.md
  quickstart.md
  diagrams/architecture-1.puml
```

No tasks.md is generated in Phase 1 design.

### Source Code (repository root)

Observed: Lab6CIS285.sln has no project declarations; no application sources, build descriptor, entry point or tests were found. Tooling is not an application component.

Proposed future layout ONLY; no directories or files below were created:

```text
pom.xml
src/main/java/splitsmart/
  bootstrap/          # composition, configuration, entry point
  presentation/       # Swing views, presenters, background work
  application/        # use cases, authorization, transactions
  application/ports/  # repositories, policies, credentials, unit of work
  domain/             # validation, splits, approval, balances
  infrastructure/     # JDBC, credential and diagnostic adapters
src/main/resources/   # versioned schema and config defaults
src/test/java/splitsmart/
  domain/
  application/
  infrastructure/
  contracts/
```

**Structure Decision**: One deployable avoids distributed transactions and unnecessary services. Package boundaries preserve testability and later adapter replacement. The empty .sln does not establish a .NET application; future implementation introduces Maven separately.

## Complexity Tracking

| Conflict / gate failure | Why retained | Alternative and limitation |
| --- | --- | --- |
| Desktop versus customer web/mobile | Existing sources disagree; U-01 blocks acceptance | Declaring desktop sufficient drops CR-10; choosing web silently overrides Swing direction. |
| Local accounts versus distributed collaboration | Account requirements do not define deployment trust | Local store is simpler but gives no remote sharing or protection against host-file access. |

## Phases and Handoff

Phase 0: repository and primary technical documentation reviewed; independent research agent reviewed integrity, security and gates. Decisions remain proposals.

Phase 1: component/deployment views, model, contracts and validation guide generated. No application code, build descriptor or tests generated. setup-plan.ps1 -Json was attempted but blocked by Windows execution policy. The existing feature pointer and branch were read and the active local plan template copied manually. No override/preset directories or extensions.yml were present.

Next: human review, then recorded U-01 through U-10 decisions before affected implementation tasks. Dependency compatibility, security, packaging, migrations and acceptance execution are future work.
