# Switch Scheduler — Project Plan

## Overview

Switch Scheduler is a Home Assistant custom integration, distributed via
HACS, that lets users schedule on/off states for any HA entity with toggle
capability (switches, lights, fans, input booleans, groups, etc.) using a
visual grid-based UI.

The user creates "schedule sets" — named groups of one or more entities
paired with a time-slot grid. The grid divides each day into 96 cells
(15-minute intervals) that the user paints as "on" or "off". A background
executor evaluates active schedules at each 15-minute boundary and calls
`homeassistant.turn_on` or `homeassistant.turn_off` on the target entities.

The integration exposes a full-page HA panel with a two-panel layout —
narrow left sidebar listing all schedules, wide right pane for viewing and
editing — and each schedule set appears as a `switch` entity in HA so that
automations can enable/disable schedules programmatically.

## Goals

| # | Goal |
|---|------|
| 1 | Allow users to select any combination of toggleable HA entities and assign an on/off schedule to them. |
| 2 | Provide a visual grid editor where each cell represents a 15-minute interval, supporting click, drag-select, and bulk operations. |
| 3 | Support daily (1-row template), weekly (7-row Mon–Sun), and custom date-range (up to ~31 days) cadences, with repeating or one-off execution. |
| 4 | Execute schedules reliably — correct entity states at each 15-minute boundary, on HA restart, and on schedule activation. |
| 5 | Expose each schedule set as a `switch` entity so automations can enable/disable schedules. |
| 6 | Design the data model to be extensible to non-boolean slot values (RGB, brightness, temperature) in future versions without breaking changes. |
| 7 | Distribute via HACS with full validation (hassfest + HACS action). |

## Non-Goals

- Controlling non-boolean states (RGB colour, brightness, temperature
  setpoint) — designed for but not implemented in v1.
- Calendar / iCal import or export.
- Integration with HA automations / scripts as schedule sources.
- Mobile-specific UI optimisations (the panel will be responsive but not
  a native mobile experience).
- Sub-15-minute granularity (15-minute is fixed for v1, but the data
  model stores a `slot_minutes` field per schedule for future flexibility).

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Home Assistant Core                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              switch_scheduler integration                │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │   │
│  │  │ Config Flow   │  │  Coordinator │  │  Switch       │  │   │
│  │  │ (setup only)  │  │  (executor)  │  │  Platform     │  │   │
│  │  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │   │
│  │         │                 │                   │           │   │
│  │         │          ┌──────┴───────┐           │           │   │
│  │         │          │  Store       │           │           │   │
│  │         │          │  (JSON)      │◄──────────┘           │   │
│  │         │          └──────┬───────┘                       │   │
│  │         │                 │                               │   │
│  │  ┌──────┴─────────────────┴──────────────────────────┐   │   │
│  │  │            WebSocket API Commands                  │   │   │
│  │  │  ws: schedule/list, schedule/get, schedule/save,   │   │   │
│  │  │      schedule/delete, schedule/toggle_active        │   │   │
│  │  └──────────────────────┬────────────────────────────┘   │   │
│  └─────────────────────────┼────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────┴────────────────────────────────┐   │
│  │              Frontend Panel (LitElement)                  │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐   │   │
│  │  │ Schedule     │  │ Grid Editor  │  │ Entity Picker  │   │   │
│  │  │ List View    │  │ (drag/click) │  │ (selector)     │   │   │
│  │  └─────────────┘  └──────────────┘  └────────────────┘   │   │
│  └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Data flow:**

1. User creates/edits schedules via the frontend panel.
2. Panel sends WebSocket commands to the integration backend.
3. Backend validates and persists schedule data to `Store` (JSON file in
   `.storage/`).
4. Coordinator evaluates active schedules at each 15-minute boundary
   (`:00`, `:15`, `:30`, `:45`) using `async_track_utc_time_change`.
5. Coordinator calls `homeassistant.turn_on` / `homeassistant.turn_off`
   on target entities when the current slot's desired state differs from
   the entity's actual state.
6. Each schedule set is exposed as a `switch` entity — toggling it
   enables/disables schedule execution.

---

## Component Descriptions

### Backend: `custom_components/switch_scheduler/`

#### `__init__.py` — Integration Entry Point

**Responsibilities:**
- Register the integration on config entry setup.
- Initialise the `Store` for schedule persistence.
- Start the `ScheduleCoordinator`.
- Register WebSocket API commands.
- Register the frontend panel.
- Forward setup to the `switch` platform.

**Key functions:**
- `async_setup_entry(hass, entry)` — main setup.
- `async_unload_entry(hass, entry)` — teardown: cancel coordinator
  listener, unregister panel, unload switch platform.

#### `const.py` — Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `DOMAIN` | `"switch_scheduler"` | Integration domain. |
| `STORE_KEY` | `"switch_scheduler.schedules"` | Storage key. |
| `STORE_VERSION` | `1` | Storage schema version. |
| `DEFAULT_SLOT_MINUTES` | `15` | Default minutes per grid cell. |
| `SLOTS_PER_DAY` | `96` | 24 × 60 / 15 (at default granularity). |
| `MAX_CUSTOM_DAYS` | `31` | Maximum days in a custom range. |

#### `store.py` — Persistent Schedule Storage

**Responsibilities:**
- Wrap `homeassistant.helpers.storage.Store` for schedule CRUD.
- Serialise/deserialise schedule data to/from JSON.
- Assign UUIDs to new schedules.

**Data model (JSON schema):**

```json
{
  "schedules": {
    "<uuid>": {
      "id": "<uuid>",
      "name": "Living Room Lights",
      "entity_ids": ["switch.living_room", "light.floor_lamp"],
      "cadence": "weekly",
      "repeat": true,
      "start_date": "2025-01-06",
      "end_date": null,
      "active": true,
      "slot_minutes": 15,
      "slots": {
        "0": [1, 1, 0, 0, ...],
        "1": [0, 0, 1, 1, ...],
        ...
      }
    }
  }
}
```

`slot_minutes` is stored per schedule to allow future granularity
changes. For v1, this is always `15` and the UI does not expose it.

**Slot value encoding:**

Each slot is an integer. For v1, `0` = off, `1` = on. This is
intentionally not a boolean — future versions can use other integer
values or replace with a richer structure (e.g. `{"state": "on",
"brightness": 128, "rgb": [255, 0, 0]}`) without changing the storage
format fundamentally.

**Cadence rules:**

| Cadence | `slots` keys | `start_date` | `end_date` | `repeat` |
|---------|-------------|--------------|------------|----------|
| `daily` | `"0"` (single template day) | ignored | ignored | always `true` |
| `weekly` | `"0"` – `"6"` (Mon=0, Sun=6) | ignored | ignored | always `true` |
| `custom` | `"0"` – `"N-1"` (one per day in range) | required | required | user choice |

#### `coordinator.py` — Schedule Executor

**Responsibilities:**
- Listen for time changes at 15-minute boundaries using
  `async_track_utc_time_change(hass, callback, minute=[0, 15, 30, 45],
  second=0)`.
- On each tick, evaluate all active schedules:
  1. Determine which slot index the current local time maps to.
  2. For custom cadences, determine which day offset the current date
     maps to (accounting for repeat/one-off).
  3. Look up the desired state for each schedule.
  4. Compare desired state to each target entity's current state.
  5. Call `turn_on` or `turn_off` only when state differs.
- On startup or schedule activation, immediately evaluate and correct
  entity states.
- Handle one-off schedules: mark as inactive after the end date passes.

**Time zone handling:**
- Schedules are defined in the user's HA local time zone
  (`hass.config.time_zone`).
- The coordinator converts UTC tick times to local time before slot
  lookup.
- DST transitions: when clocks spring forward, the skipped slots are
  never executed. When clocks fall back, the repeated slots execute
  with the state from the second occurrence (last-write-wins).

**Error handling:**
- If `turn_on` / `turn_off` fails for an entity, log at `WARNING`
  level. Do not stop processing other entities or schedules.
- If an entity no longer exists, log at `WARNING` and skip it (do not
  remove it from the schedule — the user may re-add the entity later).

#### `websocket_api.py` — Frontend Communication

Register WebSocket commands under the `switch_scheduler/` namespace:

| Command | Payload | Response | Purpose |
|---------|---------|----------|---------|
| `switch_scheduler/list` | — | `{ schedules: [...] }` | List all schedules (summary: id, name, entity_ids, cadence, active). |
| `switch_scheduler/get` | `{ schedule_id }` | `{ schedule: {...} }` | Get full schedule including slots. |
| `switch_scheduler/save` | `{ schedule: {...} }` | `{ schedule: {...} }` | Create or update a schedule (upsert by id). |
| `switch_scheduler/delete` | `{ schedule_id }` | `{ success: true }` | Delete a schedule. |
| `switch_scheduler/toggle_active` | `{ schedule_id }` | `{ schedule: {...} }` | Toggle active/paused state. |

**Validation:**
- `entity_ids` must be non-empty; each must be a valid entity ID format;
  each must belong to an entity that supports `homeassistant.turn_on`
  and `homeassistant.turn_off` services.
- `cadence` must be one of `daily`, `weekly`, `custom`.
- For `custom` cadence, `start_date` and `end_date` are required;
  range must be 1–31 days.
- Each slot array must have exactly `24 * 60 / slot_minutes` entries
  (96 at default 15-minute granularity).
- Slot values must be integers (0 or 1 for v1).
- On save, check for **schedule conflicts** — if another active
  schedule targets any of the same entities in overlapping time slots
  with a different desired state, include a `conflicts` array in the
  response listing the conflicting schedule IDs and time ranges. The
  frontend displays these as warnings but does not block the save.

#### `switch.py` — Schedule Switch Entities

Each schedule set is exposed as a `switch` entity:

| Property | Value |
|----------|-------|
| `unique_id` | `switch_scheduler_{schedule_uuid}` |
| `name` | Schedule name (e.g. "Living Room Lights") |
| `is_on` | `schedule.active` |
| `icon` | `mdi:calendar-clock` |
| `extra_state_attributes` | `entity_ids`, `cadence`, `repeat`, `start_date`, `end_date` |
| `device_info` | Single virtual device: "Switch Scheduler" |

Toggling the switch calls `store.toggle_active(schedule_id)` and
notifies the coordinator.

**Dynamic entity management:**
- Entities are created/removed when schedules are created/deleted.
- Use `async_add_entities` for new schedules, entity registry removal
  for deleted ones.
- The switch platform listens for store change events (via a dispatcher
  signal or callback) to stay in sync.

#### `config_flow.py` — Minimal Config Flow

The config flow is intentionally minimal — it exists only to create the
single config entry that bootstraps the integration. All schedule
management happens in the panel.

**Single step: `async_step_user`**
- No user input required.
- Check if already configured (`_abort_if_unique_id_configured`).
- Create entry with title "Switch Scheduler".

This pattern is used by HA integrations that are singleton services
(e.g. `sun`, `met`). The config flow is required by HACS but the
integration only needs one instance.

### Frontend: Panel

#### Technology

- **LitElement** — standard HA frontend framework.
- **HA WebSocket** — for backend communication.
- **CSS Grid** — for the schedule grid layout.

The panel is a single JavaScript file (or a small bundle) served from
the integration directory and registered via
`hass.http.register_static_path` + `async_register_built_in_panel` (or
`frontend.async_register_panel`).

#### Panel Structure

```
custom_components/switch_scheduler/frontend/
├── switch-scheduler-panel.js       # Built/bundled panel entry point
└── src/                            # Source files (if using a build step)
    ├── switch-scheduler-panel.ts   # Panel root component
    ├── schedule-list.ts            # Schedule list view
    ├── schedule-editor.ts          # Schedule editor (entity picker + grid)
    ├── schedule-grid.ts            # Grid component (the interactive grid)
    └── styles.ts                   # Shared styles
```

#### Panel Layout — Two-Panel Interface

The panel uses a master-detail layout:

- **Left sidebar (narrow, ~250–300px):** Always-visible list of
  schedules. Each item shows name, cadence badge, and active/paused
  indicator. Clicking a schedule selects it and opens it in the right
  pane. "Add Schedule" button at the top. Selected item is
  highlighted.
- **Right pane (remaining width):** Displays the selected schedule's
  editor (metadata + grid) or a placeholder/empty state when nothing
  is selected.

On narrow screens (< 768px), the sidebar collapses to a hamburger menu
or overlays the right pane.

#### Right Pane: Schedule Editor

- **Metadata section (top):** Name, entity picker (multi-select,
  filtered to entities supporting `turn_on`/`turn_off`), cadence
  selection (daily / weekly / custom), repeat toggle (for custom only),
  date range picker (for custom only). Save / Cancel / Delete buttons.
- **Conflict warnings:** If the backend reports conflicts with other
  schedules, display a warning banner listing the conflicting schedules
  and time ranges. Warnings are informational — they do not block save.
- **Grid section (below metadata):** The interactive time-slot grid.

#### Schedule Grid

- **Columns:** 96 cells per day (labelled at hour boundaries:
  00:00, 01:00, …, 23:00).
- **Rows:** 1 for daily, 7 for weekly (Mon–Sun labels), N for custom
  (date labels, paginated if > 14 days).
- **Cell states:** on (filled/coloured), off (empty/light).
- **Interactions:**
  - Click a cell to toggle.
  - Click-and-drag to select a rectangular region; release to set all
    selected cells to on or off (context menu or toggle based on the
    first cell's state).
  - Toolbar: "All On", "All Off", "Invert" buttons.
  - For weekly: "Copy Monday to all" convenience action.
- **Pagination (custom cadence):** Show 7 days per page. Page
  navigation (prev/next/jump to date).
- **Responsive:** On narrow screens, the grid scrolls horizontally
  with sticky row labels.

#### Frontend Build — TypeScript + Vite

The panel is authored in TypeScript using LitElement and built with
Vite. Source lives in `frontend/src/`, and the production bundle is
committed to the repo at
`custom_components/switch_scheduler/frontend/switch-scheduler-panel.js`
so that HACS installations work without requiring end users to run a
build step.

Development workflow:

```bash
cd frontend/
npm install
npm run build          # Production build → ../custom_components/.../frontend/
npm run dev            # Watch mode for development
```

Vite config targets ES2020 (HA frontend baseline), outputs a single
IIFE bundle, and externalises `lit` (provided by HA at runtime).

---

## Repository Layout

```
ha-switch-scheduler/
├── custom_components/
│   └── switch_scheduler/
│       ├── __init__.py
│       ├── manifest.json
│       ├── config_flow.py
│       ├── const.py
│       ├── store.py
│       ├── coordinator.py
│       ├── websocket_api.py
│       ├── switch.py
│       ├── strings.json
│       ├── translations/
│       │   └── en.json
│       ├── brand/
│       │   └── icon.png
│       └── frontend/
│           └── switch-scheduler-panel.js   # Built output (committed)
├── frontend/                               # Frontend source (TS + Vite)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── switch-scheduler-panel.ts
│       ├── schedule-list.ts
│       ├── schedule-editor.ts
│       ├── schedule-grid.ts
│       └── styles.ts
├── tests/
│   ├── conftest.py
│   ├── test_store.py
│   ├── test_coordinator.py
│   ├── test_config_flow.py
│   ├── test_switch.py
│   └── test_websocket_api.py
├── .github/
│   └── workflows/
│       ├── hacs.yml
│       ├── hassfest.yml
│       └── tests.yml
├── hacs.json
├── README.md
├── LICENSE
└── .gitignore
```

---

## Data Formats

### Schedule Object (full)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Porch Lights",
  "entity_ids": ["switch.porch_light", "switch.garden_spots"],
  "cadence": "weekly",
  "repeat": true,
  "start_date": null,
  "end_date": null,
  "active": true,
  "slot_minutes": 15,
  "slots": {
    "0": [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    "1": [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1]
  }
}
```

The example above shows a weekly schedule for Monday (key `"0"`) and
Tuesday (key `"1"`) with porch lights on from 18:00–23:59 (slots
72–95). Keys `"2"`–`"6"` are omitted for brevity but follow the same
pattern.

### Schedule Summary (list response)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Porch Lights",
  "entity_ids": ["switch.porch_light", "switch.garden_spots"],
  "cadence": "weekly",
  "repeat": true,
  "active": true
}
```

Slots are excluded from the list response to reduce payload size.

---

## Build & Integration

### Python Backend

- **No external dependencies** — the integration uses only HA core APIs
  and the Python standard library.
- **`manifest.json`**: `"requirements": []`, `"dependencies": []`.
- **Testing:** pytest. Tests mock HA APIs using `unittest.mock` and
  custom stubs (following the pattern from `ha-fujitsu-broadlink-ir`).

### Frontend

- **TypeScript + Vite** from day one. Source in `frontend/src/`, built
  output committed to
  `custom_components/switch_scheduler/frontend/switch-scheduler-panel.js`.
- `npm run build` produces a single IIFE bundle targeting ES2020.
- `npm run dev` runs Vite in watch mode for rapid iteration.

### CI Workflows

**`.github/workflows/hacs.yml`:**
```yaml
name: HACS Validation
on: [push, pull_request]
jobs:
  hacs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hacs/action@main
        with:
          category: integration
```

**`.github/workflows/hassfest.yml`:**
```yaml
name: Hassfest
on: [push, pull_request]
jobs:
  hassfest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: home-assistant/actions/hassfest@master
```

**`.github/workflows/tests.yml`:**
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install pytest
      - run: pytest tests/
```

### HACS Distribution

- `hacs.json` at repo root with `"name": "Switch Scheduler"` and
  `"render_readme": true`.
- `manifest.json` with all required fields (see Repository Layout).
- `brand/icon.png` — a calendar-clock style icon (256×256 minimum).
- GitHub Release created from a version tag for HACS visibility.

---

## Phased Delivery

### Phase 1 — Backend Foundation

**Deliverables:**
- Integration scaffold: `manifest.json`, `hacs.json`, `const.py`,
  `config_flow.py` (minimal singleton), `strings.json`,
  `translations/en.json`.
- `store.py` with full CRUD for schedules.
- `coordinator.py` with 15-minute tick evaluation and entity state
  management.
- `websocket_api.py` with all five commands.
- `switch.py` with dynamic schedule switch entities.
- `__init__.py` tying it all together.
- Unit tests for store, coordinator, and WebSocket API.
- CI workflows (HACS, hassfest, tests).

**Exit criteria:** The integration installs via HACS, creates a config
entry, and can create/evaluate schedules via WebSocket commands (testable
via HA developer tools).

### Phase 2 — Frontend Panel

**Deliverables:**
- Vite + TypeScript project setup in `frontend/`.
- Panel registration in `__init__.py`.
- Two-panel layout: left sidebar schedule list + right pane editor.
- Schedule editor: metadata form + interactive grid.
- Grid interactions: click, drag-select, bulk actions.
- Conflict warning display.
- Pagination for custom cadences > 14 days.
- Responsive layout (sidebar collapse on narrow screens).

**Exit criteria:** Full end-to-end workflow — create, view, edit, delete,
pause/resume schedules — works from the HA UI.

### Phase 3 — Polish & Hardening

**Deliverables:**
- DST transition handling and edge case tests.
- Midnight rollover testing.
- Entity availability checks (warn if target entity is unavailable).
- One-off schedule expiry (auto-deactivate after end date).
- Schedule validation improvements (warn on empty schedules).
- UI polish: loading states, error toasts, confirmation dialogs for
  delete.
- Documentation: `README.md` with installation, usage, and screenshots.

**Exit criteria:** Integration is robust enough for daily use and has
complete user-facing documentation.

### Phase 4 — Future Extensibility Prep (Optional)

Not part of v1 delivery but documented here for reference:
- Refactor slot value from integer to a typed structure.
- Add "slot type" selector to the editor (on/off, colour, brightness).
- Per-slot value editor (colour picker, brightness slider).
- This phase validates the extensibility of the data model designed in
  Phase 1.

---

## Test Strategy

### Unit Tests

| Test File | Covers |
|-----------|--------|
| `test_store.py` | CRUD operations, UUID generation, validation, persistence round-trip. |
| `test_coordinator.py` | Slot index calculation for all cadences, DST transitions, midnight rollover, one-off expiry, entity state diffing, error handling for missing entities. |
| `test_config_flow.py` | Successful setup, duplicate abort. |
| `test_switch.py` | Switch entity state reflects schedule active status, toggle works, dynamic creation/removal. |
| `test_websocket_api.py` | All commands with valid and invalid payloads. |

### Key Edge Cases

- **Midnight rollover:** A schedule slot spanning 23:45–00:15 crosses
  day boundaries. The coordinator must handle this correctly for all
  cadences.
- **DST spring forward:** 02:00–03:00 disappears. Slots in the skipped
  hour are never evaluated (correct — nothing to do).
- **DST fall back:** 01:00–02:00 repeats. Slots in the repeated hour
  evaluate twice (second occurrence wins — same state, so no-op).
- **HA restart mid-schedule:** On startup, the coordinator must evaluate
  the current slot immediately, not wait for the next 15-minute
  boundary.
- **Entity removed:** If a target entity no longer exists, log a warning
  and skip. Do not crash or remove the entity from the schedule.
- **Empty schedule:** A schedule with all slots set to "off" is valid
  (turns everything off and keeps it off).
- **Overlapping schedules:** Two schedules targeting the same entity.
  Both execute; last one evaluated wins. The UI warns about conflicts
  at save time but does not prevent them.

### Testing Without HA

Follow the pattern from `ha-fujitsu-broadlink-ir`: stub HA imports using
`types.ModuleType` so that pure-Python logic (store serialisation, slot
index calculation, cadence mapping) can be tested without a running HA
instance.

---

## Security Considerations

- **Entity access:** The WebSocket API commands are protected by HA's
  authentication. Only authenticated users can create/modify schedules.
- **Input validation:** All WebSocket payloads are validated with
  `vol.Schema` (voluptuous) before processing. Entity IDs are format-
  checked but not verified against the entity registry at save time
  (they may not exist yet).
- **No external network access:** The integration communicates only with
  the local HA instance. No outbound HTTP/HTTPS calls.
- **Storage:** Schedule data is stored in HA's `.storage/` directory,
  which is protected by the OS file permissions of the HA installation.

---

## Resolved Design Decisions

| # | Decision | Resolution |
|---|----------|------------|
| 1 | **Panel layout** | Two-panel interface — narrow left sidebar with schedule list, wide right pane for editing. No separate Lovelace card in v1. |
| 2 | **Entity filtering** | Show any entity that supports `homeassistant.turn_on` / `homeassistant.turn_off` services. |
| 3 | **Schedule conflicts** | Warn in v1. Backend detects conflicts on save and returns them; frontend displays warning banners. Conflicts are informational, not blocking. |
| 4 | **Slot granularity** | Store `slot_minutes` per schedule in the data model. Fixed at 15 for v1 (not exposed in UI), but the field exists for future granularity options. |
| 5 | **Frontend build tooling** | TypeScript + Vite from day one. Source in `frontend/`, built output committed to `custom_components/.../frontend/`. |
| 6 | **Storage** | HA Store (`.storage/` JSON file). Config entry options are not suited for large, frequently-changing data. |
