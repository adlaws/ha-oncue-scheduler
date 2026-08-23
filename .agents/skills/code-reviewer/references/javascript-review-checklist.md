# JavaScript / TypeScript Review Checklist

Language-specific review checks for JavaScript and TypeScript codebases.
Apply after completing Part A (Universal Review Checklist) from the main
skill.

If the `/javascript-developer` skill is available, also read its reference
guidelines for project-specific conventions.

## BJ1. Type Safety and Correctness

| # | Check | Details |
|---|-------|---------|
| BJ1.1 | **Strict equality** | Use `===` and `!==` instead of `==` and `!=`. The only exception is `== null` to check for both `null` and `undefined`. |
| BJ1.2 | **`const` by default** | Use `const` for all bindings that are not reassigned. Use `let` only when reassignment is necessary. Never use `var`. |
| BJ1.3 | **Nullish checks** | Use `??` (nullish coalescing) instead of `||` when `0`, `""`, or `false` are valid values. |
| BJ1.4 | **Optional chaining** | Use `?.` for safe property access on potentially null/undefined objects. |
| BJ1.5 | **TypeScript strict mode** | Enable `strict: true` in `tsconfig.json`. Do not use `any` unless absolutely necessary; prefer `unknown` and narrow. |
| BJ1.6 | **Type assertions** | Avoid `as` casts. Prefer type guards (`typeof`, `instanceof`, discriminated unions) to narrow types. |

## BJ2. Async and Promises

| # | Check | Details |
|---|-------|---------|
| BJ2.1 | **Unhandled rejections** | Every `Promise` must have error handling. Prefer `try/catch` with `async/await` over `.catch()` chains. |
| BJ2.2 | **Async consistency** | Don't mix callbacks and promises in the same code path. Convert callback APIs to promises with `util.promisify` or wrapper functions. |
| BJ2.3 | **Concurrent operations** | Use `Promise.all()` for independent parallel operations, not sequential `await` in a loop. Use `Promise.allSettled()` when partial failure is acceptable. |
| BJ2.4 | **Async in loops** | `forEach` does not await async callbacks. Use `for...of` with `await` or `Promise.all(items.map(...))`. |
| BJ2.5 | **Error re-throwing** | When catching and re-throwing, preserve the original error as the `cause` option: `throw new Error("context", { cause: err })`. |

## BJ3. Security

| # | Check | Details |
|---|-------|---------|
| BJ3.1 | **XSS prevention** | Never insert user input into the DOM via `innerHTML`, `outerHTML`, or `document.write`. Use `textContent` or framework-provided escaping. |
| BJ3.2 | **Prototype pollution** | Avoid `Object.assign` or spread on untrusted input without validation. Deep-merge libraries must be vetted. |
| BJ3.3 | **`eval` and `Function`** | Never use `eval()`, `new Function()`, or `setTimeout/setInterval` with string arguments. |
| BJ3.4 | **Dependency hygiene** | Run `npm audit` regularly. Pin major versions. Avoid packages with no maintenance activity. |
| BJ3.5 | **Secrets in client code** | Never bundle API keys, tokens, or secrets in frontend JavaScript. |

## BJ4. Module Structure

| # | Check | Details |
|---|-------|---------|
| BJ4.1 | **ESM over CJS** | Prefer ES modules (`import`/`export`) over CommonJS (`require`/`module.exports`). |
| BJ4.2 | **Named exports** | Prefer named exports over default exports for better auto-import and refactoring support. |
| BJ4.3 | **Barrel files** | Use `index.js` barrel files sparingly. They can break tree-shaking and create circular dependency issues. |
| BJ4.4 | **Circular imports** | Detect and break circular dependencies. They cause partial initialisation bugs. |
| BJ4.5 | **File size** | Flag files exceeding ~300 lines. Extract composables, utilities, or sub-components. |

## BJ5. DOM and Framework Patterns

| # | Check | Details |
|---|-------|---------|
| BJ5.1 | **Event listener cleanup** | Listeners added with `addEventListener` must be removed on teardown. Framework lifecycle hooks should handle this. |
| BJ5.2 | **Memory leaks** | Watch for closures capturing large objects, intervals/timeouts without cleanup, and detached DOM nodes. |
| BJ5.3 | **Rendering performance** | Minimise DOM reads/writes in loops. Batch mutations. Use `requestAnimationFrame` for visual updates. |
| BJ5.4 | **Accessibility** | Interactive elements must be keyboard-navigable. Use semantic HTML. Provide ARIA labels where needed. |

## BJ6. Style and Idioms

| # | Check | Details |
|---|-------|---------|
| BJ6.1 | **Arrow functions** | Prefer arrow functions for callbacks and short functions. Use `function` declarations for named, hoisted functions. |
| BJ6.2 | **Destructuring** | Use destructuring for extracting properties from objects and arrays when it improves readability. |
| BJ6.3 | **Template literals** | Prefer template literals over string concatenation for multi-part strings. |
| BJ6.4 | **Array methods** | Prefer `map`, `filter`, `reduce`, `find`, `some`, `every` over manual loops for data transformation. |
| BJ6.5 | **Early returns** | Prefer guard clauses with early returns over deeply nested conditionals. |

## BJ7. Tooling Compliance

| # | Check | Details |
|---|-------|---------|
| BJ7.1 | **ESLint** | Must pass with zero errors. Warnings should be addressed or explicitly suppressed with a comment explaining why. |
| BJ7.2 | **Prettier / formatter** | All files must be formatted consistently. |
| BJ7.3 | **TypeScript compiler** | Must compile with zero errors under `strict` mode. |

## References

* [MDN Web Docs](https://developer.mozilla.org/)
* [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
* [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
* [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
