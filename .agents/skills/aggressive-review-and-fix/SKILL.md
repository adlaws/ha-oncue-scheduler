---
name: aggressive-review-and-fix
description: >
  Aggressive, multi-phase code review and fix pipeline intended as a final
  quality gate before submitting a pull request. Use when asked to
  "aggressive review", "aggressive review and fix", "final review before PR",
  "strict review and fix", "pre-PR review", "thorough review and fix",
  "clean up this branch for PR", or when the user wants a comprehensive,
  nit-picky but fair review covering code quality, comments/docstrings,
  unit tests, and documentation — with all issues fixed in-place. Supports
  branch-scoped (default) and project-wide modes. Users may select individual
  phases (e.g. "aggressive-review-and-fix on documentation please").
---

# Aggressive Review and Fix

A strict, multi-phase review-and-fix pipeline that iterates on code quality,
comments, testing, and documentation until convergence. Designed as the final
quality gate before changes in a branch are submitted as a pull request.

## When to Use This Skill

- Final check before opening a pull request
- User says "aggressive review", "strict review and fix", "pre-PR review",
  "final review before merge", "clean up this branch"
- User wants all code quality, documentation, commenting, and testing issues
  found and fixed — not just reported
- User wants a thorough, nit-picky (but fair) review

## When NOT to Use

- The user wants a quick, informal review
- The user only wants findings reported without fixes (use `/code-reviewer`
  or `/documentation-reviewer` directly instead)
- The user wants a single-pass review (use the individual skill directly)

## Scope

### Default: Branch Changes Only

By default, this skill operates on **changes made in the current branch**
relative to the main branch. Determine the changed files:

```bash
git diff --name-only main...HEAD
```

If `main` does not exist, try `master`, `develop`, or ask the user which
base branch to diff against.

### Optional: Project-Wide

If the user explicitly requests a project-wide review (e.g. "do an
aggressive review on the whole project", "review everything"), expand the
scope to the full project. Warn the user this will take significantly longer.

### Optional: Selective Phases

The user may request only specific phases. Match their request to the
phase names below:

| User says | Phase(s) to run |
|-----------|-----------------|
| "on code" / "code quality" / "code review" | Phase 1 only |
| "on comments" / "on docstrings" / "commenting" | Phase 2 only |
| "on tests" / "on unit tests" / "testing" | Phase 3 only |
| "on documentation" / "on docs" | Phase 4 only |
| "on code and tests" | Phases 1 and 3 |
| (no qualifier) | All four phases |

When running selective phases, still perform the validation gate (build +
test) after the selected phase(s) complete.

## Prerequisites

1. Identify the project language(s) and build system.
2. Confirm the project builds and tests pass **before** starting:
   - **C++ (this project):** `cd build && cmake --build . && ctest --output-on-failure`
   - Adapt for other languages as needed.
3. If running in branch-scoped mode, confirm the branch has commits ahead
   of the base branch.

## Phases

Each phase follows the same pattern:

1. Invoke `/ralph-loop` on the target skill with the specified focus.
2. The ralph-loop iterates until convergence (no High/Medium findings remain).
3. After convergence, run the **validation gate** (build + test) before
   proceeding to the next phase.
4. If the validation gate fails, fix the failure before moving on.

### Aggression Level

"Aggressive" means:

- **All** Critical, Major, and Minor severity findings are fixed — not
  just Critical and Major.
- The review is thorough and nit-picky: inconsistent naming, missing edge
  case handling, unclear variable names, suboptimal structure, and missing
  comments are all fair game.
- However, **do not fabricate issues**. Every finding must be a genuine
  improvement. Do not flag correct, clear, idiomatic code just to produce
  output.
- Apply the principle: "Would a thorough, experienced reviewer flag this
  in a real PR review?" If yes, fix it. If not, leave it alone.

---

### Phase 1: Code Quality Review

**Skill:** `/ralph-loop` on `/code-reviewer`
**Scope:** Changed files (or full project if requested)
**Focus:** Full code review — correctness, security, maintainability,
readability, performance, and concurrency.

Instructions to the code-reviewer:

- Review aggressively. Fix all Critical, Major, AND Minor findings.
- Apply the full Part A universal checklist and relevant Part B
  language-specific checks.
- Check cross-boundary interactions if multiple languages are present.
- Do not skip any checklist item.

**Validation gate:** Build and run all tests after convergence.

---

### Phase 2: Comments and Docstrings Review

**Skill:** `/ralph-loop` on `/code-reviewer`
**Scope:** Changed files (or full project if requested)
**Focus:** Completeness, accuracy, and sufficiency of docstrings and
inline code comments ONLY.

Instructions to the code-reviewer:

- Focus exclusively on commenting and documentation within source files.
- Every public function, class, method, struct, and enum must have a
  docstring/doc-comment that explains its purpose, parameters, return
  value, and any important behaviour (e.g. thread safety, ownership).
- Inline comments must explain **why**, not **what**. Remove comments
  that merely restate the code.
- Fix missing, inaccurate, outdated, or misleading comments.
- Ensure docstring style matches the project's conventions (e.g. Doxygen
  for C++, docstrings for Python, JSDoc for JS/TS).
- Do not add trivial comments to self-explanatory code. A comment that
  says `// increment counter` above `counter++` is worse than no comment.

**Validation gate:** Build and run all tests after convergence.

---

### Phase 3: Unit Testing Review

**Skill:** `/ralph-loop` on `/code-reviewer`
**Scope:** Changed files AND their corresponding test files
**Focus:** Completeness, accuracy, and sufficiency of unit tests ONLY.

Instructions to the code-reviewer:

- Verify every changed function/method has corresponding unit tests.
- Check that tests cover the happy path, edge cases, boundary conditions,
  and error paths.
- Verify test names clearly describe the scenario and expected outcome.
- Ensure tests are independent — no shared mutable state, no order
  dependency.
- Check assertion quality: specific assertions, not just boolean checks.
- Add missing tests. Fix weak or incorrect tests.
- If a function is non-trivial and untested, write tests for it.
- Do not write tests for trivial getters/setters or one-line delegating
  functions unless they contain logic.

**Validation gate:** Build and run all tests after convergence. All new
and existing tests must pass.

---

### Phase 4: Documentation Review

**Skill:** `/ralph-loop` on `/documentation-reviewer`
**Scope:** Documentation files changed in the branch (or all docs if
project-wide). Typically `docs/`, `README.md`, and any other `.md` files
outside of `.agents/`, `.notes/`, `.tickets/`, `.plans/`.
**Focus:** Completeness, correctness, accuracy, style, and sufficiency
of user-facing documentation.

Instructions to the documentation-reviewer:

- Review aggressively. Fix all Critical, Major, AND Minor findings.
- Check that documentation accurately reflects the current state of the
  code, configuration, and behaviour.
- Verify terminology consistency across all documentation files.
- Check formatting against the `/markdown-formatter` skill rules.
- Ensure the documentation is sufficient: a new team member should be able
  to understand the system from the docs alone.
- Fix inaccurate, outdated, incomplete, or misleading documentation.
- Check that any code changes in the branch that affect user-visible
  behaviour have corresponding documentation updates.

**Validation gate:** Build the documentation site (`mkdocs build --strict`
if available) and verify no warnings or errors.

---

## Validation Gate Details

After each phase (and at the end of the full pipeline):

1. **Build:** Compile the project and confirm zero errors.
   - C++ (this project): `cd build && cmake --build .`
2. **Test:** Run all unit tests and confirm zero failures.
   - C++ (this project): `cd build && ctest --output-on-failure`
3. **Documentation build** (Phase 4 only): `mkdocs build --strict`
   (if `mkdocs.yml` exists).
4. If any gate fails, diagnose and fix the failure before proceeding.

## Workflow Summary

```
┌─────────────────────────────────────────────────────┐
│  Determine scope (branch diff or project-wide)      │
│  Determine phases (all four, or user-selected)      │
│  Confirm build + tests pass (baseline)              │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────▼──────────────┐
         │  Phase 1: Code Quality     │
         │  /ralph-loop /code-reviewer│
         │  → Validation Gate         │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │  Phase 2: Comments         │
         │  /ralph-loop /code-reviewer│
         │  → Validation Gate         │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │  Phase 3: Unit Tests       │
         │  /ralph-loop /code-reviewer│
         │  → Validation Gate         │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │  Phase 4: Documentation    │
         │  /ralph-loop /doc-reviewer │
         │  → Validation Gate         │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │  Final Summary Report      │
         └────────────────────────────┘
```

## Final Report

When all phases are complete, produce a summary:

```
## Aggressive Review and Fix — Summary

**Scope:** Branch `<branch-name>` vs `main` (or project-wide)
**Phases run:** 1, 2, 3, 4 (or subset)

### Phase Results

| Phase | Iterations | Findings Fixed | Status |
|-------|-----------|----------------|--------|
| 1. Code Quality | N | X | ✅ Converged |
| 2. Comments | N | X | ✅ Converged |
| 3. Unit Tests | N | X | ✅ Converged |
| 4. Documentation | N | X | ✅ Converged |

### Validation
- Build: ✅ Pass
- Tests: ✅ Pass (N tests)
- Docs build: ✅ Pass (if applicable)

### Notes
<Any residual observations, scope-locked findings, or recommendations>
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No changes detected in branch | Verify the correct base branch; try `git log --oneline main..HEAD` |
| Build fails before starting | Fix build issues first; this skill assumes a clean baseline |
| Phase produces more findings than previous iteration | Ralph-loop will halt automatically; investigate regression |
| Too many phases for a small change | Use selective phases (e.g. "aggressive-review-and-fix on code only") |
| Documentation build not configured | Skip the mkdocs gate if no `mkdocs.yml` exists |
