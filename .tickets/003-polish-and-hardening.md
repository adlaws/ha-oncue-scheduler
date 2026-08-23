# Polish and Harden Integration (Phase 3)

## Story

As a Home Assistant user, I want the Switch Scheduler integration to handle edge cases gracefully and include clear documentation so that I can rely on it for daily use and install it easily via HACS.

## Description

Phase 3 adds robustness, edge-case handling, and user-facing documentation to the Switch Scheduler integration. The backend gains DST-aware evaluation, empty-schedule warnings, and entity-availability checks. The frontend replaces native alert/confirm dialogs with HA-styled toast notifications and adds a loading spinner during save/delete. A comprehensive README.md covers installation, configuration, and usage.

**Technical Context**

* Phase 1 backend: `custom_components/switch_scheduler/` (store, coordinator, websocket_api, switch, config_flow)
* Phase 2 frontend: `frontend/src/` (LitElement panel, built bundle)
* Tests: `tests/` (61 tests, all passing)
* One-off expiry already implemented in coordinator; needs edge-case tests
* DST handling currently relies on `dt_util.now()` with no explicit transition logic
* Frontend uses native `alert()`/`confirm()` for user feedback

## Acceptance Criteria

* [] DST spring-forward gap is handled correctly (slots in the skipped hour are not evaluated)
* [] DST fall-back repeated hour is handled correctly without duplicate side effects
* [] Midnight rollover tested for all cadences (daily, weekly, custom)
* [] Coordinator logs a warning when a target entity is unavailable (state is `unavailable` or `unknown`) and skips the service call
* [] Store validation warns on schedules where all slots are off (empty schedule) - save succeeds but websocket response includes a warning
* [] Frontend replaces native `alert()` calls with HA-styled toast notifications
* [] Frontend replaces native `confirm()` for delete with a styled confirmation dialog
* [] Frontend shows a loading spinner overlay during save and delete operations
* [] `README.md` created with: project overview, HACS installation steps, manual installation steps, configuration instructions, usage guide with feature descriptions, and a troubleshooting section
* [] New unit tests for DST spring-forward and fall-back slot evaluation
* [] New unit tests for midnight rollover across all cadences
* [] New unit tests for entity unavailability handling
* [] New unit test for empty-schedule warning
* [] All existing 61 tests continue to pass
* [] Project builds successfully (Python + frontend)

## Design

### Approach

Three workstreams: backend hardening, frontend UX polish, and documentation. All backend changes follow the existing patterns in `coordinator.py`, `store.py`, and `websocket_api.py`. Frontend changes are scoped to `schedule-editor.ts` and a new toast helper. Documentation is a new `README.md` at the repo root.

### Key Changes

#### 1. DST Handling (coordinator.py)

No code change needed in the coordinator itself. `compute_slot_index` uses local hour/minute from `dt_util.now()`, which correctly reflects the local wall clock after DST transitions. During spring-forward, the 2:00 AM tick never fires (the clock jumps from 1:59 to 3:00), so slots in the gap are naturally skipped. During fall-back, the 1:00-1:59 AM ticks fire twice, but `_async_apply_state` is idempotent (it checks current state before calling the service), so the second evaluation is a no-op.

What is needed: **tests** that document and verify this behaviour. Add tests to `test_coordinator.py` that:
- Verify `compute_slot_index` returns correct values for times at DST boundaries
- Verify `_async_evaluate` handles a mocked spring-forward scenario (local_now jumps from 01:45 to 03:00)
- Verify `_async_evaluate` handles a mocked fall-back scenario (01:30 AM evaluated twice produces no duplicate service calls)

#### 2. Midnight Rollover Tests (test_coordinator.py)

Add tests verifying `compute_slot_index` and `compute_day_key` at 23:45 (slot 95) and 00:00 (slot 0 of the next day) for daily, weekly, and custom cadences. These are pure-function tests on existing code.

#### 3. Entity Availability Check (coordinator.py)

Extend `_async_apply_state` to check for `unavailable` and `unknown` states:

```python
if state.state in ("unavailable", "unknown"):
    _LOGGER.warning("Entity '%s' is %s, skipping", entity_id, state.state)
    return
```

Add this check after the existing `state is None` check.

#### 4. Empty Schedule Warning (websocket_api.py)

After a successful save in `ws_save_schedule`, check if all slot values are 0. If so, add a `warnings` list to the response alongside the existing `conflicts` list:

```python
warnings = []
all_off = all(v == 0 for arr in saved.get("slots", {}).values() for v in arr)
if all_off:
    warnings.append("All time slots are off - this schedule will not activate any entities")
connection.send_result(msg["id"], {"schedule": saved, "conflicts": conflicts, "warnings": warnings})
```

The save still succeeds; this is informational only.

#### 5. Frontend Toast Notifications (schedule-editor.ts)

Replace native `alert()` calls with a custom `<toast-notification>` element that renders a styled banner at the top of the editor. The toast auto-dismisses after 5 seconds or on click.

Create `frontend/src/toast-notification.ts`:
- Properties: `message: string`, `type: "info" | "warning" | "error"`, `visible: boolean`
- Renders a fixed-position banner with appropriate colour based on type
- Auto-hides after 5 seconds via `setTimeout`
- Exposed via a `show(message, type)` method

Update `schedule-editor.ts`:
- Import and include `<toast-notification>` in the template
- Replace `alert("Name is required")` with `this._showToast("Name is required", "error")`
- Replace `alert("Failed to save...")` with `this._showToast("Failed to save schedule", "error")`
- Replace `alert("Failed to delete...")` with `this._showToast("Failed to delete schedule", "error")`
- Show any backend warnings: `this._showToast(warnings[0], "warning")`

#### 6. Frontend Confirmation Dialog (schedule-editor.ts)

Replace native `confirm()` for delete with an inline confirmation state:
- Add `@state() private _confirmDelete = false` flag
- First click on Delete shows "Are you sure? Yes / No" inline buttons
- Second click (Yes) performs the delete
- No/Cancel resets the flag

Replace native `confirm()` for cancel-with-unsaved-changes with the same pattern using `@state() private _confirmDiscard = false`.

This avoids blocking native dialogs and stays within the LitElement rendering model.

#### 7. Frontend Loading Spinner (schedule-editor.ts)

The `_saving` state already exists and disables the Save button. Extend this:
- When `_saving` is true, render a semi-transparent overlay over the editor with a CSS spinner
- Add `@state() private _deleting = false` for delete operations
- Style: centered circular spinner using CSS animation, overlay with `rgba(0,0,0,0.1)` background

#### 8. README.md

Create `README.md` at the repo root with these sections:
- **Overview**: What the integration does
- **Features**: Bullet list of capabilities
- **Installation**: HACS installation steps (add custom repository) and manual installation steps (copy `custom_components/switch_scheduler/`)
- **Configuration**: Add via HA integrations page (singleton config flow)
- **Usage**: Creating schedules, using the grid, cadence types, enabling/disabling schedules via the switch entity
- **Troubleshooting**: Common issues (panel not appearing after install, entities not responding)

### Edge Cases & Risks

- **Toast z-index**: Must be above the grid overlay. Use `z-index: 100`.
- **Inline confirm state leaking**: If user clicks Delete, sees "Are you sure?", then clicks a different schedule, the confirm state must reset. Handle in `willUpdate` when `schedule` property changes.
- **Empty schedule warning for new schedules**: A brand-new schedule with default all-off slots should trigger the warning. This is correct behaviour.
- **DST test portability**: Use fixed datetime objects rather than relying on the test machine's timezone. Test pure functions with explicit datetime values.

### Testing Strategy

Add new tests to `tests/test_coordinator.py`:
- `test_compute_slot_index_dst_spring_forward` - slot index at 03:00 after spring-forward
- `test_compute_slot_index_dst_fall_back` - slot index during repeated 01:30 AM
- `test_midnight_rollover_slot_index` - slot 95 at 23:45, slot 0 at 00:00
- `test_midnight_rollover_day_key_daily` - day key at 23:45 and 00:00 for daily
- `test_midnight_rollover_day_key_weekly` - day key changes at midnight across weekdays
- `test_midnight_rollover_day_key_custom` - day key changes at midnight in custom range
- `test_entity_unavailable_skipped` - entity in `unavailable` state skipped with warning
- `test_entity_unknown_skipped` - entity in `unknown` state skipped with warning

Add new tests to `tests/test_websocket_api.py`:
- `test_save_empty_schedule_returns_warning` - all-off slots produce a warning in response

Total new tests: ~9-10.

### Documentation

- `README.md` created at repo root (new file)
- No changes to existing documentation files

## Implementation Notes

### Files Modified

* `custom_components/switch_scheduler/coordinator.py` - Added `unavailable`/`unknown` state check in `_async_apply_state`
* `custom_components/switch_scheduler/websocket_api.py` - Added `warnings` list to save response (empty-schedule detection)
* `frontend/src/schedule-editor.ts` - Replaced `alert()`/`confirm()` with toast notifications and inline confirmation, added loading overlay with spinner, added `_deleting` state
* `tests/test_coordinator.py` - Added 10 new tests (DST, midnight rollover, entity availability, fall-back idempotency)
* `tests/test_websocket_api.py` - Added 1 new test (empty schedule warning)
* `tests/conftest.py` - Already had `hass.http` and `hass.components` mocks from Phase 2

### Files Created

* `frontend/src/toast-notification.ts` - Reusable `<toast-notification>` LitElement component with auto-dismiss
* `README.md` - Comprehensive user documentation

### Deviations from Design

None. All design decisions implemented as specified.

## Estimate

| Estimate | Description |
|----------|-------------|
| 1        | Trivial - minutes of effort |
| 2        | Small - less than half a day |
| 3        | Moderate - roughly half a day |
| 5        | Significant - about a day |
| 8        | Large - a few days |
| 10       | Very large - up to a week |
| **20**   | **Too large - break into smaller tickets** |

**Estimate:** **8** - Large. Multiple workstreams (backend, frontend, docs) but each change is small and follows existing patterns. The new tests are the bulk of the effort.

## Verification Notes

* All 71 tests pass (61 existing + 10 new)
* Frontend builds cleanly with zero TypeScript errors
* Bundle size increased from 44.9 kB to 49.1 kB (toast component added)
* New coordinator tests cover: DST spring-forward slot index, DST fall-back slot index, midnight rollover (slot index + day key for all 3 cadences), unavailable entity skip, unknown entity skip, fall-back idempotency
* New websocket test covers: empty schedule warning in save response
* README covers: overview, features, HACS install, manual install, configuration, usage (creating, grid, automations, evaluation), troubleshooting

## Technical Release Notes

* Coordinator now skips entities in `unavailable` or `unknown` state with a warning log
* WebSocket save response includes a `warnings` list (currently: empty-schedule warning)
* Frontend uses toast notifications instead of native `alert()` dialogs
* Frontend uses inline confirmation instead of native `confirm()` for delete and discard
* Frontend shows loading spinner overlay during save and delete operations
* Added 10 new tests covering DST transitions, midnight rollover, and entity availability

## Customer Release Notes

* Entities that are unavailable or in an unknown state are now gracefully skipped during schedule evaluation
* Saving a schedule with all time slots off now shows a warning
* Improved notifications in the schedule editor (styled toast messages instead of browser popups)
* Delete confirmation now shows inline rather than as a browser dialog
* Loading indicator shown while saving or deleting schedules
* Added comprehensive README with installation, usage, and troubleshooting documentation
