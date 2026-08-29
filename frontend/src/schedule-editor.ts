import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles } from "./styles";
import type { Schedule, Conflict, HomeAssistant, HvacPreset, PaletteEntry, PaletteEntryObject } from "./types";
import { normalizePaletteEntry, paletteEntryDisplayColor, paletteEntryBackground } from "./types";
import "./schedule-grid";
import "./entity-picker";
import "./icon-picker";
import "./mdi-icon";
import "./toast-notification";
import type { ToastNotification } from "./toast-notification";

const SLOTS_PER_DAY = 96;
const DAY_KEYS_WEEKLY = ["0", "1", "2", "3", "4", "5", "6"];

function defaultSlots(cadence: string): Record<string, number[]> {
    if (cadence === "daily") return { "0": new Array(SLOTS_PER_DAY).fill(0) };
    if (cadence === "weekly") {
        const s: Record<string, number[]> = {};
        for (const k of DAY_KEYS_WEEKLY) s[k] = new Array(SLOTS_PER_DAY).fill(0);
        return s;
    }
    return {};
}

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

@customElement("schedule-editor")
export class ScheduleEditor extends LitElement {
    @property({ attribute: false }) hass!: HomeAssistant;
    @property({ attribute: false }) schedule: Schedule | null = null;
    @property({ type: Boolean }) isNew = false;
    @property({ attribute: false }) globalHvacPresets: HvacPreset[] = [];
    @property({ attribute: false }) globalColorPresets: PaletteEntry[] = [];

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
      :host {
        display: block;
        height: 100%;
        overflow-y: auto;
        padding: 16px;
        box-sizing: border-box;
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
      .never-label input[type="checkbox"] {
        width: auto;
      }
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
      .cadence-row {
        display: flex;
        align-items: flex-end;
        gap: 8px;
      }
      .cadence-row select {
        flex: 1;
      }
      .cadence-row .repeat-check {
        display: flex;
        align-items: center;
        gap: 4px;
        padding-bottom: 8px;
        white-space: nowrap;
        font-size: 13px;
      }
      .cadence-row .repeat-check input[type="checkbox"] {
        width: auto;
      }
      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-top: 20px;
      }
      .checkbox-row input[type="checkbox"] {
        width: auto;
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
      .date-range-row .repeat-check input[type="checkbox"] {
        width: auto;
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
      .editor-wrapper {
        position: relative;
      }
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
      .palette-editor {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .palette-entry {
        position: relative;
        display: inline-flex;
        align-items: center;
      }
      .palette-entry input[type="color"] {
        width: 32px;
        height: 32px;
        padding: 0;
        border: 1px solid var(--ss-border);
        border-radius: 4px;
        cursor: pointer;
        background: none;
      }
      .palette-remove {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: none;
        background: var(--error-color, #db4437);
        color: #fff;
        font-size: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
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
      .palette-entry-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: 36px;
        height: 36px;
        border-radius: 6px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.15s, box-shadow 0.15s;
        position: relative;
        justify-content: center;
        box-sizing: border-box;
      }
      .palette-entry-chip:hover {
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
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
        border-radius: 50%;
        border: none;
        background: var(--error-color, #db4437);
        color: #fff;
        font-size: 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
      }
      .palette-edit-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border: 1px solid var(--ss-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
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
        padding: 0;
        border: 1px solid var(--ss-border);
        border-radius: 4px;
        cursor: pointer;
        background: none;
      }
      .palette-mode-help {
        font-size: 12px;
        color: var(--secondary-text-color, #727272);
        padding: 4px 0;
      }
      .cycle-config {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .cycle-colors {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
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
      .hvac-presets {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .hvac-preset-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .hvac-preset-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 12px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.15s, box-shadow 0.15s;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        position: relative;
      }
      .hvac-preset-chip:hover {
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      }
      .hvac-preset-chip .chip-icon {
        --mdi-icon-size: 16px;
        flex-shrink: 0;
      }
      .hvac-preset-chip .chip-remove {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: none;
        background: rgba(0,0,0,0.3);
        color: #fff;
        font-size: 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
        margin-left: 2px;
      }
      .hvac-preset-chip .chip-remove:hover {
        background: var(--error-color, #db4437);
      }
      .preset-confirm-overlay {
        padding: 12px;
        border: 1px solid var(--ss-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
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
      .hvac-edit-form {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
        padding: 12px;
        border: 1px solid var(--ss-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
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
        padding: 0;
        border: 1px solid var(--ss-border);
        border-radius: 4px;
        cursor: pointer;
        background: none;
        flex-shrink: 0;
      }
      .hvac-edit-form .color-alias-row .alias-input {
        flex: 1;
      }
      .hvac-edit-form .icon-picker-group {
        flex: 1;
        min-width: 160px;
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
        }
    }

    private get _toast(): ToastNotification | null {
        return this.renderRoot.querySelector("toast-notification");
    }

    private _showToast(message: string, type: "info" | "warning" | "error" = "info") {
        this._toast?.show(message, type);
    }

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
          <button class="primary" ?disabled=${busy} @click=${this._onSave}>
            ${this._saving ? "Saving..." : "Save"}
          </button>
        </div>
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

        <div class="form-group">
          <label for="cadence">Cadence</label>
          <div class="cadence-row">
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
          </div>
        </div>

        <div class="form-group">
          <label>Revert external changes after</label>
          <div class="revert-row">
            <input
              type="number"
              min="0"
              max="59"
              style="width: 60px"
              .value=${this._revertDelay !== null ? String(Math.floor(this._revertDelay / 60)) : "0"}
              ?disabled=${this._revertDelay === null}
              @input=${(e: InputEvent) => {
                const mins = parseInt((e.target as HTMLInputElement).value) || 0;
                const secs = (this._revertDelay ?? 0) % 60;
                this._revertDelay = mins * 60 + secs;
                this._dirty = true;
            }}
            />
            <span>min</span>
            <input
              type="number"
              min="0"
              max="59"
              style="width: 60px"
              .value=${this._revertDelay !== null ? String((this._revertDelay) % 60) : "0"}
              ?disabled=${this._revertDelay === null}
              @input=${(e: InputEvent) => {
                const secs = parseInt((e.target as HTMLInputElement).value) || 0;
                const mins = Math.floor((this._revertDelay ?? 0) / 60);
                this._revertDelay = mins * 60 + secs;
                this._dirty = true;
            }}
            />
            <span>sec</span>
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

        <div class="form-group">
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
            <option value="color">Color</option>
            <option value="hvac">HVAC</option>
          </select>
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

        ${this._slotType === "color" ? html`
          <div class="form-group full-width">
            <label>Color Palette</label>
            <div class="palette-editor">
              ${this._palette.map((entry, i) => {
                    const norm = normalizePaletteEntry(entry);
                    return html`
                <div class="palette-entry-chip"
                     style="background: ${paletteEntryBackground(norm)}"
                     title="${this._paletteEntryTooltip(norm)}"
                     @click=${() => { this._paletteEditIndex = i; }}>
                  <span class="palette-mode-label">${this._paletteModeBadge(norm.mode)}</span>
                  ${this._palette.length > 1 ? html`
                    <button class="chip-remove" @click=${(e: Event) => {
                                e.stopPropagation();
                                this._requestDeletePaletteEntry(i);
                            }}>✕</button>
                  ` : nothing}
                </div>
              `;
                })}
              ${this._palette.length < 10 ? html`
                <button class="palette-add" @click=${() => {
                        this._palette = [...this._palette, "#888888"];
                        this._paletteEditIndex = this._palette.length - 1;
                        this._dirty = true;
                    }}>+</button>
              ` : nothing}
            </div>
            ${this._confirmDeletePaletteIndex !== null && this._confirmDeletePaletteIndex < this._palette.length
                    ? this._renderPaletteDeleteConfirm(this._confirmDeletePaletteIndex)
                    : nothing}
            ${this._paletteEditIndex !== null && this._paletteEditIndex < this._palette.length
                    ? this._renderPaletteEditForm(
                        normalizePaletteEntry(this._palette[this._paletteEditIndex]),
                        this._paletteEditIndex,
                    )
                    : nothing}
          </div>
        ` : nothing}

        ${this._slotType === "hvac" ? html`
          <div class="form-group full-width">
            <label>HVAC Presets</label>
            <div class="hvac-presets">
              <div class="hvac-preset-list">
                ${this._hvacPresets.map((preset, i) => html`
                  <div
                    class="hvac-preset-chip"
                    style="background: ${preset.color}"
                    title="${this._hvacPresetTooltip(preset)}"
                    @click=${() => { this._hvacEditIndex = i; }}
                  >
                    ${preset.icon ? html`<mdi-icon class="chip-icon" .icon=${preset.icon}></mdi-icon>` : nothing}
                    ${preset.alias || this._hvacPresetLabel(preset)}
                    ${this._hvacPresets.length > 1 ? html`
                      <button class="chip-remove" @click=${(e: Event) => {
                                e.stopPropagation();
                                this._requestDeletePreset(i);
                            }}>✕</button>
                    ` : nothing}
                  </div>
                `)}
                ${this._hvacPresets.length < 20 ? html`
                  <button class="palette-add" @click=${this._addHvacPreset}>+</button>
                ` : nothing}
              </div>
              ${this._confirmDeletePresetIndex !== null && this._confirmDeletePresetIndex < this._hvacPresets.length
                    ? this._renderPresetDeleteConfirm(this._confirmDeletePresetIndex)
                    : nothing}
              ${this._hvacEditIndex !== null && this._hvacEditIndex < this._hvacPresets.length
                    ? this._renderHvacEditForm(this._hvacPresets[this._hvacEditIndex], this._hvacEditIndex)
                    : nothing}
            </div>
          </div>
        ` : nothing}
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
          @slots-changed=${(e: CustomEvent) => {
                this._slots = e.detail.slots;
                this._dirty = true;
            }}
        ></schedule-grid>
      </div>
      </div>
    `;
    }

    private _hvacPresetLabel(preset: HvacPreset): string {
        const parts: string[] = [];
        if (preset.temperature !== null) parts.push(`${preset.temperature}°`);
        if (preset.hvac_mode) parts.push(preset.hvac_mode);
        if (preset.fan_mode) parts.push(preset.fan_mode);
        return parts.join(" | ") || "Preset";
    }

    private _hvacPresetTooltip(preset: HvacPreset): string {
        const lines: string[] = [];
        if (preset.alias) lines.push(preset.alias);
        if (preset.temperature !== null) lines.push(`Temperature: ${preset.temperature}°C`);
        if (preset.hvac_mode) lines.push(`Mode: ${preset.hvac_mode}`);
        if (preset.fan_mode) lines.push(`Fan: ${preset.fan_mode}`);
        return lines.join("\n");
    }

    private _addHvacPreset() {
        this._hvacPresets = [
            ...this._hvacPresets,
            { temperature: 22, hvac_mode: "cool", fan_mode: "auto", color: "#90caf9" },
        ];
        this._hvacEditIndex = this._hvacPresets.length - 1;
        this._dirty = true;
    }

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

    private async _requestDeletePreset(index: number) {
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/hvac_preset_usage",
                index,
            });
            this._confirmDeletePresetUsage = result.schedules ?? [];
        } catch {
            this._confirmDeletePresetUsage = [];
        }
        this._confirmDeletePresetIndex = index;
    }

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

    private _updateHvacPreset(index: number, patch: Partial<HvacPreset>) {
        const updated = [...this._hvacPresets];
        updated[index] = { ...updated[index], ...patch };
        this._hvacPresets = updated;
        this._dirty = true;
    }

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
          <button class="secondary" @click=${() => { this._hvacEditIndex = null; }}>Done</button>
        </div>
      </div>
    `;
    }

    // ── Palette entry editing ──

    private _paletteModeBadge(mode: string): string {
        switch (mode) {
            case "crossfade": return "⇢";
            case "cycle": return "⟳";
            case "tv": return "📺";
            default: return "";
        }
    }

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

    private async _requestDeletePaletteEntry(index: number) {
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/color_preset_usage",
                index,
            });
            this._confirmDeletePaletteUsage = result.schedules ?? [];
        } catch {
            this._confirmDeletePaletteUsage = [];
        }
        this._confirmDeletePaletteIndex = index;
    }

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

    private _updatePaletteEntry(index: number, patch: Partial<PaletteEntryObject>) {
        const updated = [...this._palette];
        const norm = normalizePaletteEntry(updated[index]);
        updated[index] = { ...norm, ...patch };
        this._palette = updated;
        this._dirty = true;
    }

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
          <button class="secondary" @click=${() => { this._paletteEditIndex = null; }}>Done</button>
        </div>
      </div>
    `;
    }

    private _rebuildCustomSlots() {
        if (!this._startDate || !this._endDate) return;
        const dates = dateRange(this._startDate, this._endDate);
        const newSlots: Record<string, number[]> = {};
        for (const d of dates) {
            newSlots[d] = this._slots[d] ?? new Array(SLOTS_PER_DAY).fill(0);
        }
        this._slots = newSlots;
    }

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

    private _onCancel() {
        if (this._dirty) {
            this._confirmDiscard = true;
            return;
        }
        this.dispatchEvent(
            new CustomEvent("editor-cancel", { bubbles: true, composed: true })
        );
    }

    private _toggleActive() {
        this._active = !this._active;
        this._dirty = true;
    }

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

    private _doDiscard() {
        this._confirmDiscard = false;
        this._dirty = false;
        this.dispatchEvent(
            new CustomEvent("editor-cancel", { bubbles: true, composed: true })
        );
    }

    private _onDelete() {
        if (!this.schedule?.id) return;
        this._confirmDelete = true;
    }

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
