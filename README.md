# OnCue

A Home Assistant custom integration that lets you schedule on/off states
for any toggleable entity using a visual grid-based UI.

[![HACS Validation][hacs-badge]][hacs-url]
[![Hassfest Validation][hassfest-badge]][hassfest-url]
[![Tests][tests-badge]][tests-url]

[hacs-badge]: https://github.com/adlaws/oncue-scheduler/actions/workflows/hacs.yml/badge.svg
[hacs-url]: https://github.com/adlaws/oncue-scheduler/actions/workflows/hacs.yml
[hassfest-badge]: https://github.com/adlaws/oncue-scheduler/actions/workflows/hassfest.yml/badge.svg
[hassfest-url]: https://github.com/adlaws/oncue-scheduler/actions/workflows/hassfest.yml
[tests-badge]: https://github.com/adlaws/oncue-scheduler/actions/workflows/tests.yml/badge.svg
[tests-url]: https://github.com/adlaws/oncue-scheduler/actions/workflows/tests.yml

## Features

* Schedule on/off states for switches, lights, fans, input booleans,
  and any other toggleable entity
* Visual grid editor with 15-minute time slots (96 slots per day)
* Current time indicator on the grid with dashed vertical line
* Click to toggle individual slots, drag to select ranges
* Three cadence modes:
    * **Daily** - one schedule applied every day
    * **Weekly** - per-day schedules for Monday through Sunday
    * **Custom** - date-range schedules with optional repeat
* Each schedule appears as a `switch` entity for automation control
* Conflict detection warns when schedules overlap on the same entity
* Runtime entity overrides to temporarily force an entity on or off
* Automatic revert of external state changes after a configurable delay
* Unavailable entity detection with visual indicator in the UI
* Automatic state recovery when an unavailable entity comes back online
* Bulk actions: set all slots on/off, copy Monday to all days
* Responsive layout with collapsible sidebar on small screens

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to **Integrations**
3. Click the three-dot menu and select **Custom repositories**
4. Add `https://github.com/adlaws/oncue-scheduler` as an **Integration**
5. Search for "OnCue" and install it
6. Restart Home Assistant

### Manual

1. Download the latest release from the
   [releases page](https://github.com/adlaws/oncue-scheduler/releases)
2. Copy the `custom_components/oncue_scheduler/` folder to your
   Home Assistant `custom_components/` directory
3. Restart Home Assistant

## Configuration

1. Go to **Settings > Devices & Services**
2. Click **Add Integration**
3. Search for "OnCue"
4. Click to add - no configuration options are needed

The integration creates a single config entry and adds an "OnCue"
panel to your sidebar.

## Usage

### Creating a Schedule

1. Open the **OnCue** panel from the sidebar
2. Click **+ Add** in the left sidebar
3. Enter a name for the schedule
4. Search and select the entities you want to control
   (e.g. `switch.living_room`)
5. Select a cadence:
    * **Daily**: one row of time slots applied every day
    * **Weekly**: seven rows, one per weekday (Monday through Sunday)
    * **Custom**: specify a date range with optional repeat
6. Paint the time slots on the grid - blue slots are "on",
   grey slots are "off"
7. Click **Save**

### Using the Grid

* **Click** a cell to toggle it on/off
* **Click and drag** to select a rectangular region of cells
* **All On / All Off** buttons set every slot in the schedule
* **Copy Mon to All** (weekly cadence) copies Monday's pattern
  to all days
* Hover over a cell to see its time range (e.g. "09:00 - 09:15")
* A dashed red line marks the current time, with time labels above
  and below the grid
* For **weekly** schedules, the current day's row is highlighted
  with a yellow background
* For **custom** schedules, today's row is highlighted and past
  dates are faded

### Entity Overrides

Each entity in a saved schedule can be temporarily overridden to
force it on or off, independent of the schedule's time slots. In the
entity list for an existing schedule, click the **On** or **Off**
button next to an entity to set an override. Click the same button
again to clear it. Overrides persist until cleared and take priority
over the scheduled slot value during evaluation.

### Unavailable Entities

If an entity in an active schedule becomes unavailable (e.g. a device
loses power, batteries run out, or it is unplugged), the entity row
in the editor displays an **UNAVAILABLE** badge. The coordinator
skips unavailable entities during evaluation and logs a warning.

When the entity comes back online, the coordinator detects the state
transition and immediately applies the correct scheduled state
(respecting any active override), rather than waiting for the next
15-minute evaluation tick.

### Revert External Changes

Each schedule has a configurable revert delay (default: 3 minutes).
When an entity is changed externally (e.g. someone flips a physical
switch), the coordinator detects the change and automatically reverts
the entity to its scheduled or overridden state after the delay.
Set the delay to **Never** to disable revert for a schedule.

### Controlling Schedules via Automations

Each schedule creates a `switch` entity
(e.g. `switch.oncue_my_schedule`). You can use this entity in
automations to enable or disable schedules programmatically:

```yaml
automation:
  - alias: "Disable holiday schedule when home"
    trigger:
      - platform: state
        entity_id: person.me
        to: "home"
    action:
      - service: switch.turn_off
        target:
          entity_id: switch.oncue_holiday_lights
```

### How Evaluation Works

The coordinator evaluates all active schedules every 15 minutes
(at :00, :15, :30, :45). For each schedule, it:

1. Determines the current time slot (based on local time)
2. Determines the current day key (based on the cadence)
3. Reads the slot value (on or off)
4. Applies any active override for the entity
5. Skips entities that are unavailable or unknown (logs a warning)
6. Calls `homeassistant.turn_on` or `homeassistant.turn_off` on each
   target entity (only if the entity's current state differs)

On startup, the coordinator evaluates immediately rather than waiting
for the next 15-minute boundary. It also monitors entity state
changes: when an entity transitions from unavailable to available,
the scheduled state is applied immediately.

## Development

### Frontend Dev Preview

The frontend can be previewed locally in a browser without a running
Home Assistant instance. A mock `hass` object provides fake entities
and WebSocket responses so all UI interactions work.

#### Prerequisites

```bash
cd frontend
npm install
```

#### Running the Dev Server

```bash
npm run preview
```

This starts a Vite dev server at `http://localhost:5173/` with
hot-reload. The page includes:

* A simulated HA header bar
* **Toggle Dark** button to switch between light and dark themes
* **Toggle Narrow** button to test the responsive/mobile layout

#### Mock Data

The dev harness (`frontend/dev/mock-hass.ts`) provides:

* Seed schedules (daily, weekly, and a paused schedule)
* Mock entities across all supported domains (`switch`, `light`,
  `fan`, `input_boolean`), including one unavailable entity to
  demonstrate the unavailability indicator
* In-memory handling of all WebSocket APIs (list, get, save, delete,
  overrides, unavailable entity tracking)

Changes made in the preview (creating/editing/deleting schedules)
persist in memory until the page is refreshed.

#### Building for Production

```bash
npm run build
```

This compiles the frontend into a single IIFE bundle at
`custom_components/oncue_scheduler/frontend/oncue-scheduler-panel.js`.

Use `npm run dev` for a watching build that recompiles on source
changes.

## Troubleshooting

### Panel not appearing after installation

* Ensure you have restarted Home Assistant after installing
* Check that the integration is configured
  (Settings > Devices & Services > OnCue)
* Clear your browser cache and reload the page

### Entity not responding to schedule

* Verify the entity ID is correct
  (check in Developer Tools > States)
* Ensure the entity is not in an `unavailable` or `unknown` state;
  the coordinator skips entities in these states and logs a warning.
  Unavailable entities are flagged in the UI with an **UNAVAILABLE**
  badge. When the entity comes back online, the scheduled state is
  applied automatically
* Check the Home Assistant logs for warnings from `oncue`

### Schedule not activating

* Verify the schedule is active (green dot in the sidebar, or check
  the switch entity state)
* For custom cadences, verify the date range includes today
* One-off (non-repeating) custom schedules auto-deactivate after
  their end date

### Conflicting schedules

If two active schedules control the same entity with different slot
values, both execute and the last one evaluated wins. The UI warns
about conflicts at save time but does not prevent them.
