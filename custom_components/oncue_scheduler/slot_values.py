"""Slot value abstraction for extensible schedule types."""

from __future__ import annotations

from typing import Any

from .const import (
    SLOT_TYPE_ON_OFF,
    SLOT_TYPE_COLOR,
    SLOT_TYPE_HVAC,
    SLOT_TYPE_BRIGHTNESS,
    SLOT_TYPE_SCENE,
    VALID_SLOT_TYPES,
    VALID_HVAC_MODES,
    VALID_FAN_MODES,
    VALID_PALETTE_MODES,
    VALID_CYCLE_TRANSITIONS,
    MAX_CYCLE_COLORS,
    MIN_CYCLE_COLOR_SECONDS,
    DEFAULT_SLOT_MINUTES,
    TV_COLORS,
)


def validate_slot_value(value: Any, slot_type: str) -> str | None:
    """Validate a single slot value for the given slot type.

    :param value: The slot value to validate.
    :param slot_type: One of SLOT_TYPE_ON_OFF, SLOT_TYPE_COLOR, SLOT_TYPE_HVAC.
    :returns: Error string if invalid, or None if valid.
    """
    if slot_type not in VALID_SLOT_TYPES:
        return f"unknown slot_type '{slot_type}'"

    if slot_type == SLOT_TYPE_ON_OFF:
        if not isinstance(value, int) or value not in (0, 1):
            return f"on_off slot value must be 0 or 1, got {value!r}"

    if slot_type == SLOT_TYPE_COLOR:
        if not isinstance(value, int) or value < 0:
            return f"color slot value must be a non-negative integer (palette index), got {value!r}"

    if slot_type == SLOT_TYPE_HVAC:
        if not isinstance(value, int) or value < 0:
            return f"hvac slot value must be a non-negative integer (preset index), got {value!r}"

    if slot_type == SLOT_TYPE_BRIGHTNESS:
        if not isinstance(value, int) or value < 0:
            return f"brightness slot value must be a non-negative integer (preset index), got {value!r}"

    if slot_type == SLOT_TYPE_SCENE:
        if not isinstance(value, int) or value < 0:
            return f"scene slot value must be a non-negative integer (preset index), got {value!r}"

    return None


def validate_palette(palette: Any) -> str | None:
    """Validate a color palette list.

    :param palette: List of hex color strings or palette entry objects.
    :returns: Error string if invalid, or None if valid.
    """
    if not isinstance(palette, list):
        return "palette must be a list"
    for i, entry in enumerate(palette):
        if isinstance(entry, str):
            if not _is_valid_hex_color(entry):
                return f"palette[{i}] is not a valid hex color: {entry!r}"
        elif isinstance(entry, dict):
            err = _validate_palette_entry_object(entry, i)
            if err:
                return err
        else:
            return f"palette[{i}] must be a hex color string or object"
    return None


def _validate_palette_entry_object(entry: dict[str, Any], index: int) -> str | None:
    """Validate a palette entry object with mode/color/etc.

    :param entry: Palette entry dict with mode, color, and mode-specific fields.
    :param index: Position in the palette (for error messages).
    :returns: Error string if invalid, or None if valid.
    """
    mode = entry.get("mode")
    if mode not in VALID_PALETTE_MODES:
        return f"palette[{index}].mode must be one of {VALID_PALETTE_MODES}"
    color = entry.get("color")
    if not isinstance(color, str) or not _is_valid_hex_color(color):
        return f"palette[{index}].color must be a valid hex color"
    if mode == "cycle":
        colors = entry.get("colors")
        if not isinstance(colors, list) or len(colors) < 2:
            return f"palette[{index}].colors must be a list of at least 2 colors"
        if len(colors) > MAX_CYCLE_COLORS:
            return f"palette[{index}].colors must have at most {MAX_CYCLE_COLORS} entries"
        for j, c in enumerate(colors):
            if not isinstance(c, str) or not _is_valid_hex_color(c):
                return f"palette[{index}].colors[{j}] must be a valid hex color"
        transition = entry.get("transition", "snap")
        if transition not in VALID_CYCLE_TRANSITIONS:
            return f"palette[{index}].transition must be one of {VALID_CYCLE_TRANSITIONS}"
        rate = entry.get("rate", 1)
        if not isinstance(rate, (int, float)) or rate <= 0:
            return f"palette[{index}].rate must be a positive number"
        slot_seconds = DEFAULT_SLOT_MINUTES * 60
        max_rate = slot_seconds / (len(colors) * MIN_CYCLE_COLOR_SECONDS)
        if rate > max_rate:
            return (
                f"palette[{index}].rate too high: each color must display "
                f"for at least {MIN_CYCLE_COLOR_SECONDS} seconds"
            )
    return None


def validate_hvac_presets(presets: Any) -> str | None:
    """Validate an HVAC presets list.

    :param presets: List of HVAC preset dicts with temperature, hvac_mode,
        fan_mode, and color fields.
    :returns: Error string if invalid, or None if valid.
    """
    if not isinstance(presets, list):
        return "hvac_presets must be a list"
    for i, entry in enumerate(presets):
        if not isinstance(entry, dict):
            return f"hvac_presets[{i}] must be an object"
        temp = entry.get("temperature")
        if temp is not None and not isinstance(temp, (int, float)):
            return f"hvac_presets[{i}].temperature must be a number or null"
        mode = entry.get("hvac_mode")
        if mode is not None and mode not in VALID_HVAC_MODES:
            return f"hvac_presets[{i}].hvac_mode must be one of {VALID_HVAC_MODES} or null"
        fan = entry.get("fan_mode")
        if fan is not None and fan not in VALID_FAN_MODES:
            return f"hvac_presets[{i}].fan_mode must be one of {VALID_FAN_MODES} or null"
        color = entry.get("color")
        if not isinstance(color, str) or not _is_valid_hex_color(color):
            return f"hvac_presets[{i}].color must be a valid hex color"
    return None


def _is_valid_hex_color(s: str) -> bool:
    """Check if string is a valid 6-digit hex color like '#ff00aa'.

    :param s: String to validate.
    :returns: True if the string is a valid 7-character hex colour (#rrggbb).
    """
    if len(s) != 7 or s[0] != "#":
        return False
    try:
        int(s[1:], 16)
        return True
    except ValueError:
        return False


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert '#rrggbb' to an (r, g, b) tuple.

    :param hex_color: 7-character hex color string (e.g. '#ff00aa').
    :returns: Tuple of (red, green, blue) integers in 0-255.
    """
    val = int(hex_color[1:], 16)
    return (val >> 16) & 0xFF, (val >> 8) & 0xFF, val & 0xFF


def interpret_slot_value(
    value: int,
    slot_type: str,
    palette: list[str | dict[str, Any]] | None = None,
    hvac_presets: list[dict[str, Any]] | None = None,
    brightness_presets: list[dict[str, Any]] | None = None,
    scene_presets: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Return an action dict for the given slot value and type.

    Value 0 means off/none; 1..N are 1-based indices into the preset list.

    :param value: Slot value (0 = off/none, 1..N = preset index).
    :param slot_type: One of SLOT_TYPE_ON_OFF, SLOT_TYPE_COLOR, SLOT_TYPE_HVAC.
    :param palette: Color presets list (required for color slot type).
    :param hvac_presets: HVAC presets list (required for HVAC slot type).
    :returns: Action dict with at minimum an "action" key. Possible actions:
        "turn_on", "turn_off", "set_color", "set_hvac", or "none".
    """
    if slot_type == SLOT_TYPE_ON_OFF:
        if value == 1:
            return {"action": "turn_on"}
        if value == 0:
            return {"action": "turn_off"}

    if slot_type == SLOT_TYPE_COLOR:
        if value == 0:
            return {"action": "none"}
        if palette and 1 <= value <= len(palette):
            entry = palette[value - 1]
            if isinstance(entry, str):
                rgb = hex_to_rgb(entry)
                return {"action": "set_color", "rgb_color": list(rgb)}
            # Object entry with mode
            mode = entry.get("mode", "solid")
            rgb = hex_to_rgb(entry["color"])
            if mode == "solid":
                return {"action": "set_color", "rgb_color": list(rgb)}
            if mode == "crossfade":
                return {
                    "action": "set_color",
                    "rgb_color": list(rgb),
                    "color_mode": "crossfade",
                }
            if mode == "cycle":
                return {
                    "action": "set_color",
                    "rgb_color": list(rgb),
                    "color_mode": "cycle",
                    "cycle_colors": [
                        list(hex_to_rgb(c)) for c in entry.get("colors", [])
                    ],
                    "cycle_transition": entry.get("transition", "snap"),
                    "cycle_rate": entry.get("rate", 1),
                }
            if mode == "tv":
                return {
                    "action": "set_color",
                    "rgb_color": list(rgb),
                    "color_mode": "tv",
                    "tv_colors": [list(hex_to_rgb(c)) for c in TV_COLORS],
                }
            return {"action": "set_color", "rgb_color": list(rgb)}
        return {"action": "none"}

    if slot_type == SLOT_TYPE_HVAC:
        if value == 0:
            return {"action": "none"}
        if hvac_presets and 1 <= value <= len(hvac_presets):
            preset = hvac_presets[value - 1]
            result: dict[str, Any] = {"action": "set_hvac"}
            if preset.get("hvac_mode") is not None:
                result["hvac_mode"] = preset["hvac_mode"]
            if preset.get("temperature") is not None:
                result["temperature"] = preset["temperature"]
            if preset.get("fan_mode") is not None:
                result["fan_mode"] = preset["fan_mode"]
            return result
        return {"action": "none"}

    if slot_type == SLOT_TYPE_BRIGHTNESS:
        if value == 0:
            return {"action": "none"}
        if brightness_presets and 1 <= value <= len(brightness_presets):
            preset = brightness_presets[value - 1]
            result_b: dict[str, Any] = {"action": "set_brightness", "brightness": preset["brightness"]}
            if preset.get("transition") == "crossfade":
                result_b["brightness_mode"] = "crossfade"
            return result_b
        return {"action": "none"}

    if slot_type == SLOT_TYPE_SCENE:
        if value == 0:
            return {"action": "none"}
        if scene_presets and 1 <= value <= len(scene_presets):
            preset = scene_presets[value - 1]
            return {"action": "activate_scene", "scene_id": preset["scene_id"]}
        return {"action": "none"}

    return {"action": "none"}


def validate_brightness_presets(presets: Any) -> str | None:
    """Validate a brightness presets list.

    :param presets: List of brightness preset dicts with brightness and color fields.
    :returns: Error string if invalid, or None if valid.
    """
    if not isinstance(presets, list):
        return "brightness_presets must be a list"
    for i, entry in enumerate(presets):
        if not isinstance(entry, dict):
            return f"brightness_presets[{i}] must be an object"
        brightness = entry.get("brightness")
        if not isinstance(brightness, int) or not (1 <= brightness <= 255):
            return f"brightness_presets[{i}].brightness must be an integer 1-255"
        color = entry.get("color")
        if not isinstance(color, str) or not _is_valid_hex_color(color):
            return f"brightness_presets[{i}].color must be a valid hex color"
        transition = entry.get("transition")
        if transition is not None and transition not in ("snap", "crossfade"):
            return f"brightness_presets[{i}].transition must be 'snap' or 'crossfade'"
    return None


def validate_scene_presets(presets: Any) -> str | None:
    """Validate a scene presets list.

    :param presets: List of scene preset dicts with scene_id, name, and color fields.
    :returns: Error string if invalid, or None if valid.
    """
    if not isinstance(presets, list):
        return "scene_presets must be a list"
    for i, entry in enumerate(presets):
        if not isinstance(entry, dict):
            return f"scene_presets[{i}] must be an object"
        scene_id = entry.get("scene_id")
        if not isinstance(scene_id, str) or not scene_id:
            return f"scene_presets[{i}].scene_id must be a non-empty string"
        name = entry.get("name")
        if not isinstance(name, str) or not name:
            return f"scene_presets[{i}].name must be a non-empty string"
        color = entry.get("color")
        if not isinstance(color, str) or not _is_valid_hex_color(color):
            return f"scene_presets[{i}].color must be a valid hex color"
    return None


def normalize_palette_entry(entry: str | dict[str, Any]) -> dict[str, Any]:
    """Normalize a palette entry (string or object) into object form.

    :param entry: Hex color string or palette entry dict.
    :returns: Dict with at least 'mode' and 'color' keys.
    """
    if isinstance(entry, str):
        return {"mode": "solid", "color": entry}
    return entry


def _lerp_rgb(
    c1: list[int], c2: list[int], t: float
) -> list[int]:
    """Linear interpolation between two RGB colours.

    :param c1: Start colour as [r, g, b].
    :param c2: End colour as [r, g, b].
    :param t: Interpolation factor in [0, 1], clamped.
    :returns: Interpolated colour as [r, g, b].
    """
    t = max(0.0, min(1.0, t))
    return [int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)]


def compute_animated_color(
    color_mode: str,
    elapsed_seconds: float,
    slot_seconds: float,
    current_rgb: list[int],
    next_rgb: list[int] | None = None,
    cycle_colors: list[list[int]] | None = None,
    cycle_transition: str = "snap",
    cycle_rate: float = 1.0,
    tv_colors: list[list[int]] | None = None,
) -> list[int]:
    """Compute the RGB color at a given point within a slot.

    :param color_mode: Animation mode ("crossfade", "cycle", or "tv").
    :param elapsed_seconds: Seconds elapsed since the slot started.
    :param slot_seconds: Total duration of the slot in seconds.
    :param current_rgb: Base RGB colour for this slot as [r, g, b].
    :param next_rgb: RGB colour of the next slot (used by crossfade).
    :param cycle_colors: List of RGB colours to cycle through.
    :param cycle_transition: Transition style, "snap" or "fade".
    :param cycle_rate: Number of full cycles per slot.
    :param tv_colors: Colour palette for TV simulation mode.
    :returns: Computed RGB colour as [r, g, b].
    """
    t = elapsed_seconds / slot_seconds if slot_seconds > 0 else 0.0

    if color_mode == "crossfade":
        target = next_rgb if next_rgb else current_rgb
        return _lerp_rgb(current_rgb, target, t)

    if color_mode == "cycle" and cycle_colors and len(cycle_colors) >= 2:
        n = len(cycle_colors)
        total_steps = n * cycle_rate
        pos = (t * total_steps) % n
        idx = int(pos)
        frac = pos - idx
        if cycle_transition == "fade":
            return _lerp_rgb(
                cycle_colors[idx % n], cycle_colors[(idx + 1) % n], frac
            )
        # snap
        return list(cycle_colors[idx % n])

    if color_mode == "tv" and tv_colors and len(tv_colors) >= 2:
        return _compute_tv_color(elapsed_seconds, slot_seconds, tv_colors)

    return list(current_rgb)


def compute_animated_brightness(
    elapsed_seconds: float,
    slot_seconds: float,
    current_brightness: int,
    next_brightness: int | None = None,
) -> int:
    """Compute interpolated brightness for crossfade between slots.

    :param elapsed_seconds: Seconds elapsed since the slot started.
    :param slot_seconds: Total duration of the slot in seconds.
    :param current_brightness: Brightness value for the current slot (1-255).
    :param next_brightness: Brightness value for the next slot (1-255), or None.
    :returns: Interpolated brightness value as an integer (1-255).
    """
    t = elapsed_seconds / slot_seconds if slot_seconds > 0 else 0.0
    target = next_brightness if next_brightness is not None else current_brightness
    return max(1, min(255, round(current_brightness + (target - current_brightness) * t)))


def _compute_tv_color(
    elapsed_seconds: float,
    slot_seconds: float,
    colors: list[list[int]],
) -> list[int]:
    """Pseudo-random TV-like colour sequencing with snaps and fades.

    Uses a deterministic LCG to produce repeatable segment durations
    and colour selections for a given elapsed time.

    :param elapsed_seconds: Seconds elapsed since the slot started.
    :param slot_seconds: Total slot duration in seconds.
    :param colors: Colour palette as list of [r, g, b] lists.
    :returns: Current frame colour as [r, g, b].
    """
    n = len(colors)
    segment_start = 0.0
    seed = 0
    while segment_start < slot_seconds:
        # LCG step (glibc constants) for deterministic pseudo-random sequencing
        seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
        duration = 2.0 + (seed % 500) / 100.0  # 2.0 - 6.99 seconds per segment
        segment_end = segment_start + duration
        if elapsed_seconds < segment_end or segment_end >= slot_seconds:
            color_idx = seed % n
            # ~25% chance of crossfade into next colour
            next_seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
            do_fade = (next_seed % 4) == 0
            if do_fade and duration > 1.0:
                next_color_idx = next_seed % n
                frac = (elapsed_seconds - segment_start) / duration
                return _lerp_rgb(colors[color_idx], colors[next_color_idx], frac)
            return list(colors[color_idx])
        segment_start = segment_end
        seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
    return list(colors[0])
