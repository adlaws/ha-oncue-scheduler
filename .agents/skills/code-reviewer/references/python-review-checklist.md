# Python Review Checklist

Language-specific review checks for Python codebases. Apply after
completing Part A (Universal Review Checklist) from the main skill.

If the `/python-developer` skill is available, also read its reference
guidelines for project-specific conventions.

## BP1. Error Handling

| # | Check | Details |
|---|-------|---------|
| BP1.1 | **Specific exceptions** | Catch specific exception types, not bare `except:` or `except Exception:`. |
| BP1.2 | **Exception chaining** | Use `raise NewError("context") from err` to preserve the original traceback. |
| BP1.3 | **LBYL vs EAFP** | Prefer EAFP (try/except) for operations that usually succeed. Use LBYL (if/check) for cheap preconditions. |
| BP1.4 | **Suppress pattern** | Use `contextlib.suppress(ErrorType)` instead of empty `except` blocks when intentionally ignoring an error. |
| BP1.5 | **SystemExit and KeyboardInterrupt** | Never catch `BaseException` unless re-raising. These must propagate. |

## BP2. Type Safety

| # | Check | Details |
|---|-------|---------|
| BP2.1 | **Type hints on public APIs** | All public functions and methods should have type annotations for parameters and return values. |
| BP2.2 | **`Optional` and `None`** | Use `Optional[T]` (or `T | None` in 3.10+) when a value can be `None`. Check before using. |
| BP2.3 | **Mutable defaults** | Never use mutable objects (`[]`, `{}`, `set()`) as default parameter values. Use `None` and create inside the function. |
| BP2.4 | **`mypy` / `pyright`** | Type checking should pass cleanly if the project uses a type checker. |

## BP3. Resource Management

| # | Check | Details |
|---|-------|---------|
| BP3.1 | **Context managers** | Use `with` statements for files, locks, database connections, and any resource with `__enter__`/`__exit__`. |
| BP3.2 | **`finally` for cleanup** | When `with` is not applicable, use `try/finally` for cleanup. |
| BP3.3 | **Generator cleanup** | Generators that acquire resources should use `try/finally` to ensure cleanup even if the consumer stops iterating. |
| BP3.4 | **Temporary files** | Use `tempfile` module with context managers, not manual file creation. |

## BP4. Naming and Style

| # | Check | Details |
|---|-------|---------|
| BP4.1 | **PEP 8 naming** | `snake_case` for functions, methods, variables, and modules. `PascalCase` for classes. `UPPER_SNAKE_CASE` for module-level constants. |
| BP4.2 | **Leading underscores** | Use `_name` for internal/private names. Avoid `__name` (name mangling) unless needed to prevent subclass collisions. |
| BP4.3 | **`__all__`** | Public modules should define `__all__` to control `from module import *`. |
| BP4.4 | **Docstrings** | Public modules, classes, functions, and methods must have docstrings. Follow Google, NumPy, or reStructuredText style consistently. |
| BP4.5 | **f-strings** | Prefer f-strings over `%` formatting or `.format()` for Python 3.6+. |

## BP5. Data Structures and Patterns

| # | Check | Details |
|---|-------|---------|
| BP5.1 | **Dataclasses** | Use `@dataclass` (or `NamedTuple`) for data-holding classes instead of plain classes with `__init__` boilerplate. |
| BP5.2 | **Immutability** | Use `frozen=True` on dataclasses, `tuple` instead of `list`, and `frozenset` instead of `set` when mutation is not needed. |
| BP5.3 | **Comprehensions** | Prefer list/dict/set comprehensions over `map`/`filter` with lambdas for readability. Avoid nested comprehensions. |
| BP5.4 | **Iterators** | Use generators and `itertools` for large sequences to avoid materialising entire lists in memory. |
| BP5.5 | **`enum.Enum`** | Use `Enum` for fixed sets of values instead of string or integer constants. |

## BP6. Concurrency

| # | Check | Details |
|---|-------|---------|
| BP6.1 | **GIL awareness** | `threading` does not provide true parallelism for CPU-bound work. Use `multiprocessing` or `concurrent.futures.ProcessPoolExecutor`. |
| BP6.2 | **`asyncio` patterns** | Do not mix blocking I/O with `asyncio`. Use `loop.run_in_executor` for blocking calls in async code. |
| BP6.3 | **Thread safety** | Protect shared mutable state with `threading.Lock`. Use `queue.Queue` for inter-thread communication. |
| BP6.4 | **Task cancellation** | `asyncio` tasks should handle `CancelledError` and clean up. |

## BP7. Security

| # | Check | Details |
|---|-------|---------|
| BP7.1 | **`pickle` safety** | Never unpickle untrusted data. Use JSON, MessagePack, or protobuf for untrusted serialisation. |
| BP7.2 | **`subprocess` safety** | Use list arguments, not shell strings. Set `shell=False` (the default). Never pass user input to `shell=True`. |
| BP7.3 | **SQL injection** | Use parameterised queries, never string formatting for SQL. |
| BP7.4 | **`eval` / `exec`** | Never use on untrusted input. |
| BP7.5 | **Dependency scanning** | Run `pip-audit` or `safety check` regularly. |

## BP8. Tooling Compliance

| # | Check | Details |
|---|-------|---------|
| BP8.1 | **Linter** | `ruff`, `flake8`, or `pylint` should pass with zero errors. |
| BP8.2 | **Formatter** | `black`, `ruff format`, or `yapf` should produce no changes. |
| BP8.3 | **Import sorting** | `isort` or `ruff` import sorting should produce no changes. |

## References

* [PEP 8 - Style Guide for Python Code](https://peps.python.org/pep-0008/)
* [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
* [The Hitchhiker's Guide to Python](https://docs.python-guide.org/)
* [Python Documentation](https://docs.python.org/3/)
* [Real Python](https://realpython.com/)
