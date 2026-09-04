import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles } from "./styles";
import type { Schedule, Conflict, HomeAssistant, HvacPreset, PaletteEntry, PaletteEntryObject, BrightnessPreset, ScenePreset } from "./types";
import { normalizePaletteEntry, paletteEntryDisplayColor, paletteEntryBackground } from "./types";
import "./schedule-grid";
import "./entity-picker";
import "./icon-picker";
import "./mdi-icon";
import "./toast-notification";
import type { ToastNotification } from "./toast-notification";

const SLOTS_PER_DAY = 96;
const DAY_KEYS_WEEKLY = ["0", "1", "2", "3", "4", "5", "6"];

const DEFAULT_BRIGHTNESS_PRESETS: BrightnessPreset[] = [
    { brightness: 3, color: "#1a1a2e", alias: "1%" },
    { brightness: 64, color: "#4a6fa5", alias: "25%" },
    { brightness: 128, color: "#ff9800", alias: "50%" },
    { brightness: 191, color: "#ffc107", alias: "75%" },
    { brightness: 255, color: "#ffeb3b", alias: "100%" },
];

/**
 * Build an empty slots object for the given cadence.
 * @param cadence - "daily", "weekly", or "custom".
 * @returns Day-keyed map of zero-filled slot arrays.
 */
function defaultSlots(cadence: string): Record<string, number[]> {
    if (cadence === "daily") return { "0": new Array(SLOTS_PER_DAY).fill(0) };
    if (cadence === "weekly") {
        const s: Record<string, number[]> = {};
        for (const k of DAY_KEYS_WEEKLY) s[k] = new Array(SLOTS_PER_DAY).fill(0);
        return s;
    }
    return {};
}

/**
 * Generate an array of ISO date strings between two dates, inclusive.
 * @param start - ISO start date.
 * @param end - ISO end date.
 * @returns Array of ISO date strings.
 */
function dateRange(start: string, end: string): string[] {
    const dates: string[] = [];
    const d = new Date(start);
    const last = new Date(end);
    while (d <= last) {
        dates.push(d.toISOString().slice(0, 10));
        d.setDate(d.getDate() + 1);
    }
    return dates;
}

/** Full schedule editor with form fields, grid, preset management, and CRUD. */
@customElement("schedule-editor")
export class ScheduleEditor extends LitElement {
    @property({ attribute: false }) hass!: HomeAssistant;
    @property({ attribute: false }) schedule: Schedule | null = null;
    @property({ type: Boolean }) isNew = false;
    @property({ attribute: false }) globalHvacPresets: HvacPreset[] = [];
    @property({ attribute: false }) globalColorPresets: PaletteEntry[] = [];
    @property({ attribute: false }) globalBrightnessPresets: BrightnessPreset[] = [];
    @property({ attribute: false }) globalScenePresets: ScenePreset[] = [];

    @state() private _name = "";
    @state() private _entityIds: string[] = [];
    @state() private _cadence: "daily" | "weekly" | "custom" = "daily";
    @state() private _repeat = true;
    @state() private _startDate = "";
    @state() private _endDate = "";
    @state() private _slots: Record<string, number[]> = {};
    @state() private _conflicts: Conflict[] = [];
    @state() private _saving = false;
    @state() private _deleting = false;
    @state() private _dirty = false;
    @state() private _confirmDelete = false;
    @state() private _confirmDiscard = false;
    @state() private _active = true;
    @state() private _overrides: Record<string, string> = {};
    @state() private _scheduledStates: Record<string, string> = {};
    @state() private _unavailableEntities: string[] = [];
    @state() private _revertDelay: number | null = 180;
    @state() private _slotType: string = "on_off";
    @state() private _palette: PaletteEntry[] = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff8800", "#ffffff"];
    @state() private _hvacPresets: HvacPreset[] = [];
    @state() private _hvacEditIndex: number | null = null;
    @state() private _confirmDeletePresetIndex: number | null = null;
    @state() private _confirmDeletePresetUsage: { id: string; name: string }[] = [];
    @state() private _paletteEditIndex: number | null = null;
    @state() private _confirmDeletePaletteIndex: number | null = null;
    @state() private _confirmDeletePaletteUsage: { id: string; name: string }[] = [];
    @state() private _pendingSlotType: string | null = null;
    @state() private _brightnessPresets: BrightnessPreset[] = [];
    @state() private _brightnessEditIndex: number | null = null;
    @state() private _confirmDeleteBrightnessIndex: number | null = null;
    @state() private _confirmDeleteBrightnessUsage: { id: string; name: string }[] = [];
    @state() private _scenePresets: ScenePreset[] = [];
    @state() private _sceneEditIndex: number | null = null;
    @state() private _confirmDeleteSceneIndex: number | null = null;
    @state() private _confirmDeleteSceneUsage: { id: string; name: string }[] = [];
    @state() private _isNewPreset = false;

    private _unsubOverrides: (() => void) | null = null;

    connectedCallback() {
        super.connectedCallback();
        this._subscribeOverrideEvents();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._unsubOverrides?.();
        this._unsubOverrides = null;
    }

    /** Subscribe to real-time override change events for the current schedule. */
    private async _subscribeOverrideEvents() {
        try {
            this._unsubOverrides = await this.hass.connection.subscribeEvents(
                (event: any) => {
                    const scheduleId = event.data?.schedule_id;
                    if (scheduleId && this.schedule?.id === scheduleId) {
                        this._loadOverrides();
                    }
                },
                "oncue_scheduler_overrides_changed",
            );
        } catch {
            // Subscription not supported in mock/test environments
        }
    }

    static styles = [
        sharedStyles,
        css`
      /* ── Host & layout ── */
      :host {
        display: block;
        height: 100%;
        overflow-y: auto;
        padding: 16px;
        box-sizing: border-box;
      }
      .editor-wrapper {
        position: relative;
      }
      .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .editor-header h2 {
        margin: 0;
        font-size: 18px;
      }
      .actions {
        display: flex;
        gap: 8px;
      }

      /* ── Form layout ── */
      .form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 16px;
      }
      .form .full-width {
        grid-column: 1 / -1;
      }
      .form input[type="text"],
      .form textarea,
      .form select,
      .form input[type="date"] {
        width: 100%;
      }
      textarea {
        min-height: 60px;
        resize: vertical;
      }
      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-top: 20px;
      }
      .revert-row {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .revert-row input[type="number"] {
        width: 60px;
        text-align: center;
      }
      .revert-row span {
        font-size: 13px;
        color: var(--secondary-text-color, #727272);
      }
      .never-label {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        margin-left: 8px;
        cursor: pointer;
      }

      /* ── Cadence & date range ── */
      .cadence-row {
        display: flex;
        align-items: flex-end;
        gap: 8px;
      }
      .cadence-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
      }
      .cadence-field select {
        width: 100%;
      }
      .cadence-row .repeat-check {
        display: flex;
        align-items: center;
        gap: 4px;
        padding-bottom: 8px;
        white-space: nowrap;
        font-size: 13px;
      }
      .date-range-row {
        display: flex;
        align-items: flex-end;
        gap: 12px;
        flex-wrap: wrap;
      }
      .date-range-row .form-group {
        flex: 1;
        min-width: 120px;
      }
      .date-range-row .repeat-check {
        display: flex;
        align-items: center;
        gap: 6px;
        padding-bottom: 8px;
        white-space: nowrap;
      }
      /* auto-width for all standalone checkboxes */
      .checkbox-row input[type="checkbox"],
      .never-label input[type="checkbox"],
      .cadence-row .repeat-check input[type="checkbox"],
      .date-range-row .repeat-check input[type="checkbox"] {
        width: auto;
      }

      /* ── Status indicator ── */
      .status-toggle {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 500;
      }
      .status-toggle button {
        font-size: 12px;
        padding: 4px 10px;
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }
      .status-dot.active {
        background: var(--success-color, #4caf50);
      }
      .status-dot.paused {
        background: var(--disabled-text-color, #bdbdbd);
      }

      /* ── Grid section ── */
      .grid-section {
        margin-top: 16px;
      }
      .grid-section h3 {
        margin: 0 0 8px;
        font-size: 14px;
      }
      .empty-msg {
        text-align: center;
        color: var(--secondary-text-color, #727272);
        padding: 48px 16px;
        font-size: 16px;
      }

      /* ── Shared: color swatch inputs ── */
      input[type="color"] {
        padding: 0;
        border: 1px solid var(--ss-border);
        border-radius: 4px;
        cursor: pointer;
        background: none;
      }

      /* ── Shared: interactive chip base ── */
      .palette-entry-chip,
      .hvac-preset-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.15s, box-shadow 0.15s;
        position: relative;
      }
      .palette-entry-chip:hover,
      .hvac-preset-chip:hover {
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      }

      /* ── Shared: circular remove button on chips ── */
      .palette-remove,
      .palette-entry-chip .chip-remove,
      .hvac-preset-chip .chip-remove {
        border-radius: 50%;
        border: none;
        background: var(--error-color, #db4437);
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
      }

      /* ── Shared: edit form panels ── */
      .palette-edit-form,
      .hvac-edit-form,
      .preset-confirm-overlay {
        padding: 12px;
        border: 1px solid var(--ss-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
      }

      /* ── Modal overlay for preset editing ── */
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-panel {
        background: var(--card-background-color, #fff);
        border-radius: 12px;
        padding: 20px;
        max-width: 600px;
        width: 90vw;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      .modal-panel h3 {
        margin: 0 0 12px;
        font-size: 16px;
      }
      .modal-warning {
        font-size: 13px;
        color: var(--warning-color, #ff9800);
        margin: 0 0 12px;
        padding: 6px 10px;
        background: rgba(255, 152, 0, 0.1);
        border-radius: 6px;
        border-left: 3px solid var(--warning-color, #ff9800);
      }

      /* ── Shared: flex-wrap item lists ── */
      .palette-editor,
      .hvac-preset-list,
      .cycle-colors {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }

      /* ── Palette (on_off colour swatches) ── */
      .palette-entry {
        position: relative;
        display: inline-flex;
        align-items: center;
      }
      .palette-entry input[type="color"] {
        width: 32px;
        height: 32px;
      }
      .palette-remove {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 16px;
        height: 16px;
        font-size: 10px;
      }
      .palette-add {
        width: 32px;
        height: 32px;
        border: 1px dashed var(--ss-border);
        border-radius: 4px;
        background: transparent;
        cursor: pointer;
        font-size: 18px;
        color: var(--secondary-text-color, #727272);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
      .palette-add:hover {
        background: var(--ss-cell-off);
      }

      /* ── Palette entry chips (HVAC / cycle mode) ── */
      .palette-entry-chip {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        justify-content: center;
        box-sizing: border-box;
      }
      .palette-entry-chip .palette-mode-label {
        font-size: 14px;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        pointer-events: none;
      }
      .palette-entry-chip .chip-remove {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 14px;
        height: 14px;
        font-size: 9px;
      }

      /* ── Palette edit form ── */
      .palette-edit-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 8px;
      }
      .palette-edit-row {
        display: flex;
        gap: 8px;
        align-items: flex-end;
      }
      .palette-edit-row input[type="color"] {
        width: 36px;
        height: 36px;
      }
      .palette-mode-help {
        font-size: 12px;
        color: var(--secondary-text-color, #727272);
        padding: 4px 0;
      }

      /* ── Cycle configuration ── */
      .cycle-config {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .cycle-options {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .cycle-options .form-group {
        flex: 1;
        min-width: 120px;
      }

      /* ── HVAC presets ── */
      .hvac-presets {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .hvac-preset-chip {
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 12px;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0,0,0,0.4);
      }
      .hvac-preset-chip .chip-icon {
        --mdi-icon-size: 16px;
        flex-shrink: 0;
      }
      .hvac-preset-chip .chip-remove {
        width: 14px;
        height: 14px;
        font-size: 9px;
        background: rgba(0,0,0,0.3);
        margin-left: 2px;
      }
      .hvac-preset-chip .chip-remove:hover {
        background: var(--error-color, #db4437);
      }

      /* ── HVAC edit form ── */
      .hvac-edit-form {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
      }
      .hvac-edit-form .form-group {
        margin-bottom: 0;
      }
      .hvac-edit-form .hvac-edit-actions {
        grid-column: 1 / -1;
        display: flex;
        gap: 6px;
        justify-content: flex-end;
      }
      .hvac-edit-form .color-alias-row {
        display: flex;
        gap: 8px;
        align-items: flex-end;
        grid-column: 1 / -1;
      }
      .hvac-edit-form .color-alias-row input[type="color"] {
        width: 36px;
        height: 36px;
        flex-shrink: 0;
      }
      .hvac-edit-form .color-alias-row .alias-input {
        flex: 1;
      }
      .hvac-edit-form .icon-picker-group {
        flex: 1;
        min-width: 160px;
      }

      /* ── Preset delete confirmation ── */
      .preset-confirm-overlay {
        font-size: 13px;
      }
      .preset-confirm-overlay p {
        margin: 0 0 8px;
      }
      .preset-confirm-overlay .confirm-actions {
        display: flex;
        gap: 6px;
        justify-content: flex-end;
      }

      /* ── Inline confirm & loading overlay ── */
      .inline-confirm {
        display: inline-flex;
        gap: 4px;
        align-items: center;
        font-size: 13px;
      }
      .inline-confirm span {
        color: var(--error-color, #db4437);
        font-weight: 500;
      }
      .inline-confirm button {
        font-size: 12px;
        padding: 4px 8px;
      }
      /* ── Save button states ── */
      button.primary:disabled {
        opacity: 0.5;
        cursor: default;
      }
      button.primary.pulse {
        animation: save-pulse 2s ease-in-out infinite;
      }
      @keyframes save-pulse {
        0%, 100% { box-shadow: 0 0 0 0 transparent; }
        50% { box-shadow: 0 0 8px 2px var(--ss-primary); }
      }

      /* ── Unsaved changes banner ── */
      .unsaved-banner {
        font-size: 13px;
        padding: 8px 12px;
        border-radius: 4px;
        margin-bottom: 12px;
        min-height: 18px;
        box-sizing: content-box;
      }
      .unsaved-banner.visible {
        background: var(--warning-color, #ff9800);
        color: #fff;
      }

      .loading-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        border-radius: 8px;
      }
      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid var(--ss-border);
        border-top-color: var(--ss-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `,
    ];

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has("schedule")) {
            this._loadFromSchedule();
            this._confirmDelete = false;
            this._confirmDiscard = false;
            this._loadOverrides();
        } else if (changed.has("globalHvacPresets") && !this._dirty) {
            this._hvacPresets = this.globalHvacPresets.map((p) => ({ ...p }));
        } else if (changed.has("globalBrightnessPresets") && !this._dirty) {
            this._brightnessPresets = this.globalBrightnessPresets.map((p) => ({ ...p }));
        } else if (changed.has("globalScenePresets") && !this._dirty) {
            this._scenePresets = this.globalScenePresets.map((p) => ({ ...p }));
        }
    }

    private get _toast(): ToastNotification | null {
        return this.renderRoot.querySelector("toast-notification");
    }

    /** Show a toast notification. */
    private _showToast(message: string, type: "info" | "warning" | "error" = "info") {
        this._toast?.show(message, type);
    }

    /** Populate form state from the current schedule (or defaults for new). */
    private _loadFromSchedule() {
        if (this.schedule) {
            this._name = this.schedule.name;
            this._entityIds = [...this.schedule.entity_ids];
            this._cadence = this.schedule.cadence;
            this._repeat = this.schedule.repeat;
            this._startDate = this.schedule.start_date ?? "";
            this._endDate = this.schedule.end_date ?? "";
            this._slots = JSON.parse(JSON.stringify(this.schedule.slots));
            this._active = this.schedule.active;
            this._revertDelay = "revert_delay" in (this.schedule as any)
                ? (this.schedule as any).revert_delay
                : 180;
            this._slotType = this.schedule.slot_type ?? "on_off";
            this._palette = this.globalColorPresets.length > 0 ? [...this.globalColorPresets] : ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff8800", "#ffffff"];
            this._hvacPresets = this.globalHvacPresets.map((p) => ({ ...p }));
            this._hvacEditIndex = null;
            this._brightnessPresets = this.globalBrightnessPresets.length > 0 ? this.globalBrightnessPresets.map((p) => ({ ...p })) : DEFAULT_BRIGHTNESS_PRESETS.map((p) => ({ ...p }));
            this._brightnessEditIndex = null;
            this._scenePresets = this.globalScenePresets.map((p) => ({ ...p }));
            this._sceneEditIndex = null;
        } else {
            this._name = "";
            this._entityIds = [];
            this._cadence = "daily";
            this._repeat = true;
            this._startDate = "";
            this._endDate = "";
            this._slots = defaultSlots("daily");
            this._active = true;
            this._revertDelay = 180;
            this._slotType = "on_off";
            this._palette = this.globalColorPresets.length > 0 ? [...this.globalColorPresets] : ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff8800", "#ffffff"];
            this._hvacPresets = this.globalHvacPresets.map((p) => ({ ...p }));
            this._hvacEditIndex = null;
            this._brightnessPresets = this.globalBrightnessPresets.length > 0 ? this.globalBrightnessPresets.map((p) => ({ ...p })) : DEFAULT_BRIGHTNESS_PRESETS.map((p) => ({ ...p }));
            this._brightnessEditIndex = null;
            this._scenePresets = this.globalScenePresets.map((p) => ({ ...p }));
            this._sceneEditIndex = null;
        }
        this._dirty = false;
        this._conflicts = [];
    }

    render() {
        if (!this.schedule && !this.isNew) {
            return html`<div class="empty-msg">Select a schedule or create a new one.</div>`;
        }

        const customDates =
            this._cadence === "custom" && this._startDate && this._endDate
                ? dateRange(this._startDate, this._endDate)
                : [];

        const busy = this._saving || this._deleting;

        return html`
      <toast-notification></toast-notification>
      <div class="editor-wrapper">
      ${busy ? html`<div class="loading-overlay"><div class="spinner"></div></div>` : nothing}
      <div class="editor-header">
        <h2>${this.isNew ? "New Schedule" : "Edit Schedule"}
          ${!this.isNew
                ? html`
              <span class="status-toggle">
                <span class="status-dot ${this._active ? "active" : "paused"}"></span>
                ${this._active ? "Active" : "Paused"}
                <button class="secondary" @click=${this._toggleActive}>
                  ${this._active ? "Pause" : "Resume"}
                </button>
              </span>
            `
                : nothing}
        </h2>
        <div class="actions">
          ${this._confirmDiscard
                ? html`
              <div class="inline-confirm">
                <span>Discard changes?</span>
                <button class="danger" @click=${this._doDiscard}>Yes</button>
                <button class="secondary" @click=${() => { this._confirmDiscard = false; }}>No</button>
              </div>
            `
                : html`<button class="secondary" @click=${this._onCancel}>Cancel</button>`}
          ${!this.isNew
                ? this._confirmDelete
                    ? html`
                <div class="inline-confirm">
                  <span>Delete?</span>
                  <button class="danger" @click=${this._doDelete}>Yes</button>
                  <button class="secondary" @click=${() => { this._confirmDelete = false; }}>No</button>
                </div>
              `
                    : html`<button class="danger" @click=${this._onDelete}>Delete</button>`
                : nothing}
          <button class="primary ${this._dirty ? "pulse" : ""}" ?disabled=${busy || !this._dirty} @click=${this._onSave}>
            ${this._saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div class="unsaved-banner ${this._dirty && !this.isNew ? "visible" : ""}">
        ${this._dirty && !this.isNew ? "Changes will not take effect until the schedule is saved." : nothing}
      </div>

      ${this._conflicts.length > 0
                ? html`
            <div class="warning-banner">
              ⚠ Conflicts detected with:
              ${this._conflicts.map((c) => c.schedule_name).join(", ")}
            </div>
          `
                : nothing}

      <div class="form">
        <div class="form-group full-width">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            .value=${this._name}
            @input=${(e: InputEvent) => {
                this._name = (e.target as HTMLInputElement).value;
                this._dirty = true;
            }}
            placeholder="My Schedule"
          />
        </div>

        <div class="form-group full-width">
          <div class="cadence-row">
            <div class="cadence-field">
              <label for="slot-type">Slot Type</label>
              <select
                id="slot-type"
                .value=${this._slotType}
                @change=${(e: Event) => {
                    const newType = (e.target as HTMLSelectElement).value;
                    if (newType !== this._slotType) {
                        const hasData = Object.values(this._slots).some(
                            arr => arr.some(v => v !== 0)
                        );
                        if (hasData) {
                            this._pendingSlotType = newType;
                            (e.target as HTMLSelectElement).value = this._slotType;
                            return;
                        }
                        this._slotType = newType;
                        this._slots = defaultSlots(this._cadence);
                        if (this._cadence === "custom") {
                            this._rebuildCustomSlots();
                        }
                        this._dirty = true;
                    }
                }}
              >
                <option value="on_off">On/Off</option>
                <option value="brightness">Brightness / Percentage</option>
                <option value="color">Color</option>
                <option value="hvac">HVAC</option>
                <option value="scene">Scene</option>
              </select>
            </div>
            <div class="cadence-field">
              <label for="cadence">Cadence</label>
              <select
                id="cadence"
                .value=${this._cadence}
                @change=${(e: Event) => {
                    const newCadence = (e.target as HTMLSelectElement).value as "daily" | "weekly" | "custom";
                    this._cadence = newCadence;
                    this._slots = defaultSlots(newCadence);
                    this._dirty = true;
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <label class="repeat-check">
              <input
                type="checkbox"
                .checked=${this._repeat}
                @change=${(e: Event) => {
                this._repeat = (e.target as HTMLInputElement).checked;
                this._dirty = true;
            }}
              />
              Repeat
            </label>
            <div class="cadence-field">
              <label>Revert after</label>
              <div class="revert-row">
                <input
                  type="number"
                  min="0"
                  max="59"
                  style="width: 50px"
                  .value=${this._revertDelay !== null ? String(Math.floor(this._revertDelay / 60)) : "0"}
                  ?disabled=${this._revertDelay === null}
                  @input=${(e: InputEvent) => {
                    const mins = parseInt((e.target as HTMLInputElement).value) || 0;
                    const secs = (this._revertDelay ?? 0) % 60;
                    this._revertDelay = mins * 60 + secs;
                    this._dirty = true;
                }}
                />
                <span>m</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  style="width: 50px"
                  .value=${this._revertDelay !== null ? String((this._revertDelay) % 60) : "0"}
                  ?disabled=${this._revertDelay === null}
                  @input=${(e: InputEvent) => {
                    const secs = parseInt((e.target as HTMLInputElement).value) || 0;
                    const mins = Math.floor((this._revertDelay ?? 0) / 60);
                    this._revertDelay = mins * 60 + secs;
                    this._dirty = true;
                }}
                />
                <span>s</span>
                <label class="never-label">
                  <input
                    type="checkbox"
                    .checked=${this._revertDelay === null}
                    @change=${(e: Event) => {
                    this._revertDelay = (e.target as HTMLInputElement).checked ? null : 180;
                    this._dirty = true;
                }}
                  />
                  Never
                </label>
              </div>
            </div>
          </div>
          ${this._pendingSlotType ? html`
            <div class="preset-confirm-overlay">
              <p>Changing slot type will <b>clear all scheduled data</b>.</p>
              <p>The current <b>${this._slotType}</b> values are incompatible with <b>${this._pendingSlotType}</b> and cannot be preserved.</p>
              <p style="margin-bottom:0">If you need both types, create a separate schedule instead.</p>
              <div class="confirm-actions">
                <button class="secondary" @click=${() => { this._pendingSlotType = null; }}>Cancel</button>
                <button class="danger" @click=${() => {
                    this._slotType = this._pendingSlotType!;
                    this._pendingSlotType = null;
                    this._slots = defaultSlots(this._cadence);
                    if (this._cadence === "custom") {
                        this._rebuildCustomSlots();
                    }
                    this._dirty = true;
                }}>Change &amp; Clear</button>
              </div>
            </div>
          ` : nothing}
        </div>

        ${this._cadence === "custom"
                ? html`
              <div class="form-group full-width">
                <div class="date-range-row">
                  <div class="form-group">
                    <label for="start-date">Start Date</label>
                    <input
                      id="start-date"
                      type="date"
                      .value=${this._startDate}
                      @change=${(e: Event) => {
                        this._startDate = (e.target as HTMLInputElement).value;
                        this._rebuildCustomSlots();
                        this._dirty = true;
                    }}
                    />
                  </div>
                  <div class="form-group">
                    <label for="end-date">End Date</label>
                    <input
                      id="end-date"
                      type="date"
                      .value=${this._endDate}
                      @change=${(e: Event) => {
                        this._endDate = (e.target as HTMLInputElement).value;
                        this._rebuildCustomSlots();
                        this._dirty = true;
                    }}
                    />
                  </div>
                </div>
              </div>
            `
                : nothing}

        <div class="form-group full-width">
          <label>Entities</label>
          <entity-picker
            .hass=${this.hass}
            .selectedIds=${this._entityIds}
            .overrides=${this._overrides}
            .scheduledStates=${this._scheduledStates}
            .unavailableEntities=${this._unavailableEntities}
            .showOverrides=${!this.isNew}
            .slotType=${this._slotType}
            @entities-changed=${(e: CustomEvent) => {
                this._entityIds = e.detail.entityIds;
                this._dirty = true;
            }}
            @override-set=${this._onOverrideSet}
            @override-clear=${this._onOverrideClear}
          ></entity-picker>
        </div>

      </div>

      <div class="grid-section">
        <h3>Time Slots (15-minute intervals)</h3>
        <schedule-grid
          .cadence=${this._cadence}
          .slots=${this._slots}
          .customDates=${customDates}
          .slotType=${this._slotType}
          .palette=${this._palette}
          .hvacPresets=${this._hvacPresets}
          .brightnessPresets=${this._brightnessPresets}
          .scenePresets=${this._scenePresets}
          @slots-changed=${(e: CustomEvent) => {
                this._slots = e.detail.slots;
                this._dirty = true;
            }}
          @preset-edit=${(e: CustomEvent) => { this._onPresetEdit(e.detail.index); }}
          @preset-delete=${(e: CustomEvent) => { this._onPresetDelete(e.detail.index); }}
          @preset-add=${() => { this._onPresetAdd(); }}
        ></schedule-grid>
      </div>
      </div>

      ${this._renderPresetModal()}
    `;
    }

    private _renderPresetModal() {
        const colorEdit = this._slotType === "color" && this._paletteEditIndex !== null && this._paletteEditIndex < this._palette.length;
        const colorDelete = this._slotType === "color" && this._confirmDeletePaletteIndex !== null && this._confirmDeletePaletteIndex < this._palette.length;
        const hvacEdit = this._slotType === "hvac" && this._hvacEditIndex !== null && this._hvacEditIndex < this._hvacPresets.length;
        const hvacDelete = this._slotType === "hvac" && this._confirmDeletePresetIndex !== null && this._confirmDeletePresetIndex < this._hvacPresets.length;
        const brightEdit = this._slotType === "brightness" && this._brightnessEditIndex !== null && this._brightnessEditIndex < this._brightnessPresets.length;
        const brightDelete = this._slotType === "brightness" && this._confirmDeleteBrightnessIndex !== null && this._confirmDeleteBrightnessIndex < this._brightnessPresets.length;
        const sceneEdit = this._slotType === "scene" && this._sceneEditIndex !== null && this._sceneEditIndex < this._scenePresets.length;
        const sceneDelete = this._slotType === "scene" && this._confirmDeleteSceneIndex !== null && this._confirmDeleteSceneIndex < this._scenePresets.length;

        if (!colorEdit && !colorDelete && !hvacEdit && !hvacDelete && !brightEdit && !brightDelete && !sceneEdit && !sceneDelete) {
            return nothing;
        }

        const isEditing = colorEdit || hvacEdit || brightEdit || sceneEdit;
        const title = colorDelete || hvacDelete || brightDelete || sceneDelete
            ? "Delete Preset"
            : this._isNewPreset ? "New Preset" : "Edit Preset";

        return html`
      <div class="modal-backdrop" @click=${(e: Event) => { if (e.target === e.currentTarget) this._closePresetModal(); }}>
        <div class="modal-panel">
          <h3>${title}</h3>
          ${isEditing && !this._isNewPreset ? html`
            <p class="modal-warning">Changes to this preset will affect all schedules that use it.</p>
          ` : nothing}
          ${colorDelete ? this._renderPaletteDeleteConfirm(this._confirmDeletePaletteIndex!) : nothing}
          ${colorEdit ? this._renderPaletteEditForm(normalizePaletteEntry(this._palette[this._paletteEditIndex!]), this._paletteEditIndex!) : nothing}
          ${hvacDelete ? this._renderPresetDeleteConfirm(this._confirmDeletePresetIndex!) : nothing}
          ${hvacEdit ? this._renderHvacEditForm(this._hvacPresets[this._hvacEditIndex!], this._hvacEditIndex!) : nothing}
          ${brightDelete ? this._renderBrightnessDeleteConfirm(this._confirmDeleteBrightnessIndex!) : nothing}
          ${brightEdit ? this._renderBrightnessEditForm(this._brightnessPresets[this._brightnessEditIndex!], this._brightnessEditIndex!) : nothing}
          ${sceneDelete ? this._renderSceneDeleteConfirm(this._confirmDeleteSceneIndex!) : nothing}
          ${sceneEdit ? this._renderSceneEditForm(this._scenePresets[this._sceneEditIndex!], this._sceneEditIndex!) : nothing}
        </div>
      </div>
    `;
    }

    private _closePresetModal() {
        this._paletteEditIndex = null;
        this._hvacEditIndex = null;
        this._brightnessEditIndex = null;
        this._sceneEditIndex = null;
        this._confirmDeletePaletteIndex = null;
        this._confirmDeletePresetIndex = null;
        this._confirmDeleteBrightnessIndex = null;
        this._confirmDeleteSceneIndex = null;
        if (this._isNewPreset) {
            this._cancelNewPreset();
        }
        this._isNewPreset = false;
    }

    // ── Preset event dispatchers from schedule-grid ──

    private _onPresetEdit(index: number) {
        this._isNewPreset = false;
        if (this._slotType === "color") this._paletteEditIndex = index;
        else if (this._slotType === "hvac") this._hvacEditIndex = index;
        else if (this._slotType === "brightness") this._brightnessEditIndex = index;
        else if (this._slotType === "scene") this._sceneEditIndex = index;
    }

    private _onPresetDelete(index: number) {
        if (this._slotType === "color") this._requestDeletePaletteEntry(index);
        else if (this._slotType === "hvac") this._requestDeletePreset(index);
        else if (this._slotType === "brightness") this._requestDeleteBrightnessPreset(index);
        else if (this._slotType === "scene") this._requestDeleteScenePreset(index);
    }

    private _onPresetAdd() {
        this._isNewPreset = true;
        if (this._slotType === "color") {
            this._palette = [...this._palette, "#888888"];
            this._paletteEditIndex = this._palette.length - 1;
            this._dirty = true;
        } else if (this._slotType === "hvac") this._addHvacPreset();
        else if (this._slotType === "brightness") this._addBrightnessPreset();
        else if (this._slotType === "scene") this._addScenePreset();
    }

    private _cancelNewPreset() {
        if (!this._isNewPreset) return;
        if (this._slotType === "color" && this._paletteEditIndex !== null) {
            this._palette = this._palette.filter((_, i) => i !== this._paletteEditIndex);
            this._paletteEditIndex = null;
        } else if (this._slotType === "hvac" && this._hvacEditIndex !== null) {
            this._hvacPresets = this._hvacPresets.filter((_, i) => i !== this._hvacEditIndex);
            this._hvacEditIndex = null;
        } else if (this._slotType === "brightness" && this._brightnessEditIndex !== null) {
            this._brightnessPresets = this._brightnessPresets.filter((_, i) => i !== this._brightnessEditIndex);
            this._brightnessEditIndex = null;
        } else if (this._slotType === "scene" && this._sceneEditIndex !== null) {
            this._scenePresets = this._scenePresets.filter((_, i) => i !== this._sceneEditIndex);
            this._sceneEditIndex = null;
        }
        this._isNewPreset = false;
    }

    /**
     * Human-readable label for an HVAC preset.
     * @param preset - HVAC preset object.
     * @returns Label like "cool 22° / fan: auto".
     */
    private _hvacPresetLabel(preset: HvacPreset): string {
        const parts: string[] = [];
        if (preset.temperature !== null) parts.push(`${preset.temperature}°`);
        if (preset.hvac_mode) parts.push(preset.hvac_mode);
        if (preset.fan_mode) parts.push(preset.fan_mode);
        return parts.join(" | ") || "Preset";
    }

    /**
     * Tooltip for an HVAC preset showing all configured attributes.
     * @param preset - HVAC preset object.
     * @returns Multi-line tooltip string.
     */
    private _hvacPresetTooltip(preset: HvacPreset): string {
        const lines: string[] = [];
        if (preset.alias) lines.push(preset.alias);
        if (preset.temperature !== null) lines.push(`Temperature: ${preset.temperature}°C`);
        if (preset.hvac_mode) lines.push(`Mode: ${preset.hvac_mode}`);
        if (preset.fan_mode) lines.push(`Fan: ${preset.fan_mode}`);
        return lines.join("\n");
    }

    /** Append a default HVAC preset and open its edit form. */
    private _addHvacPreset() {
        this._hvacPresets = [
            ...this._hvacPresets,
            { temperature: 22, hvac_mode: "cool", fan_mode: "auto", color: "#90caf9" },
        ];
        this._hvacEditIndex = this._hvacPresets.length - 1;
        this._dirty = true;
    }

    /**
     * Count how many slots reference an HVAC preset by index.
     * @param index - Zero-based preset index (slot value = index + 1).
     * @returns Total slot count across all days.
     */
    private _presetSlotCount(index: number): number {
        const paletteValue = index + 1;
        let count = 0;
        for (const arr of Object.values(this._slots)) {
            for (const v of arr) {
                if (v === paletteValue) count++;
            }
        }
        return count;
    }

    /** Render the delete confirmation overlay for an HVAC preset. */
    private _renderPresetDeleteConfirm(index: number) {
        const preset = this._hvacPresets[index];
        const label = preset.alias || this._hvacPresetLabel(preset);
        const localCount = this._presetSlotCount(index);
        const usage = this._confirmDeletePresetUsage;
        // Filter out the current schedule from the usage list
        const otherSchedules = usage.filter((s) => s.id !== this.schedule?.id);
        const currentName = this.schedule?.name;
        const usedHere = localCount > 0;

        let usageMsg;
        if (usedHere && otherSchedules.length > 0) {
            const names = otherSchedules.map((s) => `'${s.name}'`).join(", ");
            usageMsg = html`This preset is in use by this schedule${currentName ? ` ('${currentName}')` : ""} and ${names} — affected slots will be cleared.`;
        } else if (usedHere) {
            usageMsg = html`This preset is used in <b>${localCount}</b> slot${localCount > 1 ? "s" : ""} in this schedule — they will be cleared.`;
        } else if (otherSchedules.length > 0) {
            const names = otherSchedules.map((s) => `'${s.name}'`).join(", ");
            usageMsg = html`This preset is in use by ${names} — affected slots will be cleared.`;
        } else {
            usageMsg = html`This preset is not used in any schedules.`;
        }

        return html`
      <div class="preset-confirm-overlay">
        <p>Delete preset <b>${label}</b>?</p>
        <p>${usageMsg}</p>
        <div class="confirm-actions">
          <button class="secondary" @click=${() => { this._confirmDeletePresetIndex = null; }}>Cancel</button>
          <button class="danger" @click=${() => { this._doRemoveHvacPreset(index); }}>Delete</button>
        </div>
      </div>
    `;
    }

    /**
     * Ask for confirmation before deleting a preset, showing usage info.
     * @param index - Zero-based preset index to delete.
     */
    private async _requestDeletePreset(index: number) {
        this._confirmDeletePresetIndex = index;
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/hvac_preset_usage",
                index,
            });
            this._confirmDeletePresetUsage = result.schedules ?? [];
        } catch {
            this._confirmDeletePresetUsage = [];
        }
    }

    /**
     * Remove an HVAC preset and rewrite slot references.
     * @param index - Zero-based preset index to remove.
     */
    private _doRemoveHvacPreset(index: number) {
        this._confirmDeletePresetIndex = null;
        const removedValue = index + 1;
        // Clear slots using this preset and remap higher indices
        const newSlots: Record<string, number[]> = {};
        for (const [key, arr] of Object.entries(this._slots)) {
            newSlots[key] = arr.map((v) => {
                if (v === removedValue) return 0;
                if (v > removedValue) return v - 1;
                return v;
            });
        }
        this._slots = newSlots;
        this._hvacPresets = this._hvacPresets.filter((_, i) => i !== index);
        if (this._hvacEditIndex !== null) {
            if (this._hvacEditIndex === index) this._hvacEditIndex = null;
            else if (this._hvacEditIndex > index) this._hvacEditIndex--;
        }
        this._dirty = true;
    }

    /**
     * Merge a partial update into an HVAC preset at the given index.
     * @param index - Zero-based preset index to update.
     * @param patch - Fields to merge into the preset.
     */
    private _updateHvacPreset(index: number, patch: Partial<HvacPreset>) {
        const updated = [...this._hvacPresets];
        updated[index] = { ...updated[index], ...patch };
        this._hvacPresets = updated;
        this._dirty = true;
    }

    /** Render the inline edit form for an HVAC preset. */
    private _renderHvacEditForm(preset: HvacPreset, index: number) {
        return html`
      <div class="hvac-edit-form">
        <div class="form-group">
          <label>Temperature (°C)</label>
          <input
            type="number"
            step="0.5"
            .value=${preset.temperature !== null ? String(preset.temperature) : ""}
            @input=${(e: InputEvent) => {
                const val = (e.target as HTMLInputElement).value;
                this._updateHvacPreset(index, { temperature: val ? parseFloat(val) : null });
            }}
          />
        </div>
        <div class="form-group">
          <label>HVAC Mode</label>
          <select
            .value=${preset.hvac_mode ?? ""}
            @change=${(e: Event) => {
                const val = (e.target as HTMLSelectElement).value;
                this._updateHvacPreset(index, { hvac_mode: val || null });
            }}
          >
            <option value="">—</option>
            <option value="off">Off</option>
            <option value="heat">Heat</option>
            <option value="cool">Cool</option>
            <option value="heat_cool">Heat/Cool</option>
            <option value="auto">Auto</option>
            <option value="dry">Dry</option>
            <option value="fan_only">Fan Only</option>
          </select>
        </div>
        <div class="form-group">
          <label>Fan Mode</label>
          <select
            .value=${preset.fan_mode ?? ""}
            @change=${(e: Event) => {
                const val = (e.target as HTMLSelectElement).value;
                this._updateHvacPreset(index, { fan_mode: val || null });
            }}
          >
            <option value="">—</option>
            <option value="auto">Auto</option>
            <option value="low">Low</option>
            <option value="medium_low">Medium Low</option>
            <option value="medium">Medium</option>
            <option value="medium_high">Medium High</option>
            <option value="high">High</option>
          </select>
        </div>
        <div class="color-alias-row">
          <div class="form-group">
            <label>Color</label>
            <input
              type="color"
              .value=${preset.color}
              @input=${(e: InputEvent) => {
                this._updateHvacPreset(index, { color: (e.target as HTMLInputElement).value });
            }}
            />
          </div>
          <div class="form-group alias-input">
            <label>Alias</label>
            <input
              type="text"
              .value=${preset.alias ?? ""}
              placeholder="e.g. Daytime Cooling"
              @input=${(e: InputEvent) => {
                this._updateHvacPreset(index, { alias: (e.target as HTMLInputElement).value || undefined });
            }}
            />
          </div>
          <div class="form-group icon-picker-group">
            <label>Icon</label>
            <icon-picker
              .value=${preset.icon ?? ""}
              @icon-changed=${(e: CustomEvent) => {
                this._updateHvacPreset(index, { icon: e.detail.icon || undefined });
            }}
            ></icon-picker>
          </div>
        </div>
        <div class="hvac-edit-actions">
          ${this._isNewPreset ? html`<button class="danger" @click=${() => { this._cancelNewPreset(); }}>Cancel</button>` : nothing}
          <button class="secondary" @click=${() => { this._hvacEditIndex = null; this._isNewPreset = false; }}>Done</button>
        </div>
      </div>
    `;
    }

    // ── Brightness preset editing ──

    /** Append a default brightness preset and open its edit form. */
    private _addBrightnessPreset() {
        this._brightnessPresets = [
            ...this._brightnessPresets,
            { brightness: 128, color: "#ffc107" },
        ];
        this._brightnessEditIndex = this._brightnessPresets.length - 1;
        this._dirty = true;
    }

    private _updateBrightnessPreset(index: number, patch: Partial<BrightnessPreset>) {
        const updated = [...this._brightnessPresets];
        updated[index] = { ...updated[index], ...patch };
        this._brightnessPresets = updated;
        this._dirty = true;
    }

    private async _requestDeleteBrightnessPreset(index: number) {
        this._confirmDeleteBrightnessIndex = index;
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/brightness_preset_usage",
                index,
            });
            this._confirmDeleteBrightnessUsage = result.schedules ?? [];
        } catch {
            this._confirmDeleteBrightnessUsage = [];
        }
    }

    private _doRemoveBrightnessPreset(index: number) {
        this._confirmDeleteBrightnessIndex = null;
        const removedValue = index + 1;
        const newSlots: Record<string, number[]> = {};
        for (const [key, arr] of Object.entries(this._slots)) {
            newSlots[key] = arr.map((v) => {
                if (v === removedValue) return 0;
                if (v > removedValue) return v - 1;
                return v;
            });
        }
        this._slots = newSlots;
        this._brightnessPresets = this._brightnessPresets.filter((_, i) => i !== index);
        if (this._brightnessEditIndex !== null) {
            if (this._brightnessEditIndex === index) this._brightnessEditIndex = null;
            else if (this._brightnessEditIndex > index) this._brightnessEditIndex--;
        }
        this._dirty = true;
    }

    private _renderBrightnessDeleteConfirm(index: number) {
        const preset = this._brightnessPresets[index];
        const label = preset.alias || `${Math.round(preset.brightness / 255 * 100)}%`;
        const localCount = this._presetSlotCount(index);
        const usage = this._confirmDeleteBrightnessUsage;
        const otherSchedules = usage.filter((s) => s.id !== this.schedule?.id);
        const usedHere = localCount > 0;
        let usageMsg;
        if (usedHere && otherSchedules.length > 0) {
            const names = otherSchedules.map((s) => `'${s.name}'`).join(", ");
            usageMsg = html`This preset is in use by this schedule and ${names} — affected slots will be cleared.`;
        } else if (usedHere) {
            usageMsg = html`This preset is used in <b>${localCount}</b> slot${localCount > 1 ? "s" : ""} in this schedule — they will be cleared.`;
        } else if (otherSchedules.length > 0) {
            const names = otherSchedules.map((s) => `'${s.name}'`).join(", ");
            usageMsg = html`This preset is in use by ${names} — affected slots will be cleared.`;
        } else {
            usageMsg = html`This preset is not used in any schedules.`;
        }
        return html`
      <div class="preset-confirm-overlay">
        <p>Delete brightness preset <b>${label}</b>?</p>
        <p>${usageMsg}</p>
        <div class="confirm-actions">
          <button class="secondary" @click=${() => { this._confirmDeleteBrightnessIndex = null; }}>Cancel</button>
          <button class="danger" @click=${() => { this._doRemoveBrightnessPreset(index); }}>Delete</button>
        </div>
      </div>
    `;
    }

    private _renderBrightnessEditForm(preset: BrightnessPreset, index: number) {
        const pct = Math.round(preset.brightness / 255 * 100);
        return html`
      <div class="hvac-edit-form">
        <div class="form-group">
          <label>Brightness (${pct}%)</label>
          <input
            type="range"
            min="1"
            max="255"
            .value=${String(preset.brightness)}
            @input=${(e: InputEvent) => {
                this._updateBrightnessPreset(index, { brightness: parseInt((e.target as HTMLInputElement).value) });
            }}
          />
        </div>
        <div class="color-alias-row">
          <div class="form-group">
            <label>Color</label>
            <input
              type="color"
              .value=${preset.color}
              @input=${(e: InputEvent) => {
                this._updateBrightnessPreset(index, { color: (e.target as HTMLInputElement).value });
            }}
            />
          </div>
          <div class="form-group alias-input">
            <label>Alias</label>
            <input
              type="text"
              .value=${preset.alias ?? ""}
              placeholder="e.g. Night Light"
              @input=${(e: InputEvent) => {
                this._updateBrightnessPreset(index, { alias: (e.target as HTMLInputElement).value || undefined });
            }}
            />
          </div>
          <div class="form-group icon-picker-group">
            <label>Icon</label>
            <icon-picker
              .value=${preset.icon ?? ""}
              @icon-changed=${(e: CustomEvent) => {
                this._updateBrightnessPreset(index, { icon: e.detail.icon || undefined });
            }}
            ></icon-picker>
          </div>
        </div>
        <div class="color-alias-row">
          <div class="form-group" style="flex:1">
            <label>Transition</label>
            <select
              .value=${preset.transition ?? "snap"}
              @change=${(e: Event) => {
                this._updateBrightnessPreset(index, {
                    transition: (e.target as HTMLSelectElement).value as "snap" | "crossfade",
                });
            }}
            >
              <option value="snap">Snap</option>
              <option value="crossfade">Cross-fade</option>
            </select>
          </div>
        </div>
        ${preset.transition === "crossfade" ? html`
          <div class="palette-mode-help">
            Gradually fades from this brightness to the next slot's brightness over the time block.
          </div>
        ` : nothing}
        <div class="hvac-edit-actions">
          ${this._isNewPreset ? html`<button class="danger" @click=${() => { this._cancelNewPreset(); }}>Cancel</button>` : nothing}
          <button class="secondary" @click=${() => { this._brightnessEditIndex = null; this._isNewPreset = false; }}>Done</button>
        </div>
      </div>
    `;
    }

    // ── Scene preset editing ──

    /** Append a default scene preset and open its edit form. */
    private _addScenePreset() {
        this._scenePresets = [
            ...this._scenePresets,
            { scene_id: "", name: "New Scene", color: "#7c4dff" },
        ];
        this._sceneEditIndex = this._scenePresets.length - 1;
        this._dirty = true;
    }

    private _updateScenePreset(index: number, patch: Partial<ScenePreset>) {
        const updated = [...this._scenePresets];
        updated[index] = { ...updated[index], ...patch };
        this._scenePresets = updated;
        this._dirty = true;
    }

    private async _requestDeleteScenePreset(index: number) {
        this._confirmDeleteSceneIndex = index;
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/scene_preset_usage",
                index,
            });
            this._confirmDeleteSceneUsage = result.schedules ?? [];
        } catch {
            this._confirmDeleteSceneUsage = [];
        }
    }

    private _doRemoveScenePreset(index: number) {
        this._confirmDeleteSceneIndex = null;
        const removedValue = index + 1;
        const newSlots: Record<string, number[]> = {};
        for (const [key, arr] of Object.entries(this._slots)) {
            newSlots[key] = arr.map((v) => {
                if (v === removedValue) return 0;
                if (v > removedValue) return v - 1;
                return v;
            });
        }
        this._slots = newSlots;
        this._scenePresets = this._scenePresets.filter((_, i) => i !== index);
        if (this._sceneEditIndex !== null) {
            if (this._sceneEditIndex === index) this._sceneEditIndex = null;
            else if (this._sceneEditIndex > index) this._sceneEditIndex--;
        }
        this._dirty = true;
    }

    private _renderSceneDeleteConfirm(index: number) {
        const preset = this._scenePresets[index];
        const label = preset.alias || preset.name;
        const localCount = this._presetSlotCount(index);
        const usage = this._confirmDeleteSceneUsage;
        const otherSchedules = usage.filter((s) => s.id !== this.schedule?.id);
        const usedHere = localCount > 0;
        let usageMsg;
        if (usedHere && otherSchedules.length > 0) {
            const names = otherSchedules.map((s) => `'${s.name}'`).join(", ");
            usageMsg = html`This preset is in use by this schedule and ${names} — affected slots will be cleared.`;
        } else if (usedHere) {
            usageMsg = html`This preset is used in <b>${localCount}</b> slot${localCount > 1 ? "s" : ""} in this schedule — they will be cleared.`;
        } else if (otherSchedules.length > 0) {
            const names = otherSchedules.map((s) => `'${s.name}'`).join(", ");
            usageMsg = html`This preset is in use by ${names} — affected slots will be cleared.`;
        } else {
            usageMsg = html`This preset is not used in any schedules.`;
        }
        return html`
      <div class="preset-confirm-overlay">
        <p>Delete scene preset <b>${label}</b>?</p>
        <p>${usageMsg}</p>
        <div class="confirm-actions">
          <button class="secondary" @click=${() => { this._confirmDeleteSceneIndex = null; }}>Cancel</button>
          <button class="danger" @click=${() => { this._doRemoveScenePreset(index); }}>Delete</button>
        </div>
      </div>
    `;
    }

    private _renderSceneEditForm(preset: ScenePreset, index: number) {
        return html`
      <div class="hvac-edit-form">
        <div class="form-group">
          <label>Scene Entity ID</label>
          <input
            type="text"
            .value=${preset.scene_id}
            placeholder="scene.my_scene"
            @input=${(e: InputEvent) => {
                this._updateScenePreset(index, { scene_id: (e.target as HTMLInputElement).value });
            }}
          />
        </div>
        <div class="form-group">
          <label>Name</label>
          <input
            type="text"
            .value=${preset.name}
            placeholder="Scene name"
            @input=${(e: InputEvent) => {
                this._updateScenePreset(index, { name: (e.target as HTMLInputElement).value });
            }}
          />
        </div>
        <div class="color-alias-row">
          <div class="form-group">
            <label>Color</label>
            <input
              type="color"
              .value=${preset.color}
              @input=${(e: InputEvent) => {
                this._updateScenePreset(index, { color: (e.target as HTMLInputElement).value });
            }}
            />
          </div>
          <div class="form-group alias-input">
            <label>Alias</label>
            <input
              type="text"
              .value=${preset.alias ?? ""}
              placeholder="e.g. Movie Night"
              @input=${(e: InputEvent) => {
                this._updateScenePreset(index, { alias: (e.target as HTMLInputElement).value || undefined });
            }}
            />
          </div>
          <div class="form-group icon-picker-group">
            <label>Icon</label>
            <icon-picker
              .value=${preset.icon ?? ""}
              @icon-changed=${(e: CustomEvent) => {
                this._updateScenePreset(index, { icon: e.detail.icon || undefined });
            }}
            ></icon-picker>
          </div>
        </div>
        <div class="hvac-edit-actions">
          ${this._isNewPreset ? html`<button class="danger" @click=${() => { this._cancelNewPreset(); }}>Cancel</button>` : nothing}
          <button class="secondary" @click=${() => { this._sceneEditIndex = null; this._isNewPreset = false; }}>Done</button>
        </div>
      </div>
    `;
    }

    // ── Palette entry editing ──

    /**
     * Short badge label for a palette entry's animation mode.
     * @param mode - Mode string.
     * @returns Single-letter badge or empty string for solid.
     */
    private _paletteModeBadge(mode: string): string {
        switch (mode) {
            case "crossfade": return "⇢";
            case "cycle": return "⟳";
            case "tv": return "📺";
            default: return "";
        }
    }

    /**
     * Tooltip for a palette entry showing mode and cycle parameters.
     * @param entry - Normalized palette entry object.
     * @returns Multi-line tooltip string.
     */
    private _paletteEntryTooltip(entry: PaletteEntryObject): string {
        const lines: string[] = [];
        if (entry.mode === "cycle" && entry.alias) lines.push(entry.alias);
        lines.push(entry.color);
        if (entry.mode !== "solid") lines.push(`Mode: ${entry.mode}`);
        if (entry.mode === "cycle" && entry.colors) {
            lines.push(`Colors: ${entry.colors.length}`);
            lines.push(`Transition: ${entry.transition ?? "snap"}`);
            lines.push(`Rate: ${entry.rate ?? 1}x per block`);
        }
        return lines.join("\n");
    }

    /** Render the delete confirmation overlay for a palette entry. */
    private _renderPaletteDeleteConfirm(index: number) {
        const norm = normalizePaletteEntry(this._palette[index]);
        const label = (norm.mode === "cycle" && norm.alias) ? norm.alias : norm.color;
        const localCount = this._paletteSlotCount(index);
        const usage = this._confirmDeletePaletteUsage;
        const otherSchedules = usage.filter((s) => s.id !== this.schedule?.id);
        const currentName = this.schedule?.name;
        const usedHere = localCount > 0;

        let usageMsg;
        if (usedHere && otherSchedules.length > 0) {
            const names = otherSchedules.map((s) => `'${s.name}'`).join(", ");
            usageMsg = html`This preset is in use by this schedule${currentName ? ` ('${currentName}')` : ""} and ${names} — affected slots will be cleared.`;
        } else if (usedHere) {
            usageMsg = html`This preset is used in <b>${localCount}</b> slot${localCount > 1 ? "s" : ""} in this schedule — they will be cleared.`;
        } else if (otherSchedules.length > 0) {
            const names = otherSchedules.map((s) => `'${s.name}'`).join(", ");
            usageMsg = html`This preset is in use by ${names} — affected slots will be cleared.`;
        } else {
            usageMsg = html`This preset is not used in any schedules.`;
        }

        return html`
      <div class="preset-confirm-overlay">
        <p>Delete color preset <b>${label}</b>?</p>
        <p>${usageMsg}</p>
        <div class="confirm-actions">
          <button class="secondary" @click=${() => { this._confirmDeletePaletteIndex = null; }}>Cancel</button>
          <button class="danger" @click=${() => { this._doRemovePaletteEntry(index); }}>Delete</button>
        </div>
      </div>
    `;
    }

    /**
     * Ask for confirmation before deleting a palette entry, showing usage info.
     * @param index - Zero-based palette index to delete.
     */
    private async _requestDeletePaletteEntry(index: number) {
        this._confirmDeletePaletteIndex = index;
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/color_preset_usage",
                index,
            });
            this._confirmDeletePaletteUsage = result.schedules ?? [];
        } catch {
            this._confirmDeletePaletteUsage = [];
        }
    }

    /**
     * Count how many slots reference a palette entry by index.
     * @param index - Zero-based palette index (slot value = index + 1).
     * @returns Total slot count across all days.
     */
    private _paletteSlotCount(index: number): number {
        const paletteValue = index + 1;
        let count = 0;
        for (const arr of Object.values(this._slots)) {
            for (const v of arr) {
                if (v === paletteValue) count++;
            }
        }
        return count;
    }

    /**
     * Remove a palette entry and rewrite slot references.
     * @param index - Zero-based palette index to remove.
     */
    private _doRemovePaletteEntry(index: number) {
        this._confirmDeletePaletteIndex = null;
        const removedValue = index + 1;
        const newSlots: Record<string, number[]> = {};
        for (const [key, arr] of Object.entries(this._slots)) {
            newSlots[key] = arr.map((v) => {
                if (v === removedValue) return 0;
                if (v > removedValue) return v - 1;
                return v;
            });
        }
        this._slots = newSlots;
        this._palette = this._palette.filter((_, i) => i !== index);
        if (this._paletteEditIndex !== null) {
            if (this._paletteEditIndex === index) this._paletteEditIndex = null;
            else if (this._paletteEditIndex > index) this._paletteEditIndex--;
        }
        this._dirty = true;
    }

    /**
     * Merge a partial update into a palette entry at the given index.
     * @param index - Zero-based palette index to update.
     * @param patch - Fields to merge into the normalized entry.
     */
    private _updatePaletteEntry(index: number, patch: Partial<PaletteEntryObject>) {
        const updated = [...this._palette];
        const norm = normalizePaletteEntry(updated[index]);
        updated[index] = { ...norm, ...patch };
        this._palette = updated;
        this._dirty = true;
    }

    /** Render the inline edit form for a palette entry. */
    private _renderPaletteEditForm(entry: PaletteEntryObject, index: number) {
        const maxRate = entry.colors && entry.colors.length >= 2
            ? Math.floor(900 / (entry.colors.length * 5))
            : 30;
        return html`
      <div class="palette-edit-form">
        <div class="palette-edit-row">
          <div class="form-group">
            <label>Color</label>
            <input
              type="color"
              .value=${entry.color}
              @input=${(e: InputEvent) => {
                this._updatePaletteEntry(index, { color: (e.target as HTMLInputElement).value });
            }}
            />
          </div>
          <div class="form-group" style="flex:1">
            <label>Mode</label>
            <select
              .value=${entry.mode}
              @change=${(e: Event) => {
                const mode = (e.target as HTMLSelectElement).value as PaletteEntryObject["mode"];
                const patch: Partial<PaletteEntryObject> = { mode };
                if (mode === "cycle" && (!entry.colors || entry.colors.length < 2)) {
                    patch.colors = [entry.color, "#888888"];
                    patch.transition = "snap";
                    patch.rate = 1;
                }
                this._updatePaletteEntry(index, patch);
            }}
            >
              <option value="solid">Solid</option>
              <option value="crossfade">Cross-fade</option>
              <option value="cycle">Cycle</option>
              <option value="tv">TV Mode</option>
            </select>
          </div>
        </div>

        ${entry.mode === "crossfade" ? html`
          <div class="palette-mode-help">
            Gradually fades from this color to the next slot's color over the 15-minute block.
          </div>
        ` : nothing}

        ${entry.mode === "tv" ? html`
          <div class="palette-mode-help">
            Semi-randomly cycles through TV-like colors to simulate light from a television.
          </div>
        ` : nothing}

        ${entry.mode === "cycle" ? html`
          <div class="cycle-config">
            <label>Cycle Colors</label>
            <div class="cycle-colors">
              ${(entry.colors ?? []).map((c, ci) => html`
                <div class="palette-entry">
                  <input
                    type="color"
                    .value=${c}
                    @input=${(e: InputEvent) => {
                    const newColors = [...(entry.colors ?? [])];
                    newColors[ci] = (e.target as HTMLInputElement).value;
                    this._updatePaletteEntry(index, { colors: newColors });
                }}
                  />
                  ${(entry.colors ?? []).length > 2 ? html`
                    <button class="palette-remove" @click=${() => {
                        const newColors = (entry.colors ?? []).filter((_, j) => j !== ci);
                        this._updatePaletteEntry(index, { colors: newColors });
                    }}>✕</button>
                  ` : nothing}
                </div>
              `)}
              ${(entry.colors ?? []).length < 10 ? html`
                <button class="palette-add" @click=${() => {
                        const newColors = [...(entry.colors ?? []), "#888888"];
                        this._updatePaletteEntry(index, { colors: newColors });
                    }}>+</button>
              ` : nothing}
            </div>
            <div class="cycle-options">
              <div class="form-group" style="flex:2">
                <label>Alias</label>
                <input
                  type="text"
                  .value=${entry.alias ?? ""}
                  placeholder="e.g. Christmas Lighting"
                  @input=${(e: InputEvent) => {
                    this._updatePaletteEntry(index, { alias: (e.target as HTMLInputElement).value || undefined });
                }}
                />
              </div>
              <div class="form-group">
                <label>Transition</label>
                <select
                  .value=${entry.transition ?? "snap"}
                  @change=${(e: Event) => {
                    this._updatePaletteEntry(index, {
                        transition: (e.target as HTMLSelectElement).value as "snap" | "fade",
                    });
                }}
                >
                  <option value="snap">Snap</option>
                  <option value="fade">Cross-fade</option>
                </select>
              </div>
              <div class="form-group">
                <label>Rate (cycles per block)</label>
                <input
                  type="number"
                  min="0.1"
                  max=${maxRate}
                  step="0.1"
                  .value=${String(entry.rate ?? 1)}
                  @input=${(e: InputEvent) => {
                    const val = parseFloat((e.target as HTMLInputElement).value);
                    if (!isNaN(val) && val > 0) {
                        this._updatePaletteEntry(index, { rate: val });
                    }
                }}
                />
              </div>
            </div>
          </div>
        ` : nothing}

        <div class="hvac-edit-actions">
          ${this._isNewPreset ? html`<button class="danger" @click=${() => { this._cancelNewPreset(); }}>Cancel</button>` : nothing}
          <button class="secondary" @click=${() => { this._paletteEditIndex = null; this._isNewPreset = false; }}>Done</button>
        </div>
      </div>
    `;
    }

    /** Re-derive custom cadence slot keys from the date range. */
    private _rebuildCustomSlots() {
        if (!this._startDate || !this._endDate) return;
        const dates = dateRange(this._startDate, this._endDate);
        const newSlots: Record<string, number[]> = {};
        for (const d of dates) {
            newSlots[d] = this._slots[d] ?? new Array(SLOTS_PER_DAY).fill(0);
        }
        this._slots = newSlots;
    }

    /** Validate and save the schedule to the backend. */
    private async _onSave() {
        if (!this._name.trim()) {
            this._showToast("Name is required", "error");
            return;
        }
        const entityIds = this._entityIds;
        if (entityIds.length === 0) {
            this._showToast("At least one entity ID is required", "error");
            return;
        }

        this._saving = true;
        try {
            // Save HVAC presets globally before saving the schedule
            if (this._slotType === "hvac") {
                await this.hass.connection.sendMessagePromise({
                    type: "oncue_scheduler/save_hvac_presets",
                    hvac_presets: this._hvacPresets,
                });
            }

            // Save color presets globally before saving the schedule
            if (this._slotType === "color") {
                await this.hass.connection.sendMessagePromise({
                    type: "oncue_scheduler/save_color_presets",
                    color_presets: this._palette,
                });
            }

            // Save brightness presets globally before saving the schedule
            if (this._slotType === "brightness") {
                await this.hass.connection.sendMessagePromise({
                    type: "oncue_scheduler/save_brightness_presets",
                    brightness_presets: this._brightnessPresets,
                });
            }

            // Save scene presets globally before saving the schedule
            if (this._slotType === "scene") {
                await this.hass.connection.sendMessagePromise({
                    type: "oncue_scheduler/save_scene_presets",
                    scene_presets: this._scenePresets,
                });
            }

            const schedule: Record<string, unknown> = {
                name: this._name.trim(),
                entity_ids: entityIds,
                cadence: this._cadence,
                repeat: this._repeat,
                start_date: this._cadence === "custom" ? this._startDate || null : null,
                end_date: this._cadence === "custom" ? this._endDate || null : null,
                active: this._active,
                slot_minutes: 15,
                slot_type: this._slotType,
                slots: this._slots,
                revert_delay: this._revertDelay,
            };
            if (this.schedule?.id) {
                schedule.id = this.schedule.id;
            }

            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/save",
                schedule,
            });

            if (result.conflicts && result.conflicts.length > 0) {
                this._conflicts = result.conflicts;
            } else {
                this._conflicts = [];
            }

            if (result.warnings?.length > 0) {
                this._showToast(result.warnings[0], "warning");
            }

            this._dirty = false;
            this.dispatchEvent(
                new CustomEvent("schedule-saved", {
                    detail: { id: result.schedule?.id ?? this.schedule?.id },
                    bubbles: true,
                    composed: true,
                })
            );
        } catch (err) {
            console.error("Failed to save schedule:", err);
            this._showToast("Failed to save schedule", "error");
        } finally {
            this._saving = false;
        }
    }

    /** Discard changes and fire cancel event. */
    private _onCancel() {
        if (this._dirty) {
            this._confirmDiscard = true;
            return;
        }
        this.dispatchEvent(
            new CustomEvent("editor-cancel", { bubbles: true, composed: true })
        );
    }

    /** Toggle the schedule's active/paused state. */
    private _toggleActive() {
        this._active = !this._active;
        this._dirty = true;
    }

    /** Fetch override states and scheduled states for the current schedule. */
    private async _loadOverrides() {
        if (!this.schedule?.id) {
            this._overrides = {};
            this._scheduledStates = {};
            this._unavailableEntities = [];
            return;
        }
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/get_overrides",
                schedule_id: this.schedule.id,
            });
            this._overrides = result.overrides ?? {};
            this._scheduledStates = result.scheduled_states ?? {};
            this._unavailableEntities = result.unavailable_entities ?? [];
        } catch {
            this._overrides = {};
            this._scheduledStates = {};
            this._unavailableEntities = [];
        }
    }

    /** Apply an entity override via WebSocket. */
    private async _onOverrideSet(e: CustomEvent) {
        if (!this.schedule?.id) return;
        const { entityId, state } = e.detail;
        try {
            await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/set_override",
                schedule_id: this.schedule.id,
                entity_id: entityId,
                state,
            });
            this._overrides = { ...this._overrides, [entityId]: state };
        } catch (err) {
            console.error("Failed to set override:", err);
            this._showToast("Failed to set override", "error");
        }
    }

    /** Clear an entity override via WebSocket. */
    private async _onOverrideClear(e: CustomEvent) {
        if (!this.schedule?.id) return;
        const { entityId } = e.detail;
        try {
            await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/clear_override",
                schedule_id: this.schedule.id,
                entity_id: entityId,
            });
            const updated = { ...this._overrides };
            delete updated[entityId];
            this._overrides = updated;
        } catch (err) {
            console.error("Failed to clear override:", err);
            this._showToast("Failed to clear override", "error");
        }
    }

    /** Discard unsaved changes and close the editor. */
    private _doDiscard() {
        this._confirmDiscard = false;
        this._dirty = false;
        this.dispatchEvent(
            new CustomEvent("editor-cancel", { bubbles: true, composed: true })
        );
    }

    /** Show the delete confirmation dialog. */
    private _onDelete() {
        if (!this.schedule?.id) return;
        this._confirmDelete = true;
    }

    /** Delete the schedule after user confirmation. */
    private async _doDelete() {
        if (!this.schedule?.id) return;
        this._confirmDelete = false;
        this._deleting = true;

        try {
            await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/delete",
                schedule_id: this.schedule.id,
            });
            this.dispatchEvent(
                new CustomEvent("schedule-deleted", { bubbles: true, composed: true })
            );
        } catch (err) {
            console.error("Failed to delete schedule:", err);
            this._showToast("Failed to delete schedule", "error");
        } finally {
            this._deleting = false;
        }
    }
}
