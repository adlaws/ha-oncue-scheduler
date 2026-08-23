"""Tests for slot_values module."""

from oncue.slot_values import validate_slot_value, interpret_slot_value


def test_validate_on_off_valid():
    assert validate_slot_value(0, "on_off") is None
    assert validate_slot_value(1, "on_off") is None


def test_validate_on_off_invalid_value():
    assert validate_slot_value(2, "on_off") is not None
    assert validate_slot_value(-1, "on_off") is not None
    assert validate_slot_value(0.5, "on_off") is not None
    assert validate_slot_value("on", "on_off") is not None


def test_validate_unknown_slot_type():
    assert validate_slot_value(0, "brightness") is not None
    assert validate_slot_value(1, "brightness") is not None


def test_interpret_on_off_turn_on():
    result = interpret_slot_value(1, "on_off")
    assert result == {"action": "turn_on"}


def test_interpret_on_off_turn_off():
    result = interpret_slot_value(0, "on_off")
    assert result == {"action": "turn_off"}


def test_interpret_on_off_unknown_value():
    result = interpret_slot_value(2, "on_off")
    assert result == {"action": "none"}


def test_interpret_unknown_slot_type():
    result = interpret_slot_value(1, "brightness")
    assert result == {"action": "none"}
