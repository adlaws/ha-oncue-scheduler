"""Schedule coordinator - evaluates schedules at 15-minute boundaries."""

from __future__ import annotations

import logging
from datetime import date, datetime
from typing import Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_utc_time_change,
)
import homeassistant.util.dt as dt_util

from .const import (
    CADENCE_CUSTOM,
    CADENCE_DAILY,
    CADENCE_WEEKLY,
    EVENT_OVERRIDES_CHANGED,
    SIGNAL_SCHEDULES_UPDATED,
    SLOT_TYPE_COLOR,
    SLOT_TYPE_ON_OFF,
)
from .slot_values import compute_animated_color, interpret_slot_value, normalize_palette_entry

_LOGGER = logging.getLogger(__name__)


def compute_slot_index(local_now: datetime, slot_minutes: int) -> int:
    """Compute the slot index for a given local time."""
    return (local_now.hour * 60 + local_now.minute) // slot_minutes


def compute_day_key(
    schedule: dict[str, Any], local_date: date
) -> str | None:
    """Compute the slot day key for a schedule, or None if outside range."""
    cadence = schedule["cadence"]

    if cadence == CADENCE_DAILY:
        return "0"

    if cadence == CADENCE_WEEKLY:
        return str(local_date.weekday())

    if cadence == CADENCE_CUSTOM:
        start_str = schedule.get("start_date")
        end_str = schedule.get("end_date")
        if not start_str or not end_str:
            return None
        start_d = date.fromisoformat(start_str) if isinstance(start_str, str) else start_str
        end_d = date.fromisoformat(end_str) if isinstance(end_str, str) else end_str

        if schedule.get("repeat"):
            num_days = (end_d - start_d).days + 1
            if num_days <= 0:
                return None
            offset = (local_date - start_d).days % num_days
            return str(offset)
        else:
            if local_date < start_d or local_date > end_d:
                return None
            return str((local_date - start_d).days)

    return None


class ScheduleCoordinator:
    """Evaluates active schedules and controls target entities."""

    def __init__(self, hass: HomeAssistant, store: Any) -> None:
        self._hass = hass
        self._store = store
        self._unsub_time: CALLBACK_TYPE | None = None
        self._unsub_signal: CALLBACK_TYPE | None = None
        self._unsub_state: CALLBACK_TYPE | None = None
        # Runtime overrides: {schedule_id: {entity_id: "on"|"off"}}
        self._overrides: dict[str, dict[str, str]] = {}
        # Pending revert timers: {entity_id: cancel_callback}
        self._revert_timers: dict[str, CALLBACK_TYPE] = {}
        # Guard: entities currently being set by the coordinator itself
        self._applying: set[str] = set()
        # Entities that are currently unavailable/unknown
        self._unavailable: set[str] = set()
        # Sub-slot timer for animated colour modes (~5s interval)
        self._unsub_anim: CALLBACK_TYPE | None = None
        # Last-sent animated colour per entity to avoid redundant calls
        self._last_anim_color: dict[str, list[int]] = {}

    async def async_start(self) -> None:
        self._unsub_time = async_track_utc_time_change(
            self._hass,
            self._async_on_tick,
            minute=[0, 15, 30, 45],
            second=0,
        )
        self._unsub_signal = async_dispatcher_connect(
            self._hass,
            SIGNAL_SCHEDULES_UPDATED,
            self._async_on_schedules_updated,
        )
        self._refresh_state_listeners()
        self._refresh_animation_timer()
        # Evaluate immediately on startup
        await self._async_evaluate()

    @callback
    def async_stop(self) -> None:
        if self._unsub_time:
            self._unsub_time()
            self._unsub_time = None
        if self._unsub_signal:
            self._unsub_signal()
            self._unsub_signal = None
        if self._unsub_state:
            self._unsub_state()
            self._unsub_state = None
        if self._unsub_anim:
            self._unsub_anim()
            self._unsub_anim = None
        for cancel in self._revert_timers.values():
            cancel()
        self._revert_timers.clear()
        self._last_anim_color.clear()

    async def _async_on_tick(self, now: datetime) -> None:
        await self._async_evaluate()

    async def _async_on_schedules_updated(self) -> None:
        self._refresh_state_listeners()
        self._refresh_animation_timer()
        await self._async_evaluate()

    async def _async_evaluate(self) -> None:
        local_now = dt_util.now()
        local_date = local_now.date()

        for schedule in list(self._store.schedules.values()):
            if not schedule.get("active"):
                continue

            # Expire one-off custom schedules past their end date
            if (
                schedule["cadence"] == CADENCE_CUSTOM
                and not schedule.get("repeat")
                and schedule.get("end_date")
            ):
                end_d = schedule["end_date"]
                if isinstance(end_d, str):
                    end_d = date.fromisoformat(end_d)
                if local_date > end_d:
                    _LOGGER.info(
                        "Deactivating expired one-off schedule '%s'",
                        schedule.get("name"),
                    )
                    await self._store.async_set_active(schedule["id"], False)
                    continue

            slot_minutes = schedule.get("slot_minutes", 15)
            slot_index = compute_slot_index(local_now, slot_minutes)
            day_key = compute_day_key(schedule, local_date)
            if day_key is None:
                continue

            slots = schedule.get("slots", {})
            day_slots = slots.get(day_key)
            if not day_slots or slot_index >= len(day_slots):
                continue

            desired_state = day_slots[slot_index]
            slot_type = schedule.get("slot_type", SLOT_TYPE_ON_OFF)

            for entity_id in schedule.get("entity_ids", []):
                override = self._overrides.get(schedule["id"], {}).get(entity_id)
                if override is not None:
                    override_desired = 1 if override == "on" else 0
                    await self._async_apply_state(entity_id, override_desired, slot_type, schedule)
                else:
                    await self._async_apply_state(entity_id, desired_state, slot_type, schedule)

    async def _async_apply_state(self, entity_id: str, desired: int, slot_type: str, schedule: dict[str, Any] | None = None) -> None:
        state = self._hass.states.get(entity_id)
        if state is None:
            self._unavailable.add(entity_id)
            _LOGGER.warning(
                "Entity '%s' not found, skipping", entity_id
            )
            return

        if state.state in ("unavailable", "unknown"):
            self._unavailable.add(entity_id)
            _LOGGER.warning(
                "Entity '%s' is %s, skipping", entity_id, state.state
            )
            return

        self._unavailable.discard(entity_id)

        palette = self._store.color_presets or None
        hvac_presets = self._store.hvac_presets or None
        result = interpret_slot_value(desired, slot_type, palette, hvac_presets)
        action = result["action"]

        if action == "none":
            return

        if action == "set_color":
            rgb = result["rgb_color"]
            self._applying.add(entity_id)
            try:
                await self._hass.services.async_call(
                    "light",
                    "turn_on",
                    {"entity_id": entity_id, "rgb_color": rgb},
                    blocking=True,
                )
            except Exception:
                _LOGGER.warning(
                    "Failed to set color on '%s'", entity_id,
                    exc_info=True,
                )
            finally:
                self._applying.discard(entity_id)
            return

        if action == "set_hvac":
            service_data: dict[str, Any] = {"entity_id": entity_id}
            if "hvac_mode" in result:
                service_data["hvac_mode"] = result["hvac_mode"]
            if "temperature" in result:
                service_data["temperature"] = result["temperature"]
            if "fan_mode" in result:
                service_data["fan_mode"] = result["fan_mode"]
            self._applying.add(entity_id)
            try:
                if "hvac_mode" in result:
                    await self._hass.services.async_call(
                        "climate",
                        "set_hvac_mode",
                        {"entity_id": entity_id, "hvac_mode": result["hvac_mode"]},
                        blocking=True,
                    )
                if "temperature" in result:
                    await self._hass.services.async_call(
                        "climate",
                        "set_temperature",
                        {"entity_id": entity_id, "temperature": result["temperature"]},
                        blocking=True,
                    )
                if "fan_mode" in result:
                    await self._hass.services.async_call(
                        "climate",
                        "set_fan_mode",
                        {"entity_id": entity_id, "fan_mode": result["fan_mode"]},
                        blocking=True,
                    )
            except Exception:
                _LOGGER.warning(
                    "Failed to set HVAC on '%s'", entity_id,
                    exc_info=True,
                )
            finally:
                self._applying.discard(entity_id)
            return

        current_on = state.state == "on"
        want_on = action == "turn_on"

        if current_on == want_on:
            return

        service = "turn_on" if want_on else "turn_off"
        self._applying.add(entity_id)
        try:
            await self._hass.services.async_call(
                "homeassistant",
                service,
                {"entity_id": entity_id},
                blocking=True,
            )
        except Exception:
            _LOGGER.warning(
                "Failed to call %s on '%s'", service, entity_id,
                exc_info=True,
            )
        finally:
            self._applying.discard(entity_id)

    def set_override(self, schedule_id: str, entity_id: str, state: str) -> None:
        """Set a runtime override for an entity in a schedule."""
        self._overrides.setdefault(schedule_id, {})[entity_id] = state
        self._hass.bus.async_fire(
            EVENT_OVERRIDES_CHANGED, {"schedule_id": schedule_id}
        )

    def clear_override(self, schedule_id: str, entity_id: str) -> None:
        """Clear a runtime override for an entity in a schedule."""
        if schedule_id in self._overrides:
            self._overrides[schedule_id].pop(entity_id, None)
            if not self._overrides[schedule_id]:
                del self._overrides[schedule_id]
            self._hass.bus.async_fire(
                EVENT_OVERRIDES_CHANGED, {"schedule_id": schedule_id}
            )

    def get_overrides(self, schedule_id: str) -> dict[str, str]:
        """Return current overrides for a schedule: {entity_id: "on"|"off"}."""
        return dict(self._overrides.get(schedule_id, {}))

    def get_unavailable_entities(self, schedule_id: str) -> list[str]:
        """Return entities in a schedule that are currently unavailable."""
        schedule = self._store.schedules.get(schedule_id)
        if not schedule:
            return []
        return sorted(
            eid for eid in schedule.get("entity_ids", [])
            if eid in self._unavailable
        )

    def get_scheduled_states(self, schedule_id: str) -> dict[str, str]:
        """Return what each entity's scheduled state is right now."""
        schedule = self._store.schedules.get(schedule_id)
        if not schedule or not schedule.get("active"):
            return {}

        local_now = dt_util.now()
        local_date = local_now.date()
        slot_minutes = schedule.get("slot_minutes", 15)
        slot_index = compute_slot_index(local_now, slot_minutes)
        day_key = compute_day_key(schedule, local_date)
        if day_key is None:
            return {}

        day_slots = schedule.get("slots", {}).get(day_key)
        if not day_slots or slot_index >= len(day_slots):
            return {}

        slot_type = schedule.get("slot_type", SLOT_TYPE_ON_OFF)
        desired = day_slots[slot_index]
        palette = self._store.color_presets or None
        hvac_presets = self._store.hvac_presets or None
        result = interpret_slot_value(desired, slot_type, palette, hvac_presets)
        action = result["action"]
        if action == "none":
            scheduled_state = "off"
        else:
            scheduled_state = "on" if action in ("turn_on", "set_color", "set_hvac") else "off"

        return {eid: scheduled_state for eid in schedule.get("entity_ids", [])}

    @callback
    def _refresh_state_listeners(self) -> None:
        """Rebuild the state change listener for all managed entity IDs."""
        if self._unsub_state:
            self._unsub_state()
            self._unsub_state = None

        entity_ids: set[str] = set()
        for schedule in self._store.schedules.values():
            if schedule.get("active"):
                entity_ids.update(schedule.get("entity_ids", []))

        if entity_ids:
            self._unsub_state = async_track_state_change_event(
                self._hass, list(entity_ids), self._on_state_changed
            )

    @callback
    def _on_state_changed(self, event: Event) -> None:
        """Handle an external state change on a managed entity."""
        entity_id = event.data.get("entity_id", "")

        # Ignore state changes caused by the coordinator itself
        if entity_id in self._applying:
            return

        new_state = event.data.get("new_state")
        old_state = event.data.get("old_state")
        if new_state is None or old_state is None:
            return
        if new_state.state == old_state.state:
            return

        # Entity just became available — apply scheduled state immediately
        if old_state.state in ("unavailable", "unknown") and new_state.state not in ("unavailable", "unknown"):
            self._unavailable.discard(entity_id)
            self._hass.async_create_task(self._async_apply_on_available(entity_id))
            return

        # Entity just became unavailable
        if new_state.state in ("unavailable", "unknown"):
            self._unavailable.add(entity_id)
            return

        # Find schedules that manage this entity and have revert enabled
        for schedule in self._store.schedules.values():
            if not schedule.get("active"):
                continue
            if entity_id not in schedule.get("entity_ids", []):
                continue

            revert_delay = schedule.get("revert_delay")
            if revert_delay is None or revert_delay <= 0:
                continue

            # Determine the desired state (override takes priority)
            desired = self._get_desired_state(schedule, entity_id)
            if desired is None:
                continue

            if new_state.state == desired:
                # State matches what we want — cancel any pending revert
                self._cancel_revert(entity_id)
                continue

            _LOGGER.info(
                "External state change on '%s' (now %s, want %s); "
                "will revert in %s seconds",
                entity_id, new_state.state, desired, revert_delay,
            )
            self._schedule_revert(entity_id, desired, revert_delay)

    async def _async_apply_on_available(self, entity_id: str) -> None:
        """Apply scheduled state to an entity that just became available."""
        local_now = dt_util.now()
        local_date = local_now.date()

        for schedule in self._store.schedules.values():
            if not schedule.get("active"):
                continue
            if entity_id not in schedule.get("entity_ids", []):
                continue

            slot_minutes = schedule.get("slot_minutes", 15)
            slot_index = compute_slot_index(local_now, slot_minutes)
            day_key = compute_day_key(schedule, local_date)
            if day_key is None:
                continue

            day_slots = schedule.get("slots", {}).get(day_key)
            if not day_slots or slot_index >= len(day_slots):
                continue

            desired_state = day_slots[slot_index]
            slot_type = schedule.get("slot_type", SLOT_TYPE_ON_OFF)

            override = self._overrides.get(schedule["id"], {}).get(entity_id)
            if override is not None:
                override_desired = 1 if override == "on" else 0
                await self._async_apply_state(entity_id, override_desired, slot_type, schedule)
            else:
                await self._async_apply_state(entity_id, desired_state, slot_type, schedule)
            return

    def _get_desired_state(
        self, schedule: dict[str, Any], entity_id: str
    ) -> str | None:
        """Return the desired state for an entity: override > scheduled."""
        override = self._overrides.get(schedule["id"], {}).get(entity_id)
        if override is not None:
            return override

        local_now = dt_util.now()
        slot_minutes = schedule.get("slot_minutes", 15)
        slot_index = compute_slot_index(local_now, slot_minutes)
        day_key = compute_day_key(schedule, local_now.date())
        if day_key is None:
            return None

        day_slots = schedule.get("slots", {}).get(day_key)
        if not day_slots or slot_index >= len(day_slots):
            return None

        slot_type = schedule.get("slot_type", SLOT_TYPE_ON_OFF)
        palette = self._store.color_presets or None
        hvac_presets = self._store.hvac_presets or None
        result = interpret_slot_value(day_slots[slot_index], slot_type, palette, hvac_presets)
        action = result["action"]
        if action == "none":
            return "off"
        return "on" if action in ("turn_on", "set_color", "set_hvac") else "off"

    def _schedule_revert(
        self, entity_id: str, desired: str, delay: int
    ) -> None:
        """Schedule a delayed revert for an entity."""
        self._cancel_revert(entity_id)

        async def _do_revert(_now: datetime) -> None:
            self._revert_timers.pop(entity_id, None)
            desired_int = 1 if desired == "on" else 0
            await self._async_apply_state(entity_id, desired_int, SLOT_TYPE_ON_OFF)

        cancel = self._hass.helpers.event.async_call_later(
            delay, _do_revert
        )
        self._revert_timers[entity_id] = cancel

    def _cancel_revert(self, entity_id: str) -> None:
        """Cancel a pending revert timer for an entity."""
        cancel = self._revert_timers.pop(entity_id, None)
        if cancel:
            cancel()

    # ── Animated colour support ──

    def _has_animated_palette_entries(self) -> bool:
        """Check if any active colour schedule uses animated palette modes."""
        has_color_schedule = any(
            s.get("active") and s.get("slot_type") == SLOT_TYPE_COLOR
            for s in self._store.schedules.values()
        )
        if not has_color_schedule:
            return False
        palette = self._store.color_presets
        if not palette:
            return False
        for entry in palette:
            if isinstance(entry, dict) and entry.get("mode", "solid") != "solid":
                return True
        return False

    @callback
    def _refresh_animation_timer(self) -> None:
        """Start or stop the sub-slot animation timer as needed."""
        needs_anim = self._has_animated_palette_entries()
        if needs_anim and self._unsub_anim is None:
            self._unsub_anim = async_track_utc_time_change(
                self._hass,
                self._async_on_anim_tick,
                second=list(range(0, 60, 5)),  # every 5 seconds
            )
        elif not needs_anim and self._unsub_anim is not None:
            self._unsub_anim()
            self._unsub_anim = None
            self._last_anim_color.clear()

    async def _async_on_anim_tick(self, now: datetime) -> None:
        """Evaluate animated colour slots every ~5 seconds."""
        local_now = dt_util.now()
        local_date = local_now.date()
        palette = self._store.color_presets
        if not palette:
            return

        for schedule in list(self._store.schedules.values()):
            if not schedule.get("active"):
                continue
            if schedule.get("slot_type") != SLOT_TYPE_COLOR:
                continue

            slot_minutes = schedule.get("slot_minutes", 15)
            slot_index = compute_slot_index(local_now, slot_minutes)
            day_key = compute_day_key(schedule, local_date)
            if day_key is None:
                continue

            day_slots = schedule.get("slots", {}).get(day_key)
            if not day_slots or slot_index >= len(day_slots):
                continue

            value = day_slots[slot_index]
            if value == 0 or value > len(palette):
                continue

            entry = palette[value - 1]
            norm = normalize_palette_entry(entry)
            mode = norm.get("mode", "solid")
            if mode == "solid":
                continue

            # Compute elapsed seconds within the current slot
            slot_start_minutes = slot_index * slot_minutes
            elapsed = (local_now.hour * 60 + local_now.minute - slot_start_minutes) * 60 + local_now.second
            slot_seconds = slot_minutes * 60

            result = interpret_slot_value(value, SLOT_TYPE_COLOR, palette)
            if result.get("action") != "set_color":
                continue

            # For crossfade, resolve the next slot's colour
            next_rgb = None
            if mode == "crossfade":
                next_idx = slot_index + 1
                if next_idx < len(day_slots):
                    next_val = day_slots[next_idx]
                    if next_val > 0 and next_val <= len(palette):
                        next_entry = normalize_palette_entry(palette[next_val - 1])
                        from .slot_values import hex_to_rgb
                        next_rgb = list(hex_to_rgb(next_entry["color"]))

            rgb = compute_animated_color(
                color_mode=result.get("color_mode", mode),
                elapsed_seconds=elapsed,
                slot_seconds=slot_seconds,
                current_rgb=result["rgb_color"],
                next_rgb=next_rgb,
                cycle_colors=result.get("cycle_colors"),
                cycle_transition=result.get("cycle_transition", "snap"),
                cycle_rate=result.get("cycle_rate", 1.0),
                tv_colors=result.get("tv_colors"),
            )

            for entity_id in schedule.get("entity_ids", []):
                override = self._overrides.get(schedule["id"], {}).get(entity_id)
                if override is not None:
                    continue
                if entity_id in self._unavailable:
                    continue
                # Skip if colour hasn't changed
                if self._last_anim_color.get(entity_id) == rgb:
                    continue
                self._last_anim_color[entity_id] = rgb
                self._applying.add(entity_id)
                try:
                    await self._hass.services.async_call(
                        "light",
                        "turn_on",
                        {"entity_id": entity_id, "rgb_color": rgb},
                        blocking=True,
                    )
                except Exception:
                    _LOGGER.warning(
                        "Failed to set animated color on '%s'", entity_id,
                        exc_info=True,
                    )
                finally:
                    self._applying.discard(entity_id)
