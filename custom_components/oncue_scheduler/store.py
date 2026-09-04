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
    MAX_BRIGHTNESS_PRESET_COUNT,
    MAX_CUSTOM_DAYS,
    MAX_HVAC_PRESET_COUNT,
    MAX_PALETTE_SIZE,
    MAX_REVERT_DELAY,
    MAX_SCENE_PRESET_COUNT,
    SIGNAL_SCHEDULES_UPDATED,
    SLOT_TYPE_BRIGHTNESS,
    SLOT_TYPE_COLOR,
    SLOT_TYPE_HVAC,
    SLOT_TYPE_ON_OFF,
    SLOT_TYPE_SCENE,
    STORE_KEY,
    STORE_VERSION,
    VALID_CADENCES,
    VALID_SLOT_TYPES,
)
from .slot_values import (
    validate_brightness_presets,
    validate_hvac_presets,
    validate_palette,
    validate_scene_presets,
    validate_slot_value,
)

_LOGGER = logging.getLogger(__name__)


def slots_per_day(slot_minutes: int) -> int:
    """Return the number of time slots in a day.

    :param slot_minutes: Duration of each slot in minutes (must evenly divide 1440).
    :returns: Number of slots per day.
    """
    return 24 * 60 // slot_minutes


def validate_schedule(
    data: dict[str, Any],
    hvac_presets: list[dict[str, Any]] | None = None,
    color_presets: list | None = None,
    brightness_presets: list[dict[str, Any]] | None = None,
    scene_presets: list[dict[str, Any]] | None = None,
) -> list[str]:
    """Validate a schedule data dict.

    :param data: Schedule dict with name, entity_ids, cadence, slots, etc.
    :param hvac_presets: Global HVAC presets list (required for HVAC slot type).
    :param color_presets: Global color presets list (required for color slot type).
    :returns: List of validation error strings, empty if valid.
    """
    errors: list[str] = []

    name = data.get("name")
    if not name or not isinstance(name, str):
        errors.append("name must be a non-empty string")

    entity_ids = data.get("entity_ids")
    if not entity_ids or not isinstance(entity_ids, list):
        errors.append("entity_ids must be a non-empty list")
    elif not all(isinstance(eid, str) and eid for eid in entity_ids):
        errors.append("entity_ids must contain only non-empty strings")

    cadence = data.get("cadence")
    if cadence not in VALID_CADENCES:
        errors.append(f"cadence must be one of {VALID_CADENCES}")

    slot_mins = data.get("slot_minutes", DEFAULT_SLOT_MINUTES)
    if not isinstance(slot_mins, int) or slot_mins <= 0 or 1440 % slot_mins != 0:
        errors.append("slot_minutes must be a positive integer that evenly divides 1440")
        return errors
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

    if slot_type == SLOT_TYPE_BRIGHTNESS:
        if not brightness_presets:
            errors.append("no brightness presets defined — create at least one preset first")

    if slot_type == SLOT_TYPE_SCENE:
        if not scene_presets:
            errors.append("no scene presets defined — create at least one preset first")

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
    """Generate default all-off slots for a cadence.

    :param cadence: One of CADENCE_DAILY, CADENCE_WEEKLY, CADENCE_CUSTOM.
    :param start_date: ISO date string for custom cadence start.
    :param end_date: ISO date string for custom cadence end.
    :param slot_minutes: Duration of each slot in minutes.
    :returns: Dict mapping day keys to lists of zero-valued slot arrays.
    """
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
        """Initialise the schedule store.

        :param hass: Home Assistant instance.
        """
        self._hass = hass
        self._store = Store(hass, STORE_VERSION, STORE_KEY)
        self._schedules: dict[str, dict[str, Any]] = {}
        self._hvac_presets: list[dict[str, Any]] = []
        self._color_presets: list[dict[str, Any] | str] = []
        self._brightness_presets: list[dict[str, Any]] = []
        self._scene_presets: list[dict[str, Any]] = []

    async def async_load(self) -> None:
        """Load schedules and presets from persistent storage, applying migrations."""
        data = await self._store.async_load()
        if data and isinstance(data, dict):
            self._schedules = data.get("schedules", {})
            self._hvac_presets = data.get("hvac_presets", [])
            self._color_presets = data.get("color_presets", [])
            self._brightness_presets = data.get("brightness_presets", [])
            self._scene_presets = data.get("scene_presets", [])
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
            self._brightness_presets = []
            self._scene_presets = []

    async def _async_save(self) -> None:
        """Persist current state and notify listeners."""
        await self._store.async_save({
            "schedules": self._schedules,
            "hvac_presets": self._hvac_presets,
            "color_presets": self._color_presets,
            "brightness_presets": self._brightness_presets,
            "scene_presets": self._scene_presets,
        })
        async_dispatcher_send(self._hass, SIGNAL_SCHEDULES_UPDATED)

    @property
    def schedules(self) -> dict[str, dict[str, Any]]:
        """All schedules keyed by ID.

        :returns: Dict mapping schedule ID to schedule data.
        """
        return self._schedules

    def async_list_schedules(self) -> list[dict[str, Any]]:
        """Return summaries (without slot data) for all schedules.

        :returns: List of schedule dicts with the 'slots' key omitted.
        """
        result = []
        for s in self._schedules.values():
            summary = {k: v for k, v in s.items() if k != "slots"}
            result.append(summary)
        return result

    def async_get_schedule(self, schedule_id: str) -> dict[str, Any] | None:
        """Return a single schedule by ID, or None.

        :param schedule_id: ID of the schedule to retrieve.
        :returns: Schedule dict, or None if not found.
        """
        return self._schedules.get(schedule_id)

    async def async_save_schedule(self, data: dict[str, Any]) -> dict[str, Any]:
        """Create or update a schedule.

        Assigns a UUID if no id is present, applies defaults, validates,
        and persists.

        :param data: Schedule dict. Missing fields are set to defaults.
        :returns: The saved schedule dict with id and defaults populated.
        :raises ValueError: If validation fails.
        """
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
            brightness_presets=self._brightness_presets if data.get("slot_type") == SLOT_TYPE_BRIGHTNESS else None,
            scene_presets=self._scene_presets if data.get("slot_type") == SLOT_TYPE_SCENE else None,
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
        """Delete a schedule by ID.

        :param schedule_id: ID of the schedule to delete.
        :returns: True if the schedule existed and was deleted, False otherwise.
        """
        if schedule_id in self._schedules:
            del self._schedules[schedule_id]
            await self._async_save()
            return True
        return False

    async def async_toggle_active(self, schedule_id: str) -> dict[str, Any] | None:
        """Toggle a schedule's active flag.

        :param schedule_id: ID of the schedule to toggle.
        :returns: The updated schedule dict, or None if not found.
        """
        schedule = self._schedules.get(schedule_id)
        if schedule is None:
            return None
        schedule["active"] = not schedule["active"]
        await self._async_save()
        return schedule

    async def async_set_active(self, schedule_id: str, active: bool) -> dict[str, Any] | None:
        """Set a schedule's active flag.

        :param schedule_id: ID of the schedule to update.
        :param active: New active state.
        :returns: The updated schedule dict, or None if not found.
        """
        schedule = self._schedules.get(schedule_id)
        if schedule is None:
            return None
        schedule["active"] = active
        await self._async_save()
        return schedule

    # ── Global HVAC presets ──

    @property
    def hvac_presets(self) -> list[dict[str, Any]]:
        """Global HVAC presets list.

        :returns: List of HVAC preset dicts.
        """
        return self._hvac_presets

    async def async_save_hvac_presets(self, presets: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Replace the global HVAC presets list.

        :param presets: New HVAC presets list to store.
        :returns: The saved presets list.
        :raises ValueError: If validation fails or count exceeds the limit.
        """
        err = validate_hvac_presets(presets)
        if err:
            raise ValueError(err)
        if len(presets) > MAX_HVAC_PRESET_COUNT:
            raise ValueError(f"hvac_presets must have at most {MAX_HVAC_PRESET_COUNT} entries")
        self._hvac_presets = presets
        await self._async_save()
        return self._hvac_presets

    def hvac_preset_usage(self, index: int) -> list[dict[str, str]]:
        """Return schedules using the HVAC preset at the given index.

        :param index: Zero-based preset index (converted to 1-based for slot lookup).
        :returns: List of {id, name} dicts for schedules referencing this preset.
        """
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
        """Delete preset at index, remap all HVAC schedule slots.

        Slot values referencing the deleted preset are zeroed; values
        above the deleted index are decremented to stay correct.

        :param index: Zero-based preset index to delete.
        :returns: The updated presets list.
        :raises ValueError: If index is out of range.
        """
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
        """Global color presets list.

        :returns: List of hex color strings or palette entry dicts.
        """
        return self._color_presets

    async def async_save_color_presets(self, presets: list) -> list:
        """Replace the global color presets list.

        :param presets: New color presets list to store.
        :returns: The saved presets list.
        :raises ValueError: If validation fails or count exceeds the limit.
        """
        err = validate_palette(presets)
        if err:
            raise ValueError(err)
        if len(presets) > MAX_PALETTE_SIZE:
            raise ValueError(f"color_presets must have at most {MAX_PALETTE_SIZE} entries")
        self._color_presets = presets
        await self._async_save()
        return self._color_presets

    def color_preset_usage(self, index: int) -> list[dict[str, str]]:
        """Return schedules using the color preset at the given index.

        :param index: Zero-based preset index (converted to 1-based for slot lookup).
        :returns: List of {id, name} dicts for schedules referencing this preset.
        """
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
        """Delete preset at index, remap all color schedule slots.

        Slot values referencing the deleted preset are zeroed; values
        above the deleted index are decremented to stay correct.

        :param index: Zero-based preset index to delete.
        :returns: The updated presets list.
        :raises ValueError: If index is out of range.
        """
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

    # ── Global brightness presets ──

    @property
    def brightness_presets(self) -> list[dict[str, Any]]:
        """Global brightness presets list.

        :returns: List of brightness preset dicts.
        """
        return self._brightness_presets

    async def async_save_brightness_presets(self, presets: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Replace the global brightness presets list.

        :param presets: New brightness presets list to store.
        :returns: The saved presets list.
        :raises ValueError: If validation fails or count exceeds the limit.
        """
        err = validate_brightness_presets(presets)
        if err:
            raise ValueError(err)
        if len(presets) > MAX_BRIGHTNESS_PRESET_COUNT:
            raise ValueError(f"brightness_presets must have at most {MAX_BRIGHTNESS_PRESET_COUNT} entries")
        self._brightness_presets = presets
        await self._async_save()
        return self._brightness_presets

    def brightness_preset_usage(self, index: int) -> list[dict[str, str]]:
        """Return schedules using the brightness preset at the given index.

        :param index: Zero-based preset index (converted to 1-based for slot lookup).
        :returns: List of {id, name} dicts for schedules referencing this preset.
        """
        value = index + 1
        result: list[dict[str, str]] = []
        for s in self._schedules.values():
            if s.get("slot_type") != SLOT_TYPE_BRIGHTNESS:
                continue
            for arr in s.get("slots", {}).values():
                if value in arr:
                    result.append({"id": s["id"], "name": s.get("name", "")})
                    break
        return result

    async def async_delete_brightness_preset(self, index: int) -> list[dict[str, Any]]:
        """Delete preset at index, remap all brightness schedule slots.

        :param index: Zero-based preset index to delete.
        :returns: The updated presets list.
        :raises ValueError: If index is out of range.
        """
        if index < 0 or index >= len(self._brightness_presets):
            raise ValueError(f"preset index {index} out of range")
        removed_value = index + 1
        for s in self._schedules.values():
            if s.get("slot_type") != SLOT_TYPE_BRIGHTNESS:
                continue
            for key, arr in s.get("slots", {}).items():
                s["slots"][key] = [
                    0 if v == removed_value else (v - 1 if v > removed_value else v)
                    for v in arr
                ]
        self._brightness_presets.pop(index)
        await self._async_save()
        return self._brightness_presets

    # ── Global scene presets ──

    @property
    def scene_presets(self) -> list[dict[str, Any]]:
        """Global scene presets list.

        :returns: List of scene preset dicts.
        """
        return self._scene_presets

    async def async_save_scene_presets(self, presets: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Replace the global scene presets list.

        :param presets: New scene presets list to store.
        :returns: The saved presets list.
        :raises ValueError: If validation fails or count exceeds the limit.
        """
        err = validate_scene_presets(presets)
        if err:
            raise ValueError(err)
        if len(presets) > MAX_SCENE_PRESET_COUNT:
            raise ValueError(f"scene_presets must have at most {MAX_SCENE_PRESET_COUNT} entries")
        self._scene_presets = presets
        await self._async_save()
        return self._scene_presets

    def scene_preset_usage(self, index: int) -> list[dict[str, str]]:
        """Return schedules using the scene preset at the given index.

        :param index: Zero-based preset index (converted to 1-based for slot lookup).
        :returns: List of {id, name} dicts for schedules referencing this preset.
        """
        value = index + 1
        result: list[dict[str, str]] = []
        for s in self._schedules.values():
            if s.get("slot_type") != SLOT_TYPE_SCENE:
                continue
            for arr in s.get("slots", {}).values():
                if value in arr:
                    result.append({"id": s["id"], "name": s.get("name", "")})
                    break
        return result

    async def async_delete_scene_preset(self, index: int) -> list[dict[str, Any]]:
        """Delete preset at index, remap all scene schedule slots.

        :param index: Zero-based preset index to delete.
        :returns: The updated presets list.
        :raises ValueError: If index is out of range.
        """
        if index < 0 or index >= len(self._scene_presets):
            raise ValueError(f"preset index {index} out of range")
        removed_value = index + 1
        for s in self._schedules.values():
            if s.get("slot_type") != SLOT_TYPE_SCENE:
                continue
            for key, arr in s.get("slots", {}).items():
                s["slots"][key] = [
                    0 if v == removed_value else (v - 1 if v > removed_value else v)
                    for v in arr
                ]
        self._scene_presets.pop(index)
        await self._async_save()
        return self._scene_presets
