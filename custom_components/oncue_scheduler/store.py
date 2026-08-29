"""Persistent schedule storage for OnCue."""

from __future__ import annotations

import logging
import uuid
from datetime import date
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store

from .const import (
    CADENCE_CUSTOM,
    CADENCE_DAILY,
    CADENCE_WEEKLY,
    DEFAULT_REVERT_DELAY,
    DEFAULT_SLOT_MINUTES,
    MAX_CUSTOM_DAYS,
    MAX_HVAC_PRESET_COUNT,
    MAX_PALETTE_SIZE,
    MAX_REVERT_DELAY,
    SIGNAL_SCHEDULES_UPDATED,
    SLOT_TYPE_COLOR,
    SLOT_TYPE_HVAC,
    SLOT_TYPE_ON_OFF,
    STORE_KEY,
    STORE_VERSION,
    VALID_CADENCES,
    VALID_SLOT_TYPES,
)
from .slot_values import validate_hvac_presets, validate_palette, validate_slot_value

_LOGGER = logging.getLogger(__name__)


def slots_per_day(slot_minutes: int) -> int:
    """Return the number of time slots in a day."""
    return 24 * 60 // slot_minutes


def validate_schedule(data: dict[str, Any], hvac_presets: list[dict[str, Any]] | None = None, color_presets: list | None = None) -> list[str]:
    """Return a list of validation error strings, empty if valid."""
    errors: list[str] = []

    if not data.get("name"):
        errors.append("name is required")

    entity_ids = data.get("entity_ids")
    if not entity_ids or not isinstance(entity_ids, list):
        errors.append("entity_ids must be a non-empty list")

    cadence = data.get("cadence")
    if cadence not in VALID_CADENCES:
        errors.append(f"cadence must be one of {VALID_CADENCES}")

    slot_mins = data.get("slot_minutes", DEFAULT_SLOT_MINUTES)
    expected_slots = slots_per_day(slot_mins)

    if cadence == CADENCE_DAILY:
        expected_days = {"0"}
    elif cadence == CADENCE_WEEKLY:
        expected_days = {str(i) for i in range(7)}
    elif cadence == CADENCE_CUSTOM:
        start = data.get("start_date")
        end = data.get("end_date")
        if not start or not end:
            errors.append("start_date and end_date required for custom cadence")
            return errors
        try:
            start_d = date.fromisoformat(start) if isinstance(start, str) else start
            end_d = date.fromisoformat(end) if isinstance(end, str) else end
        except (ValueError, TypeError):
            errors.append("start_date and end_date must be valid ISO dates")
            return errors
        num_days = (end_d - start_d).days + 1
        if num_days < 1 or num_days > MAX_CUSTOM_DAYS:
            errors.append(f"custom range must be 1-{MAX_CUSTOM_DAYS} days")
            return errors
        expected_days = {str(i) for i in range(num_days)}
    else:
        expected_days = set()

    slot_type = data.get("slot_type", SLOT_TYPE_ON_OFF)
    if slot_type not in VALID_SLOT_TYPES:
        errors.append(f"slot_type must be one of {VALID_SLOT_TYPES}")

    if slot_type == SLOT_TYPE_COLOR:
        if not color_presets:
            errors.append("no color presets defined — create at least one preset first")

    if slot_type == SLOT_TYPE_HVAC:
        if not hvac_presets:
            errors.append("no HVAC presets defined — create at least one preset first")

    slots = data.get("slots", {})
    if slots:
        for key, arr in slots.items():
            if key not in expected_days:
                errors.append(f"unexpected slot key '{key}' for cadence '{cadence}'")
            if not isinstance(arr, list) or len(arr) != expected_slots:
                errors.append(
                    f"slot '{key}' must have exactly {expected_slots} entries"
                )
            else:
                for i, v in enumerate(arr):
                    err = validate_slot_value(v, slot_type)
                    if err:
                        errors.append(f"slot '{key}' index {i}: {err}")
                        break

    revert_delay = data.get("revert_delay")
    if revert_delay is not None:
        if not isinstance(revert_delay, (int, float)) or revert_delay < 0:
            errors.append("revert_delay must be a non-negative number or null")
        elif revert_delay > MAX_REVERT_DELAY:
            errors.append(f"revert_delay must be at most {MAX_REVERT_DELAY} seconds")

    return errors


def _default_slots(cadence: str, start_date: str | None, end_date: str | None, slot_minutes: int) -> dict[str, list[int]]:
    """Generate default all-off slots for a cadence."""
    n = slots_per_day(slot_minutes)
    if cadence == CADENCE_DAILY:
        return {"0": [0] * n}
    if cadence == CADENCE_WEEKLY:
        return {str(i): [0] * n for i in range(7)}
    if cadence == CADENCE_CUSTOM and start_date and end_date:
        start_d = date.fromisoformat(start_date) if isinstance(start_date, str) else start_date
        end_d = date.fromisoformat(end_date) if isinstance(end_date, str) else end_date
        num_days = (end_d - start_d).days + 1
        return {str(i): [0] * n for i in range(num_days)}
    return {}


class ScheduleStore:
    """CRUD wrapper around HA's Store for schedule persistence."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store = Store(hass, STORE_VERSION, STORE_KEY)
        self._schedules: dict[str, dict[str, Any]] = {}
        self._hvac_presets: list[dict[str, Any]] = []
        self._color_presets: list[dict[str, Any] | str] = []

    async def async_load(self) -> None:
        data = await self._store.async_load()
        if data and isinstance(data, dict):
            self._schedules = data.get("schedules", {})
            self._hvac_presets = data.get("hvac_presets", [])
            self._color_presets = data.get("color_presets", [])
            # Migrate: extract per-schedule presets into global store
            if not self._hvac_presets:
                for s in self._schedules.values():
                    if s.get("slot_type") == SLOT_TYPE_HVAC and s.get("hvac_presets"):
                        self._hvac_presets = s["hvac_presets"]
                        break
            for s in self._schedules.values():
                s.pop("hvac_presets", None)
            # Migrate: extract per-schedule palettes into global color presets
            if not self._color_presets:
                for s in self._schedules.values():
                    if s.get("slot_type") == SLOT_TYPE_COLOR and s.get("palette"):
                        self._color_presets = s["palette"]
                        break
            for s in self._schedules.values():
                s.pop("palette", None)
        else:
            self._schedules = {}
            self._hvac_presets = []
            self._color_presets = []

    async def _async_save(self) -> None:
        await self._store.async_save({
            "schedules": self._schedules,
            "hvac_presets": self._hvac_presets,
            "color_presets": self._color_presets,
        })
        async_dispatcher_send(self._hass, SIGNAL_SCHEDULES_UPDATED)

    @property
    def schedules(self) -> dict[str, dict[str, Any]]:
        return self._schedules

    def async_list_schedules(self) -> list[dict[str, Any]]:
        """Return summaries (without slot data) for all schedules."""
        result = []
        for s in self._schedules.values():
            summary = {k: v for k, v in s.items() if k != "slots"}
            result.append(summary)
        return result

    def async_get_schedule(self, schedule_id: str) -> dict[str, Any] | None:
        return self._schedules.get(schedule_id)

    async def async_save_schedule(self, data: dict[str, Any]) -> dict[str, Any]:
        """Create or update a schedule. Returns the saved schedule."""
        schedule_id = data.get("id")
        if not schedule_id:
            schedule_id = str(uuid.uuid4())
            data["id"] = schedule_id

        data.setdefault("active", True)
        data.setdefault("repeat", True)
        data.setdefault("slot_minutes", DEFAULT_SLOT_MINUTES)
        data.setdefault("slot_type", SLOT_TYPE_ON_OFF)
        data.setdefault("start_date", None)
        data.setdefault("end_date", None)
        data.setdefault("revert_delay", DEFAULT_REVERT_DELAY)

        if not data.get("slots"):
            data["slots"] = _default_slots(
                data.get("cadence", CADENCE_DAILY),
                data.get("start_date"),
                data.get("end_date"),
                data["slot_minutes"],
            )

        errors = validate_schedule(
            data,
            hvac_presets=self._hvac_presets if data.get("slot_type") == SLOT_TYPE_HVAC else None,
            color_presets=self._color_presets if data.get("slot_type") == SLOT_TYPE_COLOR else None,
        )
        if errors:
            raise ValueError("; ".join(errors))

        # Strip per-schedule presets (they are stored globally)
        data.pop("hvac_presets", None)
        data.pop("palette", None)

        self._schedules[schedule_id] = data
        await self._async_save()
        return data

    async def async_delete_schedule(self, schedule_id: str) -> bool:
        if schedule_id in self._schedules:
            del self._schedules[schedule_id]
            await self._async_save()
            return True
        return False

    async def async_toggle_active(self, schedule_id: str) -> dict[str, Any] | None:
        schedule = self._schedules.get(schedule_id)
        if schedule is None:
            return None
        schedule["active"] = not schedule["active"]
        await self._async_save()
        return schedule

    async def async_set_active(self, schedule_id: str, active: bool) -> dict[str, Any] | None:
        schedule = self._schedules.get(schedule_id)
        if schedule is None:
            return None
        schedule["active"] = active
        await self._async_save()
        return schedule

    # ── Global HVAC presets ──

    @property
    def hvac_presets(self) -> list[dict[str, Any]]:
        return self._hvac_presets

    async def async_save_hvac_presets(self, presets: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Replace the global HVAC presets list."""
        err = validate_hvac_presets(presets)
        if err:
            raise ValueError(err)
        if len(presets) > MAX_HVAC_PRESET_COUNT:
            raise ValueError(f"hvac_presets must have at most {MAX_HVAC_PRESET_COUNT} entries")
        self._hvac_presets = presets
        await self._async_save()
        return self._hvac_presets

    def hvac_preset_usage(self, index: int) -> list[dict[str, str]]:
        """Return list of {id, name} for schedules using the preset at index."""
        value = index + 1  # slot values are 1-based
        result: list[dict[str, str]] = []
        for s in self._schedules.values():
            if s.get("slot_type") != SLOT_TYPE_HVAC:
                continue
            for arr in s.get("slots", {}).values():
                if value in arr:
                    result.append({"id": s["id"], "name": s.get("name", "")})
                    break
        return result

    async def async_delete_hvac_preset(self, index: int) -> list[dict[str, Any]]:
        """Delete preset at index, remap all HVAC schedule slots."""
        if index < 0 or index >= len(self._hvac_presets):
            raise ValueError(f"preset index {index} out of range")
        removed_value = index + 1
        # Remap slot values across all HVAC schedules
        for s in self._schedules.values():
            if s.get("slot_type") != SLOT_TYPE_HVAC:
                continue
            for key, arr in s.get("slots", {}).items():
                s["slots"][key] = [
                    0 if v == removed_value else (v - 1 if v > removed_value else v)
                    for v in arr
                ]
        self._hvac_presets.pop(index)
        await self._async_save()
        return self._hvac_presets

    # ── Global color presets ──

    @property
    def color_presets(self) -> list[dict[str, Any] | str]:
        return self._color_presets

    async def async_save_color_presets(self, presets: list) -> list:
        """Replace the global color presets list."""
        err = validate_palette(presets)
        if err:
            raise ValueError(err)
        if len(presets) > MAX_PALETTE_SIZE:
            raise ValueError(f"color_presets must have at most {MAX_PALETTE_SIZE} entries")
        self._color_presets = presets
        await self._async_save()
        return self._color_presets

    def color_preset_usage(self, index: int) -> list[dict[str, str]]:
        """Return list of {id, name} for schedules using the preset at index."""
        value = index + 1  # slot values are 1-based
        result: list[dict[str, str]] = []
        for s in self._schedules.values():
            if s.get("slot_type") != SLOT_TYPE_COLOR:
                continue
            for arr in s.get("slots", {}).values():
                if value in arr:
                    result.append({"id": s["id"], "name": s.get("name", "")})
                    break
        return result

    async def async_delete_color_preset(self, index: int) -> list:
        """Delete preset at index, remap all color schedule slots."""
        if index < 0 or index >= len(self._color_presets):
            raise ValueError(f"preset index {index} out of range")
        removed_value = index + 1
        for s in self._schedules.values():
            if s.get("slot_type") != SLOT_TYPE_COLOR:
                continue
            for key, arr in s.get("slots", {}).items():
                s["slots"][key] = [
                    0 if v == removed_value else (v - 1 if v > removed_value else v)
                    for v in arr
                ]
        self._color_presets.pop(index)
        await self._async_save()
        return self._color_presets
