"""Tests for WebSocket API commands."""

import pytest
from unittest.mock import AsyncMock, MagicMock


@pytest.fixture
async def store_with_schedule(mock_store):
    await mock_store.async_load()
    saved = await mock_store.async_save_schedule({
        "name": "Test Schedule",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    })
    return mock_store, saved


@pytest.mark.asyncio
async def test_ws_list_schedules(hass, connection, mock_store):
    from oncue.websocket_api import ws_list_schedules
    from oncue.const import DOMAIN
    from oncue import OnCueData

    await mock_store.async_load()
    await mock_store.async_save_schedule({
        "name": "Listed",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    })

    hass.data[DOMAIN] = {"test_entry": OnCueData(store=mock_store, coordinator=MagicMock())}

    ws_list_schedules(hass, connection, {"id": 1, "type": "oncue/list"})

    assert len(connection.results) == 1
    _, result = connection.results[0]
    assert len(result["schedules"]) == 1
    assert "slots" not in result["schedules"][0]


@pytest.mark.asyncio
async def test_ws_get_schedule(hass, connection, store_with_schedule):
    from oncue.websocket_api import ws_get_schedule
    from oncue.const import DOMAIN
    from oncue import OnCueData

    store, saved = store_with_schedule
    hass.data[DOMAIN] = {"test_entry": OnCueData(store=store, coordinator=MagicMock())}

    ws_get_schedule(hass, connection, {
        "id": 1,
        "type": "oncue/get",
        "schedule_id": saved["id"],
    })

    assert len(connection.results) == 1
    _, result = connection.results[0]
    assert result["schedule"]["name"] == "Test Schedule"
    assert "slots" in result["schedule"]


@pytest.mark.asyncio
async def test_ws_get_schedule_not_found(hass, connection, mock_store):
    from oncue.websocket_api import ws_get_schedule
    from oncue.const import DOMAIN
    from oncue import OnCueData

    await mock_store.async_load()
    hass.data[DOMAIN] = {"test_entry": OnCueData(store=mock_store, coordinator=MagicMock())}

    ws_get_schedule(hass, connection, {
        "id": 1,
        "type": "oncue/get",
        "schedule_id": "nonexistent",
    })

    assert len(connection.errors) == 1
    assert connection.errors[0][1] == "not_found"


@pytest.mark.asyncio
async def test_ws_save_schedule(hass, connection, mock_store):
    from oncue.websocket_api import ws_save_schedule
    from oncue.const import DOMAIN
    from oncue import OnCueData

    await mock_store.async_load()
    hass.data[DOMAIN] = {"test_entry": OnCueData(store=mock_store, coordinator=MagicMock())}

    await ws_save_schedule(hass, connection, {
        "id": 1,
        "type": "oncue/save",
        "schedule": {
            "name": "New Schedule",
            "entity_ids": ["switch.lamp"],
            "cadence": "daily",
        },
    })

    assert len(connection.results) == 1
    _, result = connection.results[0]
    assert result["schedule"]["name"] == "New Schedule"
    assert "conflicts" in result


@pytest.mark.asyncio
async def test_ws_save_schedule_invalid(hass, connection, mock_store):
    from oncue.websocket_api import ws_save_schedule
    from oncue.const import DOMAIN
    from oncue import OnCueData

    await mock_store.async_load()
    hass.data[DOMAIN] = {"test_entry": OnCueData(store=mock_store, coordinator=MagicMock())}

    await ws_save_schedule(hass, connection, {
        "id": 1,
        "type": "oncue/save",
        "schedule": {
            "name": "",
            "entity_ids": [],
            "cadence": "daily",
        },
    })

    assert len(connection.errors) == 1
    assert connection.errors[0][1] == "invalid_format"


@pytest.mark.asyncio
async def test_ws_delete_schedule(hass, connection, store_with_schedule):
    from oncue.websocket_api import ws_delete_schedule
    from oncue.const import DOMAIN
    from oncue import OnCueData

    store, saved = store_with_schedule
    hass.data[DOMAIN] = {"test_entry": OnCueData(store=store, coordinator=MagicMock())}

    await ws_delete_schedule(hass, connection, {
        "id": 1,
        "type": "oncue/delete",
        "schedule_id": saved["id"],
    })

    assert len(connection.results) == 1
    _, result = connection.results[0]
    assert result["success"] is True
    assert store.async_get_schedule(saved["id"]) is None


@pytest.mark.asyncio
async def test_ws_delete_not_found(hass, connection, mock_store):
    from oncue.websocket_api import ws_delete_schedule
    from oncue.const import DOMAIN
    from oncue import OnCueData

    await mock_store.async_load()
    hass.data[DOMAIN] = {"test_entry": OnCueData(store=mock_store, coordinator=MagicMock())}

    await ws_delete_schedule(hass, connection, {
        "id": 1,
        "type": "oncue/delete",
        "schedule_id": "nope",
    })

    assert len(connection.errors) == 1


@pytest.mark.asyncio
async def test_ws_toggle_active(hass, connection, store_with_schedule):
    from oncue.websocket_api import ws_toggle_active
    from oncue.const import DOMAIN
    from oncue import OnCueData

    store, saved = store_with_schedule
    hass.data[DOMAIN] = {"test_entry": OnCueData(store=store, coordinator=MagicMock())}

    await ws_toggle_active(hass, connection, {
        "id": 1,
        "type": "oncue/toggle_active",
        "schedule_id": saved["id"],
    })

    assert len(connection.results) == 1
    _, result = connection.results[0]
    assert result["schedule"]["active"] is False


@pytest.mark.asyncio
async def test_ws_save_detects_conflict(hass, connection, mock_store):
    from oncue.websocket_api import ws_save_schedule
    from oncue.const import DOMAIN
    from oncue import OnCueData

    await mock_store.async_load()

    # Create first schedule: switch.lamp ON at midnight
    slots1 = [0] * 96
    slots1[0] = 1
    await mock_store.async_save_schedule({
        "name": "Schedule A",
        "entity_ids": ["switch.lamp"],
        "cadence": "daily",
        "slots": {"0": slots1},
    })

    hass.data[DOMAIN] = {"test_entry": OnCueData(store=mock_store, coordinator=MagicMock())}

    # Save second schedule: switch.lamp OFF at midnight (conflict)
    slots2 = [0] * 96  # slot 0 is OFF, conflicting with Schedule A's ON
    await ws_save_schedule(hass, connection, {
        "id": 1,
        "type": "oncue/save",
        "schedule": {
            "name": "Schedule B",
            "entity_ids": ["switch.lamp"],
            "cadence": "daily",
            "slots": {"0": slots2},
        },
    })

    assert len(connection.results) == 1
    _, result = connection.results[0]
    assert len(result["conflicts"]) == 1
    assert "switch.lamp" in result["conflicts"][0]["overlapping_entities"]


@pytest.mark.asyncio
async def test_save_empty_schedule_returns_warning(hass, connection, mock_store):
    """Saving a schedule with all slots off includes a warning in the response."""
    from oncue.websocket_api import ws_save_schedule
    from oncue.const import DOMAIN
    from oncue import OnCueData

    await mock_store.async_load()
    hass.data[DOMAIN] = {"test_entry": OnCueData(store=mock_store, coordinator=MagicMock())}

    all_off_slots = [0] * 96
    await ws_save_schedule(hass, connection, {
        "id": 1,
        "type": "oncue/save",
        "schedule": {
            "name": "Empty Schedule",
            "entity_ids": ["switch.test"],
            "cadence": "daily",
            "slots": {"0": all_off_slots},
        },
    })

    assert len(connection.results) == 1
    _, result = connection.results[0]
    assert "warnings" in result
    assert len(result["warnings"]) == 1
    assert "All time slots are off" in result["warnings"][0]
