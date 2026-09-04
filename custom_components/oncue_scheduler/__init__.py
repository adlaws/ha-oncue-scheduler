"""OnCue integration for Home Assistant."""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from pathlib import Path

from homeassistant.config_entries import ConfigEntry
from homeassistant.components.frontend import (
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.components.http import StaticPathConfig
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .coordinator import ScheduleCoordinator
from .store import ScheduleStore
from .websocket_api import async_register_websocket_api

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SWITCH]
PANEL_URL = "/oncue_scheduler/panel"
PANEL_ICON = "mdi:calendar-clock"
PANEL_TITLE = "OnCue"
FRONTEND_DIR = Path(__file__).parent / "frontend"
_MANIFEST = json.loads((Path(__file__).parent / "manifest.json").read_text())
VERSION = _MANIFEST["version"]


@dataclass
class OnCueData:
    """Shared runtime data for the integration."""

    store: ScheduleStore
    coordinator: ScheduleCoordinator


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up OnCue from a config entry.

    Initialises the store, coordinator, WebSocket API, switch platform,
    and registers the frontend panel.

    :param hass: Home Assistant instance.
    :param entry: Config entry being set up.
    :returns: True on successful setup.
    """
    hass.data.setdefault(DOMAIN, {})

    store = ScheduleStore(hass)
    await store.async_load()

    coordinator = ScheduleCoordinator(hass, store)

    hass.data[DOMAIN][entry.entry_id] = OnCueData(
        store=store,
        coordinator=coordinator,
    )

    async_register_websocket_api(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await coordinator.async_start()

    # Register frontend panel
    await hass.http.async_register_static_paths([
        StaticPathConfig(
            PANEL_URL, str(FRONTEND_DIR / "oncue-scheduler-panel.js"), True
        )
    ])
    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path=DOMAIN,
        require_admin=False,
        config={"_panel_custom": {
            "name": "oncue-scheduler-panel",
            "embed_iframe": False,
            "trust_external": False,
            "js_url": f"{PANEL_URL}?v={VERSION}",
        }},
    )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload an OnCue config entry.

    Stops the coordinator, unloads the switch platform, and removes
    the frontend panel.

    :param hass: Home Assistant instance.
    :param entry: Config entry being unloaded.
    :returns: True if the entry was successfully unloaded.
    """
    data: OnCueData = hass.data[DOMAIN][entry.entry_id]
    data.coordinator.async_stop()

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        if not hass.data[DOMAIN]:
            hass.data.pop(DOMAIN, None)
        async_remove_panel(hass, DOMAIN)
    return unload_ok
