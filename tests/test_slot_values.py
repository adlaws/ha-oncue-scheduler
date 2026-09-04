"""Tests for slot_values module."""

from oncue_scheduler.slot_values import (
    validate_slot_value,
    interpret_slot_value,
    validate_palette,
    validate_hvac_presets,
    validate_brightness_presets,
    validate_scene_presets,
    hex_to_rgb,
    normalize_palette_entry,
    compute_animated_color,
    compute_animated_brightness,
)


def test_validate_on_off_valid():
    assert validate_slot_value(0, "on_off") is None
    assert validate_slot_value(1, "on_off") is None


def test_validate_on_off_invalid_value():
    assert validate_slot_value(2, "on_off") is not None
    assert validate_slot_value(-1, "on_off") is not None
    assert validate_slot_value(0.5, "on_off") is not None
    assert validate_slot_value("on", "on_off") is not None


def test_validate_unknown_slot_type():
    assert validate_slot_value(0, "unknown_type") is not None
    assert validate_slot_value(1, "unknown_type") is not None


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
    result = interpret_slot_value(1, "unknown_type")
    assert result == {"action": "none"}


# Color slot type tests

def test_validate_color_valid():
    assert validate_slot_value(0, "color") is None
    assert validate_slot_value(1, "color") is None
    assert validate_slot_value(10, "color") is None


def test_validate_color_invalid():
    assert validate_slot_value(-1, "color") is not None
    assert validate_slot_value("red", "color") is not None


def test_validate_palette_valid():
    assert validate_palette(["#ff0000", "#00ff00", "#0000ff"]) is None


def test_validate_palette_invalid_type():
    assert validate_palette("not a list") is not None


def test_validate_palette_invalid_entry():
    assert validate_palette(["#ff0000", "red"]) is not None
    assert validate_palette(["#ff0000", 123]) is not None
    assert validate_palette(["#fff"]) is not None


def test_hex_to_rgb():
    assert hex_to_rgb("#ff0000") == (255, 0, 0)
    assert hex_to_rgb("#00ff00") == (0, 255, 0)
    assert hex_to_rgb("#0000ff") == (0, 0, 255)
    assert hex_to_rgb("#ffffff") == (255, 255, 255)
    assert hex_to_rgb("#000000") == (0, 0, 0)


def test_interpret_color_unset():
    result = interpret_slot_value(0, "color", ["#ff0000"])
    assert result == {"action": "none"}


def test_interpret_color_set():
    palette = ["#ff0000", "#00ff00", "#0000ff"]
    result = interpret_slot_value(1, "color", palette)
    assert result == {"action": "set_color", "rgb_color": [255, 0, 0]}
    result = interpret_slot_value(2, "color", palette)
    assert result == {"action": "set_color", "rgb_color": [0, 255, 0]}
    result = interpret_slot_value(3, "color", palette)
    assert result == {"action": "set_color", "rgb_color": [0, 0, 255]}


def test_interpret_color_out_of_range():
    result = interpret_slot_value(5, "color", ["#ff0000"])
    assert result == {"action": "none"}


def test_interpret_color_no_palette():
    result = interpret_slot_value(1, "color")
    assert result == {"action": "none"}


# HVAC slot type tests

def test_validate_hvac_valid():
    assert validate_slot_value(0, "hvac") is None
    assert validate_slot_value(1, "hvac") is None
    assert validate_slot_value(10, "hvac") is None


def test_validate_hvac_invalid():
    assert validate_slot_value(-1, "hvac") is not None
    assert validate_slot_value("cool", "hvac") is not None


def test_validate_hvac_presets_valid():
    presets = [
        {"temperature": 22, "hvac_mode": "cool", "fan_mode": "auto", "color": "#4fc3f7"},
        {"temperature": 18, "hvac_mode": "heat", "fan_mode": "low", "color": "#ff8a65"},
    ]
    assert validate_hvac_presets(presets) is None


def test_validate_hvac_presets_with_nulls():
    presets = [
        {"temperature": None, "hvac_mode": "cool", "fan_mode": None, "color": "#4fc3f7"},
    ]
    assert validate_hvac_presets(presets) is None


def test_validate_hvac_presets_invalid_type():
    assert validate_hvac_presets("not a list") is not None


def test_validate_hvac_presets_invalid_entry():
    assert validate_hvac_presets([42]) is not None


def test_validate_hvac_presets_invalid_mode():
    presets = [{"temperature": 22, "hvac_mode": "turbo", "fan_mode": "auto", "color": "#4fc3f7"}]
    assert validate_hvac_presets(presets) is not None


def test_validate_hvac_presets_invalid_fan():
    presets = [{"temperature": 22, "hvac_mode": "cool", "fan_mode": "turbo", "color": "#4fc3f7"}]
    assert validate_hvac_presets(presets) is not None


def test_validate_hvac_presets_invalid_color():
    presets = [{"temperature": 22, "hvac_mode": "cool", "fan_mode": "auto", "color": "red"}]
    assert validate_hvac_presets(presets) is not None


def test_validate_hvac_presets_missing_color():
    presets = [{"temperature": 22, "hvac_mode": "cool", "fan_mode": "auto"}]
    assert validate_hvac_presets(presets) is not None


def test_interpret_hvac_unset():
    presets = [{"temperature": 22, "hvac_mode": "cool", "fan_mode": "auto", "color": "#4fc3f7"}]
    result = interpret_slot_value(0, "hvac", hvac_presets=presets)
    assert result == {"action": "none"}


def test_interpret_hvac_set():
    presets = [
        {"temperature": 22, "hvac_mode": "cool", "fan_mode": "high", "color": "#4fc3f7"},
        {"temperature": 18, "hvac_mode": "heat", "fan_mode": "low", "color": "#ff8a65"},
    ]
    result = interpret_slot_value(1, "hvac", hvac_presets=presets)
    assert result == {"action": "set_hvac", "hvac_mode": "cool", "temperature": 22, "fan_mode": "high"}
    result2 = interpret_slot_value(2, "hvac", hvac_presets=presets)
    assert result2 == {"action": "set_hvac", "hvac_mode": "heat", "temperature": 18, "fan_mode": "low"}


def test_interpret_hvac_partial_preset():
    presets = [{"temperature": None, "hvac_mode": "cool", "fan_mode": None, "color": "#4fc3f7"}]
    result = interpret_slot_value(1, "hvac", hvac_presets=presets)
    assert result == {"action": "set_hvac", "hvac_mode": "cool"}
    assert "temperature" not in result
    assert "fan_mode" not in result


def test_interpret_hvac_out_of_range():
    presets = [{"temperature": 22, "hvac_mode": "cool", "fan_mode": "auto", "color": "#4fc3f7"}]
    result = interpret_slot_value(5, "hvac", hvac_presets=presets)
    assert result == {"action": "none"}


def test_interpret_hvac_no_presets():
    result = interpret_slot_value(1, "hvac")
    assert result == {"action": "none"}


# ── Palette entry object validation tests ──

def test_validate_palette_mixed_entries():
    """Palette can contain both string and object entries."""
    palette = [
        "#ff0000",
        {"mode": "solid", "color": "#00ff00"},
        {"mode": "crossfade", "color": "#0000ff"},
    ]
    assert validate_palette(palette) is None


def test_validate_palette_cycle_entry():
    palette = [{
        "mode": "cycle",
        "color": "#ff0000",
        "colors": ["#ff0000", "#00ff00", "#0000ff"],
        "transition": "snap",
        "rate": 1,
    }]
    assert validate_palette(palette) is None


def test_validate_palette_cycle_fade():
    palette = [{
        "mode": "cycle",
        "color": "#ff0000",
        "colors": ["#ff0000", "#00ff00"],
        "transition": "fade",
        "rate": 2,
    }]
    assert validate_palette(palette) is None


def test_validate_palette_tv_entry():
    palette = [{"mode": "tv", "color": "#4fc3f7"}]
    assert validate_palette(palette) is None


def test_validate_palette_object_invalid_mode():
    palette = [{"mode": "blink", "color": "#ff0000"}]
    assert validate_palette(palette) is not None


def test_validate_palette_object_invalid_color():
    palette = [{"mode": "solid", "color": "red"}]
    assert validate_palette(palette) is not None


def test_validate_palette_object_missing_color():
    palette = [{"mode": "solid"}]
    assert validate_palette(palette) is not None


def test_validate_palette_cycle_too_few_colors():
    palette = [{"mode": "cycle", "color": "#ff0000", "colors": ["#ff0000"]}]
    assert validate_palette(palette) is not None


def test_validate_palette_cycle_invalid_color():
    palette = [{
        "mode": "cycle",
        "color": "#ff0000",
        "colors": ["#ff0000", "not-a-color"],
    }]
    assert validate_palette(palette) is not None


def test_validate_palette_cycle_invalid_transition():
    palette = [{
        "mode": "cycle",
        "color": "#ff0000",
        "colors": ["#ff0000", "#00ff00"],
        "transition": "blink",
    }]
    assert validate_palette(palette) is not None


def test_validate_palette_cycle_rate_too_high():
    # 2 colors, each must be on 5s minimum → max rate = 900 / (2*5) = 90
    # With 10 colors: max rate = 900 / (10*5) = 18
    palette = [{
        "mode": "cycle",
        "color": "#ff0000",
        "colors": ["#ff0000", "#00ff00"],
        "rate": 100,
    }]
    assert validate_palette(palette) is not None


def test_validate_palette_cycle_rate_zero():
    palette = [{
        "mode": "cycle",
        "color": "#ff0000",
        "colors": ["#ff0000", "#00ff00"],
        "rate": 0,
    }]
    assert validate_palette(palette) is not None


def test_validate_palette_invalid_entry_type():
    palette = [42]
    assert validate_palette(palette) is not None


# ── interpret_slot_value with object palette entries ──

def test_interpret_color_solid_object():
    palette = [{"mode": "solid", "color": "#ff0000"}]
    result = interpret_slot_value(1, "color", palette)
    assert result == {"action": "set_color", "rgb_color": [255, 0, 0]}


def test_interpret_color_crossfade():
    palette = [{"mode": "crossfade", "color": "#00ff00"}]
    result = interpret_slot_value(1, "color", palette)
    assert result["action"] == "set_color"
    assert result["rgb_color"] == [0, 255, 0]
    assert result["color_mode"] == "crossfade"


def test_interpret_color_cycle():
    palette = [{
        "mode": "cycle",
        "color": "#ff0000",
        "colors": ["#ff0000", "#00ff00", "#0000ff"],
        "transition": "fade",
        "rate": 2,
    }]
    result = interpret_slot_value(1, "color", palette)
    assert result["action"] == "set_color"
    assert result["color_mode"] == "cycle"
    assert len(result["cycle_colors"]) == 3
    assert result["cycle_colors"][0] == [255, 0, 0]
    assert result["cycle_transition"] == "fade"
    assert result["cycle_rate"] == 2


def test_interpret_color_tv():
    palette = [{"mode": "tv", "color": "#4fc3f7"}]
    result = interpret_slot_value(1, "color", palette)
    assert result["action"] == "set_color"
    assert result["color_mode"] == "tv"
    assert len(result["tv_colors"]) > 0


def test_interpret_color_backward_compat_string():
    """Plain string palette entries still work."""
    palette = ["#ff0000", "#00ff00"]
    result = interpret_slot_value(1, "color", palette)
    assert result == {"action": "set_color", "rgb_color": [255, 0, 0]}
    assert "color_mode" not in result


# ── normalize_palette_entry ──

def test_normalize_string_entry():
    result = normalize_palette_entry("#ff0000")
    assert result == {"mode": "solid", "color": "#ff0000"}


def test_normalize_object_entry():
    entry = {"mode": "cycle", "color": "#ff0000", "colors": ["#ff0000", "#00ff00"]}
    result = normalize_palette_entry(entry)
    assert result is entry


# ── compute_animated_color ──

def test_crossfade_start():
    rgb = compute_animated_color(
        "crossfade", 0.0, 900.0, [255, 0, 0], next_rgb=[0, 0, 255]
    )
    assert rgb == [255, 0, 0]


def test_crossfade_end():
    rgb = compute_animated_color(
        "crossfade", 900.0, 900.0, [255, 0, 0], next_rgb=[0, 0, 255]
    )
    assert rgb == [0, 0, 255]


def test_crossfade_midpoint():
    rgb = compute_animated_color(
        "crossfade", 450.0, 900.0, [255, 0, 0], next_rgb=[0, 0, 255]
    )
    assert rgb == [127, 0, 127]


def test_crossfade_no_next():
    rgb = compute_animated_color(
        "crossfade", 450.0, 900.0, [255, 0, 0], next_rgb=None
    )
    assert rgb == [255, 0, 0]


def test_cycle_snap_start():
    colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255]]
    rgb = compute_animated_color(
        "cycle", 0.0, 900.0, [255, 0, 0],
        cycle_colors=colors, cycle_transition="snap", cycle_rate=1,
    )
    assert rgb == [255, 0, 0]


def test_cycle_snap_second_color():
    colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255]]
    # Rate 1, 3 colors, 900s slot → each color 300s
    # At 350s → second color
    rgb = compute_animated_color(
        "cycle", 350.0, 900.0, [255, 0, 0],
        cycle_colors=colors, cycle_transition="snap", cycle_rate=1,
    )
    assert rgb == [0, 255, 0]


def test_cycle_fade():
    colors = [[255, 0, 0], [0, 255, 0]]
    # Rate 1, 2 colors, 900s → each 450s
    # At 225s → halfway through first color, fading towards second
    rgb = compute_animated_color(
        "cycle", 225.0, 900.0, [255, 0, 0],
        cycle_colors=colors, cycle_transition="fade", cycle_rate=1,
    )
    assert rgb == [127, 127, 0]


def test_tv_returns_valid_rgb():
    tv_colors = [[26, 35, 126], [79, 195, 247], [255, 249, 196]]
    rgb = compute_animated_color(
        "tv", 10.0, 900.0, [26, 35, 126], tv_colors=tv_colors,
    )
    assert len(rgb) == 3
    assert all(0 <= c <= 255 for c in rgb)


def test_tv_different_times_may_differ():
    tv_colors = [
        [26, 35, 126], [79, 195, 247], [255, 249, 196],
        [255, 204, 128], [224, 224, 224],
    ]
    rgb1 = compute_animated_color("tv", 5.0, 900.0, [26, 35, 126], tv_colors=tv_colors)
    rgb2 = compute_animated_color("tv", 100.0, 900.0, [26, 35, 126], tv_colors=tv_colors)
    # They should be valid RGB regardless
    assert len(rgb1) == 3 and len(rgb2) == 3


# ── Brightness slot type tests ──

def test_validate_brightness_valid():
    assert validate_slot_value(0, "brightness") is None
    assert validate_slot_value(1, "brightness") is None
    assert validate_slot_value(10, "brightness") is None


def test_validate_brightness_invalid():
    assert validate_slot_value(-1, "brightness") is not None
    assert validate_slot_value("bright", "brightness") is not None


def test_validate_brightness_presets_valid():
    presets = [
        {"brightness": 64, "color": "#ffc107"},
        {"brightness": 128, "color": "#ff9800"},
        {"brightness": 255, "color": "#ffeb3b"},
    ]
    assert validate_brightness_presets(presets) is None


def test_validate_brightness_presets_invalid_type():
    assert validate_brightness_presets("not a list") is not None


def test_validate_brightness_presets_invalid_entry():
    assert validate_brightness_presets([42]) is not None


def test_validate_brightness_presets_invalid_brightness():
    presets = [{"brightness": 0, "color": "#ffc107"}]
    assert validate_brightness_presets(presets) is not None


def test_validate_brightness_presets_brightness_too_high():
    presets = [{"brightness": 256, "color": "#ffc107"}]
    assert validate_brightness_presets(presets) is not None


def test_validate_brightness_presets_invalid_color():
    presets = [{"brightness": 128, "color": "yellow"}]
    assert validate_brightness_presets(presets) is not None


def test_validate_brightness_presets_missing_color():
    presets = [{"brightness": 128}]
    assert validate_brightness_presets(presets) is not None


def test_interpret_brightness_unset():
    presets = [{"brightness": 128, "color": "#ffc107"}]
    result = interpret_slot_value(0, "brightness", brightness_presets=presets)
    assert result == {"action": "none"}


def test_interpret_brightness_set():
    presets = [
        {"brightness": 64, "color": "#ffc107"},
        {"brightness": 255, "color": "#ffeb3b"},
    ]
    result = interpret_slot_value(1, "brightness", brightness_presets=presets)
    assert result == {"action": "set_brightness", "brightness": 64}
    result2 = interpret_slot_value(2, "brightness", brightness_presets=presets)
    assert result2 == {"action": "set_brightness", "brightness": 255}


def test_interpret_brightness_out_of_range():
    presets = [{"brightness": 128, "color": "#ffc107"}]
    result = interpret_slot_value(5, "brightness", brightness_presets=presets)
    assert result == {"action": "none"}


def test_interpret_brightness_no_presets():
    result = interpret_slot_value(1, "brightness")
    assert result == {"action": "none"}


# ── Brightness crossfade tests ──

def test_validate_brightness_presets_transition_valid():
    assert validate_brightness_presets([
        {"brightness": 128, "color": "#ff0000", "transition": "snap"},
    ]) is None
    assert validate_brightness_presets([
        {"brightness": 128, "color": "#ff0000", "transition": "crossfade"},
    ]) is None
    # transition is optional
    assert validate_brightness_presets([
        {"brightness": 128, "color": "#ff0000"},
    ]) is None


def test_validate_brightness_presets_transition_invalid():
    err = validate_brightness_presets([
        {"brightness": 128, "color": "#ff0000", "transition": "slide"},
    ])
    assert err is not None
    assert "transition" in err


def test_interpret_brightness_crossfade():
    presets = [
        {"brightness": 64, "color": "#ffc107", "transition": "crossfade"},
    ]
    result = interpret_slot_value(1, "brightness", brightness_presets=presets)
    assert result == {
        "action": "set_brightness",
        "brightness": 64,
        "brightness_mode": "crossfade",
    }


def test_interpret_brightness_snap():
    presets = [
        {"brightness": 64, "color": "#ffc107", "transition": "snap"},
    ]
    result = interpret_slot_value(1, "brightness", brightness_presets=presets)
    assert result == {"action": "set_brightness", "brightness": 64}


def test_interpret_brightness_no_transition():
    presets = [
        {"brightness": 64, "color": "#ffc107"},
    ]
    result = interpret_slot_value(1, "brightness", brightness_presets=presets)
    assert result == {"action": "set_brightness", "brightness": 64}


def test_compute_animated_brightness_start():
    result = compute_animated_brightness(0, 900, 50, 200)
    assert result == 50


def test_compute_animated_brightness_end():
    result = compute_animated_brightness(900, 900, 50, 200)
    assert result == 200


def test_compute_animated_brightness_midpoint():
    result = compute_animated_brightness(450, 900, 50, 200)
    assert result == 125


def test_compute_animated_brightness_no_next():
    result = compute_animated_brightness(450, 900, 128, None)
    assert result == 128


def test_compute_animated_brightness_clamps_min():
    result = compute_animated_brightness(0, 900, 1, 1)
    assert result >= 1


def test_compute_animated_brightness_clamps_max():
    result = compute_animated_brightness(900, 900, 255, 255)
    assert result <= 255

def test_validate_scene_valid():
    assert validate_slot_value(0, "scene") is None
    assert validate_slot_value(1, "scene") is None
    assert validate_slot_value(10, "scene") is None


def test_validate_scene_invalid():
    assert validate_slot_value(-1, "scene") is not None
    assert validate_slot_value("scene", "scene") is not None


def test_validate_scene_presets_valid():
    presets = [
        {"scene_id": "scene.morning", "name": "Morning", "color": "#ff9800"},
        {"scene_id": "scene.evening", "name": "Evening", "color": "#7c4dff"},
    ]
    assert validate_scene_presets(presets) is None


def test_validate_scene_presets_invalid_type():
    assert validate_scene_presets("not a list") is not None


def test_validate_scene_presets_invalid_entry():
    assert validate_scene_presets([42]) is not None


def test_validate_scene_presets_missing_scene_id():
    presets = [{"name": "Morning", "color": "#ff9800"}]
    assert validate_scene_presets(presets) is not None


def test_validate_scene_presets_empty_scene_id():
    presets = [{"scene_id": "", "name": "Morning", "color": "#ff9800"}]
    assert validate_scene_presets(presets) is not None


def test_validate_scene_presets_missing_name():
    presets = [{"scene_id": "scene.morning", "color": "#ff9800"}]
    assert validate_scene_presets(presets) is not None


def test_validate_scene_presets_invalid_color():
    presets = [{"scene_id": "scene.morning", "name": "Morning", "color": "red"}]
    assert validate_scene_presets(presets) is not None


def test_validate_scene_presets_missing_color():
    presets = [{"scene_id": "scene.morning", "name": "Morning"}]
    assert validate_scene_presets(presets) is not None


def test_interpret_scene_unset():
    presets = [{"scene_id": "scene.morning", "name": "Morning", "color": "#ff9800"}]
    result = interpret_slot_value(0, "scene", scene_presets=presets)
    assert result == {"action": "none"}


def test_interpret_scene_set():
    presets = [
        {"scene_id": "scene.morning", "name": "Morning", "color": "#ff9800"},
        {"scene_id": "scene.evening", "name": "Evening", "color": "#7c4dff"},
    ]
    result = interpret_slot_value(1, "scene", scene_presets=presets)
    assert result == {"action": "activate_scene", "scene_id": "scene.morning"}
    result2 = interpret_slot_value(2, "scene", scene_presets=presets)
    assert result2 == {"action": "activate_scene", "scene_id": "scene.evening"}


def test_interpret_scene_out_of_range():
    presets = [{"scene_id": "scene.morning", "name": "Morning", "color": "#ff9800"}]
    result = interpret_slot_value(5, "scene", scene_presets=presets)
    assert result == {"action": "none"}


def test_interpret_scene_no_presets():
    result = interpret_slot_value(1, "scene")
    assert result == {"action": "none"}
