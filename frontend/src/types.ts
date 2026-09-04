/** HVAC preset configuration for a single climate state. */
export interface HvacPreset {
    temperature: number | null;
    hvac_mode: string | null;
    fan_mode: string | null;
    color: string;
    alias?: string;
    icon?: string;
}

/** Brightness preset configuration. */
export interface BrightnessPreset {
    brightness: number;
    color: string;
    alias?: string;
    icon?: string;
    transition?: "snap" | "crossfade";
}

/** Scene preset configuration. */
export interface ScenePreset {
    scene_id: string;
    name: string;
    color: string;
    alias?: string;
    icon?: string;
}

/** Palette entry animation mode. */
export type PaletteMode = "solid" | "crossfade" | "cycle" | "tv";

/** Structured palette entry with animation mode and optional cycle config. */
export interface PaletteEntryObject {
    mode: PaletteMode;
    color: string;
    colors?: string[];
    transition?: "snap" | "fade";
    rate?: number;
    alias?: string;
}

/** A palette entry — either a bare hex color string or a structured object. */
export type PaletteEntry = string | PaletteEntryObject;

/**
 * Normalize a palette entry into object form.
 * @param entry - Hex string or palette entry object.
 * @returns Object with at least `mode` and `color`.
 */
export function normalizePaletteEntry(entry: PaletteEntry): PaletteEntryObject {
    if (typeof entry === "string") return { mode: "solid", color: entry };
    return entry;
}

/**
 * Extract the display color from a palette entry.
 * @param entry - Hex string or palette entry object.
 * @returns Hex color string.
 */
export function paletteEntryDisplayColor(entry: PaletteEntry): string {
    return typeof entry === "string" ? entry : entry.color;
}

const TV_COLORS = [
    "#1a237e", "#4fc3f7", "#fff9c4", "#ffcc80", "#e0e0e0",
    "#81d4fa", "#ffab91", "#c5e1a5", "#b0bec5", "#fff176",
];

/**
 * Build a CSS `background` value that visually represents the palette entry's
 * mode and colours — used for editor chips, grid cells, and palette swatches.
 */
export function paletteEntryBackground(entry: PaletteEntryObject): string {
    switch (entry.mode) {
        case "crossfade":
            return `linear-gradient(90deg, ${entry.color}, ${entry.color}80)`;
        case "cycle": {
            const cols = entry.colors && entry.colors.length >= 2
                ? entry.colors : [entry.color, "#888"];
            if (entry.transition === "fade") {
                return `linear-gradient(90deg, ${cols.join(", ")})`;
            }
            // snap: hard-edged vertical stripes
            const n = cols.length;
            const stops = cols.map((c, i) => {
                const start = (i / n * 100).toFixed(1);
                const end = ((i + 1) / n * 100).toFixed(1);
                return `${c} ${start}%, ${c} ${end}%`;
            });
            return `linear-gradient(90deg, ${stops.join(", ")})`;
        }
        case "tv":
            return `linear-gradient(90deg, ${TV_COLORS.join(", ")})`;
        default:
            return entry.color;
    }
}

/** A single schedule with full slot data. */
export interface Schedule {
    id: string;
    name: string;
    entity_ids: string[];
    cadence: "daily" | "weekly" | "custom";
    repeat: boolean;
    start_date: string | null;
    end_date: string | null;
    active: boolean;
    slot_minutes: number;
    slot_type: string;
    slots: Record<string, number[]>;
}

/** Schedule summary without slot data, used in list views. */
export interface ScheduleSummary {
    id: string;
    name: string;
    entity_ids: string[];
    cadence: "daily" | "weekly" | "custom";
    repeat: boolean;
    active: boolean;
    slot_type: string;
}

/** Conflict info returned when saving a schedule that overlaps another. */
export interface Conflict {
    schedule_id: string;
    schedule_name: string;
    overlapping_entities: string[];
    conflicting_slot_count: number;
}

/** Minimal Home Assistant interface used by this panel. */
export interface HomeAssistant {
    connection: {
        sendMessagePromise(msg: Record<string, unknown>): Promise<any>;
        subscribeEvents(callback: (event: any) => void, eventType: string): Promise<() => void>;
    };
    states: Record<string, any>;
}

/** Runtime override and scheduled state data for a schedule's entities. */
export interface EntityOverrides {
    overrides: Record<string, string>;
    scheduled_states: Record<string, string>;
}
