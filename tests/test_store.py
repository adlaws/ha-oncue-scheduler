"""Tests for ScheduleStore CRUD operations."""

import pytest


@pytest.fixture
async def store(mock_store):
    await mock_store.async_load()
    return mock_store


@pytest.mark.asyncio
async def test_empty_store_returns_no_schedules(store):
    assert store.async_list_schedules() == []


@pytest.mark.asyncio
async def test_save_schedule_assigns_uuid(store):
    data = {
        "name": "Test Schedule",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    result = await store.async_save_schedule(data)
    assert "id" in result
    assert len(result["id"]) == 36  # UUID format


@pytest.mark.asyncio
async def test_save_schedule_generates_default_slots(store):
    data = {
        "name": "Daily",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    result = await store.async_save_schedule(data)
    assert "0" in result["slots"]
    assert len(result["slots"]["0"]) == 96
    assert all(v == 0 for v in result["slots"]["0"])


@pytest.mark.asyncio
async def test_save_weekly_generates_7_days(store):
    data = {
        "name": "Weekly",
        "entity_ids": ["switch.test"],
        "cadence": "weekly",
    }
    result = await store.async_save_schedule(data)
    assert len(result["slots"]) == 7
    for i in range(7):
        assert str(i) in result["slots"]


@pytest.mark.asyncio
async def test_save_custom_generates_correct_days(store):
    data = {
        "name": "Custom",
        "entity_ids": ["switch.test"],
        "cadence": "custom",
        "start_date": "2025-01-01",
        "end_date": "2025-01-05",
    }
    result = await store.async_save_schedule(data)
    assert len(result["slots"]) == 5


@pytest.mark.asyncio
async def test_save_preserves_provided_slots(store):
    slots = {"0": [1] * 96}
    data = {
        "name": "With Slots",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": slots,
    }
    result = await store.async_save_schedule(data)
    assert result["slots"]["0"] == [1] * 96


@pytest.mark.asyncio
async def test_get_schedule_returns_saved(store):
    data = {
        "name": "Findable",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    saved = await store.async_save_schedule(data)
    found = store.async_get_schedule(saved["id"])
    assert found is not None
    assert found["name"] == "Findable"


@pytest.mark.asyncio
async def test_get_schedule_returns_none_for_missing(store):
    assert store.async_get_schedule("nonexistent") is None


@pytest.mark.asyncio
async def test_list_schedules_excludes_slots(store):
    data = {
        "name": "Listed",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    await store.async_save_schedule(data)
    summaries = store.async_list_schedules()
    assert len(summaries) == 1
    assert "slots" not in summaries[0]
    assert summaries[0]["name"] == "Listed"


@pytest.mark.asyncio
async def test_update_existing_schedule(store):
    data = {
        "name": "Original",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    saved = await store.async_save_schedule(data)
    saved["name"] = "Updated"
    updated = await store.async_save_schedule(saved)
    assert updated["name"] == "Updated"
    assert len(store.async_list_schedules()) == 1


@pytest.mark.asyncio
async def test_delete_schedule(store):
    data = {
        "name": "Doomed",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    saved = await store.async_save_schedule(data)
    assert await store.async_delete_schedule(saved["id"]) is True
    assert store.async_get_schedule(saved["id"]) is None


@pytest.mark.asyncio
async def test_delete_nonexistent_returns_false(store):
    assert await store.async_delete_schedule("nope") is False


@pytest.mark.asyncio
async def test_toggle_active(store):
    data = {
        "name": "Toggle Me",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    saved = await store.async_save_schedule(data)
    assert saved["active"] is True
    toggled = await store.async_toggle_active(saved["id"])
    assert toggled["active"] is False
    toggled2 = await store.async_toggle_active(saved["id"])
    assert toggled2["active"] is True


@pytest.mark.asyncio
async def test_toggle_nonexistent_returns_none(store):
    assert await store.async_toggle_active("missing") is None


@pytest.mark.asyncio
async def test_set_active(store):
    data = {
        "name": "Set Active",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    saved = await store.async_save_schedule(data)
    result = await store.async_set_active(saved["id"], False)
    assert result["active"] is False


@pytest.mark.asyncio
async def test_validation_rejects_empty_name(store):
    data = {
        "name": "",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    with pytest.raises(ValueError, match="name is required"):
        await store.async_save_schedule(data)


@pytest.mark.asyncio
async def test_validation_rejects_empty_entity_ids(store):
    data = {
        "name": "No Entities",
        "entity_ids": [],
        "cadence": "daily",
    }
    with pytest.raises(ValueError, match="entity_ids"):
        await store.async_save_schedule(data)


@pytest.mark.asyncio
async def test_validation_rejects_invalid_cadence(store):
    data = {
        "name": "Bad Cadence",
        "entity_ids": ["switch.test"],
        "cadence": "hourly",
    }
    with pytest.raises(ValueError, match="cadence"):
        await store.async_save_schedule(data)


@pytest.mark.asyncio
async def test_validation_rejects_wrong_slot_length(store):
    data = {
        "name": "Wrong Slots",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": {"0": [0] * 50},
    }
    with pytest.raises(ValueError, match="exactly 96"):
        await store.async_save_schedule(data)


@pytest.mark.asyncio
async def test_validation_rejects_custom_without_dates(store):
    data = {
        "name": "No Dates",
        "entity_ids": ["switch.test"],
        "cadence": "custom",
    }
    with pytest.raises(ValueError, match="start_date and end_date required"):
        await store.async_save_schedule(data)


@pytest.mark.asyncio
async def test_validation_rejects_custom_range_too_long(store):
    data = {
        "name": "Too Long",
        "entity_ids": ["switch.test"],
        "cadence": "custom",
        "start_date": "2025-01-01",
        "end_date": "2025-03-01",
    }
    with pytest.raises(ValueError, match="1-31 days"):
        await store.async_save_schedule(data)


@pytest.mark.asyncio
async def test_slot_minutes_defaults_to_15(store):
    data = {
        "name": "Default Granularity",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    result = await store.async_save_schedule(data)
    assert result["slot_minutes"] == 15


@pytest.mark.asyncio
async def test_slot_values_are_integers(store):
    data = {
        "name": "Int Slots",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": {"0": [0, 1] * 48},
    }
    result = await store.async_save_schedule(data)
    assert all(isinstance(v, int) for v in result["slots"]["0"])


@pytest.mark.asyncio
async def test_save_defaults_slot_type(store):
    data = {
        "name": "No Slot Type",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    result = await store.async_save_schedule(data)
    assert result["slot_type"] == "on_off"


@pytest.mark.asyncio
async def test_save_preserves_explicit_slot_type(store):
    data = {
        "name": "Explicit Type",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slot_type": "on_off",
    }
    result = await store.async_save_schedule(data)
    assert result["slot_type"] == "on_off"


def test_slots_per_day():
    from oncue_scheduler.store import slots_per_day
    assert slots_per_day(15) == 96
    assert slots_per_day(30) == 48
    assert slots_per_day(60) == 24


@pytest.mark.asyncio
async def test_validation_rejects_negative_revert_delay(store):
    data = {
        "name": "Negative Revert",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "revert_delay": -10,
    }
    with pytest.raises(ValueError, match="revert_delay"):
        await store.async_save_schedule(data)


@pytest.mark.asyncio
async def test_validation_rejects_excessive_revert_delay(store):
    data = {
        "name": "Too Long Revert",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "revert_delay": 7200,
    }
    with pytest.raises(ValueError, match="revert_delay"):
        await store.async_save_schedule(data)


@pytest.mark.asyncio
async def test_save_defaults_revert_delay(store):
    data = {
        "name": "Default Revert",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
    }
    result = await store.async_save_schedule(data)
    assert result["revert_delay"] == 180


@pytest.mark.asyncio
async def test_save_accepts_null_revert_delay(store):
    data = {
        "name": "No Revert",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "revert_delay": None,
    }
    result = await store.async_save_schedule(data)
    assert result["revert_delay"] is None


@pytest.mark.asyncio
async def test_validation_rejects_invalid_slot_values(store):
    data = {
        "name": "Bad Slots",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": {"0": [2] + [0] * 95},
    }
    with pytest.raises(ValueError, match="slot"):
        await store.async_save_schedule(data)


@pytest.mark.asyncio
async def test_save_color_schedule_with_palette(store):
    data = {
        "name": "Color Schedule",
        "entity_ids": ["light.test"],
        "cadence": "daily",
        "slot_type": "color",
        "palette": ["#ff0000", "#00ff00", "#0000ff"],
    }
    result = await store.async_save_schedule(data)
    assert result["slot_type"] == "color"
    assert result["palette"] == ["#ff0000", "#00ff00", "#0000ff"]


@pytest.mark.asyncio
async def test_color_schedule_rejects_missing_palette(store):
    data = {
        "name": "No Palette",
        "entity_ids": ["light.test"],
        "cadence": "daily",
        "slot_type": "color",
    }
    with pytest.raises(ValueError, match="palette"):
        await store.async_save_schedule(data)


@pytest.mark.asyncio
async def test_color_schedule_accepts_palette_index_slots(store):
    data = {
        "name": "Color Slots",
        "entity_ids": ["light.test"],
        "cadence": "daily",
        "slot_type": "color",
        "palette": ["#ff0000", "#00ff00"],
        "slots": {"0": [0, 1, 2, 0] * 24},
    }
    result = await store.async_save_schedule(data)
    assert result["slots"]["0"][1] == 1
    assert result["slots"]["0"][2] == 2
