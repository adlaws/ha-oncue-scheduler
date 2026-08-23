"""Tests for ScheduleSwitch entity behaviour."""

import pytest
from unittest.mock import MagicMock


@pytest.mark.asyncio
async def test_switch_is_on_reflects_active(mock_store):
    from ha_oncue_scheduler.switch import ScheduleSwitch

    await mock_store.async_load()
    saved = await mock_store.async_save_schedule({
        "name": "Active Schedule",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    })

    switch = ScheduleSwitch("test_entry", mock_store, saved)
    assert switch.is_on is True


@pytest.mark.asyncio
async def test_switch_is_off_when_inactive(mock_store):
    from ha_oncue_scheduler.switch import ScheduleSwitch

    await mock_store.async_load()
    saved = await mock_store.async_save_schedule({
        "name": "Inactive",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    })
    await mock_store.async_set_active(saved["id"], False)

    switch = ScheduleSwitch("test_entry", mock_store, saved)
    assert switch.is_on is False


@pytest.mark.asyncio
async def test_switch_turn_off_deactivates(mock_store):
    from ha_oncue_scheduler.switch import ScheduleSwitch

    await mock_store.async_load()
    saved = await mock_store.async_save_schedule({
        "name": "Toggle",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    })

    switch = ScheduleSwitch("test_entry", mock_store, saved)
    await switch.async_turn_off()

    assert mock_store.async_get_schedule(saved["id"])["active"] is False


@pytest.mark.asyncio
async def test_switch_turn_on_activates(mock_store):
    from ha_oncue_scheduler.switch import ScheduleSwitch

    await mock_store.async_load()
    saved = await mock_store.async_save_schedule({
        "name": "Activate",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    })
    await mock_store.async_set_active(saved["id"], False)

    switch = ScheduleSwitch("test_entry", mock_store, saved)
    await switch.async_turn_on()

    assert mock_store.async_get_schedule(saved["id"])["active"] is True


@pytest.mark.asyncio
async def test_switch_unique_id(mock_store):
    from ha_oncue_scheduler.switch import ScheduleSwitch

    await mock_store.async_load()
    saved = await mock_store.async_save_schedule({
        "name": "UniqueID",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    })

    switch = ScheduleSwitch("test_entry", mock_store, saved)
    assert switch.unique_id == f"ha_oncue_scheduler_{saved['id']}"


@pytest.mark.asyncio
async def test_switch_extra_attributes(mock_store):
    from ha_oncue_scheduler.switch import ScheduleSwitch

    await mock_store.async_load()
    saved = await mock_store.async_save_schedule({
        "name": "Attrs",
        "entity_ids": ["switch.test", "light.lamp"],
        "cadence": "weekly",
    })

    switch = ScheduleSwitch("test_entry", mock_store, saved)
    attrs = switch.extra_state_attributes
    assert attrs["entity_ids"] == ["switch.test", "light.lamp"]
    assert attrs["cadence"] == "weekly"
    assert attrs["repeat"] is True


@pytest.mark.asyncio
async def test_switch_icon(mock_store):
    from ha_oncue_scheduler.switch import ScheduleSwitch

    await mock_store.async_load()
    saved = await mock_store.async_save_schedule({
        "name": "Icon",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    })

    switch = ScheduleSwitch("test_entry", mock_store, saved)
    assert switch.icon == "mdi:calendar-clock"
