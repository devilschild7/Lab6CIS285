# Quickstart and Validation Guide — Architecture #1

Status: proposed design review and future validation guide. There is no runnable SplitSmart application, pom.xml, entry point, schema or test suite in the inspected workspace. Do not run future build commands as though implementation exists.

## Available Now: Documentation Review

Prerequisites: repository checkout and a Markdown reader. Optional: PlantUML renderer for the source diagram; no renderer was installed or run here.

From the repository root, these read-only PowerShell commands inspect the proposal:

```powershell
Get-Content -LiteralPath '.specify/feature.json'
Get-Content -LiteralPath 'specs/002-lab7-baseline/plan.md'
Get-ChildItem -LiteralPath 'specs/002-lab7-baseline' -Recurse -File
Get-Content -LiteralPath 'Lab6CIS285.sln'
git status --short
```

Expected: feature pointer selects specs/002-lab7-baseline; seven new design files are present (plan, architecture, research, model, contracts, quickstart and PlantUML source); solution has no project declaration. Existing unrelated working-tree changes may already be present. No executed application test or delivered feature should be inferred.

Review in order: [baseline](spec.md), [Architecture #1](architecture-1.md), [decision register](research.md), [data model](data-model.md), [contracts](contracts/application-contracts.md). Verify every FR/NFR has an owner and planned validation in the architecture matrix. Compare proposed technology with the original principles and constitution. Render diagrams/architecture-1.puml if a suitable renderer is available; rendering is an optional review check, not evidence of application behavior.

## Decision Gate Before Implementation

Record and review answers U-01 through U-10. Highest priority: platform direction, personal/shared-data permissions, reviewer eligibility, residual cents, settlement/currency policy and report dates. Obtain human architecture acceptance. A desktop-only decision must explicitly acknowledge CR-10 remains unmet/deferred; do not merely mark the gate passed because desktop is easier.

## Future Build and Run — Not Runnable Yet

Prerequisites after implementation: accepted decisions, JDK 21, Maven installation/wrapper, pinned dependencies/plugins, a populated pom.xml, application entry point and JUnit tests. Build configuration must provide executable JAR packaging including runtime dependencies. Use an isolated test data directory outside source/sync folders; never run validation against real personal data.

Proposed commands, only after those artifacts exist:

```powershell
java -version
mvn -version
mvn clean verify
mvn package
java -jar target/splitsmart.jar
```

Expected after implementation: Java reports version 21; Maven uses that JDK; verify executes defined unit/integration/contract checks; package produces the explicitly configured target/splitsmart.jar including declared dependencies; launch opens the desktop application against configured local storage. Packaging name, integration-test execution and Main-Class must be configured in future work. Today these commands cannot establish acceptance and may fail because files/tools are absent. Do not create placeholder success outputs.

## Future End-to-End Scenarios

Use fresh fixture accounts A, B and C and an isolated group. Policies below must be settled first. Contract names and result categories are defined in contracts/application-contracts.md; persistence invariants in data-model.md.

| Check | Action after implementation | Expected outcome / gate |
| --- | --- | --- |
| Account/group | Register/login, create group, add B/C, logout/switch actor | Correct identity and authorized visibility; U-02 policy enforced |
| Participant subset | Group A/B/C; expense selects only A/B | C receives no allocated share |
| Equal split | Create 30.00 with three participants | Three 10.00 shares, PENDING, balances unchanged |
| Percentage split | Create 40.00 at 25%/75% | Shares 10.00/30.00, total 40.00 |
| Residual split | Create 10.00 for three participants | Exact total 10.00 and accepted U-04 allocation; no arbitrary tie-breaker |
| Invalid input | Try negative/zero/blank amount, missing/duplicate participants, non-100% total | Clear errors, no expense/share/image/notice persisted |
| Approval | Approve as eligible reviewer, then retry/concurrently submit stale version | One approval/effect; unauthorized actor denied; U-03 |
| Notices | Create expense, switch to another group member in same store | Notice according to U-06; no claim of cross-device delivery |
| Settlement | Establish 20.00 owed, record 5.00 payment, retry same command | 15.00 owed; single payment row; U-07 exceptional cases covered separately |
| Reports | Add records on/inside/outside date boundaries | Selected activity/balances match accepted U-08 semantics |
| Receipts | Save with/without allowed image; try disallowed/oversized image | Optionality and accepted U-09 limits; authorized access only |
| Failure/restart | Inject mid-write failure, then restart after successful save | No partial failed transaction; committed data persists |
| Isolation | Query/mutate using unrelated account and stale sessions | U-02 denial and no information leakage |
| Concurrent finance | Submit payment using stale group revision while approval commits | Conflict/reload, no duplicate or inconsistent financial effect |

For failure and concurrency checks, use future integration harnesses rather than deleting/corrupting real files. Record actual test command, environment, dataset, expected/actual results and remaining failures. Do not claim acceptance from architecture review alone.

## Quality and Deployment Validation

After implementation, measure save/report responsiveness with explicit dataset and workstation details; thresholds require U-10. Verify event dispatch thread stays responsive during storage work. Test private data-directory permissions, consistent backup/restore, startup on schema mismatch and safe shutdown. These checks provide evidence, not production guarantees. If U-01 selects web/mobile, replace desktop launch and deployment checks with a revised server/client plan and new network contracts.
