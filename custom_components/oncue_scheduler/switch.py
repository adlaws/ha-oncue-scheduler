"""Switch platform for OnCue - exposes each schedule as a switch entity."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers import entity_registry as er

from .const import DOMAIN, SIGNAL_SCHEDULES_UPDATED

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    data = hass.data[DOMAIN][config_entry.entry_id]
    store = data.store

    tracked: dict[str, ScheduleSwitch] = {}

    @callback
    def _async_on_schedules_updated() -> None:
        current_ids = set(store.schedules.keys())
        tracked_ids = set(tracked.keys())

        # Add new entities
        new_entities: list[ScheduleSwitch] = []
        for sid in current_ids - tracked_ids:
            schedule = store.schedules[sid]
            entity = ScheduleSwitch(config_entry.entry_id, store, schedule)
            tracked[sid] = entity
            new_entities.append(entity)
        if new_entities:
            async_add_entities(new_entities)

        # Remove deleted entities
        for sid in tracked_ids - current_ids:
            entity = tracked.pop(sid)
            ent_reg = er.async_get(hass)
            entity_id = ent_reg.async_get_entity_id("switch", DOMAIN, entity.unique_id)
            if entity_id:
                ent_reg.async_remove(entity_id)
            else:
                hass.async_create_task(entity.async_remove())

        # Update existing entities
        for sid in current_ids & tracked_ids:
            tracked[sid].async_schedule_update_ha_state()

    # Initial population
    for sid, schedule in store.schedules.items():
        entity = ScheduleSwitch(config_entry.entry_id, store, schedule)
        tracked[sid] = entity
    if tracked:
        async_add_entities(list(tracked.values()))

    async_dispatcher_connect(hass, SIGNAL_SCHEDULES_UPDATED, _async_on_schedules_updated)


class ScheduleSwitch(SwitchEntity):
    """Switch entity representing a schedule set's active/paused state."""

    _attr_has_entity_name = True
    _attr_icon = "mdi:calendar-clock"

    def __init__(
        self,
        entry_id: str,
        store: Any,
        schedule: dict[str, Any],
    ) -> None:
        self._entry_id = entry_id
        self._store = store
        self._schedule_id: str = schedule["id"]
        self._attr_unique_id = f"oncue_scheduler_{schedule['id']}"
        self._attr_name = schedule.get("name", "Schedule")

    @property
    def device_info(self) -> DeviceInfo:
        return DeviceInfo(
            identifiers={(DOMAIN, self._entry_id)},
            name="OnCue",
            manufacturer="OnCue",
            model="Schedule Controller",
        )

    @property
    def _schedule(self) -> dict[str, Any] | None:
        return self._store.schedules.get(self._schedule_id)

    @property
    def is_on(self) -> bool:
        schedule = self._schedule
        return schedule.get("active", False) if schedule else False

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        schedule = self._schedule
        if not schedule:
            return {}
        return {
            "entity_ids": schedule.get("entity_ids", []),
            "cadence": schedule.get("cadence"),
            "repeat": schedule.get("repeat"),
            "start_date": schedule.get("start_date"),
            "end_date": schedule.get("end_date"),
        }

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._store.async_set_active(self._schedule_id, True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._store.async_set_active(self._schedule_id, False)
