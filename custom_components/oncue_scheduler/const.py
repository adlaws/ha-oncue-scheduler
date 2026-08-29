"""OnCue constants."""

DOMAIN = "oncue_scheduler"
STORE_KEY = "oncue_scheduler.schedules"
STORE_VERSION = 1
DEFAULT_SLOT_MINUTES = 15
SLOTS_PER_DAY = 96
MAX_CUSTOM_DAYS = 31

CADENCE_DAILY = "daily"
CADENCE_WEEKLY = "weekly"
CADENCE_CUSTOM = "custom"
VALID_CADENCES = {CADENCE_DAILY, CADENCE_WEEKLY, CADENCE_CUSTOM}

SLOT_TYPE_ON_OFF = "on_off"
SLOT_TYPE_COLOR = "color"
SLOT_TYPE_HVAC = "hvac"
VALID_SLOT_TYPES = {SLOT_TYPE_ON_OFF, SLOT_TYPE_COLOR, SLOT_TYPE_HVAC}

MAX_PALETTE_SIZE = 10
MAX_HVAC_PRESET_COUNT = 20
MAX_CYCLE_COLORS = 10
MIN_CYCLE_COLOR_SECONDS = 5

PALETTE_MODE_SOLID = "solid"
PALETTE_MODE_CROSSFADE = "crossfade"
PALETTE_MODE_CYCLE = "cycle"
PALETTE_MODE_TV = "tv"
VALID_PALETTE_MODES = {PALETTE_MODE_SOLID, PALETTE_MODE_CROSSFADE, PALETTE_MODE_CYCLE, PALETTE_MODE_TV}
VALID_CYCLE_TRANSITIONS = {"snap", "fade"}

# Preset colours for TV simulation mode - warm/cool whites, blues, ambers
TV_COLORS = [
    "#1a237e",  # deep blue (night scenes)
    "#4fc3f7",  # light blue (daytime TV)
    "#fff9c4",  # warm white (commercials)
    "#ffcc80",  # amber (warm scenes)
    "#e0e0e0",  # cool white (news)
    "#81d4fa",  # sky blue (sports)
    "#ffab91",  # salmon (firelight)
    "#c5e1a5",  # pale green (nature)
    "#b0bec5",  # blue-grey (dim scenes)
    "#fff176",  # pale yellow (sitcom)
]

VALID_HVAC_MODES = {"off", "heat", "cool", "heat_cool", "auto", "dry", "fan_only"}
VALID_FAN_MODES = {"auto", "low", "medium", "medium_low", "medium_high", "high"}

SIGNAL_SCHEDULES_UPDATED = f"{DOMAIN}_schedules_updated"

EVENT_OVERRIDES_CHANGED = f"{DOMAIN}_overrides_changed"

DEFAULT_REVERT_DELAY = 180  # seconds (3 minutes)
MAX_REVERT_DELAY = 3600  # 1 hour
