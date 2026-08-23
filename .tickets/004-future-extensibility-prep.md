# Prepare Data Model for Future Non-Boolean Slot Values (Phase 4)

## Story

As a developer extending Switch Scheduler in a future version, I want the slot value handling to be abstracted behind a typed structure so that adding brightness, colour, or temperature slot types does not require a storage migration or breaking changes to the existing on/off functionality.

## Description

Phase 4 refactors the slot value layer from raw integers to a typed abstraction. Currently, slot values are plain integers (`0` = off, `1` = on) validated only with `isinstance(v, int)`. The coordinator interprets them with `desired == 1`. This works for v1 but will break if future versions need richer values (brightness 0-255, RGB tuples, temperature setpoints).

This phase introduces a slot value helper module that encapsulates interpretation logic, adds a "slot type" concept to the data model, and updates the frontend grid to support a selectable slot type (on/off only for now, but wired for extension). The storage format remains integer-based for backward compatibility; the abstraction layer maps integers to typed values.

**Technical Context**

* `custom_components/switch_scheduler/store.py` - validation uses `isinstance(v, int)`
* `custom_components/switch_scheduler/coordinator.py` - interprets with `desired == 1`
* `frontend/src/schedule-grid.ts` - renders with `val ? "on" : "off"`
* Project plan Goal 6: "Design the data model to be extensible to non-boolean slot values"
* Project plan explicitly notes slot values are "intentionally not a boolean" for this reason

## Acceptance Criteria

* [] New `slot_values.py` module provides `interpret_slot_value(value, slot_type)` and `validate_slot_value(value, slot_type)` functions
* [] `slot_type` field added to the schedule data model with default `"on_off"`, stored alongside existing fields
* [] Store validation uses `validate_slot_value()` instead of bare `isinstance(v, int)`
* [] Coordinator uses `interpret_slot_value()` instead of `desired == 1`
* [] Existing schedules without a `slot_type` field default to `"on_off"` (backward compatible)
* [] Frontend schedule editor shows a read-only "Slot Type: On/Off" indicator (not editable in v1)
* [] Frontend grid continues to work identically for on/off slot type
* [] WebSocket save/get responses include the `slot_type` field
* [] Unit tests for `interpret_slot_value` and `validate_slot_value` with the `on_off` type
* [] Unit tests verify backward compatibility (schedules without `slot_type` still work)
* [] All existing 71 tests continue to pass
* [] Project builds successfully (Python + frontend)

## Design

### Approach

Introduce a thin abstraction layer (`slot_values.py`) that encapsulates slot value interpretation and validation. The coordinator and store delegate to this module instead of using inline logic. The data model gains a `slot_type` field per schedule (default `"on_off"`). Existing schedules without this field are handled via `setdefault` in `async_save_schedule`, preserving backward compatibility. No storage migration needed.

The frontend shows the slot type as a read-only label. No new slot types are implemented in this phase; the abstraction is wired end-to-end with only `"on_off"` supported.

### Key Changes

* [New file] **`custom_components/switch_scheduler/slot_values.py`** - Slot value abstraction:
  - `SLOT_TYPE_ON_OFF = "on_off"` constant
  - `VALID_SLOT_TYPES = {"on_off"}` set
  - `validate_slot_value(value: Any, slot_type: str) -> str | None` - returns error string or None. For `on_off`: must be int, must be 0 or 1.
  - `interpret_slot_value(value: int, slot_type: str) -> dict` - returns `{"action": "turn_on"}` or `{"action": "turn_off"}` for `on_off` type. Returns `{"action": "none"}` for unrecognised values.
* [Modified] **`custom_components/switch_scheduler/const.py`** - Add `SLOT_TYPE_ON_OFF = "on_off"` and `VALID_SLOT_TYPES` for import convenience (re-exported from slot_values).
* [Modified] **`custom_components/switch_scheduler/store.py`** - In `validate_schedule()`: replace `isinstance(v, int)` check with `validate_slot_value(v, slot_type)`. In `async_save_schedule()`: add `data.setdefault("slot_type", SLOT_TYPE_ON_OFF)`.
* [Modified] **`custom_components/switch_scheduler/coordinator.py`** - In `_async_apply_state()`: replace `desired == 1` with `interpret_slot_value(desired, slot_type)["action"]` comparison. Pass `slot_type` from schedule into `_async_apply_state`.
* [Modified] **`frontend/src/schedule-editor.ts`** - Add a read-only "Slot Type" label showing "On/Off" below the cadence selector.
* [Modified] **`frontend/src/types.ts`** - Add `slot_type: string` to `Schedule` and `ScheduleSummary` interfaces.

### Data & Interfaces

Schedule data gains one field:

```python
{
    "slot_type": "on_off",  # new, defaults to "on_off"
    # ... all existing fields unchanged
}
```

`slot_values.py` public API:

```python
def validate_slot_value(value: Any, slot_type: str) -> str | None:
    """Return error string if value is invalid for the slot type, or None."""

def interpret_slot_value(value: int, slot_type: str) -> dict[str, str]:
    """Return {"action": "turn_on"|"turn_off"|"none"} for the value."""
```

### Edge Cases & Risks

- **Backward compatibility**: Schedules saved before Phase 4 will not have `slot_type`. The `setdefault` in `async_save_schedule` handles this. The coordinator also defaults to `"on_off"` via `schedule.get("slot_type", SLOT_TYPE_ON_OFF)`.
- **Unknown slot type**: If a schedule has an unrecognised `slot_type`, `interpret_slot_value` returns `{"action": "none"}`, causing no state change. `validate_slot_value` rejects unknown types at save time.
- **Validation strictness change**: Currently any integer is accepted. With Phase 4, only 0 and 1 are valid for `on_off`. Existing schedules with other integer values (unlikely but possible) would fail validation on next save. This is acceptable since no other values were ever intended.

### Testing Strategy

Add new test file `tests/test_slot_values.py`:
- `test_validate_on_off_valid` - 0 and 1 are valid
- `test_validate_on_off_invalid_value` - 2, -1, 0.5, "on" are invalid
- `test_validate_unknown_slot_type` - unknown type rejects all values
- `test_interpret_on_off_turn_on` - value 1 returns turn_on action
- `test_interpret_on_off_turn_off` - value 0 returns turn_off action
- `test_interpret_on_off_unknown_value` - value 2 returns none action
- `test_interpret_unknown_slot_type` - unknown type returns none action

Add to `tests/test_store.py`:
- `test_save_defaults_slot_type` - saved schedule has `slot_type: "on_off"`
- `test_save_preserves_explicit_slot_type` - explicitly set slot_type is kept

Add to `tests/test_coordinator.py`:
- `test_coordinator_uses_slot_type` - coordinator passes slot_type through to apply logic

### Documentation

- No README changes needed (slot type is internal/not user-visible in v1)

## Implementation Notes

### Files Created

* `custom_components/switch_scheduler/slot_values.py` - `validate_slot_value()` and `interpret_slot_value()` functions, `SLOT_TYPE_ON_OFF` and `VALID_SLOT_TYPES` constants
* `tests/test_slot_values.py` - 7 tests covering validation and interpretation for on_off type, unknown types, and invalid values

### Files Modified

* `custom_components/switch_scheduler/const.py` - Added `SLOT_TYPE_ON_OFF` and `VALID_SLOT_TYPES` constants
* `custom_components/switch_scheduler/store.py` - Import `validate_slot_value` and constants; `validate_schedule()` uses `validate_slot_value()` per-value instead of `isinstance(v, int)`; `async_save_schedule()` sets `slot_type` default to `"on_off"`; validation now also checks `slot_type` is in `VALID_SLOT_TYPES`
* `custom_components/switch_scheduler/coordinator.py` - Import `interpret_slot_value` and `SLOT_TYPE_ON_OFF`; reads `slot_type` from schedule; passes it to `_async_apply_state()` which uses `interpret_slot_value()` instead of `desired == 1`
* `frontend/src/types.ts` - Added `slot_type: string` to `Schedule` and `ScheduleSummary` interfaces
* `frontend/src/schedule-editor.ts` - Added read-only "Slot Type: On/Off" field in form; save payload includes `slot_type: "on_off"`
* `tests/test_store.py` - Added 2 tests for slot_type defaulting and preservation
* `tests/test_coordinator.py` - Added 1 test verifying coordinator uses slot_type through interpret_slot_value

### Deviations from Design

None.

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

**Estimate:** **5** - Significant. New module, updates to 3 backend files and 2 frontend files, new test file plus additions to 2 existing test files. All changes follow established patterns.

## Verification Notes

* All 81 tests pass (71 existing + 10 new)
* Frontend builds with zero TypeScript errors
* Bundle size: 49.26 kB (13.88 kB gzipped)
* Backward compatibility: schedules without `slot_type` get `"on_off"` via `setdefault`
* Existing coordinator tests still pass, confirming the `interpret_slot_value` abstraction is transparent for on_off type

## Technical Release Notes

* New `slot_values.py` module provides `validate_slot_value()` and `interpret_slot_value()` abstraction
* `slot_type` field added to schedule data model (default: `"on_off"`)
* Store validation now uses per-value validation through `slot_values.py` instead of bare `isinstance(v, int)`
* Coordinator uses `interpret_slot_value()` to determine actions instead of hardcoded `desired == 1`
* Validation is now stricter: only 0 and 1 are accepted for `on_off` type (previously any integer)

## Customer Release Notes

* Internal preparation for future slot types (brightness, colour, temperature) - no user-visible changes
* Schedule editor now displays the slot type (currently always "On/Off")
