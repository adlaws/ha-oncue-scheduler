# Go Review Checklist

Language-specific review checks for Go codebases. Apply after completing
Part A (Universal Review Checklist) from the main skill.

If the `/go-developer` skill is available, also read its
`references/go-development-guidelines.md` for project-specific conventions.

## BG1. Error Handling

| # | Check | Details |
|---|-------|---------|
| BG1.1 | **Check every error** | Every call that returns an error must check it. Assigning to `_` is only acceptable when the doc comment explicitly states the call cannot fail in context. |
| BG1.2 | **Wrap with context** | Use `fmt.Errorf("context: %w", err)` to add context. Avoid bare `return err` except in trivial wrappers. |
| BG1.3 | **Error types** | Use `errors.Is()` and `errors.As()` for comparison, not `==` or type assertions on wrapped errors. |
| BG1.4 | **Sentinel errors** | Sentinel errors should be package-level `var` values prefixed with `Err` (e.g. `ErrNotFound`). |
| BG1.5 | **Panic avoidance** | `panic` is reserved for truly unrecoverable situations (programmer bugs, impossible states). Library code must not panic on bad input. |

## BG2. Naming and Style

| # | Check | Details |
|---|-------|---------|
| BG2.1 | **Export casing** | Exported names use `PascalCase`; unexported use `camelCase`. |
| BG2.2 | **Acronyms** | Acronyms are all-caps (`HTTP`, `ID`, `URL`), not mixed case. |
| BG2.3 | **Getter names** | Getters are named after the field (e.g. `Name()`, not `GetName()`). |
| BG2.4 | **Interface names** | Single-method interfaces use the `-er` suffix (`Reader`, `Stringer`). |
| BG2.5 | **Package names** | Short, lowercase, no underscores, singular. Avoid generic names like `util`. |
| BG2.6 | **Receiver names** | Short (1-2 letters), consistent across methods. Never `this` or `self`. |

## BG3. Concurrency

| # | Check | Details |
|---|-------|---------|
| BG3.1 | **Goroutine leaks** | Every goroutine must have a clear exit path. Use `context.Context` or `done` channels for cancellation. |
| BG3.2 | **Mutex discipline** | Protect shared state with `sync.Mutex` or `sync.RWMutex`. Prefer `defer mu.Unlock()` immediately after `mu.Lock()`. |
| BG3.3 | **Channel ownership** | Only the sender should close a channel. Document who owns the channel. |
| BG3.4 | **Race conditions** | Use `-race` flag in tests. Avoid sharing mutable state between goroutines without synchronisation. |
| BG3.5 | **Context propagation** | Pass `context.Context` as the first parameter. Do not store contexts in structs. |

## BG4. Resource Management

| # | Check | Details |
|---|-------|---------|
| BG4.1 | **`defer` for cleanup** | Use `defer` for `Close()`, `Unlock()`, and other cleanup. Place `defer` immediately after the resource is acquired. |
| BG4.2 | **`defer` in loops** | Avoid `defer` inside loops; it accumulates until the function returns. Extract the loop body into a separate function if cleanup per iteration is needed. |
| BG4.3 | **HTTP response bodies** | Always close `resp.Body` when `err == nil`, even if you do not read it. |
| BG4.4 | **`io.Reader`/`io.Writer`** | Prefer these interfaces over concrete types for flexibility. |

## BG5. Module and Package Design

| # | Check | Details |
|---|-------|---------|
| BG5.1 | **Import grouping** | Standard library, blank line, third-party, blank line, internal packages. |
| BG5.2 | **Circular imports** | Go forbids circular imports. If you detect one, refactor to break the cycle. |
| BG5.3 | **`internal/` packages** | Use `internal/` to prevent external consumers from depending on implementation details. |
| BG5.4 | **Interface placement** | Define interfaces where they are used (consumer side), not where they are implemented. |
| BG5.5 | **Minimal exports** | Only export what external consumers need. |

## BG6. Idioms and Patterns

| # | Check | Details |
|---|-------|---------|
| BG6.1 | **Struct initialisation** | Use named fields in composite literals. Avoid positional fields. |
| BG6.2 | **Slices** | Prefer `nil` slices over empty slices (they behave identically for `append`, `len`, `range`). |
| BG6.3 | **String building** | Use `strings.Builder` for repeated concatenation, not `+` in loops. |
| BG6.4 | **Type assertions** | Always use the two-value form `v, ok := x.(T)` unless the assertion is guaranteed to succeed. |
| BG6.5 | **`init()` functions** | Avoid `init()` where possible; prefer explicit initialisation. |
| BG6.6 | **Table-driven tests** | Prefer table-driven tests with named sub-tests (`t.Run`). |

## BG7. Tooling Compliance

| # | Check | Details |
|---|-------|---------|
| BG7.1 | **`go vet`** | Must pass with zero findings. |
| BG7.2 | **`staticcheck`** | Should pass if the tool is available. |
| BG7.3 | **`gofmt` / `goimports`** | All files must be formatted. |

## References

* [Effective Go](https://go.dev/doc/effective_go)
* [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
* [Go Proverbs](https://go-proverbs.github.io/)
* [Standard library documentation](https://pkg.go.dev/std)
