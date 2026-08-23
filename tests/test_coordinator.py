"""Tests for ScheduleCoordinator slot calculation and evaluation logic."""

import pytest
from datetime import datetime, date, timezone, timedelta
from unittest.mock import AsyncMock, MagicMock, patch


def test_compute_slot_index_midnight():
    from oncue_scheduler.coordinator import compute_slot_index
    dt = datetime(2025, 1, 1, 0, 0, tzinfo=timezone.utc)
    assert compute_slot_index(dt, 15) == 0


def test_compute_slot_index_noon():
    from oncue_scheduler.coordinator import compute_slot_index
    dt = datetime(2025, 1, 1, 12, 0, tzinfo=timezone.utc)
    assert compute_slot_index(dt, 15) == 48


def test_compute_slot_index_end_of_day():
    from oncue_scheduler.coordinator import compute_slot_index
    dt = datetime(2025, 1, 1, 23, 45, tzinfo=timezone.utc)
    assert compute_slot_index(dt, 15) == 95


def test_compute_slot_index_quarter_past():
    from oncue_scheduler.coordinator import compute_slot_index
    dt = datetime(2025, 1, 1, 6, 15, tzinfo=timezone.utc)
    assert compute_slot_index(dt, 15) == 25


def test_compute_slot_index_between_boundaries():
    from oncue_scheduler.coordinator import compute_slot_index
    # 6:20 should still be slot 25 (6:15-6:29)
    dt = datetime(2025, 1, 1, 6, 20, tzinfo=timezone.utc)
    assert compute_slot_index(dt, 15) == 25


def test_compute_day_key_daily():
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {"cadence": "daily"}
    assert compute_day_key(schedule, date(2025, 1, 1)) == "0"
    assert compute_day_key(schedule, date(2025, 6, 15)) == "0"


def test_compute_day_key_weekly_monday():
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {"cadence": "weekly"}
    # 2025-01-06 is a Monday
    assert compute_day_key(schedule, date(2025, 1, 6)) == "0"


def test_compute_day_key_weekly_sunday():
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {"cadence": "weekly"}
    # 2025-01-12 is a Sunday
    assert compute_day_key(schedule, date(2025, 1, 12)) == "6"


def test_compute_day_key_weekly_wednesday():
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {"cadence": "weekly"}
    # 2025-01-08 is a Wednesday
    assert compute_day_key(schedule, date(2025, 1, 8)) == "2"


def test_compute_day_key_custom_first_day():
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {
        "cadence": "custom",
        "start_date": "2025-01-01",
        "end_date": "2025-01-05",
        "repeat": False,
    }
    assert compute_day_key(schedule, date(2025, 1, 1)) == "0"


def test_compute_day_key_custom_last_day():
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {
        "cadence": "custom",
        "start_date": "2025-01-01",
        "end_date": "2025-01-05",
        "repeat": False,
    }
    assert compute_day_key(schedule, date(2025, 1, 5)) == "4"


def test_compute_day_key_custom_before_start():
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {
        "cadence": "custom",
        "start_date": "2025-01-01",
        "end_date": "2025-01-05",
        "repeat": False,
    }
    assert compute_day_key(schedule, date(2024, 12, 31)) is None


def test_compute_day_key_custom_after_end():
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {
        "cadence": "custom",
        "start_date": "2025-01-01",
        "end_date": "2025-01-05",
        "repeat": False,
    }
    assert compute_day_key(schedule, date(2025, 1, 6)) is None


def test_compute_day_key_custom_repeating():
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {
        "cadence": "custom",
        "start_date": "2025-01-01",
        "end_date": "2025-01-03",
        "repeat": True,
    }
    # 3-day cycle: day 0, 1, 2, 0, 1, 2, ...
    assert compute_day_key(schedule, date(2025, 1, 1)) == "0"
    assert compute_day_key(schedule, date(2025, 1, 3)) == "2"
    assert compute_day_key(schedule, date(2025, 1, 4)) == "0"  # wraps
    assert compute_day_key(schedule, date(2025, 1, 7)) == "0"  # wraps again


@pytest.mark.asyncio
async def test_coordinator_calls_turn_on(hass):
    from oncue_scheduler.store import ScheduleStore
    from oncue_scheduler.coordinator import ScheduleCoordinator

    store = ScheduleStore(hass)
    await store.async_load()

    slots = [0] * 96
    slots[0] = 1  # On at midnight
    await store.async_save_schedule({
        "name": "Test",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": {"0": slots},
    })

    # Mock entity as currently off
    mock_state = MagicMock()
    mock_state.state = "off"
    hass.states.get = MagicMock(return_value=mock_state)

    coordinator = ScheduleCoordinator(hass, store)

    # Patch dt_util.now to return midnight
    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 1, 6, 0, 0, tzinfo=timezone.utc)
        await coordinator._async_evaluate()

    hass.services.async_call.assert_called_once_with(
        "homeassistant", "turn_on", {"entity_id": "switch.test"}, blocking=True
    )


@pytest.mark.asyncio
async def test_coordinator_calls_turn_off(hass):
    from oncue_scheduler.store import ScheduleStore
    from oncue_scheduler.coordinator import ScheduleCoordinator

    store = ScheduleStore(hass)
    await store.async_load()

    slots = [0] * 96  # All off
    await store.async_save_schedule({
        "name": "Test",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": {"0": slots},
    })

    mock_state = MagicMock()
    mock_state.state = "on"
    hass.states.get = MagicMock(return_value=mock_state)

    coordinator = ScheduleCoordinator(hass, store)

    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 1, 6, 0, 0, tzinfo=timezone.utc)
        await coordinator._async_evaluate()

    hass.services.async_call.assert_called_once_with(
        "homeassistant", "turn_off", {"entity_id": "switch.test"}, blocking=True
    )


@pytest.mark.asyncio
async def test_coordinator_skips_matching_state(hass):
    from oncue_scheduler.store import ScheduleStore
    from oncue_scheduler.coordinator import ScheduleCoordinator

    store = ScheduleStore(hass)
    await store.async_load()

    slots = [1] * 96
    await store.async_save_schedule({
        "name": "Test",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": {"0": slots},
    })

    # Entity already on - no call needed
    mock_state = MagicMock()
    mock_state.state = "on"
    hass.states.get = MagicMock(return_value=mock_state)

    coordinator = ScheduleCoordinator(hass, store)

    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 1, 6, 0, 0, tzinfo=timezone.utc)
        await coordinator._async_evaluate()

    hass.services.async_call.assert_not_called()


@pytest.mark.asyncio
async def test_coordinator_skips_missing_entity(hass):
    from oncue_scheduler.store import ScheduleStore
    from oncue_scheduler.coordinator import ScheduleCoordinator

    store = ScheduleStore(hass)
    await store.async_load()

    slots = [1] * 96
    await store.async_save_schedule({
        "name": "Test",
        "entity_ids": ["switch.missing"],
        "cadence": "daily",
        "slots": {"0": slots},
    })

    hass.states.get = MagicMock(return_value=None)

    coordinator = ScheduleCoordinator(hass, store)

    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 1, 6, 0, 0, tzinfo=timezone.utc)
        # Should not raise
        await coordinator._async_evaluate()

    hass.services.async_call.assert_not_called()


@pytest.mark.asyncio
async def test_coordinator_skips_inactive_schedule(hass):
    from oncue_scheduler.store import ScheduleStore
    from oncue_scheduler.coordinator import ScheduleCoordinator

    store = ScheduleStore(hass)
    await store.async_load()

    slots = [1] * 96
    saved = await store.async_save_schedule({
        "name": "Inactive",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": {"0": slots},
    })
    await store.async_set_active(saved["id"], False)

    mock_state = MagicMock()
    mock_state.state = "off"
    hass.states.get = MagicMock(return_value=mock_state)

    coordinator = ScheduleCoordinator(hass, store)

    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 1, 6, 0, 0, tzinfo=timezone.utc)
        await coordinator._async_evaluate()

    hass.services.async_call.assert_not_called()


@pytest.mark.asyncio
async def test_coordinator_expires_one_off_schedule(hass):
    from oncue_scheduler.store import ScheduleStore
    from oncue_scheduler.coordinator import ScheduleCoordinator

    store = ScheduleStore(hass)
    await store.async_load()

    await store.async_save_schedule({
        "name": "One-off",
        "entity_ids": ["switch.test"],
        "cadence": "custom",
        "repeat": False,
        "start_date": "2025-01-01",
        "end_date": "2025-01-03",
    })

    coordinator = ScheduleCoordinator(hass, store)

    # Evaluate on Jan 4 (past end date)
    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 1, 4, 12, 0, tzinfo=timezone.utc)
        await coordinator._async_evaluate()

    # Schedule should now be inactive
    schedules = store.async_list_schedules()
    assert schedules[0]["active"] is False


@pytest.mark.asyncio
async def test_coordinator_handles_service_failure(hass):
    from oncue_scheduler.store import ScheduleStore
    from oncue_scheduler.coordinator import ScheduleCoordinator

    store = ScheduleStore(hass)
    await store.async_load()

    slots = [1] * 96
    await store.async_save_schedule({
        "name": "Fail Test",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": {"0": slots},
    })

    mock_state = MagicMock()
    mock_state.state = "off"
    hass.states.get = MagicMock(return_value=mock_state)
    hass.services.async_call = AsyncMock(side_effect=Exception("Service failed"))

    coordinator = ScheduleCoordinator(hass, store)

    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 1, 6, 0, 0, tzinfo=timezone.utc)
        # Should not raise
        await coordinator._async_evaluate()


# --- Phase 3: DST, midnight rollover, and entity availability tests ---


def test_compute_slot_index_dst_spring_forward():
    """After spring-forward, 3:00 AM maps to slot 12 (correct wall-clock)."""
    from oncue_scheduler.coordinator import compute_slot_index
    dt = datetime(2025, 3, 30, 3, 0, tzinfo=timezone.utc)
    assert compute_slot_index(dt, 15) == 12


def test_compute_slot_index_dst_fall_back():
    """During fall-back, 1:30 AM maps to slot 6 regardless of which occurrence."""
    from oncue_scheduler.coordinator import compute_slot_index
    dt = datetime(2025, 10, 26, 1, 30, tzinfo=timezone.utc)
    assert compute_slot_index(dt, 15) == 6


def test_midnight_rollover_slot_index():
    """Slot 95 at 23:45 and slot 0 at 00:00 the next day."""
    from oncue_scheduler.coordinator import compute_slot_index
    assert compute_slot_index(datetime(2025, 1, 1, 23, 45, tzinfo=timezone.utc), 15) == 95
    assert compute_slot_index(datetime(2025, 1, 2, 0, 0, tzinfo=timezone.utc), 15) == 0


def test_midnight_rollover_day_key_daily():
    """Daily cadence returns '0' regardless of date."""
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {"cadence": "daily"}
    assert compute_day_key(schedule, date(2025, 1, 1)) == "0"
    assert compute_day_key(schedule, date(2025, 1, 2)) == "0"


def test_midnight_rollover_day_key_weekly():
    """Weekly cadence changes day key at midnight crossing."""
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {"cadence": "weekly"}
    assert compute_day_key(schedule, date(2025, 1, 6)) == "0"
    assert compute_day_key(schedule, date(2025, 1, 7)) == "1"


def test_midnight_rollover_day_key_custom():
    """Custom cadence advances day key at midnight."""
    from oncue_scheduler.coordinator import compute_day_key
    schedule = {
        "cadence": "custom",
        "start_date": "2025-01-01",
        "end_date": "2025-01-05",
        "repeat": False,
    }
    assert compute_day_key(schedule, date(2025, 1, 1)) == "0"
    assert compute_day_key(schedule, date(2025, 1, 2)) == "1"


@pytest.mark.asyncio
async def test_coordinator_skips_unavailable_entity(hass):
    """Entity in 'unavailable' state is skipped with no service call."""
    from oncue_scheduler.store import ScheduleStore
    from oncue_scheduler.coordinator import ScheduleCoordinator

    store = ScheduleStore(hass)
    await store.async_load()

    slots = [1] * 96
    await store.async_save_schedule({
        "name": "Test",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": {"0": slots},
    })

    mock_state = MagicMock()
    mock_state.state = "unavailable"
    hass.states.get = MagicMock(return_value=mock_state)

    coordinator = ScheduleCoordinator(hass, store)

    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 1, 6, 0, 0, tzinfo=timezone.utc)
        await coordinator._async_evaluate()

    hass.services.async_call.assert_not_called()


@pytest.mark.asyncio
async def test_coordinator_skips_unknown_entity(hass):
    """Entity in 'unknown' state is skipped with no service call."""
    from oncue_scheduler.store import ScheduleStore
    from oncue_scheduler.coordinator import ScheduleCoordinator

    store = ScheduleStore(hass)
    await store.async_load()

    slots = [1] * 96
    await store.async_save_schedule({
        "name": "Test",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": {"0": slots},
    })

    mock_state = MagicMock()
    mock_state.state = "unknown"
    hass.states.get = MagicMock(return_value=mock_state)

    coordinator = ScheduleCoordinator(hass, store)

    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 1, 6, 0, 0, tzinfo=timezone.utc)
        await coordinator._async_evaluate()

    hass.services.async_call.assert_not_called()


@pytest.mark.asyncio
async def test_fall_back_idempotent(hass):
    """Evaluating the same slot twice during fall-back doesn't duplicate calls."""
    from oncue_scheduler.store import ScheduleStore
    from oncue_scheduler.coordinator import ScheduleCoordinator

    store = ScheduleStore(hass)
    await store.async_load()

    slots = [0] * 96
    slots[6] = 1  # 1:30 AM
    await store.async_save_schedule({
        "name": "Test",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slots": {"0": slots},
    })

    mock_state = MagicMock()
    mock_state.state = "off"
    hass.states.get = MagicMock(return_value=mock_state)

    coordinator = ScheduleCoordinator(hass, store)

    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 10, 26, 1, 30, tzinfo=timezone.utc)
        await coordinator._async_evaluate()

    assert hass.services.async_call.call_count == 1

    # Entity now on; second evaluation should be a no-op
    mock_state.state = "on"
    hass.services.async_call.reset_mock()

    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 10, 26, 1, 30, tzinfo=timezone.utc)
        await coordinator._async_evaluate()

    hass.services.async_call.assert_not_called()


@pytest.mark.asyncio
async def test_coordinator_uses_slot_type(hass):
    """Coordinator passes slot_type through interpret_slot_value."""
    from oncue_scheduler.store import ScheduleStore
    from oncue_scheduler.coordinator import ScheduleCoordinator

    store = ScheduleStore(hass)
    await store.async_load()

    slots = [0] * 96
    slots[0] = 1
    await store.async_save_schedule({
        "name": "Typed",
        "entity_ids": ["switch.test"],
        "cadence": "daily",
        "slot_type": "on_off",
        "slots": {"0": slots},
    })

    mock_state = MagicMock()
    mock_state.state = "off"
    hass.states.get = MagicMock(return_value=mock_state)

    coordinator = ScheduleCoordinator(hass, store)

    with patch("oncue_scheduler.coordinator.dt_util") as mock_dt:
        mock_dt.now.return_value = datetime(2025, 1, 6, 0, 0, tzinfo=timezone.utc)
        await coordinator._async_evaluate()

    hass.services.async_call.assert_called_once_with(
        "homeassistant", "turn_on", {"entity_id": "switch.test"}, blocking=True
    )
