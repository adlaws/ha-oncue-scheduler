# Implement Frontend Panel (Phase 2)

## Story

As a Home Assistant user, I want a visual panel in the HA UI where I can create, view, edit, and delete schedules using an interactive time-slot grid so that I can manage my device schedules without using developer tools.

## Description

Build the frontend panel for the Switch Scheduler integration. The panel uses a two-panel master-detail layout: a narrow left sidebar listing all schedules, and a wide right pane for editing the selected schedule's metadata and time-slot grid. The panel communicates with the Phase 1 backend via the existing WebSocket API.

The frontend is authored in TypeScript using LitElement and built with Vite. The production bundle is committed to the repo so HACS installations work without a build step.

**Technical Context**

* Phase 1 backend is complete with WebSocket API: `list`, `get`, `save`, `delete`, `toggle_active`
* Project plan: `.plans/001-switch-scheduler-project-plan.md`
* Frontend source: `frontend/src/`
* Built output: `custom_components/switch_scheduler/frontend/switch-scheduler-panel.js`

## Acceptance Criteria

* [] Vite + TypeScript project set up in `frontend/` with `npm run build` producing a single JS bundle
* [] Built bundle committed to `custom_components/switch_scheduler/frontend/switch-scheduler-panel.js`
* [] Panel registered in `__init__.py` via `hass.http.register_static_path` and HA panel registration
* [] Two-panel layout: left sidebar (schedule list) + right pane (editor)
* [] Left sidebar shows all schedules with name, cadence badge, and active/paused indicator
* [] Clicking a schedule in the sidebar selects it and shows its editor in the right pane
* [] "Add Schedule" button creates a new schedule
* [] Schedule editor shows metadata fields: name, entity ID input (comma-separated or multi-line), cadence selector, repeat toggle (custom only), date range picker (custom only)
* [] Schedule grid renders 96 columns (15-min slots) per day, with rows matching the cadence (1 for daily, 7 for weekly, N for custom)
* [] Grid supports click-to-toggle individual cells
* [] Grid supports click-and-drag to select a rectangular region and set on/off
* [] Grid toolbar with "All On", "All Off", "Invert" bulk actions
* [] Save, Cancel, and Delete buttons work correctly via WebSocket API
* [] Conflict warnings displayed when backend returns conflicts on save
* [] Pagination for custom cadences > 14 days
* [] On narrow screens (< 768px), sidebar collapses or overlays
* [] Panel loads and renders in a Home Assistant instance
* [] All existing Phase 1 tests still pass

## Design

### Approach

Build a LitElement-based HA panel using TypeScript + Vite. The panel is a single custom element `<switch-scheduler-panel>` that receives the `hass` object from HA and uses WebSocket commands to communicate with the backend. The panel is registered in `__init__.py` using `hass.http.register_static_path` for the JS bundle and `hass.components.frontend.async_register_built_in_panel` to add a sidebar entry.

The Vite build produces a single IIFE bundle that self-registers the custom element. HA injects the `hass` property at runtime. The bundle does NOT externalise `lit` since HA does not reliably expose it globally; instead it bundles a minimal lit dependency.

### Key Changes

* [New file] **`frontend/package.json`** - Node project with dependencies: `lit`, `@lit/reactive-element`. Dev deps: `typescript`, `vite`.
* [New file] **`frontend/tsconfig.json`** - TypeScript config targeting ES2020, strict mode, JSX support for lit decorators.
* [New file] **`frontend/vite.config.ts`** - Vite config: library mode, IIFE format, single output file written to `../custom_components/switch_scheduler/frontend/switch-scheduler-panel.js`.
* [New file] **`frontend/src/switch-scheduler-panel.ts`** - Root panel component. Receives `hass` and `panel` properties from HA. Manages selected schedule state. Renders sidebar + right pane layout. Fetches schedule list on connect.
* [New file] **`frontend/src/schedule-list.ts`** - `<schedule-list>` component. Renders schedule items in the sidebar with name, cadence badge (Daily/Weekly/Custom), active/paused toggle. Fires `schedule-selected` and `schedule-add` custom events.
* [New file] **`frontend/src/schedule-editor.ts`** - `<schedule-editor>` component. Metadata form (name input, entity ID list, cadence dropdown, repeat checkbox, date range inputs). Save/Cancel/Delete buttons. Conflict warning banner. Embeds `<schedule-grid>`.
* [New file] **`frontend/src/schedule-grid.ts`** - `<schedule-grid>` component. Renders CSS Grid with 96 columns per day row. Handles click, mousedown+mousemove drag selection, and bulk toolbar actions. Fires `slots-changed` event.
* [New file] **`frontend/src/styles.ts`** - Shared CSS template literals for HA theme integration (using `--primary-color`, `--card-background-color`, etc.).
* [New file] **`frontend/src/types.ts`** - TypeScript interfaces: `Schedule`, `ScheduleSummary`, `Conflict`, `HassPanelInfo`.
* [Modified] **`custom_components/switch_scheduler/__init__.py`** - Add panel registration in `async_setup_entry`: `register_static_path` for the JS file, `async_register_built_in_panel` for sidebar entry. Add cleanup in `async_unload_entry`.

### Data & Interfaces

TypeScript interfaces:

```typescript
interface Schedule {
  id: string;
  name: string;
  entity_ids: string[];
  cadence: "daily" | "weekly" | "custom";
  repeat: boolean;
  start_date: string | null;
  end_date: string | null;
  active: boolean;
  slot_minutes: number;
  slots: Record<string, number[]>;
}

interface Conflict {
  schedule_id: string;
  schedule_name: string;
  overlapping_entities: string[];
  conflicting_slot_count: number;
}
```

WebSocket calls use `hass.connection.sendMessagePromise()`:
- List: `{type: "switch_scheduler/list"}`
- Get: `{type: "switch_scheduler/get", schedule_id: string}`
- Save: `{type: "switch_scheduler/save", schedule: Schedule}`
- Delete: `{type: "switch_scheduler/delete", schedule_id: string}`
- Toggle: `{type: "switch_scheduler/toggle_active", schedule_id: string}`

### Grid Implementation Details

- CSS Grid with `grid-template-columns: auto repeat(96, 1fr)` per row.
- Row label (left sticky column): day name or date.
- Hour markers every 4 cells along the top header.
- Cell colors: on = `var(--primary-color)`, off = `var(--card-background-color)`.
- Drag selection: on `mousedown`, record start cell. On `mousemove` with button held, highlight rectangular region. On `mouseup`, set all cells in region to the opposite of the start cell's state.
- Touch support: `touchstart`/`touchmove`/`touchend` mapped to same logic.
- Pagination for custom > 14 days: show 7 days per page, prev/next buttons.

### Edge Cases & Risks

- **HA panel registration API**: `async_register_built_in_panel` vs `frontend.async_register_panel` - the approach may need adjustment depending on the HA version. Use the simpler `hass.components.frontend.async_register_built_in_panel` approach.
- **Entity picker**: For v1, use a simple multi-line text input for entity IDs rather than building a full HA entity picker component. A proper entity picker requires HA frontend dependencies that are complex to bundle.
- **Bundle size**: Bundling lit adds ~15-20KB gzipped. Acceptable for a panel.
- **No hot reload in HA**: Development requires building and refreshing the HA page. `npm run dev` watches and rebuilds but cannot inject into the HA runtime.

### Testing

- Phase 2 is frontend-only; no new Python tests needed.
- All 61 existing Phase 1 tests must continue to pass.
- Manual testing in an HA instance is the primary verification method for the panel.
- The `__init__.py` panel registration change should not break the existing test stubs.

### Documentation

- No user-facing documentation changes in Phase 2 (deferred to Phase 3).

## Implementation Notes

### Files Created

* `frontend/package.json` - Node project with lit, typescript, vite
* `frontend/tsconfig.json` - TypeScript config (ES2020, strict, decorators)
* `frontend/vite.config.ts` - IIFE library build targeting `custom_components/switch_scheduler/frontend/`
* `frontend/src/types.ts` - Schedule, ScheduleSummary, Conflict, HomeAssistant interfaces
* `frontend/src/styles.ts` - Shared CSS using HA CSS custom properties
* `frontend/src/schedule-list.ts` - Sidebar schedule list with cadence badges and active indicators
* `frontend/src/schedule-grid.ts` - 96-column CSS Grid with drag selection, touch support, bulk actions, pagination
* `frontend/src/schedule-editor.ts` - Metadata form + grid, save/cancel/delete, conflict banner
* `frontend/src/switch-scheduler-panel.ts` - Root panel with sidebar + main layout, responsive toggle

### Files Modified

* `custom_components/switch_scheduler/__init__.py` - Added panel registration via `register_static_path` + `async_register_built_in_panel`, cleanup in unload
* `tests/conftest.py` - Added `hass.http` and `hass.components` mocks, added `homeassistant.components.frontend` stub module

### Build Output

* `custom_components/switch_scheduler/frontend/switch-scheduler-panel.js` - 44.9 kB (13 kB gzipped) IIFE bundle

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

**Estimate:** **10** - Very large. Multiple interconnected LitElement components with complex grid interaction (drag selection, pagination), Vite build pipeline setup, and HA panel registration. The grid drag-select and responsive layout are the most complex parts.

## Verification Notes

* All 61 Phase 1 tests pass (`pytest tests/ -v`)
* Frontend builds cleanly with `cd frontend && npm run build`
* Bundle size: 44.9 kB (13 kB gzipped) - within acceptable range
* Panel registration adds sidebar entry with `mdi:calendar-clock` icon
* Panel cleanup in `async_unload_entry` calls `async_remove_panel`

## Technical Release Notes

* Added LitElement frontend panel with Vite build pipeline
* Panel registered as custom HA sidebar panel at `/switch_scheduler`
* Frontend bundle committed for HACS compatibility (no build step required for end users)
* Grid supports drag-select, touch, bulk actions, and pagination for custom cadences > 14 days

## Customer Release Notes

* New "Switch Scheduler" panel in the Home Assistant sidebar
* Create, edit, and delete schedules with a visual time-slot grid
* Drag to select multiple time slots at once
* Supports daily, weekly, and custom date-range schedules
* Responsive layout for mobile and tablet
