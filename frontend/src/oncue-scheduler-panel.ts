import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles } from "./styles";
import type { Schedule, ScheduleSummary, HomeAssistant, HvacPreset, PaletteEntry, BrightnessPreset, ScenePreset } from "./types";
import "./schedule-list";
import "./schedule-editor";
import "./mdi-icon";

/** Top-level panel component — sidebar schedule list + main editor area. */
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
    @state() private _hvacPresets: HvacPreset[] = [];
    @state() private _colorPresets: PaletteEntry[] = [];
    @state() private _brightnessPresets: BrightnessPreset[] = [];
    @state() private _scenePresets: ScenePreset[] = [];

    static styles = [
        sharedStyles,
        css`
      :host {
        display: flex;
        flex-direction: column;
        height: calc(100vh - var(--header-height, 56px));
      }
      .panel-toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 56px;
        flex-shrink: 0;
        padding: 0 4px;
        box-sizing: border-box;
        background: var(--app-header-background-color, var(--ss-primary));
        color: var(--app-header-text-color, #fff);
      }
      .panel-toolbar .title {
        flex: 1;
        min-width: 0;
        font-size: 20px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .toolbar-button {
        background: none;
        color: inherit;
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .layout {
        position: relative;
        display: flex;
        flex: 1;
        min-height: 0;
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
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        color: var(--secondary-text-color, #727272);
        font-size: 16px;
      }

      @media (max-width: 768px) {
        .sidebar {
          position: absolute;
          top: 0;
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
        this._loadHvacPresets();
        this._loadColorPresets();
        this._loadBrightnessPresets();
        this._loadScenePresets();
    }

    render() {
        if (this._loading) {
            return html`
        ${this._renderToolbar()}
        <div class="loading">Loading schedules...</div>
      `;
        }

        return html`
      ${this._renderToolbar()}
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
            .globalHvacPresets=${this._hvacPresets}
            .globalColorPresets=${this._colorPresets}
            .globalBrightnessPresets=${this._brightnessPresets}
            .globalScenePresets=${this._scenePresets}
            @schedule-saved=${this._onScheduleSaved}
            @schedule-deleted=${this._onScheduleDeleted}
            @editor-cancel=${this._onEditorCancel}
            @hvac-presets-changed=${this._onHvacPresetsChanged}
            @color-presets-changed=${this._onColorPresetsChanged}
            @brightness-presets-changed=${this._onBrightnessPresetsChanged}
            @scene-presets-changed=${this._onScenePresetsChanged}
          ></schedule-editor>
        </div>
      </div>
    `;
    }

    /** Ask the Home Assistant frontend to open its main sidebar. */
    private _openHassMenu() {
        this.dispatchEvent(
            new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }),
        );
    }

    /**
     * Toolbar shown on narrow screens, where the Home Assistant sidebar is
     * hidden and the panel would otherwise have no way back out.
     */
    private _renderToolbar() {
        if (!this.narrow) return nothing;
        return html`
      <div class="panel-toolbar">
        <button
          class="toolbar-button"
          title="Home Assistant menu"
          aria-label="Open Home Assistant menu"
          @click=${this._openHassMenu}
        >
          <mdi-icon icon="mdi:menu"></mdi-icon>
        </button>
        <div class="title">OnCue Scheduler</div>
        <button
          class="toolbar-button"
          title="Schedules"
          aria-label=${this._sidebarOpen ? "Hide schedule list" : "Show schedule list"}
          @click=${this._toggleSidebar}
        >
          <mdi-icon icon=${this._sidebarOpen ? "mdi:close" : "mdi:format-list-bulleted"}></mdi-icon>
        </button>
      </div>
    `;
    }

    /** Fetch all schedule summaries from the backend. */
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

    /** Fetch global HVAC presets from the backend. */
    private async _loadHvacPresets() {
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/get_hvac_presets",
            });
            this._hvacPresets = result.hvac_presets ?? [];
        } catch (err) {
            console.error("Failed to load HVAC presets:", err);
            this._hvacPresets = [];
        }
    }

    /** Fetch global color presets from the backend. */
    private async _loadColorPresets() {
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/get_color_presets",
            });
            this._colorPresets = result.color_presets ?? [];
        } catch (err) {
            console.error("Failed to load color presets:", err);
            this._colorPresets = [];
        }
    }

    /** Load full schedule data when a list item is selected. */
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

    /** Create a new blank schedule and open the editor. */
    private _onAddSchedule() {
        this._selectedSchedule = null;
        this._isNew = true;
        if (this.narrow) this._sidebarOpen = false;
    }

    /** Refresh lists and re-select the schedule after a save. */
    private async _onScheduleSaved(e: CustomEvent) {
        await this._loadSchedules();
        await this._loadHvacPresets();
        await this._loadColorPresets();
        await this._loadBrightnessPresets();
        await this._loadScenePresets();
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

    /** Clear selection and refresh the schedule list after a deletion. */
    private async _onScheduleDeleted() {
        this._selectedSchedule = null;
        this._isNew = false;
        await this._loadSchedules();
    }

    /** Discard a new unsaved schedule when the editor cancels. */
    private _onEditorCancel() {
        if (this._isNew) {
            this._isNew = false;
            this._selectedSchedule = null;
        }
    }

    /** Toggle the sidebar visibility on narrow screens. */
    private _toggleSidebar() {
        this._sidebarOpen = !this._sidebarOpen;
    }

    /** Toggle a schedule's active state via save, then refresh. */
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
            if (this._selectedSchedule && this._selectedSchedule.id === id) {
                this._selectedSchedule = { ...this._selectedSchedule, active };
            }
        } catch (err) {
            console.error("Failed to toggle schedule active state:", err);
        }
    }

    /** Reload HVAC presets after a child component modifies them. */
    private async _onHvacPresetsChanged() {
        await this._loadHvacPresets();
    }

    /** Reload color presets after a child component modifies them. */
    private async _onColorPresetsChanged() {
        await this._loadColorPresets();
    }

    /** Fetch global brightness presets from the backend. */
    private async _loadBrightnessPresets() {
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/get_brightness_presets",
            });
            this._brightnessPresets = result.brightness_presets ?? [];
        } catch (err) {
            console.error("Failed to load brightness presets:", err);
            this._brightnessPresets = [];
        }
    }

    /** Fetch global scene presets from the backend. */
    private async _loadScenePresets() {
        try {
            const result = await this.hass.connection.sendMessagePromise({
                type: "oncue_scheduler/get_scene_presets",
            });
            this._scenePresets = result.scene_presets ?? [];
        } catch (err) {
            console.error("Failed to load scene presets:", err);
            this._scenePresets = [];
        }
    }

    /** Reload brightness presets after a child component modifies them. */
    private async _onBrightnessPresetsChanged() {
        await this._loadBrightnessPresets();
    }

    /** Reload scene presets after a child component modifies them. */
    private async _onScenePresetsChanged() {
        await this._loadScenePresets();
    }
}
