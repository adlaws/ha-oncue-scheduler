import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles } from "./styles";
import type { HomeAssistant } from "./types";

const SUPPORTED_DOMAINS = ["switch", "light", "fan", "input_boolean"];
const COLOR_MODES = ["rgb", "rgbw", "rgbww", "hs", "xy"];

@customElement("entity-picker")
export class EntityPicker extends LitElement {
    @property({ attribute: false }) hass!: HomeAssistant;
    @property({ type: String }) slotType: string = "on_off";
    @property({ type: Array }) selectedIds: string[] = [];
    @property({ type: Object }) overrides: Record<string, string> = {};
    @property({ type: Object }) scheduledStates: Record<string, string> = {};
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
      .entity-name ha-icon {
        flex-shrink: 0;
        --mdc-icon-size: 18px;
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

    private get _availableEntities(): { id: string; name: string }[] {
        if (!this.hass?.states) return [];
        const selected = new Set(this.selectedIds);
        const isColor = this.slotType === "color";
        return Object.keys(this.hass.states)
            .filter((id) => {
                if (selected.has(id)) return false;
                const domain = id.split(".")[0];
                if (isColor) {
                    if (domain !== "light") return false;
                    const modes = this.hass.states[id]?.attributes?.supported_color_modes;
                    return Array.isArray(modes) && modes.some((m: string) => COLOR_MODES.includes(m));
                }
                return SUPPORTED_DOMAINS.includes(domain);
            })
            .map((id) => ({
                id,
                name: this.hass.states[id]?.attributes?.friendly_name ?? id,
            }))
            .sort((a, b) => a.id.localeCompare(b.id));
    }

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

    private _renderEntityRow(id: string) {
        const override = this.overrides[id];
        const scheduled = this.scheduledStates[id];
        const currentState = this.hass?.states?.[id]?.state === "on" ? "on" : "off";
        let rowClass = "";
        if (this.showOverrides && override) {
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
          <ha-icon .icon=${this._entityIcon(id) ?? ""}
            style="visibility: ${this._entityIcon(id) ? 'visible' : 'hidden'}"
          ></ha-icon>
          ${this._friendlyName(id)}
          <span class="entity-id">${id}</span>
        </span>
        ${this.showOverrides && this.slotType !== "color" ? html`
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

    private _friendlyName(id: string): string {
        return this.hass?.states?.[id]?.attributes?.friendly_name ?? id;
    }

    private _entityIcon(id: string): string | undefined {
        return this.hass?.states?.[id]?.attributes?.icon;
    }

    private _onInput(e: InputEvent) {
        this._query = (e.target as HTMLInputElement).value;
        this._open = true;
    }

    private _onBlur() {
        // Delay to allow mousedown on option to fire first
        setTimeout(() => { this._open = false; }, 150);
    }

    private _select(id: string) {
        const updated = [...this.selectedIds, id];
        this._query = "";
        this._fireChanged(updated);
    }

    private _remove(id: string) {
        const updated = this.selectedIds.filter((eid) => eid !== id);
        this._fireChanged(updated);
    }

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
