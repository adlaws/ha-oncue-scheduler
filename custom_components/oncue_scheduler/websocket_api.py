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
    """Detect conflicts between the given schedule and other active schedules.

    Two schedules conflict when they share entities and both have non-zero
    slot values at the same time position.

    :param store: ScheduleStore instance to query existing schedules.
    :param schedule_data: The schedule being saved (may be new or updated).
    :returns: List of conflict dicts with schedule_id, schedule_name,
        overlapping_entities, and conflicting_slot_count.
    """
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
        conflict_count = 0

        pairs = _build_comparison_pairs(
            save_cadence, save_slots, other_cadence, other_slots
        )

        for save_key, other_key in pairs:
            save_arr = save_slots.get(save_key, [])
            other_arr = other_slots.get(other_key, [])
            for s, o in zip(save_arr, other_arr):
                if s and o:
                    conflict_count += 1

        if conflict_count:
            conflicts.append(
                {
                    "schedule_id": other["id"],
                    "schedule_name": other.get("name", ""),
                    "overlapping_entities": sorted(overlap_entities),
                    "conflicting_slot_count": conflict_count,
                }
            )

    return conflicts


def _build_comparison_pairs(
    cadence_a: str,
    slots_a: dict[str, list[int]],
    cadence_b: str,
    slots_b: dict[str, list[int]],
) -> list[tuple[str, str]]:
    """Build day-key pairs for cross-cadence slot comparison.

    Maps day keys from two schedules with potentially different cadences
    into pairs that should be compared for overlapping slots.

    :param cadence_a: Cadence of the first schedule.
    :param slots_a: Slot data of the first schedule, keyed by day.
    :param cadence_b: Cadence of the second schedule.
    :param slots_b: Slot data of the second schedule, keyed by day.
    :returns: List of (key_a, key_b) tuples to compare pairwise.
    """
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


_WS_REGISTERED = "oncue_scheduler_ws_registered"


def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Register all WebSocket commands (idempotent).

    :param hass: Home Assistant instance.
    """
    if hass.data.get(_WS_REGISTERED):
        return
    hass.data[_WS_REGISTERED] = True
    websocket_api.async_register_command(hass, ws_list_schedules)
    websocket_api.async_register_command(hass, ws_get_schedule)
    websocket_api.async_register_command(hass, ws_save_schedule)
    websocket_api.async_register_command(hass, ws_delete_schedule)
    websocket_api.async_register_command(hass, ws_toggle_active)
    websocket_api.async_register_command(hass, ws_set_override)
    websocket_api.async_register_command(hass, ws_clear_override)
    websocket_api.async_register_command(hass, ws_get_overrides)
    websocket_api.async_register_command(hass, ws_get_hvac_presets)
    websocket_api.async_register_command(hass, ws_save_hvac_presets)
    websocket_api.async_register_command(hass, ws_delete_hvac_preset)
    websocket_api.async_register_command(hass, ws_hvac_preset_usage)
    websocket_api.async_register_command(hass, ws_get_color_presets)
    websocket_api.async_register_command(hass, ws_save_color_presets)
    websocket_api.async_register_command(hass, ws_delete_color_preset)
    websocket_api.async_register_command(hass, ws_color_preset_usage)
    websocket_api.async_register_command(hass, ws_get_brightness_presets)
    websocket_api.async_register_command(hass, ws_save_brightness_presets)
    websocket_api.async_register_command(hass, ws_delete_brightness_preset)
    websocket_api.async_register_command(hass, ws_brightness_preset_usage)
    websocket_api.async_register_command(hass, ws_get_scene_presets)
    websocket_api.async_register_command(hass, ws_save_scene_presets)
    websocket_api.async_register_command(hass, ws_delete_scene_preset)
    websocket_api.async_register_command(hass, ws_scene_preset_usage)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/list",
    }
)
@callback
def ws_list_schedules(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return summaries of all schedules.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    connection.send_result(msg["id"], {"schedules": store.async_list_schedules()})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/get",
        vol.Required("schedule_id"): str,
    }
)
@callback
def ws_get_schedule(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return a single schedule with full slot data.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
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
        vol.Required("type"): "oncue_scheduler/save",
        vol.Required("schedule"): dict,
    }
)
@websocket_api.async_response
async def ws_save_schedule(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save a schedule, returning conflicts and warnings.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
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
        vol.Required("type"): "oncue_scheduler/delete",
        vol.Required("schedule_id"): str,
    }
)
@websocket_api.async_response
async def ws_delete_schedule(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a schedule by ID.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
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
        vol.Required("type"): "oncue_scheduler/toggle_active",
        vol.Required("schedule_id"): str,
    }
)
@websocket_api.async_response
async def ws_toggle_active(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Toggle a schedule's active/paused state.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
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


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/set_override",
        vol.Required("schedule_id"): str,
        vol.Required("entity_id"): str,
        vol.Required("state"): vol.In(["on", "off"]),
    }
)
@websocket_api.async_response
async def ws_set_override(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Set a runtime on/off override for an entity in a schedule.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    coordinator = hass.data[DOMAIN][entry_id].coordinator
    coordinator.set_override(msg["schedule_id"], msg["entity_id"], msg["state"])
    # Apply immediately
    await coordinator._async_evaluate()
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/clear_override",
        vol.Required("schedule_id"): str,
        vol.Required("entity_id"): str,
    }
)
@websocket_api.async_response
async def ws_clear_override(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Clear a runtime override, reverting to the schedule.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    coordinator = hass.data[DOMAIN][entry_id].coordinator
    coordinator.clear_override(msg["schedule_id"], msg["entity_id"])
    # Re-evaluate to apply scheduled state immediately
    await coordinator._async_evaluate()
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/get_overrides",
        vol.Required("schedule_id"): str,
    }
)
@callback
def ws_get_overrides(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return overrides, scheduled states, and unavailable entities.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    coordinator = hass.data[DOMAIN][entry_id].coordinator
    connection.send_result(msg["id"], {
        "overrides": coordinator.get_overrides(msg["schedule_id"]),
        "scheduled_states": coordinator.get_scheduled_states(msg["schedule_id"]),
        "unavailable_entities": coordinator.get_unavailable_entities(msg["schedule_id"]),
    })


def _get_entry_id(hass: HomeAssistant) -> str | None:
    """Get the first (and only) config entry ID for this integration.

    :param hass: Home Assistant instance.
    :returns: Config entry ID string, or None if the integration is not configured.
    """
    domain_data = hass.data.get(DOMAIN)
    if not domain_data:
        return None
    for entry_id in domain_data:
        return entry_id
    return None


# ── Global HVAC presets ──


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/get_hvac_presets",
    }
)
@callback
def ws_get_hvac_presets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the global HVAC presets list.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    connection.send_result(msg["id"], {"hvac_presets": store.hvac_presets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/save_hvac_presets",
        vol.Required("hvac_presets"): list,
    }
)
@websocket_api.async_response
async def ws_save_hvac_presets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Replace the global HVAC presets list.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    try:
        saved = await store.async_save_hvac_presets(msg["hvac_presets"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    connection.send_result(msg["id"], {"hvac_presets": saved})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/delete_hvac_preset",
        vol.Required("index"): int,
    }
)
@websocket_api.async_response
async def ws_delete_hvac_preset(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete an HVAC preset by index, remapping schedule slots.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    try:
        presets = await store.async_delete_hvac_preset(msg["index"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    connection.send_result(msg["id"], {"hvac_presets": presets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/hvac_preset_usage",
        vol.Required("index"): int,
    }
)
@callback
def ws_hvac_preset_usage(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return schedules using the HVAC preset at the given index.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    connection.send_result(msg["id"], {"schedules": store.hvac_preset_usage(msg["index"])})


# ── Global color presets ──


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/get_color_presets",
    }
)
@callback
def ws_get_color_presets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the global color presets list.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    connection.send_result(msg["id"], {"color_presets": store.color_presets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/save_color_presets",
        vol.Required("color_presets"): list,
    }
)
@websocket_api.async_response
async def ws_save_color_presets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Replace the global color presets list.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    try:
        saved = await store.async_save_color_presets(msg["color_presets"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    connection.send_result(msg["id"], {"color_presets": saved})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/delete_color_preset",
        vol.Required("index"): int,
    }
)
@websocket_api.async_response
async def ws_delete_color_preset(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a color preset by index, remapping schedule slots.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    try:
        presets = await store.async_delete_color_preset(msg["index"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    connection.send_result(msg["id"], {"color_presets": presets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/color_preset_usage",
        vol.Required("index"): int,
    }
)
@callback
def ws_color_preset_usage(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return schedules using the color preset at the given index.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    connection.send_result(msg["id"], {"schedules": store.color_preset_usage(msg["index"])})


# ── Global brightness presets ──


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/get_brightness_presets",
    }
)
@callback
def ws_get_brightness_presets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the global brightness presets list.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    connection.send_result(msg["id"], {"brightness_presets": store.brightness_presets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/save_brightness_presets",
        vol.Required("brightness_presets"): list,
    }
)
@websocket_api.async_response
async def ws_save_brightness_presets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Replace the global brightness presets list.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    try:
        saved = await store.async_save_brightness_presets(msg["brightness_presets"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    connection.send_result(msg["id"], {"brightness_presets": saved})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/delete_brightness_preset",
        vol.Required("index"): int,
    }
)
@websocket_api.async_response
async def ws_delete_brightness_preset(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a brightness preset by index, remapping schedule slots.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    try:
        presets = await store.async_delete_brightness_preset(msg["index"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    connection.send_result(msg["id"], {"brightness_presets": presets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/brightness_preset_usage",
        vol.Required("index"): int,
    }
)
@callback
def ws_brightness_preset_usage(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return schedules using the brightness preset at the given index.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    connection.send_result(msg["id"], {"schedules": store.brightness_preset_usage(msg["index"])})


# ── Global scene presets ──


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/get_scene_presets",
    }
)
@callback
def ws_get_scene_presets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the global scene presets list.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    connection.send_result(msg["id"], {"scene_presets": store.scene_presets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/save_scene_presets",
        vol.Required("scene_presets"): list,
    }
)
@websocket_api.async_response
async def ws_save_scene_presets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Replace the global scene presets list.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    try:
        saved = await store.async_save_scene_presets(msg["scene_presets"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    connection.send_result(msg["id"], {"scene_presets": saved})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/delete_scene_preset",
        vol.Required("index"): int,
    }
)
@websocket_api.async_response
async def ws_delete_scene_preset(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a scene preset by index, remapping schedule slots.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    try:
        presets = await store.async_delete_scene_preset(msg["index"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    connection.send_result(msg["id"], {"scene_presets": presets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "oncue_scheduler/scene_preset_usage",
        vol.Required("index"): int,
    }
)
@callback
def ws_scene_preset_usage(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return schedules using the scene preset at the given index.

    :param hass: Home Assistant instance.
    :param connection: Active WebSocket connection.
    :param msg: Incoming message dict.
    """
    entry_id = _get_entry_id(hass)
    if entry_id is None:
        connection.send_error(msg["id"], "not_found", "Integration not configured")
        return
    store = hass.data[DOMAIN][entry_id].store
    connection.send_result(msg["id"], {"schedules": store.scene_preset_usage(msg["index"])})
