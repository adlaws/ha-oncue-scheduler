# C/C++ Review Checklist

Language-specific review checks for C and C++ codebases. Apply after
completing Part A (Universal Review Checklist) from the main skill.

Adapted from the `/cpp17-code-reviewer` skill. For C++ projects that have
the `/cpp17-code-reviewer` skill available, prefer that skill for a more
detailed C++-specific review.

## BC1. Memory Safety and Resource Management

| # | Check | Details |
|---|-------|---------|
| BC1.1 | **RAII everywhere** | Every resource (memory, file handle, mutex, socket) must be managed by a RAII wrapper. No manual `new`/`delete`, `malloc`/`free`, `fopen`/`fclose` outside resource-handle implementations. |
| BC1.2 | **Smart pointers** | Use `std::unique_ptr` by default; `std::shared_ptr` only when shared ownership is genuinely needed. Construct via `std::make_unique` / `std::make_shared`. |
| BC1.3 | **Dangling references** | No returning references/pointers to locals, temporaries, or invalidated iterators. |
| BC1.4 | **Ownership clarity** | Raw `T*` must be non-owning. Ownership transfer uses `std::unique_ptr`. |
| BC1.5 | **Rule of Zero / Five** | Prefer Rule of Zero. If any special member is defined or deleted, all five must be addressed. |
| BC1.6 | **Buffer overflows** | All buffer operations must be bounds-checked. Prefer `std::array`, `std::vector`, `std::string` over raw arrays. In C, use `snprintf` over `sprintf`, `strncpy` over `strcpy`. |

## BC2. Undefined Behaviour

| # | Check | Details |
|---|-------|---------|
| BC2.1 | **Uninitialised variables** | All variables must be initialised at declaration. |
| BC2.2 | **Null-pointer dereference** | Pointers must be validated before dereference. |
| BC2.3 | **Use-after-move** | Objects must not be read after being moved-from, except to assign or destroy. |
| BC2.4 | **Iterator invalidation** | Iterators, references, or pointers into containers must not be used after invalidating operations. |
| BC2.5 | **Signed integer overflow** | Signed overflow is UB. Check arithmetic on signed types. |
| BC2.6 | **Strict aliasing** | Don't access an object through a pointer of incompatible type. |
| BC2.7 | **Sequence points** | Don't depend on evaluation order of function arguments or unsequenced side effects. |

## BC3. Modern Idioms (C++11 and later)

| # | Check | Details |
|---|-------|---------|
| BC3.1 | **`const` / `constexpr`** | Use `const` for values that don't change. Use `constexpr` for compile-time-computable values. |
| BC3.2 | **`[[nodiscard]]`** | Apply to functions whose return value must not be ignored. |
| BC3.3 | **`std::string_view`** | Use for read-only string parameters (C++17+). |
| BC3.4 | **`std::optional`** | Prefer over sentinel values or out-parameters for "may not have a value" semantics (C++17+). |
| BC3.5 | **Range-based `for`** | Prefer `for (const auto& x : container)` over index-based loops. |
| BC3.6 | **`auto`** | Use when the type is obvious from the initialiser. |
| BC3.7 | **`noexcept`** | Mark move constructors, move-assignment, swap, and destructors `noexcept`. |

## BC4. Concurrency

| # | Check | Details |
|---|-------|---------|
| BC4.1 | **Data races** | Shared data must be protected by a mutex or be `std::atomic`. |
| BC4.2 | **Lock scope** | Use `std::lock_guard` or `std::unique_lock`; never manually call `lock()`/`unlock()`. |
| BC4.3 | **Deadlocks** | Acquire multiple locks in consistent order or use `std::scoped_lock`. |
| BC4.4 | **`volatile` misuse** | `volatile` is not a synchronisation primitive; use `std::atomic`. |

## BC5. API Design

| # | Check | Details |
|---|-------|---------|
| BC5.1 | **Parameter passing** | Cheap-to-copy by value; read-only by `const&`; sink by value + move; in/out by `T&`. |
| BC5.2 | **`explicit` constructors** | Single-argument constructors should be `explicit` unless implicit conversion is intentional. |
| BC5.3 | **Virtual destructor** | Polymorphic base classes must have a virtual destructor. |
| BC5.4 | **Header hygiene** | Include only what is used. Prefer forward declarations. Use include guards. |

## BC6. C-Specific Checks

| # | Check | Details |
|---|-------|---------|
| BC6.1 | **`sizeof` correctness** | Use `sizeof(*ptr)` instead of `sizeof(type)` for allocation sizes. |
| BC6.2 | **`NULL` checks** | Check `malloc`/`calloc`/`realloc` return values. |
| BC6.3 | **`free` discipline** | Set pointers to `NULL` after freeing. Never double-free. |
| BC6.4 | **`const` correctness** | Use `const` on pointer parameters that don't modify the pointee. |
| BC6.5 | **String termination** | Ensure all string buffers are null-terminated, especially after `strncpy`. |

## BC7. Tooling Compliance

| # | Check | Details |
|---|-------|---------|
| BC7.1 | **Compiler warnings** | Build with `-Wall -Wextra -Wpedantic` (GCC/Clang) or `/W4` (MSVC). Zero warnings. |
| BC7.2 | **Static analysis** | Use `clang-tidy`, `cppcheck`, or equivalent. |
| BC7.3 | **Address sanitizer** | Run tests with ASan/UBSan during development. |
| BC7.4 | **`clang-format`** | All files must be formatted consistently. |

## References

* [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)
* [SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c)
* [SEI CERT C++ Coding Standard](https://wiki.sei.cmu.edu/confluence/display/cplusplus)
* [CppReference](https://en.cppreference.com/)
