"""Slot value abstraction for extensible schedule types."""

from __future__ import annotations

from typing import Any

from .const import SLOT_TYPE_ON_OFF, SLOT_TYPE_COLOR, VALID_SLOT_TYPES


def validate_slot_value(value: Any, slot_type: str) -> str | None:
    """Return error string if value is invalid for the slot type, or None."""
    if slot_type not in VALID_SLOT_TYPES:
        return f"unknown slot_type '{slot_type}'"

    if slot_type == SLOT_TYPE_ON_OFF:
        if not isinstance(value, int) or value not in (0, 1):
            return f"on_off slot value must be 0 or 1, got {value!r}"

    if slot_type == SLOT_TYPE_COLOR:
        if not isinstance(value, int) or value < 0:
            return f"color slot value must be a non-negative integer (palette index), got {value!r}"

    return None


def validate_palette(palette: Any) -> str | None:
    """Return error string if palette is invalid, or None."""
    if not isinstance(palette, list):
        return "palette must be a list"
    for i, entry in enumerate(palette):
        if not isinstance(entry, str):
            return f"palette[{i}] must be a hex color string"
        if not _is_valid_hex_color(entry):
            return f"palette[{i}] is not a valid hex color: {entry!r}"
    return None


def _is_valid_hex_color(s: str) -> bool:
    """Check if string is a valid 6-digit hex color like '#ff00aa'."""
    if len(s) != 7 or s[0] != "#":
        return False
    try:
        int(s[1:], 16)
        return True
    except ValueError:
        return False


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert '#rrggbb' to (r, g, b) tuple."""
    val = int(hex_color[1:], 16)
    return (val >> 16) & 0xFF, (val >> 8) & 0xFF, val & 0xFF


def interpret_slot_value(value: int, slot_type: str, palette: list[str] | None = None) -> dict[str, Any]:
    """Return an action dict for the given slot value and type."""
    if slot_type == SLOT_TYPE_ON_OFF:
        if value == 1:
            return {"action": "turn_on"}
        if value == 0:
            return {"action": "turn_off"}

    if slot_type == SLOT_TYPE_COLOR:
        if value == 0:
            return {"action": "none"}
        if palette and 1 <= value <= len(palette):
            rgb = hex_to_rgb(palette[value - 1])
            return {"action": "set_color", "rgb_color": list(rgb)}
        return {"action": "none"}

    return {"action": "none"}
