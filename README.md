# OnCue

A Home Assistant custom integration for visual, grid-based scheduling of
switches, lights, fans, climate devices, and any other controllable entity.
Schedule on/off states, light colours, brightness levels, HVAC presets, or
Home Assistant scenes across daily, weekly, or custom date ranges.

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

* **Five schedule types**: on/off, colour, HVAC, brightness, and scene
* Visual grid editor with 15-minute time slots (96 slots per day)
* Current time indicator on the grid
* Click to toggle individual slots, drag to select ranges
* Three cadence modes:
    * **Daily**: one schedule applied every day
    * **Weekly**: per-day schedules for Monday through Sunday
    * **Custom**: date-range schedules (up to 31 days) with optional repeat
* **Colour schedules** with a palette of up to 10 entries supporting solid
  colours, crossfade transitions, colour cycling, and TV simulation mode
* **HVAC schedules** with up to 20 presets controlling temperature, HVAC
  mode, and fan mode
* **Brightness schedules** with up to 20 presets for dimming lights or
  setting fan speeds at different levels throughout the day
* **Scene schedules** with up to 20 presets that activate Home Assistant
  scenes on a timed basis
* Global presets shared across all schedules of the same type
* Each schedule appears as a `switch` entity for automation control
* Conflict detection warns when schedules overlap on the same entity
* Runtime entity overrides to temporarily force an entity on or off
* Automatic revert of external state changes after a configurable delay
* Unavailable entity detection with automatic state recovery
* Bulk actions: fill all, clear all, copy Monday to all days
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

## Quick Start

1. Go to **Settings > Devices & Services**
2. Click **Add Integration** and search for **OnCue**
3. Click to add; no configuration options are needed
4. An **OnCue** panel appears in your sidebar; open it
5. Click **+ Add** to create your first schedule

## "I Want to Turn Things On and Off"

This is the simplest use case: scheduling switches, lights, fans, or
input booleans to turn on and off at set times.

### Creating an On/Off Schedule

1. Open the **OnCue** panel from the sidebar
2. Click **+ Add**
3. Enter a name (e.g. "Porch Light")
4. Set the **Slot Type** to **On/Off**
5. Search and select the entities to control
   (e.g. `switch.porch_light`, `light.front_door`)
6. Choose a cadence:
    * **Daily**: the same pattern repeats every day
    * **Weekly**: set different patterns for each day of the week
    * **Custom**: set a specific date range (see the
      [holiday lights](#i-want-to-set-up-my-lights-while-i-am-away-on-holiday)
      section for details)
7. Paint the grid: click or drag to mark time slots as on (blue) or
   off (grey). Each cell is a 15-minute block
8. Click **Save** — the button is disabled until you make a change and
   pulses gently as a reminder when there are unsaved edits. Changes
   do not take effect until the schedule is saved

### Using the Grid

* **Click** a cell to toggle it on or off
* **Click and drag** across cells to paint a rectangular region
* **All On / All Off** buttons fill or clear every slot
* **Copy Mon to All** (weekly cadence) copies Monday's pattern to
  every other day
* Hover over a cell to see its time range (e.g. "09:00 - 09:15")
* A dashed red line marks the current time
* The current day's row is highlighted for weekly and custom cadences

### Supported Entities

On/off schedules work with any entity that supports `turn_on` and
`turn_off`, including:

* `switch.*`
* `light.*`
* `fan.*`
* `input_boolean.*`

## "I Want to Schedule My Heating and Cooling"

HVAC schedules let you control climate entities with presets that set
the HVAC mode, target temperature, and fan mode on a timed schedule.

### Setting Up HVAC Presets

HVAC presets are global: you define them once, and they are available
to every HVAC schedule.

1. Create a new schedule and set the **Slot Type** to **HVAC**
2. In the preset editor, create presets for each desired state. Each
   preset can include:
    * **HVAC mode**: off, heat, cool, heat_cool, auto, dry, or
      fan_only
    * **Temperature**: target temperature (e.g. 21.5)
    * **Fan mode**: auto, low, medium, medium_low, medium_high, or
      high
    * **Colour**: a display colour used on the schedule grid
    * **Alias** (optional): a friendly name (e.g. "Daytime Comfort")
    * **Icon** (optional): a Material Design Icon identifier
      (e.g. `mdi:fire`)
3. You can define up to 20 presets (at least one must remain)

1. Select the climate entities to control
   (e.g. `climate.living_room`)
2. Choose a cadence (daily or weekly works well for heating/cooling)
3. Select a preset from the palette bar, then click or drag on the
   grid to paint time slots with that preset
4. Use the eraser (X) to clear slots back to "no action"
5. Click **Save**

A slot set to "no action" (empty) means OnCue will not send any
command during that time period, leaving the climate entity in
whatever state it is already in.

### Example: Weekday Heating

* **Morning** (06:00-08:30): "Warm Up" preset at 22 C with heat mode
* **Daytime** (08:30-17:00): "Eco" preset at 18 C with auto mode
* **Evening** (17:00-22:00): "Comfortable" preset at 21 C with heat mode
* **Night** (22:00-06:00): "Sleep" preset at 17 C with auto mode

Use weekly cadence to set a different pattern on weekends, or daily
cadence if every day is the same.

## "I Want to Set Up My Lights While I Am Away on Holiday"

When you are away from home, you can use a custom-cadence schedule to
make your lights follow a realistic pattern that deters intruders.

### Creating a Holiday Schedule

1. Click **+ Add** and name it (e.g. "Holiday Lights")
2. Set the **Slot Type** to **On/Off** (or **Color** for colour
   variety, **Brightness** for realistic dimming patterns, or
   **Scene** to rotate through different room moods)
3. Select the lights you want to control
4. Set the cadence to **Custom**
5. Set the **start date** to the day you leave and the **end date**
   to the day you return (up to 31 days)
6. If your trip is longer than 31 days, enable **Repeat** so the
   pattern loops
7. Paint different on/off patterns for different days so the lights
   do not follow an obviously repetitive pattern
8. Click **Save**

### TV Simulation Mode

For an even more convincing "someone is home" effect, use a colour
schedule with the **TV** palette mode:

1. Set the **Slot Type** to **Color**
2. Add a colour palette entry and set its mode to **TV**
3. Paint the evening slots with this palette entry
4. The light will cycle through pseudo-random colours that mimic the
   flicker of a television, changing every few seconds with a mix of
   snaps and fades

### Controlling the Schedule While Away

Each schedule creates a Home Assistant `switch` entity. You can turn
the holiday schedule on or off from an automation or remotely through
the HA app:

```yaml
automation:
  - alias: "Enable holiday lights when away"
    trigger:
      - platform: state
        entity_id: input_boolean.holiday_mode
        to: "on"
    action:
      - service: switch.turn_on
        target:
          entity_id: switch.oncue_holiday_lights
```

### One-Off vs Repeating Custom Schedules

* **Non-repeating** (repeat off): the schedule automatically
  deactivates after the end date passes
* **Repeating** (repeat on): the pattern loops; the schedule stays
  active until you turn it off manually

## "I Want to Set Up My Lights for the Festive Season"

Colour schedules let you paint each time slot with a specific colour
from a customisable palette, perfect for seasonal or decorative
lighting.

### Setting Up a Colour Palette

Colour palette entries are global, shared across all colour schedules.

1. Create a new schedule and set the **Slot Type** to **Color**
2. In the palette editor, add up to 10 entries. Each entry can use one
   of four modes:

| Mode | Description |
|------|-------------|
| **Solid** | A single static colour |
| **Crossfade** | Smoothly fades from the current colour to the next |
| **Cycle** | Loops through 2-10 colours with snap or fade transitions at a configurable rate |
| **TV** | Pseudo-random colour changes simulating a television |

3. Click the colour swatch to open a colour picker, or set hex values
   directly (e.g. `#ff0000` for red)
4. Remove entries with the X button (at least one must remain)

### Painting a Festive Schedule

1. Select the light entities to control
2. Choose a cadence: **Custom** for a specific holiday period, or
   **Daily** for an ongoing pattern
3. Select a colour from the palette bar, then paint the grid
4. Use the eraser to clear slots back to "no action" (light
   unchanged)
5. Different colours can be painted into different time slots on the
   same day

### Example: Christmas Lights

* Create palette entries for red (`#ff0000`), green (`#00ff00`), and
  a festive cycle entry that alternates between red and green
* Set a custom cadence from December 1st to January 2nd with repeat
  off
* Paint the afternoon/evening slots (16:00-23:00) with alternating
  colours, or use the cycle entry for an animated effect
* The schedule auto-deactivates after January 2nd

## "I Want to Dim My Lights Throughout the Day"

Brightness schedules let you set different light brightness levels
(or fan speeds) at different times of day, without changing the light
colour.

### Setting Up Brightness Presets

Brightness presets are global: you define them once, and they are
available to every brightness schedule.

1. Create a new schedule and set the **Slot Type** to **Brightness**
2. In the preset editor, create presets for each desired level. Each
   preset includes:
    * **Brightness**: a value from 1-255 (displayed as a percentage
      slider)
    * **Colour**: a display colour used on the schedule grid
    * **Alias** (optional): a friendly name (e.g. "Night Light")
    * **Icon** (optional): a Material Design Icon identifier
3. You can define up to 20 presets (at least one must remain)

### Painting a Brightness Schedule

1. Select the light or fan entities to control
   (e.g. `light.living_room`, `fan.bedroom`)
2. Choose a cadence
3. Select a preset from the palette bar, then click or drag on the
   grid to paint time slots with that brightness level
4. Use the eraser (X) to clear slots back to "no action"
5. Click **Save**

### Example: Living Room Lighting

* **Morning** (06:00-08:00): "Wake Up" preset at 60%
* **Daytime** (08:00-18:00): "Full Bright" preset at 100%
* **Evening** (18:00-22:00): "Relaxed" preset at 40%
* **Night** (22:00-06:00): "Night Light" preset at 5%

Use weekly cadence to keep the lights brighter on weekends, or daily
cadence if every day is the same.

### Example: Holiday Lights with Dimming

Combine a brightness schedule with a custom date range for a
realistic "someone is home" effect while you are away:

1. Set the cadence to **Custom** with your travel dates
2. Create presets like "Reading" (70%), "TV Watching" (30%), and
   "Hallway" (15%)
3. Paint varied patterns across different days so the lighting does
   not look automated

## "I Want to Activate Scenes on a Schedule"

Scene schedules let you activate Home Assistant scenes at specific
times. This is useful when you want to control complex multi-device
states (lighting, media, blinds) without the scheduler needing to
know the details — the scene handles everything.

### Setting Up Scene Presets

Scene presets are global: you define them once, and they are available
to every scene schedule.

1. Create a new schedule and set the **Slot Type** to **Scene**
2. In the preset editor, create presets for each scene. Each preset
   includes:
    * **Scene Entity ID**: the Home Assistant scene entity
      (e.g. `scene.movie_night`)
    * **Name**: a display name for the preset
    * **Colour**: a display colour used on the schedule grid
    * **Alias** (optional): a short label for the palette bar
    * **Icon** (optional): a Material Design Icon identifier
3. You can define up to 20 presets (at least one must remain)

### Painting a Scene Schedule

1. Select the entities that your scenes control (these are used for
   conflict detection and override tracking)
2. Choose a cadence
3. Select a scene preset from the palette bar, then paint the grid
4. Use the eraser (X) to clear slots back to "no action"
5. Click **Save**

When a painted slot is reached, OnCue calls `scene.turn_on` with the
preset's scene entity ID. The scene itself defines what happens to
each device.

### Example: Daily Routine

* **Morning** (06:00-08:00): "Morning" scene — kitchen lights on,
  coffee machine on, blinds open
* **Work** (08:00-17:00): "Away" scene — all lights off, blinds
  partially closed
* **Evening** (17:00-21:00): "Relaxed" scene — living room lights
  dimmed, TV bias lighting on
* **Night** (21:00-06:00): "Bedtime" scene — all lights off except
  hallway night light

### Example: Holiday Scene Rotation

Use scenes with a custom date range while on holiday to cycle through
different "moods" each day:

1. Set the cadence to **Custom** with your travel dates and enable
   **Repeat**
2. Create scene presets for scenes like "Quiet Evening", "Movie
   Night", and "Dinner Party" — each controlling different
   combinations of lights, blinds, and media
3. Paint different scenes on different days so the house does not
   follow a repetitive pattern

## Schedule Features Reference

### Cadence Modes

| Cadence | Description | Day Keys |
|---------|-------------|----------|
| **Daily** | Same pattern every day | Single row |
| **Weekly** | Different pattern per weekday | Monday through Sunday |
| **Custom** | Specific date range, 1-31 days, optional repeat | One row per date |

### Schedule Types (Slot Types)

| Type | Values | Entities | Service Called |
|------|--------|----------|---------------|
| **On/Off** | On or off | Any toggleable entity | `homeassistant/turn_on` or `turn_off` |
| **Colour** | Palette entry or empty | `light.*` entities | `light/turn_on` with `rgb_color` |
| **HVAC** | Preset or empty | `climate.*` entities | `climate/set_hvac_mode`, `set_temperature`, `set_fan_mode` |
| **Brightness** | Preset or empty | `light.*`, `fan.*` entities | `light/turn_on` with `brightness` |
| **Scene** | Preset or empty | Any toggleable entity | `scene/turn_on` with the preset's `scene_id` |

An empty slot (value 0) means "no action": OnCue will not send any
command for that time period.

### Entity Overrides

Each entity in a saved schedule can be temporarily overridden to force
it on or off, independent of the schedule's time slots.

* In the entity list for a saved schedule, click **On** or **Off**
  next to an entity to set an override
* Click the same button again to clear it
* Overrides take priority over the scheduled slot value
* Overrides persist until cleared but are lost on Home Assistant
  restart

### Revert External Changes

Each schedule has a configurable revert delay that controls what
happens when an entity is changed externally (e.g. someone flips a
physical switch or uses the HA dashboard).

* **Default**: 3 minutes (180 seconds)
* **Range**: 0 seconds to 60 minutes (3600 seconds)
* **Never**: tick the "Never" checkbox to disable revert entirely

When revert is enabled and an external change is detected, OnCue
waits for the configured delay, then sets the entity back to its
scheduled (or overridden) state. If the entity is changed back to
the expected state before the delay expires, the revert is cancelled.

### Unavailable Entities

If an entity becomes unavailable (device loses power, network issue,
etc.):

* The entity row displays an **UNAVAILABLE** badge
* OnCue skips the entity during evaluation and logs a warning
* When the entity comes back online, OnCue immediately applies the
  correct state rather than waiting for the next 15-minute tick

### Conflict Detection

When saving a schedule, OnCue checks for conflicts with other active
schedules that control the same entities. A conflict occurs when two
schedules assign different non-empty values to the same entity in
overlapping time slots.

* Conflicts are reported as warnings at save time
* Conflicts do not prevent saving
* If conflicting schedules both run, the last one evaluated wins

### Switch Entities and Automation

Each schedule creates a `switch` entity that reflects whether the
schedule is active. The entity ID uses the pattern
`switch.oncue_{name}` where `{name}` is the slugified schedule name
(e.g. a schedule named "Heating" becomes `switch.oncue_heating`).

You can use these entities in automations to enable or disable
schedules programmatically:

```yaml
automation:
  - alias: "Disable heating schedule in summer"
    trigger:
      - platform: state
        entity_id: input_boolean.summer_mode
        to: "on"
    action:
      - service: switch.turn_off
        target:
          entity_id: switch.oncue_heating
```

All schedule switches are grouped under a single "OnCue" device in
Home Assistant.

### How Evaluation Works

The coordinator evaluates all active schedules every 15 minutes
(at :00, :15, :30, and :45). For each schedule, it:

1. Determines the current 15-minute time slot based on local time
2. Determines the applicable day key based on the cadence
3. Reads the slot value (on/off, colour index, HVAC preset index,
   brightness preset index, or scene preset index)
4. Applies any active entity override (overrides take priority)
5. Skips entities that are unavailable or unknown
6. Calls the appropriate Home Assistant service, but only if the
   entity's current state differs from the desired state

Additional behaviours:

* On startup, evaluation runs immediately rather than waiting for the
  next 15-minute boundary
* When an entity transitions from unavailable to available, the
  scheduled state is applied immediately
* For colour schedules using **cycle** or **TV** modes, a sub-slot
  animation timer updates the light colour every few seconds

## Troubleshooting

### Panel Not Appearing After Installation

* Ensure you have restarted Home Assistant after installing
* Check that the integration is configured
  (Settings > Devices & Services > OnCue)
* Clear your browser cache and reload the page

### Entity Not Responding to Schedule

* Verify the entity ID is correct (check in Developer Tools > States)
* Ensure the entity is not `unavailable` or `unknown`; OnCue skips
  these and logs a warning. The UI shows an **UNAVAILABLE** badge
* For colour schedules, ensure the entity is a `light.*` entity that
  supports RGB colour
* For HVAC schedules, ensure the entity is a `climate.*` entity
* For brightness schedules, ensure the entity is a `light.*` or
  `fan.*` entity
* Check the Home Assistant logs for warnings from `oncue`

### Schedule Not Activating

* Verify the schedule is active (green dot in the sidebar, or check
  the switch entity state)
* For custom cadences, verify the date range includes today
* One-off (non-repeating) custom schedules auto-deactivate after
  their end date

### Conflicting Schedules

If two active schedules control the same entity with different values
in the same time slot, both execute and the last one evaluated wins.
The UI warns about conflicts at save time but does not prevent them.

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

* Seed schedules covering daily, weekly, and custom cadences across
  all schedule types (on/off, colour, HVAC, brightness, scene)
* Mock entities across all supported domains (`switch`, `light`,
  `fan`, `input_boolean`, `climate`), including one unavailable entity
* In-memory handling of all WebSocket APIs (list, get, save, delete,
  overrides, presets, unavailable entity tracking)

Changes made in the preview persist in memory until the page is
refreshed.

#### Building for Production

```bash
npm run build
```

This compiles the frontend into a single IIFE bundle at
`custom_components/oncue_scheduler/frontend/oncue-scheduler-panel.js`.

Use `npm run dev` for a watching build that recompiles on source
changes.
