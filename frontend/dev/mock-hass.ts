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
    revert_delay: number | null;
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
    entity_ids: ["switch.living_room", "light.hallway", "switch.kitchen_kettle"],
    cadence: "daily",
    repeat: true,
    start_date: null,
    end_date: null,
    active: true,
    slot_minutes: 15,
    slot_type: "on_off",
    slots: makeDailySlots(),
    revert_delay: 180,
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
    revert_delay: 180,
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
    revert_delay: null,
});

let nextId = 4;

// Runtime overrides: {schedule_id: {entity_id: "on"|"off"}}
const overrides = new Map<string, Map<string, string>>();

function getScheduledStates(scheduleId: string): Record<string, string> {
    const s = store.get(scheduleId);
    if (!s || !s.active) return {};
    // Compute current slot index
    const now = new Date();
    const slotIndex = Math.floor((now.getHours() * 60 + now.getMinutes()) / 15);
    let dayKey = "0";
    if (s.cadence === "weekly") dayKey = String((now.getDay() + 6) % 7);
    const daySlots = s.slots[dayKey];
    if (!daySlots || slotIndex >= daySlots.length) return {};
    const desired = daySlots[slotIndex];
    const state = desired ? "on" : "off";
    return Object.fromEntries(s.entity_ids.map((eid) => [eid, state]));
}

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
            overrides.delete(msg.schedule_id as string);
            return {};
        }

        case "oncue_scheduler/set_override": {
            const sid = msg.schedule_id as string;
            if (!overrides.has(sid)) overrides.set(sid, new Map());
            overrides.get(sid)!.set(msg.entity_id as string, msg.state as string);
            return { success: true };
        }

        case "oncue_scheduler/clear_override": {
            const sid = msg.schedule_id as string;
            overrides.get(sid)?.delete(msg.entity_id as string);
            return { success: true };
        }

        case "oncue_scheduler/get_overrides": {
            const sid = msg.schedule_id as string;
            const ov = overrides.get(sid);
            const s = store.get(sid);
            const unavailable = s
                ? s.entity_ids.filter((eid) => mockHass.states[eid]?.state === "unavailable")
                : [];
            return {
                overrides: ov ? Object.fromEntries(ov) : {},
                scheduled_states: getScheduledStates(sid),
                unavailable_entities: unavailable,
            };
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
        subscribeEvents: async () => () => { },
    },
    states: {
        "switch.living_room": { entity_id: "switch.living_room", state: "on", attributes: { friendly_name: "Living Room" } },
        "switch.office_heater": { entity_id: "switch.office_heater", state: "on", attributes: { friendly_name: "Office Heater" } },
        "switch.desk_lamp": { entity_id: "switch.desk_lamp", state: "on", attributes: { friendly_name: "Desk Lamp" } },
        "switch.garden_valve": { entity_id: "switch.garden_valve", state: "off", attributes: { friendly_name: "Garden Valve" } },
        "switch.kitchen_kettle": { entity_id: "switch.kitchen_kettle", state: "unavailable", attributes: { friendly_name: "Kitchen Kettle" } },
        "switch.garage_door": { entity_id: "switch.garage_door", state: "off", attributes: { friendly_name: "Garage Door" } },
        "light.hallway": { entity_id: "light.hallway", state: "off", attributes: { friendly_name: "Hallway Light" } },
        "light.bedroom": { entity_id: "light.bedroom", state: "off", attributes: { friendly_name: "Bedroom Light" } },
        "light.porch": { entity_id: "light.porch", state: "on", attributes: { friendly_name: "Porch Light" } },
        "fan.ceiling": { entity_id: "fan.ceiling", state: "off", attributes: { friendly_name: "Ceiling Fan" } },
        "fan.bathroom_extractor": { entity_id: "fan.bathroom_extractor", state: "off", attributes: { friendly_name: "Bathroom Extractor" } },
        "input_boolean.guest_mode": { entity_id: "input_boolean.guest_mode", state: "off", attributes: { friendly_name: "Guest Mode" } },
        "sensor.temperature": { entity_id: "sensor.temperature", state: "22.5", attributes: { friendly_name: "Temperature" } },
        "binary_sensor.front_door": { entity_id: "binary_sensor.front_door", state: "off", attributes: { friendly_name: "Front Door" } },
    },
};

// Create the panel element after hass is ready (avoids connectedCallback race)
function mount() {
    const container = document.getElementById("panel-container");
    if (!container) return;
    // Avoid double-mounting on HMR
    if (container.querySelector("oncue-scheduler-panel")) return;
    const panel = document.createElement("oncue-scheduler-panel") as any;
    panel.hass = mockHass;
    panel.panel = { config: { title: "OnCue Scheduler" } };
    panel.style.display = "block";
    panel.style.height = "100%";
    container.appendChild(panel);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
} else {
    mount();
}
