"""Tests for slot_values module."""

from oncue_scheduler.slot_values import validate_slot_value, interpret_slot_value, validate_palette, hex_to_rgb


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
