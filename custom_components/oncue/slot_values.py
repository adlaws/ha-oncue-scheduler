"""Slot value abstraction for extensible schedule types."""

from __future__ import annotations

from typing import Any

SLOT_TYPE_ON_OFF = "on_off"
VALID_SLOT_TYPES = {SLOT_TYPE_ON_OFF}


def validate_slot_value(value: Any, slot_type: str) -> str | None:
    """Return error string if value is invalid for the slot type, or None."""
    if slot_type not in VALID_SLOT_TYPES:
        return f"unknown slot_type '{slot_type}'"

    if slot_type == SLOT_TYPE_ON_OFF:
        if not isinstance(value, int) or value not in (0, 1):
            return f"on_off slot value must be 0 or 1, got {value!r}"

    return None


def interpret_slot_value(value: int, slot_type: str) -> dict[str, str]:
    """Return an action dict for the given slot value and type."""
    if slot_type == SLOT_TYPE_ON_OFF:
        if value == 1:
            return {"action": "turn_on"}
        if value == 0:
            return {"action": "turn_off"}

    return {"action": "none"}
