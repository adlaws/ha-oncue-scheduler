/**
 * Mock hass object and bootstrap script for local dev preview.
 * Simulates the HA WebSocket API with in-memory schedule storage.
 */
import "../src/oncue-scheduler-panel";

interface MockSchedule {
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

const SLOTS_PER_DAY = 96;

function makeDailySlots(): Record<string, number[]> {
    const slots = new Array(SLOTS_PER_DAY).fill(0);
    // Turn on 08:00–09:00 (indices 32–35)
    for (let i = 32; i < 36; i++) slots[i] = 1;
    return { "0": slots };
}

function makeWeeklySlots(): Record<string, number[]> {
    const s: Record<string, number[]> = {};
    for (let d = 0; d < 7; d++) {
        const slots = new Array(SLOTS_PER_DAY).fill(0);
        // Weekdays 09:00–17:00 (indices 36–67)
        if (d < 5) {
            for (let i = 36; i < 68; i++) slots[i] = 1;
        }
        s[String(d)] = slots;
    }
    return s;
}

// Seed data
const store = new Map<string, MockSchedule>();
store.set("sched_001", {
    id: "sched_001",
    name: "Morning Lights",
    entity_ids: ["switch.living_room", "light.hallway"],
    cadence: "daily",
    repeat: true,
    start_date: null,
    end_date: null,
    active: true,
    slot_minutes: 15,
    slot_type: "on_off",
    slots: makeDailySlots(),
});
store.set("sched_002", {
    id: "sched_002",
    name: "Office Hours",
    entity_ids: ["switch.office_heater", "switch.desk_lamp"],
    cadence: "weekly",
    repeat: true,
    start_date: null,
    end_date: null,
    active: true,
    slot_minutes: 15,
    slot_type: "on_off",
    slots: makeWeeklySlots(),
});
store.set("sched_003", {
    id: "sched_003",
    name: "Holiday Watering (paused)",
    entity_ids: ["switch.garden_valve"],
    cadence: "daily",
    repeat: true,
    start_date: null,
    end_date: null,
    active: false,
    slot_minutes: 15,
    slot_type: "on_off",
    slots: { "0": new Array(SLOTS_PER_DAY).fill(0) },
});

let nextId = 4;

function summarise(s: MockSchedule) {
    return {
        id: s.id,
        name: s.name,
        entity_ids: s.entity_ids,
        cadence: s.cadence,
        repeat: s.repeat,
        active: s.active,
        slot_type: s.slot_type,
    };
}

async function handleMessage(msg: Record<string, unknown>): Promise<any> {
    // Simulate a small network delay
    await new Promise((r) => setTimeout(r, 120));

    switch (msg.type) {
        case "oncue_scheduler/list":
            return {
                schedules: Array.from(store.values()).map(summarise),
            };

        case "oncue_scheduler/get": {
            const s = store.get(msg.schedule_id as string);
            if (!s) throw new Error(`Schedule ${msg.schedule_id} not found`);
            return { schedule: structuredClone(s) };
        }

        case "oncue_scheduler/save": {
            const data = msg.schedule as MockSchedule;
            if (!data.id) {
                data.id = `sched_${String(nextId++).padStart(3, "0")}`;
            }
            store.set(data.id, structuredClone(data));
            return { schedule: structuredClone(data), conflicts: [], warnings: [] };
        }

        case "oncue_scheduler/delete": {
            store.delete(msg.schedule_id as string);
            return {};
        }

        default:
            console.warn("[mock-hass] unhandled message type:", msg.type);
            return {};
    }
}

// Build mock hass object
const mockHass = {
    connection: {
        sendMessagePromise: handleMessage,
    },
    states: {
        "switch.living_room": { entity_id: "switch.living_room", state: "on", attributes: { friendly_name: "Living Room" } },
        "light.hallway": { entity_id: "light.hallway", state: "off", attributes: { friendly_name: "Hallway Light" } },
        "switch.office_heater": { entity_id: "switch.office_heater", state: "on", attributes: { friendly_name: "Office Heater" } },
        "switch.desk_lamp": { entity_id: "switch.desk_lamp", state: "on", attributes: { friendly_name: "Desk Lamp" } },
        "switch.garden_valve": { entity_id: "switch.garden_valve", state: "off", attributes: { friendly_name: "Garden Valve" } },
    },
};

// Inject into the panel element
const panel = document.querySelector("oncue-scheduler-panel")!;
(panel as any).hass = mockHass;
(panel as any).panel = { config: { title: "OnCue Scheduler" } };
