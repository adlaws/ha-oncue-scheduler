"""Schedule coordinator - evaluates schedules at 15-minute boundaries."""

from __future__ import annotations

import logging
from datetime import date, datetime
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_track_utc_time_change
import homeassistant.util.dt as dt_util

from .const import (
    CADENCE_CUSTOM,
    CADENCE_DAILY,
    CADENCE_WEEKLY,
    SIGNAL_SCHEDULES_UPDATED,
    SLOT_TYPE_ON_OFF,
)
from .slot_values import interpret_slot_value

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

    async def _async_on_tick(self, now: datetime) -> None:
        await self._async_evaluate()

    async def _async_on_schedules_updated(self) -> None:
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
                await self._async_apply_state(entity_id, desired_state, slot_type)

    async def _async_apply_state(self, entity_id: str, desired: int, slot_type: str) -> None:
        state = self._hass.states.get(entity_id)
        if state is None:
            _LOGGER.warning(
                "Entity '%s' not found, skipping", entity_id
            )
            return

        if state.state in ("unavailable", "unknown"):
            _LOGGER.warning(
                "Entity '%s' is %s, skipping", entity_id, state.state
            )
            return

        current_on = state.state == "on"
        result = interpret_slot_value(desired, slot_type)
        action = result["action"]

        if action == "none":
            return

        want_on = action == "turn_on"

        if current_on == want_on:
            return

        service = "turn_on" if want_on else "turn_off"
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
