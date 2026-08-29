export interface HvacPreset {
    temperature: number | null;
    hvac_mode: string | null;
    fan_mode: string | null;
    color: string;
    alias?: string;
    icon?: string;
}

export type PaletteMode = "solid" | "crossfade" | "cycle" | "tv";

export interface PaletteEntryObject {
    mode: PaletteMode;
    color: string;
    colors?: string[];
    transition?: "snap" | "fade";
    rate?: number;
    alias?: string;
}

export type PaletteEntry = string | PaletteEntryObject;

export function normalizePaletteEntry(entry: PaletteEntry): PaletteEntryObject {
    if (typeof entry === "string") return { mode: "solid", color: entry };
    return entry;
}

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

export interface ScheduleSummary {
    id: string;
    name: string;
    entity_ids: string[];
    cadence: "daily" | "weekly" | "custom";
    repeat: boolean;
    active: boolean;
    slot_type: string;
}

export interface Conflict {
    schedule_id: string;
    schedule_name: string;
    overlapping_entities: string[];
    conflicting_slot_count: number;
}

export interface HomeAssistant {
    connection: {
        sendMessagePromise(msg: Record<string, unknown>): Promise<any>;
        subscribeEvents(callback: (event: any) => void, eventType: string): Promise<() => void>;
    };
    states: Record<string, any>;
}

export interface EntityOverrides {
    overrides: Record<string, string>;
    scheduled_states: Record<string, string>;
}
