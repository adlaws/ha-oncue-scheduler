"""WebSocket API for OnCue."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import (
    CADENCE_CUSTOM,
    CADENCE_DAILY,
    CADENCE_WEEKLY,
    DOMAIN,
    VALID_CADENCES,
)

_LOGGER = logging.getLogger(__name__)


def _find_conflicts(
    store: Any, schedule_data: dict[str, Any]
) -> list[dict[str, Any]]:
    """Detect conflicts between the given schedule and all other active schedules."""
    conflicts: list[dict[str, Any]] = []
    save_entities = set(schedule_data.get("entity_ids", []))
    save_id = schedule_data.get("id")
    save_slots = schedule_data.get("slots", {})
    save_cadence = schedule_data.get("cadence")

    for other in store.schedules.values():
        if other["id"] == save_id or not other.get("active"):
            continue
        overlap_entities = save_entities & set(other.get("entity_ids", []))
        if not overlap_entities:
            continue

        other_slots = other.get("slots", {})
        other_cadence = other.get("cadence")
        conflicting_slots: list[dict[str, Any]] = []

        # Build pairs of (save_day_key, other_day_key) to compare
        pairs = _build_comparison_pairs(
            save_cadence, save_slots, other_cadence, other_slots
        )

        for save_key, other_key in pairs:
            save_arr = save_slots.get(save_key, [])
            other_arr = other_slots.get(other_key, [])
            n = min(len(save_arr), len(other_arr))
            for i in range(n):
                if save_arr[i] != other_arr[i] and save_arr[i] != 0 and other_arr[i] != 0:
                    continue
                if save_arr[i] != other_arr[i]:
                    conflicting_slots.append(
                        {"day": save_key, "slot": i}
                    )

        if conflicting_slots:
            conflicts.append(
                {
                    "schedule_id": other["id"],
                    "schedule_name": other.get("name", ""),
                    "overlapping_entities": sorted(overlap_entities),
                    "conflicting_slot_count": len(conflicting_slots),
                }
            )

    return conflicts


def _build_comparison_pairs(
    cadence_a: str,
    slots_a: dict[str, list[int]],
    cadence_b: str,
    slots_b: dict[str, list[int]],
) -> list[tuple[str, str]]:
    """Build day-key pairs for cross-cadence comparison."""
    pairs: list[tuple[str, str]] = []

    if cadence_a == CADENCE_DAILY and cadence_b == CADENCE_DAILY:
        pairs.append(("0", "0"))
    elif cadence_a == CADENCE_DAILY and cadence_b == CADENCE_WEEKLY:
        for key in slots_b:
            pairs.append(("0", key))
    elif cadence_a == CADENCE_WEEKLY and cadence_b == CADENCE_DAILY:
        for key in slots_a:
            pairs.append((key, "0"))
    elif cadence_a == CADENCE_WEEKLY and cadence_b == CADENCE_WEEKLY:
        for key in slots_a:
            if key in slots_b:
                pairs.append((key, key))
    elif cadence_a == CADENCE_DAILY and cadence_b == CADENCE_CUSTOM:
        for key in slots_b:
            pairs.append(("0", key))
    elif cadence_a == CADENCE_CUSTOM and cadence_b == CADENCE_DAILY:
        for key in slots_a:
            pairs.append((key, "0"))
    elif cadence_a == CADENCE_WEEKLY and cadence_b == CADENCE_CUSTOM:
        # Compare by weekday alignment - simplified: compare all pairs
        for key_a in slots_a:
            for key_b in slots_b:
                pairs.append((key_a, key_b))
    elif cadence_a == CADENCE_CUSTOM and cadence_b == CADENCE_WEEKLY:
        for key_a in slots_a:
            for key_b in slots_b:
                pairs.append((key_a, key_b))
    elif cadence_a == CADENCE_CUSTOM and cadence_b == CADENCE_CUSTOM:
        # Compare overlapping day offsets only
        for key in slots_a:
            if key in slots_b:
                pairs.append((key, key))
    return pairs


def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Register all WebSocket commands."""
    websocket_api.async_register_command(hass, ws_list_schedules)
    websocket_api.async_register_command(hass, ws_get_schedule)
    websocket_api.async_register_command(hass, ws_save_schedule)
    websocket_api.async_register_command(hass, ws_delete_schedule)
    websocket_api.async_register_command(hass, ws_toggle_active)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue/list",
    }
)
@callback
def ws_list_schedules(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    connection.send_result(msg["id"], {"schedules": store.async_list_schedules()})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue/get",
        vol.Required("schedule_id"): str,
    }
)
@callback
def ws_get_schedule(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    schedule = store.async_get_schedule(msg["schedule_id"])
    if schedule is None:
        connection.send_error(msg["id"], "not_found", "Schedule not found")
        return
    connection.send_result(msg["id"], {"schedule": schedule})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue/save",
        vol.Required("schedule"): dict,
    }
)
@websocket_api.async_response
async def ws_save_schedule(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    schedule_data = msg["schedule"]
    try:
        saved = await store.async_save_schedule(schedule_data)
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return

    conflicts = _find_conflicts(store, saved)
    warnings: list[str] = []
    all_off = all(v == 0 for arr in saved.get("slots", {}).values() for v in arr)
    if all_off:
        warnings.append("All time slots are off - this schedule will not activate any entities")
    connection.send_result(
        msg["id"], {"schedule": saved, "conflicts": conflicts, "warnings": warnings}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue/delete",
        vol.Required("schedule_id"): str,
    }
)
@websocket_api.async_response
async def ws_delete_schedule(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    deleted = await store.async_delete_schedule(msg["schedule_id"])
    if not deleted:
        connection.send_error(msg["id"], "not_found", "Schedule not found")
        return
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue/toggle_active",
        vol.Required("schedule_id"): str,
    }
)
@websocket_api.async_response
async def ws_toggle_active(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    schedule = await store.async_toggle_active(msg["schedule_id"])
    if schedule is None:
        connection.send_error(msg["id"], "not_found", "Schedule not found")
        return
    connection.send_result(msg["id"], {"schedule": schedule})


def _get_entry_id(hass: HomeAssistant) -> str | None:
    """Get the first (and only) config entry ID for this integration."""
    domain_data = hass.data.get(DOMAIN)
    if not domain_data:
        return None
    for entry_id in domain_data:
        return entry_id
    return None
