import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles } from "./styles";
import type { Schedule, Conflict, HomeAssistant } from "./types";
import "./schedule-grid";
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

    @state() private _name = "";
    @state() private _entityIds = "";
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
      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-top: 20px;
      }
      .checkbox-row input[type="checkbox"] {
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
    `,
    ];

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has("schedule")) {
            this._loadFromSchedule();
            this._confirmDelete = false;
            this._confirmDiscard = false;
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
            this._entityIds = this.schedule.entity_ids.join("\n");
            this._cadence = this.schedule.cadence;
            this._repeat = this.schedule.repeat;
            this._startDate = this.schedule.start_date ?? "";
            this._endDate = this.schedule.end_date ?? "";
            this._slots = JSON.parse(JSON.stringify(this.schedule.slots));
        } else {
            this._name = "";
            this._entityIds = "";
            this._cadence = "daily";
            this._repeat = true;
            this._startDate = "";
            this._endDate = "";
            this._slots = defaultSlots("daily");
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
        <h2>${this.isNew ? "New Schedule" : "Edit Schedule"}</h2>
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

        <div class="form-group full-width">
          <label for="entities">Entity IDs (one per line)</label>
          <textarea
            id="entities"
            .value=${this._entityIds}
            @input=${(e: InputEvent) => {
                this._entityIds = (e.target as HTMLTextAreaElement).value;
                this._dirty = true;
            }}
            placeholder="switch.living_room&#10;light.bedroom"
          ></textarea>
        </div>

        <div class="form-group">
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

        <div class="form-group">
          <label>Slot Type</label>
          <input type="text" value="On/Off" disabled />
        </div>

        ${this._cadence === "custom"
                ? html`
              <div class="checkbox-row">
                <input
                  type="checkbox"
                  id="repeat"
                  .checked=${this._repeat}
                  @change=${(e: Event) => {
                        this._repeat = (e.target as HTMLInputElement).checked;
                        this._dirty = true;
                    }}
                />
                <label for="repeat" style="margin:0">Repeat</label>
              </div>
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
            `
                : nothing}
      </div>

      <div class="grid-section">
        <h3>Time Slots (15-minute intervals)</h3>
        <schedule-grid
          .cadence=${this._cadence}
          .slots=${this._slots}
          .customDates=${customDates}
          @slots-changed=${(e: CustomEvent) => {
                this._slots = e.detail.slots;
                this._dirty = true;
            }}
        ></schedule-grid>
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
        const entityIds = this._entityIds
            .split(/[\n,]+/)
            .map((s) => s.trim())
            .filter(Boolean);
        if (entityIds.length === 0) {
            this._showToast("At least one entity ID is required", "error");
            return;
        }

        this._saving = true;
        try {
            const schedule: Record<string, unknown> = {
                name: this._name.trim(),
                entity_ids: entityIds,
                cadence: this._cadence,
                repeat: this._cadence === "custom" ? this._repeat : true,
                start_date: this._cadence === "custom" ? this._startDate || null : null,
                end_date: this._cadence === "custom" ? this._endDate || null : null,
                active: this.schedule?.active ?? true,
                slot_minutes: 15,
                slot_type: "on_off",
                slots: this._slots,
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
