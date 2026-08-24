import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles } from "./styles";
import type { Schedule, ScheduleSummary, HomeAssistant } from "./types";
import "./schedule-list";
import "./schedule-editor";

@customElement("oncue-scheduler-panel")
export class OnCuePanel extends LitElement {
    @property({ attribute: false }) hass!: HomeAssistant;
    @property({ attribute: false }) panel: any;
    @property({ type: Boolean }) narrow = false;

    @state() private _schedules: ScheduleSummary[] = [];
    @state() private _selectedSchedule: Schedule | null = null;
    @state() private _isNew = false;
    @state() private _loading = true;
    @state() private _sidebarOpen = true;

    static styles = [
        sharedStyles,
        css`
      :host {
        display: block;
        height: calc(100vh - var(--header-height, 56px));
      }
      .layout {
        display: flex;
        height: 100%;
      }
      .sidebar {
        width: var(--ss-sidebar-width);
        border-right: 1px solid var(--ss-border);
        background: var(--ss-bg);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: width 0.2s, opacity 0.2s;
      }
      .sidebar.collapsed {
        width: 0;
        opacity: 0;
        pointer-events: none;
      }
      .main {
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }
      .toggle-sidebar {
        position: fixed;
        bottom: 16px;
        left: 16px;
        z-index: 10;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        background: var(--ss-primary);
        color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        padding: 0;
      }
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--secondary-text-color, #727272);
        font-size: 16px;
      }

      @media (max-width: 768px) {
        .sidebar {
          position: fixed;
          top: var(--header-height, 56px);
          left: 0;
          bottom: 0;
          z-index: 5;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
        }
      }
    `,
    ];

    connectedCallback() {
        super.connectedCallback();
        this._loadSchedules();
    }

    render() {
        if (this._loading) {
            return html`<div class="loading">Loading schedules...</div>`;
        }

        return html`
      <div class="layout">
        <div class="sidebar ${this._sidebarOpen ? "" : "collapsed"}">
          <schedule-list
            .schedules=${this._schedules}
            .selectedId=${this._selectedSchedule?.id ?? null}
            @schedule-selected=${this._onScheduleSelected}
            @schedule-add=${this._onAddSchedule}
            @schedule-toggle-active=${this._onToggleActive}
          ></schedule-list>
        </div>
        <div class="main">
          <schedule-editor
            .hass=${this.hass}
            .schedule=${this._selectedSchedule}
            .isNew=${this._isNew}
            @schedule-saved=${this._onScheduleSaved}
            @schedule-deleted=${this._onScheduleDeleted}
            @editor-cancel=${this._onEditorCancel}
          ></schedule-editor>
        </div>
      </div>
      ${this.narrow
                ? html`
            <button class="toggle-sidebar" @click=${this._toggleSidebar}>
              ${this._sidebarOpen ? "✕" : "☰"}
            </button>
          `
                : nothing}
    `;
    }

    private async _loadSchedules() {
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/list",
            });
            this._schedules = result.schedules ?? [];
        } catch (err) {
            console.error("Failed to load schedules:", err);
            this._schedules = [];
        } finally {
            this._loading = false;
        }
    }

    private async _onScheduleSelected(e: CustomEvent) {
        const id = e.detail.id;
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/get",
                schedule_id: id,
            });
            this._selectedSchedule = result.schedule ?? null;
            this._isNew = false;
        } catch (err) {
            console.error("Failed to load schedule:", err);
        }
        if (this.narrow) this._sidebarOpen = false;
    }

    private _onAddSchedule() {
        this._selectedSchedule = null;
        this._isNew = true;
        if (this.narrow) this._sidebarOpen = false;
    }

    private async _onScheduleSaved(e: CustomEvent) {
        await this._loadSchedules();
        // Select the saved schedule
        const id = e.detail?.id;
        if (id) {
            try {
                const result = await this.hass.connection.sendMessagePromise({
                    type: "oncue_scheduler/get",
                    schedule_id: id,
                });
                this._selectedSchedule = result.schedule ?? null;
                this._isNew = false;
            } catch {
                // ignore
            }
        }
    }

    private async _onScheduleDeleted() {
        this._selectedSchedule = null;
        this._isNew = false;
        await this._loadSchedules();
    }

    private _onEditorCancel() {
        if (this._isNew) {
            this._isNew = false;
            this._selectedSchedule = null;
        }
    }

    private _toggleSidebar() {
        this._sidebarOpen = !this._sidebarOpen;
    }

    private async _onToggleActive(e: CustomEvent) {
        const { id, active } = e.detail;
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/get",
                schedule_id: id,
            });
            const schedule = result.schedule;
            if (!schedule) return;
            schedule.active = active;
            await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/save",
                schedule,
            });
            await this._loadSchedules();
            if (this._selectedSchedule?.id === id) {
                this._selectedSchedule = { ...this._selectedSchedule, active };
            }
        } catch (err) {
            console.error("Failed to toggle schedule active state:", err);
        }
    }
}
