---
name: ticket-yes-no
description: 'Final quality gate for completed ticket work. Use when asked to "yes or no the ticket", "final review", "sign off on the ticket", "is the ticket done", "quality gate", "accept or reject the work", "verdict on the ticket", or after ticket-worker has finished implementing a ticket. Reviews all changes for completeness, scope discipline, code quality, test adequacy, and documentation accuracy. Delegates to /code-reviewer, /feature-creep-check, /documentation-reviewer, and any other relevant review skills. Produces a structured YES/NO verdict with findings.'
---

# Ticket Yes/No

The final quality gate in the ticket workflow. Reviews all work completed by `ticket-worker` and produces a binary **YES** (pass) or **NO** (fail) verdict with a structured report.

```
ticket-maker → ticket-planner → ticket-reviewer → ticket-worker → ticket-yes-no
```

## When to Use This Skill

- User asks to "yes or no the ticket", "final review", or "sign off on the ticket"
- User asks "is the ticket done?", "accept or reject the work", or "verdict on the ticket"
- User asks for a "quality gate" or "final check" on completed ticket work
- A ticket has been implemented by `ticket-worker` and needs a structured pass/fail decision
- User asks to "review all the work done" after implementation

## Prerequisites

- A work ticket in markdown format following the `ticket-maker` template
- The ticket must have been implemented by `ticket-worker` (Implementation Notes section filled in)
- Access to the codebase where the changes were made
- The project must build and all existing tests must pass before this skill begins

## What This Skill Does

- Reviews the implementation against the ticket for completeness and scope discipline
- Runs a full code review on all changed files
- Assesses test adequacy (unit tests, edge cases, benchmarks where appropriate)
- Checks documentation updates if required by the ticket
- Discovers and applies any other relevant review skills
- Produces a YES/NO verdict with a findings report

## What This Skill Does NOT Do

- It does **not** modify code, tests, documentation, or the ticket unless the user explicitly asks it to address findings (Step 9)
- It does **not** re-run `ticket-worker` or implement corrections unprompted
- It does **not** replace human judgement - it provides structured evidence for a decision
- It does **not** invent findings to justify its existence - if the work is good, it says so

## Review Philosophy: Aggressive, But Constructive

This skill hunts genuinely and enthusiastically for issues that would be of real benefit to address before the work is submitted for inclusion in the codebase. It is not a rubber stamp, and it does not pull punches.

However, it is **not** nit-picky. It does not find faults for the sake of finding something to complain about. Every finding must clear this bar:

> "Would fixing this materially improve the correctness, security, maintainability, or performance of the codebase?"

If the answer is no, it is not a finding. Specifically:

- **Do not** flag style preferences that have no impact on readability or consistency.
- **Do not** invent hypothetical failure scenarios that cannot realistically occur given the code's context.
- **Do not** demand tests for trivial getters, pass-through wrappers, or purely declarative configuration.
- **Do not** flag code that is already consistent with the surrounding codebase style, even if a different style might theoretically be "better".
- **Do** flag things that would genuinely embarrass the team if they shipped.
- **Do** flag things that would cause a real bug, a real security issue, or a real maintenance headache.
- **Do** flag missing tests for non-trivial logic.
- **Do** praise good work briefly when the implementation is solid - a quality gate should acknowledge quality, not only defects.

The tone is that of a supportive but rigorous senior engineer: direct, specific, and focused on genuine value.

## Hard Safety Rules

- Never modify project code, configuration, docs, tests, or build files.
- Never run destructive operations.
- Output is advisory. The final accept/reject decision belongs to the user.

## Workflow

### Step 1: Gather Context

1. Read the full ticket markdown. Extract:
   - Title, Story, Description
   - Acceptance Criteria (the definition of done)
   - Design (planned approach, key files, testing strategy, documentation requirements)
   - Implementation Notes (what was actually done)
   - Verification Notes (what was tested)
2. Identify all files changed by the implementation. Use `git diff` against the branch base or the commit range noted in Implementation Notes.
3. Read every changed file in full.

### Step 2: Completeness Check

Walk through every Acceptance Criterion in the ticket:

- For each criterion, determine whether the implementation satisfies it.
- Cross-reference the Design section against the actual changes. Note any planned changes that were not made, and any unplanned changes that were added.
- Record each criterion as PASS or FAIL with a brief justification.

A single FAIL on any Acceptance Criterion forces a **NO** verdict.

### Step 3: Scope Discipline Check

Determine whether the implementation changes the absolute minimum code required to fulfil the ticket:

1. Read the `/feature-creep-check` skill instructions. Apply the branch scope review mode to the changed files against the ticket's scope.
2. For each changed file, verify it is either:
   - Listed in the ticket's Design section as a key file, OR
   - Directly required by an Acceptance Criterion, OR
   - A test file covering new/changed behaviour, OR
   - A documentation file specified in the Design section
3. Flag any changes to files, functions, modules, or configuration not justified by the ticket. Classify each as:
   - **Necessary ancillary** - a change required to support the ticket work but not explicitly listed (e.g. fixing an import, updating a type definition). These are acceptable.
   - **Out of scope** - a change that is not required by the ticket. These are findings.

Out-of-scope changes are classified as Major findings.

### Step 4: Code Review

1. Read the `/code-reviewer` skill instructions. Apply its full workflow (Parts A through D as applicable) to all changed files.
2. If language-specific or framework-specific review skills are available locally (e.g. `/javascript-code-reviewer`, `/code-optimisation`), read their instructions and incorporate their checks.
3. Classify every finding by severity:

| Severity | Definition                                                                                  | Verdict Impact                            |
| -------- | ------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Critical | Security vulnerability, data loss risk, crash, correctness bug                              | Forces **NO**                             |
| Major    | Logic error, missing error handling, significant maintainability issue, out-of-scope change | Forces **NO** unless explicitly justified |
| Minor    | Style inconsistency, naming suggestion, minor readability improvement                       | Advisory only                             |

### Step 5: Test Adequacy Check

Assess the test coverage of the implementation:

1. Verify that every new or changed behaviour has at least one corresponding unit test.
2. Check for edge-case coverage: empty inputs, boundary values, error paths, not just happy paths.
3. Assess whether benchmark or performance tests are appropriate for the nature of the work:
   - Algorithmic changes or hot-path modifications warrant benchmarks.
   - Data-structure changes warrant both correctness and performance tests.
   - UI-only or configuration changes typically do not need benchmarks.
4. Verify that test names describe the scenario and expected outcome.
5. Confirm all tests pass (build and test the project if not already done).

Missing unit tests for new behaviour is a Major finding. Missing edge-case tests is a Minor finding. Missing benchmarks for performance-sensitive changes is a Major finding.

### Step 6: Documentation Review

If the ticket's Design section specified documentation updates:

1. Read the `/documentation-reviewer` skill instructions. Apply its review workflow to all documentation files changed or created by the implementation.
2. Verify documentation updates are accurate against the actual implementation (not just the planned design).
3. Flag missing documentation updates as Major findings.

If the ticket did not require documentation changes, confirm no documentation was inadvertently modified (scope discipline).

### Step 7: Discover and Apply Other Relevant Skills

1. Scan the available skills list for any other review-oriented skills relevant to the languages, frameworks, or domains touched by the implementation.
2. For each relevant skill found, read its instructions and apply any checks that were not already covered by Steps 2-6.
3. Record any additional findings with appropriate severity classifications.

This step ensures the review is as comprehensive as possible without hard-coding a fixed list of skills.

### Step 8: Produce Verdict

Determine the final verdict using these rules:

| Condition                                                             | Verdict |
| --------------------------------------------------------------------- | ------- |
| Any Acceptance Criterion is FAIL                                      | **NO**  |
| Any Critical finding exists                                           | **NO**  |
| Any Major finding exists without explicit justification               | **NO**  |
| All criteria PASS, no Critical findings, all Major findings justified | **YES** |

### Step 9: Offer to Address Findings

After presenting the verdict report, ask the user if they would like the agent to address any of the findings.

1. Rank all findings by impact (Critical first, then Major, then Minor).
2. Within each severity level, order by estimated effort (quickest wins first).
3. Present a short numbered list of the top findings (maximum 5) and suggest tackling the most impactful ones as a first step.
4. Ask: "Would you like me to address any of these? I'd suggest starting with [#1] and [#2] as they have the highest impact."

If the user agrees:

- Switch to implementation mode (this overrides the read-only constraint for this step only).
- Address the selected findings one at a time, confirming each fix.
- After all selected fixes are applied, re-run the relevant checks to confirm the findings are resolved.

If the user declines or wants to handle them manually, end the skill here.

## Report Format

Present the verdict report using this structure:

```markdown
# Ticket Yes/No: [Ticket Title]

## Verdict: YES / NO

[One-line justification for the verdict.]

---

## 1. Completeness

| #   | Acceptance Criterion | Status      | Notes                 |
| --- | -------------------- | ----------- | --------------------- |
| 1   | [criterion text]     | PASS / FAIL | [brief justification] |
| 2   | ...                  | ...         | ...                   |

## 2. Scope Discipline

| File / Change                | Justification        | Classification                                |
| ---------------------------- | -------------------- | --------------------------------------------- |
| [file or change description] | [why it was changed] | In scope / Necessary ancillary / Out of scope |

**Section verdict:** PASS / FAIL

## 3. Code Review Findings

| #   | Severity                 | File   | Finding       | Recommendation |
| --- | ------------------------ | ------ | ------------- | -------------- |
| 1   | Critical / Major / Minor | [file] | [description] | [what to do]   |

**Section verdict:** PASS / FAIL ([N] Critical, [N] Major, [N] Minor)

## 4. Test Adequacy

| Check                           | Status            | Notes |
| ------------------------------- | ----------------- | ----- |
| Unit tests for new behaviour    | PASS / FAIL       | ...   |
| Edge-case coverage              | PASS / FAIL       | ...   |
| Benchmark tests (if applicable) | PASS / FAIL / N/A | ...   |
| All tests pass                  | PASS / FAIL       | ...   |

**Section verdict:** PASS / FAIL

## 5. Documentation

| Check                                | Status            | Notes |
| ------------------------------------ | ----------------- | ----- |
| Required docs updated                | PASS / FAIL / N/A | ...   |
| Docs accurate against implementation | PASS / FAIL / N/A | ...   |

**Section verdict:** PASS / FAIL / N/A

## 6. Additional Skill Checks

[List any additional skills applied and their findings, or "No additional skills applicable."]

---

## Items to Address Before Re-review

[If NO: numbered list of specific items that must be fixed. If YES: omit this section.]
```

## Style Rules

- Follow the formatting rules defined in the `/markdown-formatter` skill.
- Do not use em-dashes. Use a regular dash, comma, semicolon, or colon instead.
- Be factual, minimal, and explicit. No filler commentary.
- Findings must be specific and actionable - cite file names, line numbers, and concrete descriptions.
- When the implementation is solid, say so briefly (e.g. "Clean implementation, well-tested."). Do not manufacture findings to fill space.

## Error Handling

| Situation                          | Action                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Ticket has no Implementation Notes | Stop and tell the user the ticket has not been implemented yet. Suggest running `ticket-worker` first. |
| Project does not build             | Stop and report the build failure. The implementation must compile before review.                      |
| Tests fail before review begins    | Stop and report the test failures. All tests must pass before this skill proceeds.                     |
| Cannot determine changed files     | Ask the user for the commit range or branch to diff against.                                           |
| A delegated skill is not available | Skip that skill's checks and note the gap in the report under "Additional Skill Checks".               |
