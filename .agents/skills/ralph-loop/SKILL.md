---
name: ralph-loop
description: >
  Iterative refinement loop that repeats a specified skill or task until
  diminishing returns are reached. Use when asked to "ralph-loop",
  "loop on", "iterate on", "keep improving", "repeat until done", or when
  a user prefixes a skill invocation with /ralph-loop (e.g.
  "/ralph-loop on /code-optimisation for X"). Runs the target skill,
  evaluates the results, and re-runs it on the updated output until the
  iteration produces no significant further improvements. Prevents
  over-engineering by stopping when remaining gains are minor or would
  introduce unacceptable complexity.
---

# Ralph Loop — Iterative Refinement Runner

## Purpose

Run a target skill or task **repeatedly** on the same scope until the
output stabilises — i.e. the latest iteration reports no significant
improvements, corrections, or gains beyond what has already been applied.

This is the opposite of a one-shot review: it catches issues that only
become visible after earlier issues are fixed, and ensures the final
output meets the skill's quality bar in aggregate, not just on the first
pass.

## When to Use

- User explicitly invokes `/ralph-loop` (e.g. `/ralph-loop on /code-optimisation for the grid builder`).
- User asks to "keep going until it's clean", "iterate until done",
  "loop on this", or "repeat the review".
- A task naturally requires multiple passes (e.g. documentation review
  where fixing one section reveals inconsistencies in another).

## When NOT to Use

- The target task is inherently one-shot (e.g. "create a file",
  "rename this variable").
- The user explicitly asks for a single pass.
- The target skill is destructive or non-idempotent (e.g. "delete all
  logs", "drop the database") — iterating would be harmful.

## Invocation Format

```
/ralph-loop on <skill-or-task> [for <scope>]
```

**Examples:**

| Invocation | Behaviour |
|------------|-----------|
| `/ralph-loop on /code-optimisation for grid_builder.cpp` | Optimise → re-optimise → … → stop when no significant gains |
| `/ralph-loop on /code-reviewer for the prediction library` | Review → fix → re-review → … → stop when clean |
| `/ralph-loop on /documentation-reviewer` | Review docs → fix → re-review → … → stop when no significant corrections |
| `/ralph-loop on "refactor the collision detection"` | Refactor → review → refactor → … → stop when stable |

## Workflow

### 1. Parse & Plan

1. Identify the **target skill** (or free-form task description).
2. Identify the **scope** (files, directories, components, or "all").
3. Load the target skill's instructions (if it is a registered skill).
4. Create a todo list with a single item: `Iteration 1: <target skill>`.

### 2. Execute Iteration

1. Mark the current iteration as in-progress.
2. Run the target skill / task on the current scope.
3. Collect the findings, changes, or output from the iteration.
4. Apply any fixes, refactors, or corrections identified.
5. **Build and test** (if applicable) to confirm nothing is broken.
6. Mark the current iteration as completed.

### 3. Evaluate Convergence

After each iteration, assess:

| Question | If YES → | If NO → |
|----------|----------|---------|
| Were any **High** or **Medium** impact findings identified and fixed? | Continue to next iteration | → |
| Were significant corrections, improvements, or structural changes made? | Continue to next iteration | → |
| Are there remaining issues that were deferred or partially addressed? | Continue to next iteration | → |
| Would further iteration likely produce only **Low** or **Informational** findings? | **Stop** | Continue |
| Would further changes add complexity disproportionate to the benefit? | **Stop** | Continue |

**Convergence is reached when:**

- The latest iteration produced **no High or Medium impact findings**, OR
- All findings from the latest iteration are Low/Informational, OR
- The iteration's output is substantively identical to the previous
  iteration's output (no meaningful diff), OR
- Further improvements would introduce unacceptable complexity or
  diminishing returns.

### 4. Report

When the loop terminates, provide a summary:

```
## Ralph Loop Summary

**Target:** <skill or task>
**Scope:** <files/components>
**Iterations:** <N>

### Iteration Log

| # | Key Changes | Remaining Issues |
|---|-------------|-----------------|
| 1 | ... | ... |
| 2 | ... | ... |
| N | No significant findings | — |

### Convergence Reason
<Why the loop stopped — e.g. "No High/Medium findings in iteration 3">

### Final State
<Brief summary of the final state of the code/docs>
```

## Safety Rails

1. **Maximum iterations:** Default cap of **5 iterations**. If
   convergence is not reached after 5 passes, stop and report the
   remaining issues to the user. The user can instruct to continue
   if desired.
2. **No infinite loops:** Each iteration MUST produce a smaller or
   equal set of findings compared to the previous iteration. If an
   iteration produces MORE findings than the previous one (regression),
   stop immediately and report the regression.
3. **Build gate:** If the target involves code changes, the build and
   tests MUST pass after every iteration before proceeding to the next.
   A failing build halts the loop.
4. **Scope lock:** The scope does not expand between iterations. If
   iteration 2 reveals issues in files outside the original scope,
   note them but do not fix them — report them at the end.
5. **No re-introducing removed code:** If iteration N removes code
   that iteration N+1 wants to add back, this is a sign of
   oscillation. Stop and report the conflict to the user.

## Integration with Target Skills

The ralph-loop skill is a **meta-skill** — it wraps other skills. It
does not define its own review checklist or coding standards. Instead,
it:

1. Loads and follows the target skill's instructions verbatim.
2. Applies the target skill's report format and severity classification.
3. Uses the target skill's convergence criteria (if defined) in addition
   to the generic criteria above.

When the target is a free-form task (not a registered skill), the
ralph-loop uses its own convergence criteria and asks the agent to
self-assess whether further iteration would be productive.
