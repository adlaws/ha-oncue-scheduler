import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles } from "./styles";
import type { HomeAssistant } from "./types";
import "./mdi-icon";

const SUPPORTED_DOMAINS = ["switch", "light", "fan", "input_boolean", "climate"];
const COLOR_MODES = ["rgb", "rgbw", "rgbww", "hs", "xy"];

// SVG path data for entity domain icons (Material Design Icons)
const DOMAIN_ICON_PATHS: Record<string, { on: string; off: string }> = {
    switch: {
        on: "M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5m0 8a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z",
        off: "M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5M7 15a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z",
    },
    light: {
        on: "M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1h4m-3-5h2l.5-4h-3l.5 4Z",
        off: "M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1h4M12 8a4 4 0 0 0-4 4c0 1.54.83 2.87 2.07 3.6l.43.25V18h3v-2.15l.43-.25A4.02 4.02 0 0 0 16 12a4 4 0 0 0-4-4Z",
    },
    fan: {
        on: "M12 11a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m4.22-.99c-.67.49-1.47.86-2.23 1.12.03.31-.02.63-.14.93 1.59 1.08 2.75 2.59 2.75 3.2 0 .43-.55.86-1.5 1.18-.96.32-2.2.5-3.5.56-.45-.6-1.07-1.08-1.74-1.42.03-.77.13-1.51.31-2.2-.52-.36-.9-.87-1.1-1.45A9.82 9.82 0 0 1 5 12.83c0-.72.53-1.35 1.42-1.82.89-.47 2.05-.77 3.34-.89.4.55.94.97 1.56 1.2.44-.66.97-1.26 1.59-1.77-.29-.47-.42-1.01-.39-1.55A9.73 9.73 0 0 1 12 4.29c.72 0 1.35.53 1.82 1.42.47.89.77 2.05.89 3.34a3.43 3.43 0 0 0-1.2 1.56c.65.43 1.24.96 1.75 1.58.48-.29 1.02-.43 1.56-.4.84.19 1.64.46 2.36.83.72.37 1.19.93 1.19 1.55 0 .72-.53 1.35-1.42 1.82-.89.47-2.05.77-3.34.89a3.43 3.43 0 0 0-1.2-1.56Z",
        off: "M12 11a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m4.22-.99c-.67.49-1.47.86-2.23 1.12.03.31-.02.63-.14.93 1.59 1.08 2.75 2.59 2.75 3.2 0 .43-.55.86-1.5 1.18-.96.32-2.2.5-3.5.56-.45-.6-1.07-1.08-1.74-1.42.03-.77.13-1.51.31-2.2-.52-.36-.9-.87-1.1-1.45A9.82 9.82 0 0 1 5 12.83c0-.72.53-1.35 1.42-1.82.89-.47 2.05-.77 3.34-.89.4.55.94.97 1.56 1.2.44-.66.97-1.26 1.59-1.77-.29-.47-.42-1.01-.39-1.55A9.73 9.73 0 0 1 12 4.29c.72 0 1.35.53 1.82 1.42.47.89.77 2.05.89 3.34a3.43 3.43 0 0 0-1.2 1.56c.65.43 1.24.96 1.75 1.58.48-.29 1.02-.43 1.56-.4.84.19 1.64.46 2.36.83.72.37 1.19.93 1.19 1.55 0 .72-.53 1.35-1.42 1.82-.89.47-2.05.77-3.34.89a3.43 3.43 0 0 0-1.2-1.56Z",
    },
    cover: {
        on: "M3 4h18v2H3V4m0 14h18v2H3v-2m0-7h18v2H3v-2m0 3.5h18v1H3v-1m0-7h18v1H3v-1Z",
        off: "M3 4h18v2H3V4m0 14h18v2H3v-2Z",
    },
    climate: {
        on: "M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-8a1 1 0 0 1 1 1v3h-2V6a1 1 0 0 1 1-1Z",
        off: "M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-8a1 1 0 0 1 1 1v3h-2V6a1 1 0 0 1 1-1Z",
    },
    input_boolean: {
        on: "M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5m0 8a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z",
        off: "M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5M7 15a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z",
    },
};
const DEFAULT_ICON_PATH = "M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4c-1.1 0-2 .9-2 2v3.8h1.5c1.4 0 2.5 1.1 2.5 2.5S4.9 15.8 3.5 15.8H2V19c0 1.1.9 2 2 2h3.8v-1.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5V21H17c1.1 0 2-.9 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z";

/** Entity selection widget with search, override controls, and compatibility checks. */
@customElement("entity-picker")
export class EntityPicker extends LitElement {
    @property({ attribute: false }) hass!: HomeAssistant;
    @property({ type: String }) slotType: string = "on_off";
    @property({ type: Array }) selectedIds: string[] = [];
    @property({ type: Object }) overrides: Record<string, string> = {};
    @property({ type: Object }) scheduledStates: Record<string, string> = {};
    @property({ type: Array }) unavailableEntities: string[] = [];
    @property({ type: Boolean }) showOverrides = false;

    @state() private _query = "";
    @state() private _open = false;

    static styles = [
        sharedStyles,
        css`
      :host {
        display: block;
      }
      .entity-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }
      .entity-row {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 13px;
        background: color-mix(in srgb, var(--ss-primary) 10%, transparent);
        border: 1px solid transparent;
      }
      .entity-row.override-match {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 20%, transparent);
        border-color: var(--warning-color, #ff9800);
      }
      .entity-row.override-conflict {
        background: color-mix(in srgb, var(--error-color, #db4437) 15%, transparent);
        border-color: var(--error-color, #db4437);
      }
      .entity-row.unavailable {
        background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
        border-color: var(--error-color, #db4437);
        opacity: 0.8;
      }
      .entity-row.incompatible {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 10%, transparent);
        border-color: var(--warning-color, #ff9800);
        opacity: 0.85;
      }
      .incompatible-badge {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--warning-color, #ff9800);
        background: color-mix(in srgb, var(--warning-color, #ff9800) 15%, transparent);
        padding: 1px 6px;
        border-radius: 4px;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .unavailable-badge {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--error-color, #db4437);
        background: color-mix(in srgb, var(--error-color, #db4437) 15%, transparent);
        padding: 1px 6px;
        border-radius: 4px;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .entity-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .entity-name .entity-icon {
        flex-shrink: 0;
        width: 18px;
        height: 18px;
      }
      .entity-name .entity-icon.state-on {
        fill: var(--primary-color, #03a9f4);
      }
      .entity-name .entity-icon.state-off {
        fill: var(--secondary-text-color, #727272);
      }
      .entity-name .entity-icon.state-unavailable {
        fill: var(--error-color, #db4437);
      }
      .entity-id {
        font-size: 11px;
        color: var(--secondary-text-color, #727272);
      }
      .override-controls {
        display: inline-flex;
        gap: 2px;
        flex-shrink: 0;
      }
      .override-btn {
        cursor: pointer;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 11px;
        background: transparent;
        color: var(--secondary-text-color, #727272);
        line-height: 1.3;
      }
      .override-btn:hover {
        background: var(--secondary-background-color, #f5f5f5);
      }
      .override-btn.active-on {
        background: var(--success-color, #4caf50);
        color: #fff;
        border-color: var(--success-color, #4caf50);
      }
      .override-btn.active-off {
        background: var(--error-color, #db4437);
        color: #fff;
        border-color: var(--error-color, #db4437);
      }
      .override-btn.current-state {
        background: color-mix(in srgb, var(--ss-primary) 20%, transparent);
        border-color: var(--ss-primary);
        color: var(--primary-text-color, #212121);
      }
      .entity-remove {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: transparent;
        border: none;
        color: var(--secondary-text-color, #727272);
        font-size: 14px;
        padding: 0;
        line-height: 1;
        flex-shrink: 0;
      }
      .entity-remove:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--error-color, #db4437);
      }
      .input-wrapper {
        position: relative;
      }
      input {
        width: 100%;
      }
      .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-height: 200px;
        overflow-y: auto;
        background: var(--ss-bg);
        border: 1px solid var(--ss-border);
        border-top: none;
        border-radius: 0 0 4px 4px;
        z-index: 20;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      .option {
        padding: 8px 12px;
        cursor: pointer;
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .option:hover {
        background: var(--ss-cell-off);
      }
      .option-id {
        font-weight: 500;
      }
      .option-name {
        color: var(--secondary-text-color, #727272);
        font-size: 12px;
      }
      .no-results {
        padding: 8px 12px;
        color: var(--secondary-text-color, #727272);
        font-size: 13px;
        font-style: italic;
      }
    `,
    ];

    /**
     * Check whether an entity supports the current slot type.
     * @param id - Entity ID to check.
     * @returns True if the entity's domain and capabilities match.
     */
    private _isEntityCompatible(id: string): boolean {
        const domain = id.split(".")[0];
        if (this.slotType === "color") {
            if (domain !== "light") return false;
            const modes = this.hass?.states?.[id]?.attributes?.supported_color_modes;
            return Array.isArray(modes) && modes.some((m: string) => COLOR_MODES.includes(m));
        }
        if (this.slotType === "hvac") {
            return domain === "climate";
        }
        if (this.slotType === "brightness") {
            return domain === "light" || domain === "fan";
        }
        if (this.slotType === "scene") {
            return SUPPORTED_DOMAINS.includes(domain);
        }
        return SUPPORTED_DOMAINS.includes(domain);
    }

    /**
     * Human-readable reason why an entity is incompatible.
     * @param id - Entity ID.
     * @returns Short explanation string.
     */
    private _incompatibleReason(id: string): string {
        const domain = id.split(".")[0];
        const domainLabel = domain.replace("_", " ");
        if (this.slotType === "color") {
            if (domain !== "light") return `${domainLabel} does not support colour`;
            return "light does not support colour modes";
        }
        if (this.slotType === "hvac") {
            return `${domainLabel} does not support HVAC states`;
        }
        if (this.slotType === "brightness") {
            return `${domainLabel} does not support brightness`;
        }
        return "incompatible";
    }

    /** Compatible entities not already selected, sorted by ID. */
    private get _availableEntities(): { id: string; name: string }[] {
        if (!this.hass?.states) return [];
        const selected = new Set(this.selectedIds);
        return Object.keys(this.hass.states)
            .filter((id) => {
                if (selected.has(id)) return false;
                return this._isEntityCompatible(id);
            })
            .map((id) => ({
                id,
                name: this.hass.states[id]?.attributes?.friendly_name ?? id,
            }))
            .sort((a, b) => a.id.localeCompare(b.id));
    }

    /** Available entities filtered by the current search query. */
    private get _filtered(): { id: string; name: string }[] {
        const q = this._query.toLowerCase();
        if (!q) return this._availableEntities;
        return this._availableEntities.filter(
            (e) => e.id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q)
        );
    }

    render() {
        return html`
      <div class="entity-list">
        ${this.selectedIds.map((id) => this._renderEntityRow(id))}
      </div>
      <div class="input-wrapper">
        <input
          type="text"
          .value=${this._query}
          @input=${this._onInput}
          @focus=${() => { this._open = true; }}
          @blur=${this._onBlur}
          placeholder="Search entities..."
        />
        ${this._open ? this._renderDropdown() : nothing}
      </div>
    `;
    }

    /** Render a single entity row with status indicators and override controls. */
    private _renderEntityRow(id: string) {
        const override = this.overrides[id];
        const scheduled = this.scheduledStates[id];
        const currentState = this.hass?.states?.[id]?.state === "on" ? "on" : "off";
        const isUnavailable = this.unavailableEntities.includes(id);
        const isIncompatible = !isUnavailable && !this._isEntityCompatible(id);
        let rowClass = "";
        if (isUnavailable) {
            rowClass = "unavailable";
        } else if (isIncompatible) {
            rowClass = "incompatible";
        } else if (this.showOverrides && override) {
            rowClass = override === scheduled ? "override-match" : "override-conflict";
        }

        const onClass = override === "on" ? "active-on"
            : (!override && this.showOverrides && currentState === "on") ? "current-state"
                : "";
        const offClass = override === "off" ? "active-off"
            : (!override && this.showOverrides && currentState === "off") ? "current-state"
                : "";

        return html`
      <div class="entity-row ${rowClass}">
        <span class="entity-name">
          ${this._renderEntityIcon(id)}
          ${this._friendlyName(id)}
          <span class="entity-id">${id}</span>
        </span>
        ${isUnavailable ? html`<span class="unavailable-badge">unavailable</span>` : nothing}
        ${isIncompatible ? html`<span class="incompatible-badge" title=${this._incompatibleReason(id)}>${this._incompatibleReason(id)}</span>` : nothing}
        ${this.showOverrides && this.slotType !== "color" && this.slotType !== "brightness" && this.slotType !== "scene" ? html`
          <span class="override-controls">
            <button
              class="override-btn ${onClass}"
              title="Override On"
              @click=${() => this._onOverride(id, "on")}
            >On</button>
            <button
              class="override-btn ${offClass}"
              title="Override Off"
              @click=${() => this._onOverride(id, "off")}
            >Off</button>
          </span>
        ` : nothing}
        <button class="entity-remove" @click=${() => this._remove(id)}>✕</button>
      </div>
    `;
    }

    /** Render the search results dropdown. */
    private _renderDropdown() {
        const items = this._filtered;
        if (items.length === 0) {
            return html`<div class="dropdown"><div class="no-results">No matching entities</div></div>`;
        }
        return html`
      <div class="dropdown">
        ${items.map(
            (e) => html`
            <div class="option" @mousedown=${(ev: Event) => { ev.preventDefault(); this._select(e.id); }}>
              <span class="option-id">${e.id}</span>
              <span class="option-name">${e.name}</span>
            </div>
          `
        )}
      </div>
    `;
    }

    /**
     * Get the friendly name for an entity, falling back to the entity ID.
     * @param id - Entity ID.
     * @returns Display name.
     */
    private _friendlyName(id: string): string {
        return this.hass?.states?.[id]?.attributes?.friendly_name ?? id;
    }

    /**
     * Get the icon for an entity — custom icon from attributes, or domain default.
     * @param id - Entity ID.
     * @returns MDI icon name or inline SVG path data.
     */
    private _entityIcon(id: string): string {
        const domain = id.split(".")[0];
        const entityState = this.hass?.states?.[id];
        const customIcon = entityState?.attributes?.icon;
        if (customIcon) return customIcon;
        const isOn = entityState?.state === "on";
        const paths = DOMAIN_ICON_PATHS[domain];
        return paths ? (isOn ? paths.on : paths.off) : DEFAULT_ICON_PATH;
    }

    /** Render the entity icon — custom HA icon or SVG domain default. */
    private _renderEntityIcon(id: string) {
        const entityState = this.hass?.states?.[id];
        const customIcon = entityState?.attributes?.icon;
        if (customIcon) {
            return html`<mdi-icon class="entity-icon" .icon=${customIcon} style="--mdi-icon-size: 18px"></mdi-icon>`;
        }
        const state = entityState?.state;
        const stateClass = state === "unavailable" || state === "unknown" ? "state-unavailable"
            : state === "on" ? "state-on" : "state-off";
        const path = this._entityIcon(id);
        return html`<svg class="entity-icon ${stateClass}" viewBox="0 0 24 24"><path d=${path}/></svg>`;
    }

    /** Update the search query from the input field. */
    private _onInput(e: InputEvent) {
        this._query = (e.target as HTMLInputElement).value;
        this._open = true;
    }

    /** Close the dropdown after a short delay to allow option clicks. */
    private _onBlur() {
        // Delay to allow mousedown on option to fire first
        setTimeout(() => { this._open = false; }, 150);
    }

    /** Add an entity to the selection. */
    private _select(id: string) {
        const updated = [...this.selectedIds, id];
        this._query = "";
        this._fireChanged(updated);
    }

    /** Remove an entity from the selection. */
    private _remove(id: string) {
        const updated = this.selectedIds.filter((eid) => eid !== id);
        this._fireChanged(updated);
    }

    /**
     * Toggle or set an override for an entity.
     * If already set to the same state, clears it instead.
     * @param id - Entity ID.
     * @param state - Desired override state, "on" or "off".
     */
    private _onOverride(id: string, state: string) {
        // Toggle: if already set to this state, clear it; otherwise set it
        const current = this.overrides[id];
        if (current === state) {
            this.dispatchEvent(
                new CustomEvent("override-clear", {
                    detail: { entityId: id },
                    bubbles: true,
                    composed: true,
                })
            );
        } else {
            this.dispatchEvent(
                new CustomEvent("override-set", {
                    detail: { entityId: id, state },
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }

    /**
     * Dispatch an entities-changed event with the updated ID list.
     * @param ids - New array of selected entity IDs.
     */
    private _fireChanged(ids: string[]) {
        this.dispatchEvent(
            new CustomEvent("entities-changed", {
                detail: { entityIds: ids },
                bubbles: true,
                composed: true,
            })
        );
    }
}
