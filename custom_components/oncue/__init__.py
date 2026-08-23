"""OnCue integration for Home Assistant."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .coordinator import ScheduleCoordinator
from .store import ScheduleStore
from .websocket_api import async_register_websocket_api

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SWITCH]
PANEL_URL = "/oncue/panel"
PANEL_ICON = "mdi:calendar-clock"
PANEL_TITLE = "OnCue"
FRONTEND_DIR = Path(__file__).parent / "frontend"


@dataclass
class OnCueData:
    """Shared runtime data for the integration."""

    store: ScheduleStore
    coordinator: ScheduleCoordinator


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
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
    hass.http.register_static_path(
        PANEL_URL, str(FRONTEND_DIR / "oncue-panel.js"), cache_headers=True
    )
    hass.components.frontend.async_register_built_in_panel(
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path=DOMAIN,
        require_admin=False,
        config={"_panel_custom": {
            "name": "oncue-panel",
            "embed_iframe": False,
            "trust_external": False,
            "js_url": PANEL_URL,
        }},
    )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    data: OnCueData = hass.data[DOMAIN][entry.entry_id]
    data.coordinator.async_stop()

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        if not hass.data[DOMAIN]:
            hass.data.pop(DOMAIN, None)
        hass.components.frontend.async_remove_panel(DOMAIN)
    return unload_ok
