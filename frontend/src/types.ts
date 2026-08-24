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
    palette?: string[];
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
    };
    states: Record<string, any>;
}

export interface EntityOverrides {
    overrides: Record<string, string>;
    scheduled_states: Record<string, string>;
}
