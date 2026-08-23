---
name: code-reviewer
description: >
  Language-agnostic code review skill. Use when performing code reviews, pull
  request reviews, codebase audits, or pre-merge quality gates in any language
  (Go, Python, JavaScript, TypeScript, C++, C#, Java, Rust, Svelte, etc.).
  Detects the codebase language(s) and applies idiomatic review rules
  accordingly. Handles multi-language codebases connected via RPC, API bridges,
  FFI, or framework bindings. Layers framework-specific checks (Django, React,
  Svelte, Qt, Wails, etc.) on top of base language review. Supports
  user-provided coding standards and infers implied standards from existing
  code patterns. Use when asked to "review code", "do a code review",
  "audit this code", "check code quality", "review this PR", or
  "review for best practices".
---

# Code Reviewer

A structured, checklist-driven code review skill that adapts to any
programming language, framework, and project convention. Detects the
language(s) in scope, applies language-idiomatic rules, and layers
framework-specific checks where applicable.

## When to Use This Skill

- When the user says "review code", "do a code review", "audit this code", "check code quality",
  "review this PR", or "review for best practices", or something similar.
- Reviewing pull requests or diffs
- Auditing an existing codebase for defects, security gaps, or
  maintainability issues
- Pre-merge quality gates where a structured checklist is needed
- Post-refactor validation to ensure no regressions were introduced
- Cross-language boundary review (e.g. Go backend + Svelte frontend
  connected via Wails bindings)
- Framework-specific review (e.g. Django views, React components, Qt
  widgets)

## Prerequisites

### Identify Language(s) and Framework(s)

Before starting, determine:

1. **Languages** - inspect file extensions, `go.mod`, `package.json`,
   `Cargo.toml`, `pyproject.toml`, `*.csproj`, `CMakeLists.txt`, etc.
2. **Frameworks** - look for framework imports, config files, or project
   structure patterns (e.g. `wails.json`, `svelte.config.js`,
   `django/settings.py`, `angular.json`).
3. **Cross-language boundaries** - identify where different languages
   interact (API endpoints, RPC definitions, FFI bindings, Wails bridge,
   gRPC protos, REST contracts).

### Gather Standards

Standards are applied in this priority order (highest first):

1. **User-provided standards** - coding guidelines the user points to
   (local docs, other skills, external URLs).
2. **Project skills** - check for locally available language/framework
   skills (e.g. `/go-developer`, `/javascript-developer`,
   `/svelte-developer`, `/python-developer`, `/cpp-developer`,
   `/rust-developer`...). Read their guidelines.
3. **Implied standards** - consistent patterns observed in the existing
   codebase (naming conventions, error handling style, file organisation).
   Adopt these unless they represent a genuine quality risk.
4. **Language community standards** - well-established idioms and official
   style guides for the detected language (see `references/` folder).

> ⚠️ Implied standards that create security vulnerabilities, suppress
> errors, hinder testability, or significantly reduce maintainability
> should be flagged rather than adopted. Note the pattern and recommend
> improvement.

### Build and Test

Confirm the code compiles and tests pass before starting the review.
Adapt commands to the detected build system:

| Language              | Build                          | Test                       |
| --------------------- | ------------------------------ | -------------------------- |
| Go                    | `go build ./...`               | `go test ./...`            |
| Python                | N/A or `python -m py_compile`  | `pytest`                   |
| JavaScript/TypeScript | `npm run build`                | `npm test`                 |
| C/C++                 | `cmake --build build`          | `ctest --test-dir build`   |
| Rust                  | `cargo build`                  | `cargo test`               |
| C#                    | `dotnet build`                 | `dotnet test`              |
| Java                  | `mvn compile` / `gradle build` | `mvn test` / `gradle test` |

If the project has a `Makefile`, prefer `make build` and `make test`.

## Review Workflow

1. **Scope** - identify the files or diff under review.
2. **Detect** - determine language(s), framework(s), and applicable
   standards.
3. **Build & Test** - confirm clean compilation and passing tests.
4. **Checklist Pass** - walk through Part A (universal) and Part B
   (language-specific) checklists, annotating findings.
5. **Cross-boundary Pass** - if multiple languages are present, walk
   through Part C.
6. **Framework Pass** - if a framework is detected, walk through Part D.
7. **Classify** - assign a severity to each finding.
8. **Report** - present findings using the report template.
9. **Coverage gap check** - if any detected language or framework lacks
   a reference checklist in `references/`, follow Part E to offer the
   user a skill extension.

---

## Part A - Universal Review Checklist

These checks apply to every language.

### A1. Correctness

| #    | Check                              | Details                                                                                                                                                                                    |
| ---- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A1.1 | **Logic errors**                   | Off-by-one, inverted conditions, short-circuit evaluation misuse, unreachable code.                                                                                                        |
| A1.2 | **Boundary / edge cases**          | Empty inputs, zero-length collections, maximum-value integers, null/nil/undefined values.                                                                                                  |
| A1.3 | **Error handling**                 | Every fallible operation must have an error path; errors must not be silently swallowed. The error handling idiom must match the language (exceptions, Result types, error returns, etc.). |
| A1.4 | **Return values**                  | Functions that return success/failure or computed results must have their return values used by callers.                                                                                   |
| A1.5 | **Preconditions / postconditions** | Verify callers satisfy documented preconditions; ensure functions deliver promised postconditions.                                                                                         |
| A1.6 | **Arithmetic**                     | Integer overflow/underflow, division by zero, signed/unsigned mismatch, floating-point precision issues, narrowing conversions.                                                            |

### A2. Security and Input Validation

| #    | Check                   | Details                                                                                                                                                                                     |
| ---- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A2.1 | **Input validation**    | All external input (files, network, CLI args, environment variables, user forms) must be validated before use.                                                                              |
| A2.2 | **Bounds checking**     | Array/collection accesses with dynamic indices must be range-checked or use safe accessors.                                                                                                 |
| A2.3 | **Injection**           | User-supplied data must never flow directly into SQL, shell commands, format strings, template expressions, or log format specifiers. Use parameterised queries, escaping, or sanitisation. |
| A2.4 | **Sensitive data**      | Passwords, keys, tokens must not be logged, hard-coded, or stored in plain text. Ensure secrets are cleared from memory after use where the language supports it.                           |
| A2.5 | **Path traversal**      | File-path inputs must be canonicalised and restricted to an expected directory.                                                                                                             |
| A2.6 | **Dependency security** | Check for known vulnerabilities in dependencies where tooling is available (`npm audit`, `go vuln`, `pip-audit`, `cargo audit`).                                                            |
| A2.7 | **Validation parity**   | When a handler accepts and stores data that will later be processed by a different code path (e.g. saved to disk then loaded, queued for async processing), the acceptance path must validate against the same constraints the consumption path enforces. A successful accept-and-store must guarantee that later processing will not fail on the stored data. |
| A2.8 | **Structured text parsing** | When parsing structured text formats (HTTP headers, MIME types, URIs, config strings, DSVs), verify the parser handles the full grammar — including optional parameters, quoting, escaping, delimiters, and trailing content — not just the common-case format. |
| A2.9 | **Encoding consistency** | When an API accepts the same logical fields via different encodings (JSON body, form data, query params, multipart), validation strictness must be consistent across all encodings. A value rejected in one format must not be silently accepted or coerced in another. |

### A3. Maintainability and Readability

| #    | Check                          | Details                                                                                                                                                                                         |
| ---- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A3.1 | **Naming**                     | Variables, functions, types, and constants follow the project's naming conventions. Names are descriptive without being excessively long. Conventions adapt to the language idiom (see Part B). |
| A3.2 | **Function length**            | Prefer short, single-responsibility functions. Flag functions exceeding ~60 lines for possible extraction (threshold may vary by language and context).                                         |
| A3.3 | **Cognitive complexity**       | Deeply nested control flow (>3 levels) warrants refactoring.                                                                                                                                    |
| A3.4 | **Code duplication**           | Identical or near-identical blocks should be extracted into shared utilities.                                                                                                                   |
| A3.5 | **Comments and documentation** | Public API surfaces must be documented per language convention (doc comments, docstrings, JSDoc, etc.). Inline comments explain _why_, not _what_.                                              |
| A3.6 | **Magic values**               | Literal numbers/strings with non-obvious meaning should be replaced with named constants.                                                                                                       |
| A3.7 | **Dead code**                  | Unreachable branches, unused variables/imports, commented-out code should be removed.                                                                                                           |
| A3.8 | **Consistent style**           | Formatting, bracing, indentation, and whitespace follow the project style or language default formatter.                                                                                        |

### A4. Testing

| #    | Check                 | Details                                                                                                    |
| ---- | --------------------- | ---------------------------------------------------------------------------------------------------------- |
| A4.1 | **Test coverage**     | New/changed behaviour must have corresponding unit tests.                                                  |
| A4.2 | **Edge-case tests**   | Tests cover empty, boundary, and error cases, not just the happy path.                                     |
| A4.3 | **Test independence** | Tests must not depend on execution order or shared mutable state.                                          |
| A4.4 | **Assertion quality** | Tests should use specific assertions appropriate to the test framework rather than generic boolean checks. |
| A4.5 | **Test naming**       | Test names describe the scenario and expected outcome.                                                     |

### A5. Performance (General)

| #    | Check                      | Details                                                                                                                                                            |
| ---- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A5.1 | **Algorithmic complexity** | Verify that algorithms scale appropriately for expected data sizes. Flag O(n^2) or worse when a better alternative exists.                                         |
| A5.2 | **Unnecessary allocation** | Avoid allocating in hot loops or when stack/value allocation suffices.                                                                                             |
| A5.3 | **Unnecessary copies**     | Pass large objects by reference rather than by value when the function does not need ownership (language-specific idiom applies).                                  |
| A5.4 | **Premature optimisation** | Flag micro-optimisations that harm readability without measured justification.                                                                                     |
| A5.5 | **Resource cleanup**       | Ensure resources (file handles, connections, locks) are released promptly, ideally via language-idiomatic patterns (defer, using, with, RAII, try-with-resources). |
| A5.6 | **File write atomicity**   | File writes that replace existing data (overwrites, config updates, uploaded content) should use write-to-temp + atomic rename to prevent data loss on write failure (disk full, I/O error, process crash). Verify stream/file-descriptor state after close before reporting success. |
| A5.7 | **Concurrent file access** | When multiple threads or requests can write to the same file concurrently, serialize the critical section (existence check, write, rename) per target path, and use unique temporary file names (e.g. incorporating a counter or request ID) to prevent collisions. |

### A6. Concurrency at API Boundaries

| #    | Check                              | Details                                                                                                                                                                                                                                                                        |
| ---- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A6.1 | **Handler thread safety**          | In server/handler architectures (HTTP, RPC, event-driven), verify that handler threads do not read or write state owned by another thread (e.g. simulation loop, main thread, background worker) without synchronisation. Prefer queuing decisions to the owning thread over adding locks to shared state. |
| A6.2 | **Consistent state under mutation** | When a handler needs to make a decision based on shared state (e.g. "is this file currently active?"), verify the decision is still valid at the point of action — or defer both decision and action to the thread that owns the state.                                        |

---

## Part B - Language-Specific Checks

After completing Part A, apply the language-specific section(s) relevant to
the code under review. If a language reference document exists in
`references/`, read it for detailed conventions.

If a locally available developer skill exists for the language (e.g.
`/go-developer`, `/javascript-developer`, `/python-developer`, `/cpp-developer`
, `/rust-developer`...), read its guidelines to inform the review.

If no reference document or local skill exists for the detected language,
use well-known community standards and fetch current best practices from
online sources if needed.

### B-Go

See `references/go-review-checklist.md` for the full Go-specific checklist.

Key checks: error handling (check every error return), naming (`PascalCase`
exports, `camelCase` unexported), goroutine leaks, mutex usage, `defer`
ordering, interface design, `context.Context` propagation, `go vet` and
`staticcheck` compliance.

### B-JavaScript / TypeScript

See `references/javascript-review-checklist.md` for the full checklist.

Key checks: `===` over `==`, proper async/await error handling, avoiding
callback hell, `const` by default, no `var`, prototype pollution, XSS in
DOM manipulation, module structure, tree-shaking compatibility.

### B-Python

See `references/python-review-checklist.md` for the full checklist.

Key checks: PEP 8 naming, type hints on public APIs, context managers for
resources, avoiding mutable default arguments, f-string formatting,
`__all__` exports, virtual environment discipline, exception specificity.

### B-C / C++

See `references/cpp-review-checklist.md` for the full checklist (adapted
from the `/cpp17-code-reviewer` skill).

Key checks: RAII for all resources, smart pointer usage, dangling
references, undefined behaviour, `const`/`constexpr` correctness, Rule of
Zero/Five, iterator invalidation, `noexcept` on move operations.

### B-Rust

Key checks: ownership and borrowing correctness, lifetime annotations,
`unsafe` block justification and minimisation, `clippy` compliance, error
handling with `Result`/`?` operator, trait design, `Send`/`Sync` bounds.

### B-C#

Key checks: `IDisposable`/`using` for resources, `async`/`await` patterns
(no `async void` except event handlers), LINQ misuse in hot paths, nullable
reference types, naming conventions (PascalCase methods, `_camelCase`
fields), exception hierarchy.

### B-Java

Key checks: resource management with try-with-resources, checked vs
unchecked exceptions, immutability where possible, `Optional` over null
returns, stream API misuse, thread safety annotations, Lombok
appropriateness.

### B-Other Languages

For languages not listed above, apply Part A fully and additionally:

1. Identify the language's official style guide or dominant community
   standard.
2. Check error handling matches the language idiom.
3. Check resource management matches the language idiom.
4. Check concurrency primitives are used correctly.
5. Fetch current best practices from online sources if uncertain.

After the review, follow Part E to offer creating a permanent reference
checklist for this language.

---

## Part C - Cross-Language Boundary Review

Apply when the codebase uses multiple languages connected via any
integration mechanism.

### C1. API Contract Consistency

| #    | Check                     | Details                                                                                                                                                                                                              |
| ---- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1.1 | **Data shape alignment**  | Structs, classes, or types on both sides of a boundary must agree on field names, types, and optionality.                                                                                                            |
| C1.2 | **Naming consistency**    | Where a concept appears on both sides (e.g. a Go struct exposed to JavaScript via Wails, or a Python model serialised to JSON for a React frontend), names should be consistent or have a clear, documented mapping. |
| C1.3 | **Error propagation**     | Errors from one side must be properly surfaced on the other. Check that error codes, messages, or exception types are not lost in translation.                                                                       |
| C1.4 | **Serialisation**         | JSON, protobuf, or other serialisation must handle edge cases: null/nil vs missing fields, date/time formats, numeric precision, enum values.                                                                        |
| C1.5 | **Version compatibility** | API changes on one side must be reflected on the other. Check for stale bindings, outdated type definitions, or mismatched API versions.                                                                             |

### C2. Integration Patterns

| #    | Check                         | Details                                                                                                                                                                       |
| ---- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C2.1 | **Binding generation**        | Auto-generated bindings (Wails, gRPC, OpenAPI, pybind11) must be regenerated after API changes. Check for stale generated files.                                              |
| C2.2 | **Async boundaries**          | Verify that async/sync mismatches across boundaries are handled correctly (e.g. Go goroutines calling into synchronous JS, or async Python calling synchronous C extensions). |
| C2.3 | **Resource lifecycle**        | Resources allocated on one side and used on the other must have clear ownership and cleanup semantics.                                                                        |
| C2.4 | **Testing across boundaries** | Integration tests should exercise the actual boundary, not just mock both sides independently.                                                                                |

---

## Part D - Framework-Specific Review

Apply when a framework is detected or specified. If a locally available
framework skill exists (e.g. `/svelte-developer`), read it and apply its
review checklist.

### D1. General Framework Checks

| #    | Check                          | Details                                                                                                                                                     |
| ---- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1.1 | **Framework idiom compliance** | Code follows the framework's recommended patterns (e.g. component lifecycle in React/Svelte, middleware ordering in Express/Django, signal patterns in Qt). |
| D1.2 | **Framework anti-patterns**    | Check for known anti-patterns specific to the framework (e.g. prop drilling in React, n+1 queries in Django ORM, synchronous I/O in async frameworks).      |
| D1.3 | **State management**           | State is managed using the framework's recommended patterns (stores, context, services) rather than ad-hoc global variables.                                |
| D1.4 | **Rendering / performance**    | Framework-specific performance concerns (unnecessary re-renders, missing memoisation, blocking the event loop, excessive DOM updates).                      |
| D1.5 | **Accessibility**              | UI frameworks: semantic HTML, ARIA attributes, keyboard navigation, screen reader compatibility.                                                            |
| D1.6 | **Security**                   | Framework-specific security: CSRF protection, template escaping, authentication middleware, CORS configuration.                                             |

### D2. Framework Reference Lookup

If the framework is not covered by a local skill:

1. Identify the framework's official documentation URL.
2. Fetch current best practices and anti-pattern lists if needed.
3. Apply checks analogous to D1 using the framework's own terminology and
   patterns.
4. After the review, follow Part E to offer creating a permanent
   reference for this framework.

---

## Severity Classification

| Severity          | Meaning                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Critical**      | Undefined behaviour, data loss, security vulnerability, crash. Must fix before merge.                                     |
| **Major**         | Resource leak, logic error, missing error handling, missing tests, cross-boundary inconsistency. Should fix before merge. |
| **Minor**         | Style violation, suboptimal idiom, missing documentation, naming inconsistency. Fix when convenient.                      |
| **Informational** | Suggestion for improvement; no defect. Optional.                                                                          |

---

## Report Template

```text
## Code Review Summary

**Scope**: <files/areas reviewed>
**Language(s)**: <detected languages>
**Framework(s)**: <detected frameworks, or "none">
**Standards**: <standards applied - project skills, user docs, implied, community>
**Build**: PASS / FAIL
**Tests**: <n> passed, <m> failed

### Critical

| File:Line | Check | Description |
|-----------|-------|-------------|
| ...       | ...   | ...         |

### Major

| File:Line | Check | Description |
|-----------|-------|-------------|
| ...       | ...   | ...         |

### Minor

| File:Line | Check | Description |
|-----------|-------|-------------|
| ...       | ...   | ...         |

### Informational

| File:Line | Check | Description |
|-----------|-------|-------------|
| ...       | ...   | ...         |

### Cross-Boundary Findings (if applicable)

| Boundary | Check | Description |
|----------|-------|-------------|
| ...      | ...   | ...         |
```

## Part E - Self-Updating Coverage

This skill is designed to grow. After completing a review, check whether
the detected language(s) and framework(s) are fully covered.

### E1. Detect Coverage Gaps

A **language gap** exists when:

- The language has no `B-<Language>` subsection in Part B above, OR
- The language has no reference checklist in `references/`

A **framework gap** exists when:

- The framework has no locally available skill (e.g. no `/svelte-developer`,
  `/django-developer`, `/react-developer`), AND
- The review relied on ad-hoc online lookups or general knowledge for
  framework-specific checks

### E2. Prompt the User

When a gap is detected, append the following to the review report (after
the findings tables):

```text
### Skill Coverage Gap Detected

This review covered <language/framework> which does not yet have a
dedicated reference checklist in this skill. Creating one would improve
future reviews by providing a structured, repeatable checklist rather
than relying on general knowledge.

Would you like me to:

1. **Create a reference checklist** - add a `references/<lang>-review-checklist.md`
   with language-specific checks, and update the Part B section in this skill.
2. **Create a dedicated developer skill** - use the `/make-expert-skill`
   workflow to create a full `/<lang>-developer` skill with coding guidelines,
   testing conventions, and reference documents.
3. **Both** - create the review checklist now and the developer skill as well.
4. **Skip** - no changes needed.
```

### E3. Create a Reference Checklist

If the user selects option 1 or 3:

1. Research the language's official style guide, linter rules, and
   community best practices (fetch online if needed).
2. Create `references/<lang>-review-checklist.md` following the same
   structure as the existing checklists (Go, JS/TS, Python, C/C++):
   - Error handling idiom
   - Naming and style conventions
   - Concurrency patterns
   - Resource management
   - Security-specific checks
   - Idiomatic patterns and anti-patterns
   - Tooling compliance (linters, formatters, static analysis)
   - References to authoritative sources
3. Add a `### B-<Language>` subsection to Part B in this SKILL.md with
   a summary and a `See references/<lang>-review-checklist.md` link.
4. Add the language to the Online Reference Sources table if not already
   present.

### E4. Create a Developer Skill

If the user selects option 2 or 3:

1. Use the `/make-expert-skill` skill to create a new
   `.agents/skills/<lang>-developer/` skill.
2. Add it to the Multi-Skill Collaboration section below.

### E5. Framework-Specific Extensions

For frameworks without a local skill:

1. Offer to create a `references/<framework>-review-checklist.md` with
   framework-specific idiom, anti-pattern, and security checks.
2. Optionally offer to create a full `/<framework>-developer` skill if
   the framework is complex enough to warrant one.

---

## Online Reference Sources

When built-in knowledge may be outdated or when the user requests it,
consult these authoritative sources:

| Language   | Primary Reference                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Go         | [Effective Go](https://go.dev/doc/effective_go), [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)                |
| Python     | [PEP 8](https://peps.python.org/pep-0008/), [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)                       |
| JavaScript | [MDN Web Docs](https://developer.mozilla.org/), [Airbnb Style Guide](https://github.com/airbnb/javascript)                                      |
| TypeScript | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/), [Google TS Style Guide](https://google.github.io/styleguide/tsguide.html) |
| C/C++      | [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/), [SEI CERT C++](https://wiki.sei.cmu.edu/confluence/display/cplusplus)       |
| Rust       | [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/), [Clippy Lints](https://rust-lang.github.io/rust-clippy/)                    |
| C#         | [.NET Design Guidelines](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/)                                                  |
| Java       | [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)                                                                   |
| General    | [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)                                   |

## Multi-Skill Collaboration

When reviewing a multi-language codebase, combine this skill with
available developer skills:

- `/go-developer` - Go implementation standards and testing conventions
- `/javascript-developer` - JavaScript implementation and testing guidelines
- `/svelte-developer` - Svelte component architecture and reactivity patterns
- `/python-developer` - Python implementation standards
- `/code-optimisation` - structured performance review after correctness review

Recommended order:

1. **This skill** (`/code-reviewer`) for the structured review pass.
2. **Language developer skills** for implementation-level guidance on fixes.
3. **`/code-optimisation`** as a final performance-focused pass if needed.
