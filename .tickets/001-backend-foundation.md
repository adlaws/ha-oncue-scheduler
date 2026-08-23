# Implement Switch Scheduler Backend Foundation (Phase 1)

## Story

As a Home Assistant user, I want to install the Switch Scheduler integration so that I can create and manage on/off schedules for my toggleable devices via the backend API, laying the foundation for the frontend panel in Phase 2.

## Description

Build the complete Python backend for the `switch_scheduler` Home Assistant custom integration. This includes the integration scaffold (manifest, config flow, constants, translations), persistent schedule storage, a coordinator that evaluates schedules at 15-minute boundaries and toggles entity states, a WebSocket API for frontend communication, and switch entities that expose each schedule set to HA automations.

The integration must be HACS-compatible and installable. Schedule management in this phase is API-only (via HA developer tools or WebSocket); the frontend panel is Phase 2.

**Technical Context**

* Reference project: `ha-fujitsu-broadlink-ir` for HA integration patterns
* Project plan: `.plans/001-switch-scheduler-project-plan.md`
* Target directory: `custom_components/switch_scheduler/`

## Acceptance Criteria

* [] Integration scaffold created: `manifest.json`, `hacs.json`, `const.py`, `config_flow.py`, `strings.json`, `translations/en.json`, `__init__.py`
* [] `store.py` implements CRUD for schedules using `homeassistant.helpers.storage.Store`, with UUID assignment and JSON serialisation
* [] `coordinator.py` evaluates active schedules at 15-minute boundaries (`:00`, `:15`, `:30`, `:45`) and calls `turn_on`/`turn_off` on target entities when the desired state differs from the current state
* [] Coordinator evaluates immediately on startup and on schedule activation (does not wait for next boundary)
* [] Coordinator handles missing entities gracefully (log warning, skip, do not crash)
* [] `websocket_api.py` implements five commands: `list`, `get`, `save`, `delete`, `toggle_active` with voluptuous validation
* [] `save` command detects schedule conflicts (overlapping entities and time slots with different desired states) and returns a `conflicts` array in the response
* [] `switch.py` exposes each schedule set as a `switch` entity with dynamic creation/removal as schedules are created/deleted
* [] Data model includes `slot_minutes` field per schedule (fixed at 15, not exposed in UI)
* [] Slot values use integers (0 = off, 1 = on) for future extensibility
* [] One-off custom schedules are marked inactive after their end date passes
* [] CI workflows created: `.github/workflows/hacs.yml`, `hassfest.yml`, `tests.yml`
* [] Unit tests cover store CRUD, coordinator slot calculation, config flow, switch entity behaviour, and WebSocket API validation
* [] All unit tests pass
* [] Project passes hassfest and HACS validation structure requirements

## Design

### Approach

Build the complete Python backend for the `switch_scheduler` integration following HA custom integration conventions established in `ha-fujitsu-broadlink-ir`. The integration is a singleton service (one config entry) that manages schedule data via `homeassistant.helpers.storage.Store`, evaluates schedules on a 15-minute tick via `async_track_utc_time_change`, and exposes each schedule as a `switch` entity. A WebSocket API provides the frontend communication channel. Tests use pytest with HA import stubs to test pure-Python logic without a running HA instance.

### Key Changes

* [New file] **`custom_components/switch_scheduler/__init__.py`** - Integration entry point. `async_setup_entry` initialises the store, starts the coordinator, registers WebSocket API commands, registers the frontend panel static path (placeholder for Phase 2), and forwards to the `switch` platform. `async_unload_entry` cancels the coordinator listener and unloads the switch platform. Stores a `SwitchSchedulerData` dataclass in `hass.data[DOMAIN][entry.entry_id]` holding references to the store and coordinator.
* [New file] **`custom_components/switch_scheduler/const.py`** - Constants: `DOMAIN`, `STORE_KEY`, `STORE_VERSION`, `DEFAULT_SLOT_MINUTES`, `SLOTS_PER_DAY`, `MAX_CUSTOM_DAYS`, cadence enum values.
* [New file] **`custom_components/switch_scheduler/config_flow.py`** - Minimal singleton config flow. Single `async_step_user` that sets unique ID `"switch_scheduler"`, aborts if already configured, and creates an entry with title "Switch Scheduler". No user input fields required.
* [New file] **`custom_components/switch_scheduler/store.py`** - `ScheduleStore` class wrapping `homeassistant.helpers.storage.Store`. Methods: `async_load`, `async_save`, `async_get_schedule(id)`, `async_list_schedules`, `async_save_schedule(data)` (upsert), `async_delete_schedule(id)`, `async_toggle_active(id)`. Generates UUIDs for new schedules via `uuid.uuid4()`. Fires a dispatcher signal `SIGNAL_SCHEDULES_UPDATED` on every mutation so the switch platform and coordinator can react.
* [New file] **`custom_components/switch_scheduler/coordinator.py`** - `ScheduleCoordinator` class. Registers a time listener via `async_track_utc_time_change(hass, callback, minute=[0, 15, 30, 45], second=0)`. On each tick and on startup: converts UTC to local time, computes slot index (`hour * 4 + minute // 15`), determines day offset for each active schedule based on cadence, looks up desired state, compares to entity's current state via `hass.states.get()`, calls `hass.services.async_call("homeassistant", "turn_on"/"turn_off")` when they differ. Handles one-off schedule expiry by marking schedules inactive after end_date. Listens for `SIGNAL_SCHEDULES_UPDATED` to re-evaluate immediately on schedule changes.
* [New file] **`custom_components/switch_scheduler/websocket_api.py`** - Registers five WebSocket commands using `@websocket_api.websocket_command` and `vol.Schema` validation. Commands: `switch_scheduler/list`, `switch_scheduler/get`, `switch_scheduler/save`, `switch_scheduler/delete`, `switch_scheduler/toggle_active`. The `save` command runs conflict detection: iterates all other active schedules, finds overlapping entity IDs, then normalises cadences for comparison. A daily schedule's single row `"0"` is expanded to match every day of the other schedule. A weekly schedule's 7 rows are compared day-by-day against the other schedule's rows (using weekday alignment for custom schedules). Two custom schedules are compared only on overlapping date ranges. For each overlapping day, slot arrays are compared index-by-index; slots where both schedules have a value and the values differ are flagged. Returns a `conflicts` array in the response listing conflicting schedule IDs and the affected day/slot ranges.
* [New file] **`custom_components/switch_scheduler/switch.py`** - Switch platform. `async_setup_entry` loads existing schedules and creates a `ScheduleSwitch` entity for each. Listens for `SIGNAL_SCHEDULES_UPDATED` to dynamically add/remove entities. `ScheduleSwitch` extends `SwitchEntity`: `is_on` returns `schedule.active`, `async_turn_on`/`async_turn_off` call `store.async_toggle_active()`, `extra_state_attributes` exposes `entity_ids`, `cadence`, `repeat`, `start_date`, `end_date`. All entities share a single virtual device "Switch Scheduler" via `device_info`.
* [New file] **`custom_components/switch_scheduler/manifest.json`** - Standard HA manifest: domain `switch_scheduler`, config_flow true, iot_class `local_push`, version `0.1.0`, codeowners `@adlaws`, no requirements or dependencies.
* [New file] **`custom_components/switch_scheduler/strings.json`** - Config flow strings for the single user step, abort reason for already_configured.
* [New file] **`custom_components/switch_scheduler/translations/en.json`** - Copy of strings.json.
* [New file] **`custom_components/switch_scheduler/brand/icon.png`** - Placeholder calendar-clock icon (256x256 minimum) required for HACS validation.
* [New file] **`hacs.json`** - HACS manifest with name "Switch Scheduler" and `render_readme: true`.
* [New file] **`.github/workflows/hacs.yml`** - HACS validation workflow.
* [New file] **`.github/workflows/hassfest.yml`** - Hassfest validation workflow.
* [New file] **`.github/workflows/tests.yml`** - Pytest workflow.
* [New file] **`tests/conftest.py`** - Shared fixtures and HA import stubs using `types.ModuleType`.
* [New file] **`tests/test_store.py`** - Tests for schedule CRUD, UUID generation, validation, persistence round-trip.
* [New file] **`tests/test_coordinator.py`** - Tests for slot index calculation across all cadences, day offset mapping, one-off expiry logic.
* [New file] **`tests/test_config_flow.py`** - Tests for successful setup and duplicate abort.
* [New file] **`tests/test_switch.py`** - Tests for switch entity state reflecting schedule active status, toggle on/off, dynamic creation on schedule add, removal on schedule delete.
* [New file] **`tests/test_websocket_api.py`** - Tests for all five commands with valid and invalid payloads, conflict detection.

### Data & Interfaces

* **`SwitchSchedulerData`** dataclass: holds `store: ScheduleStore` and `coordinator: ScheduleCoordinator`. Stored in `hass.data[DOMAIN][entry.entry_id]`.
* **Schedule dict** (as defined in the project plan): `id`, `name`, `entity_ids`, `cadence`, `repeat`, `start_date`, `end_date`, `active`, `slot_minutes`, `slots`.
* **Cadence values**: `"daily"`, `"weekly"`, `"custom"` - string constants in `const.py`.
* **Dispatcher signal**: `SIGNAL_SCHEDULES_UPDATED` - fired by the store on every mutation.
* **WebSocket commands**: registered under `switch_scheduler/` namespace with voluptuous schemas.

### Edge Cases & Risks

* **Time zones**: The coordinator must convert UTC tick times to HA's configured local time zone before computing slot indices. Use `dt_util.now()` which returns timezone-aware local time.
* **Missing entities**: If `hass.states.get(entity_id)` returns `None`, log a warning and skip. Do not remove the entity from the schedule.
* **Service call failures**: Wrap `hass.services.async_call` in try/except, log at WARNING, continue processing.
* **One-off expiry**: After evaluating a custom non-repeating schedule past its `end_date`, call `store.async_toggle_active(id)` to deactivate it.
* **Day offset for weekly**: Use `date.weekday()` (Monday=0, Sunday=6) to map to slot keys `"0"`-`"6"`.
* **Day offset for custom repeating**: `(current_date - start_date).days % num_days`.
* **Empty slots dict**: Valid, means the schedule has no effect. Do not error.

### Testing

* **Store tests**: Test CRUD operations using a mock file-backed store. Verify UUID assignment, round-trip serialisation, validation rejection of bad data.
* **Coordinator tests**: Test slot index calculation with known timestamps across daily/weekly/custom cadences. Test one-off expiry logic. Use mocked `hass` with `states.get()` and `services.async_call()` stubs.
* **Config flow tests**: Test `async_step_user` success path and `already_configured` abort.
* **Switch entity tests**: Test that `ScheduleSwitch.is_on` reflects `schedule.active`. Test toggle on/off calls store. Test dynamic entity creation when a schedule is added and removal when deleted.
* **WebSocket API tests**: Test all five commands with valid payloads and verify responses. Test validation rejection of invalid payloads. Test conflict detection with overlapping schedules across same and different cadence types (daily vs weekly, daily vs custom, weekly vs custom).
* Follow `ha-fujitsu-broadlink-ir` pattern: stub HA imports with `types.ModuleType` so tests run without HA installed.

### Documentation

* No user-facing documentation in Phase 1 (deferred to Phase 3).
* Code should have brief module-level docstrings for each file.

## Implementation Notes

Implementation followed the Design section closely. All files created as planned.

* **`custom_components/switch_scheduler/const.py`** - Constants including DOMAIN, store config, slot defaults, cadence values, dispatcher signal name.
* **`custom_components/switch_scheduler/manifest.json`** - Standard HA manifest with domain `switch_scheduler`, version `0.1.0`.
* **`custom_components/switch_scheduler/config_flow.py`** - Minimal singleton flow. Sets unique ID to DOMAIN, aborts if configured, creates entry on submit.
* **`custom_components/switch_scheduler/store.py`** - `ScheduleStore` with CRUD, UUID generation, validation, default slot generation, dispatcher signal on mutation. Includes `validate_schedule()` and `_default_slots()` helpers.
* **`custom_components/switch_scheduler/coordinator.py`** - `ScheduleCoordinator` with `compute_slot_index()` and `compute_day_key()` pure functions, 15-minute tick listener, immediate startup evaluation, one-off expiry, graceful error handling.
* **`custom_components/switch_scheduler/websocket_api.py`** - Five WebSocket commands with conflict detection via `_find_conflicts()` and `_build_comparison_pairs()` for cross-cadence normalisation.
* **`custom_components/switch_scheduler/switch.py`** - `ScheduleSwitch` entity with dynamic creation/removal via dispatcher signal listener, device grouping under a virtual "Switch Scheduler" device.
* **`custom_components/switch_scheduler/__init__.py`** - Entry point with `SwitchSchedulerData` dataclass, wiring store, coordinator, WebSocket API, and switch platform.
* **`custom_components/switch_scheduler/strings.json`** and **`translations/en.json`** - Config flow strings.
* **`custom_components/switch_scheduler/brand/icon.png`** - 256x256 placeholder icon.
* **`hacs.json`** - HACS manifest.
* **`.github/workflows/hacs.yml`**, **`hassfest.yml`**, **`tests.yml`** - CI workflows.
* **`tests/conftest.py`** - HA import stubs and shared fixtures.
* **`tests/test_store.py`** - 24 tests covering CRUD, validation, defaults, round-trip.
* **`tests/test_coordinator.py`** - 22 tests covering slot index, day key, evaluation, expiry, error handling.
* **`tests/test_config_flow.py`** - 1 test for the singleton flow.
* **`tests/test_switch.py`** - 7 tests for switch entity behaviour.
* **`tests/test_websocket_api.py`** - 10 tests for all five commands plus conflict detection.
* **`pyproject.toml`** - pytest config with `asyncio_mode = "auto"`.

**Deviations from Design:**
* Added `async_set_active(id, active)` to `ScheduleStore` alongside `async_toggle_active` - the coordinator needs to set a schedule directly to inactive (for one-off expiry) rather than toggling. The switch entity's `async_turn_on`/`async_turn_off` also use this for explicit on/off semantics.
* Conflict detection uses a simplified heuristic: it flags any slot where the two schedules disagree (one has 0, the other has 1) as a conflict. This is correct for the on/off case and extensible to richer slot values.

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

**Estimate:** **10** - Very large. ~20 new files across integration code, tests, and CI. Multiple interconnected components (store, coordinator, WebSocket API, switch platform) all built from scratch. Novel patterns (dispatcher-driven dynamic entity management, conflict detection) add complexity beyond boilerplate.

## Verification Notes

### How to Test

1. Copy `custom_components/switch_scheduler/` into a Home Assistant installation's `custom_components/` directory.
2. Restart Home Assistant.
3. Go to Settings > Devices & Services > Add Integration > search "Switch Scheduler".
4. Complete the single-step config flow.
5. Use Developer Tools > WebSocket to send commands (e.g. `{"type": "switch_scheduler/list", "id": 1}`).
6. Create a schedule via the save command and verify the switch entity appears.

### Test Commands

```bash
cd /home/adlaws/workspace/ha-switch-scheduler
source .venv/bin/activate
python -m pytest tests/ -v
```

### Areas of Risk

* The HA import stubs in `conftest.py` are simplified - they may not catch issues that only surface in a real HA environment.
* Conflict detection across weekly/custom cadences uses a simplified all-pairs comparison rather than precise weekday alignment. This may produce false positives for weekly-vs-custom comparisons.

## Technical Release Notes

* New Home Assistant custom integration `switch_scheduler` (v0.1.0).
* Persistent schedule storage via HA Store (`.storage/switch_scheduler.schedules`).
* Schedule executor runs on 15-minute boundaries via `async_track_utc_time_change`.
* WebSocket API with five commands: `switch_scheduler/list`, `get`, `save`, `delete`, `toggle_active`.
* Conflict detection on save returns overlapping schedule information.
* Each schedule exposed as a `switch` entity for automation control.
* No external dependencies. HACS-compatible distribution.

## Customer Release Notes

* New integration: Switch Scheduler lets you create on/off schedules for your switches, lights, and other toggleable devices.
* Schedules can repeat daily, weekly, or over a custom date range.
* Each schedule appears as a switch in Home Assistant, so you can enable or disable schedules via automations.
* Visual schedule editor coming in a future update (Phase 2). For now, schedules can be managed via the developer tools WebSocket API.
