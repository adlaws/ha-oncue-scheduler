"""Shared fixtures and HA import stubs for testing without Home Assistant installed."""

import sys
import types
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

# Stub out all homeassistant.* imports so the integration modules can be
# imported without HA installed.

_STUBS = {}


def _make_module(name: str) -> types.ModuleType:
    if name in _STUBS:
        return _STUBS[name]
    mod = types.ModuleType(name)
    mod.__path__ = []
    mod.__package__ = name
    _STUBS[name] = mod
    sys.modules[name] = mod
    return mod


# Core HA modules
_ha = _make_module("homeassistant")
_ha_core = _make_module("homeassistant.core")
_ha_const = _make_module("homeassistant.const")
_ha_config_entries = _make_module("homeassistant.config_entries")
_ha_helpers = _make_module("homeassistant.helpers")
_ha_helpers_storage = _make_module("homeassistant.helpers.storage")
_ha_helpers_dispatcher = _make_module("homeassistant.helpers.dispatcher")
_ha_helpers_event = _make_module("homeassistant.helpers.event")
_ha_helpers_entity_platform = _make_module("homeassistant.helpers.entity_platform")
_ha_helpers_device_registry = _make_module("homeassistant.helpers.device_registry")
_ha_components = _make_module("homeassistant.components")
_ha_components_http = _make_module("homeassistant.components.http")
_ha_components_switch = _make_module("homeassistant.components.switch")
_ha_components_websocket_api = _make_module("homeassistant.components.websocket_api")
_ha_components_frontend = _make_module("homeassistant.components.frontend")
_ha_util = _make_module("homeassistant.util")
_ha_util_dt = _make_module("homeassistant.util.dt")

# Provide vol through a stub
_vol = _make_module("voluptuous")


class _VolRequired:
    def __init__(self, key, **kwargs):
        self.key = key
        self.schema = key
    def __hash__(self):
        return hash(self.key)
    def __eq__(self, other):
        return self.key == getattr(other, "key", other)


class _VolSchema:
    def __init__(self, schema=None, extra=None):
        self.schema = schema or {}
    def __call__(self, data):
        return data


_vol.Required = _VolRequired
_vol.Optional = _VolRequired
_vol.Schema = _VolSchema
_vol.ALLOW_EXTRA = "ALLOW_EXTRA"
sys.modules["voluptuous"] = _vol
import voluptuous as vol  # noqa: E402, F811


# HomeAssistant core stubs
class _MockHomeAssistant:
    def __init__(self):
        self.data = {}
        self.states = MagicMock()
        self.services = MagicMock()
        self.services.async_call = AsyncMock()
        self.config_entries = MagicMock()
        self.config_entries.async_forward_entry_setups = AsyncMock()
        self.config_entries.async_unload_platforms = AsyncMock(return_value=True)
        self.config = MagicMock()
        self.config.time_zone = "UTC"
        self.http = MagicMock()
        self.http.async_register_static_paths = AsyncMock()
        self.components = MagicMock()
        self.async_create_task = MagicMock()

    def async_create_task(self, coro):
        pass


_ha_core.HomeAssistant = _MockHomeAssistant
_ha_core.callback = lambda f: f
_ha_core.CALLBACK_TYPE = type(None)

# Platform enum
class _Platform:
    SWITCH = "switch"
    CLIMATE = "climate"
    SENSOR = "sensor"

_ha_const.Platform = _Platform


# ConfigEntry / ConfigFlow stubs
class _ConfigEntry:
    def __init__(self, entry_id="test_entry", data=None, title="Test"):
        self.entry_id = entry_id
        self.data = data or {}
        self.title = title


class _ConfigFlowResult(dict):
    pass


class _ConfigFlow:
    domain = None
    VERSION = 1

    def __init_subclass__(cls, domain=None, **kwargs):
        super().__init_subclass__(**kwargs)
        if domain:
            cls.domain = domain

    def __init__(self):
        self._unique_id = None
        self.hass = None

    async def async_set_unique_id(self, uid):
        self._unique_id = uid

    def _abort_if_unique_id_configured(self):
        pass

    def async_create_entry(self, title, data):
        return {"type": "create_entry", "title": title, "data": data}

    def async_show_form(self, step_id, data_schema=None, errors=None):
        return {"type": "form", "step_id": step_id, "errors": errors or {}}

    def async_abort(self, reason):
        return {"type": "abort", "reason": reason}


_ha_config_entries.ConfigEntry = _ConfigEntry
_ha_config_entries.ConfigFlow = _ConfigFlow
_ha_config_entries.ConfigFlowResult = _ConfigFlowResult

# Storage stub
class _Store:
    def __init__(self, hass, version, key):
        self._data = None

    async def async_load(self):
        return self._data

    async def async_save(self, data):
        self._data = data


_ha_helpers_storage.Store = _Store

# HTTP stubs
class _StaticPathConfig:
    def __init__(self, url_path, path, cache_headers=True):
        self.url_path = url_path
        self.path = path
        self.cache_headers = cache_headers

_ha_components_http.StaticPathConfig = _StaticPathConfig

# Dispatcher stubs
_dispatcher_callbacks = {}

def _async_dispatcher_send(hass, signal, *args):
    for cb in _dispatcher_callbacks.get(signal, []):
        result = cb(*args)
        if hasattr(result, "__await__"):
            import asyncio
            asyncio.get_event_loop().run_until_complete(result)

def _async_dispatcher_connect(hass, signal, callback):
    _dispatcher_callbacks.setdefault(signal, []).append(callback)
    return lambda: _dispatcher_callbacks[signal].remove(callback)

_ha_helpers_dispatcher.async_dispatcher_send = _async_dispatcher_send
_ha_helpers_dispatcher.async_dispatcher_connect = _async_dispatcher_connect

# Event stubs
def _async_track_utc_time_change(hass, callback, **kwargs):
    return lambda: None

_ha_helpers_event.async_track_utc_time_change = _async_track_utc_time_change

# dt_util stub
from datetime import datetime, timezone

def _now():
    return datetime.now(timezone.utc).astimezone()

_ha_util_dt.now = _now

# Entity stubs
class _SwitchEntity:
    _attr_has_entity_name = False
    _attr_unique_id = None
    _attr_name = None
    _attr_icon = None

    @property
    def unique_id(self):
        return self._attr_unique_id

    @property
    def name(self):
        return self._attr_name

    @property
    def icon(self):
        return self._attr_icon

    def async_schedule_update_ha_state(self):
        pass

    async def async_remove(self):
        pass

    async def async_turn_on(self, **kwargs):
        pass

    async def async_turn_off(self, **kwargs):
        pass


_ha_components_switch.SwitchEntity = _SwitchEntity
_ha_helpers_entity_platform.AddEntitiesCallback = type(None)

# DeviceInfo stub
class _DeviceInfo(dict):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.update(kwargs)

_ha_helpers_device_registry.DeviceInfo = _DeviceInfo

# WebSocket API stubs
class _ActiveConnection:
    def __init__(self):
        self.results = []
        self.errors = []

    def send_result(self, msg_id, result):
        self.results.append((msg_id, result))

    def send_error(self, msg_id, code, message):
        self.errors.append((msg_id, code, message))


def _ws_command(schema):
    def decorator(func):
        func._ws_schema = schema
        return func
    return decorator

def _ws_async_response(func):
    return func

_registered_commands = {}

def _async_register_command(hass, handler):
    _registered_commands[handler.__name__] = handler

_ha_components_websocket_api.websocket_command = _ws_command
_ha_components_websocket_api.async_response = _ws_async_response
_ha_components_websocket_api.async_register_command = _async_register_command
_ha_components_websocket_api.ActiveConnection = _ActiveConnection

# Now we can safely import the integration modules
sys.path.insert(0, str(Path(__file__).parent.parent / "custom_components"))

import pytest


@pytest.fixture
def hass():
    """Return a mock HomeAssistant instance."""
    return _MockHomeAssistant()


@pytest.fixture
def mock_store(hass):
    """Return a ScheduleStore backed by an in-memory Store."""
    from oncue_scheduler.store import ScheduleStore
    return ScheduleStore(hass)


@pytest.fixture
def connection():
    """Return a mock WebSocket connection."""
    return _ActiveConnection()
