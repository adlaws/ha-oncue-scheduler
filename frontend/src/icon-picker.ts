import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles } from "./styles";
import "./mdi-icon";

// Curated MDI icon list — HVAC/climate-relevant plus common general-purpose icons.
// Users can type any valid mdi: name; this list just aids discovery.
const ICON_LIST: string[] = [
    // HVAC & climate
    "mdi:thermometer", "mdi:thermometer-high", "mdi:thermometer-low",
    "mdi:thermometer-lines", "mdi:thermometer-chevron-up", "mdi:thermometer-chevron-down",
    "mdi:snowflake", "mdi:snowflake-alert", "mdi:snowflake-variant",
    "mdi:fire", "mdi:fire-alert",
    "mdi:fan", "mdi:fan-off", "mdi:fan-speed-1", "mdi:fan-speed-2", "mdi:fan-speed-3",
    "mdi:air-conditioner", "mdi:air-filter",
    "mdi:heat-wave", "mdi:heat-pump", "mdi:heat-pump-outline",
    "mdi:coolant-temperature", "mdi:hvac",
    "mdi:weather-sunny", "mdi:weather-night", "mdi:weather-partly-cloudy",
    "mdi:sun-thermometer", "mdi:sun-thermometer-outline",
    "mdi:home-thermometer", "mdi:home-thermometer-outline",
    // Temperature & comfort
    "mdi:water-percent", "mdi:water", "mdi:water-off",
    "mdi:waves", "mdi:weather-windy",
    "mdi:sun-snowflake-variant",
    // Power & energy
    "mdi:power", "mdi:power-off", "mdi:power-plug", "mdi:power-plug-off",
    "mdi:flash", "mdi:flash-off", "mdi:lightning-bolt",
    "mdi:battery", "mdi:battery-charging",
    "mdi:solar-power", "mdi:solar-panel",
    // Time & schedule
    "mdi:clock", "mdi:clock-outline", "mdi:timer", "mdi:timer-outline",
    "mdi:calendar", "mdi:calendar-clock",
    "mdi:weather-sunset-up", "mdi:weather-sunset-down",
    "mdi:moon-waning-crescent", "mdi:moon-full",
    // Home & rooms
    "mdi:home", "mdi:home-outline",
    "mdi:bed", "mdi:bed-outline", "mdi:sofa", "mdi:desk",
    "mdi:door", "mdi:door-open", "mdi:window-open", "mdi:window-closed",
    "mdi:garage", "mdi:office-building",
    // Lighting
    "mdi:lightbulb", "mdi:lightbulb-outline", "mdi:lightbulb-off",
    "mdi:lamp", "mdi:ceiling-light", "mdi:floor-lamp",
    "mdi:led-strip", "mdi:led-strip-variant",
    // General
    "mdi:check", "mdi:close", "mdi:alert", "mdi:information",
    "mdi:cog", "mdi:tune", "mdi:wrench",
    "mdi:leaf", "mdi:tree", "mdi:flower",
    "mdi:account", "mdi:account-group",
    "mdi:star", "mdi:heart", "mdi:bell",
    "mdi:eye", "mdi:eye-off",
    "mdi:lock", "mdi:lock-open",
    "mdi:shield", "mdi:shield-check",
    "mdi:volume-high", "mdi:volume-off",
    "mdi:wifi", "mdi:bluetooth",
    "mdi:car", "mdi:walk", "mdi:bike",
];

@customElement("icon-picker")
export class IconPicker extends LitElement {
    @property({ type: String }) value = "";
    @state() private _query = "";
    @state() private _open = false;

    static styles = [
        sharedStyles,
        css`
      :host { display: block; position: relative; }
      .picker-input {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .picker-input input {
        flex: 1;
        min-width: 0;
      }
      .current-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-text-color, #212121);
      }
      .clear-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 2px;
        font-size: 14px;
        color: var(--secondary-text-color, #727272);
        line-height: 1;
      }
      .clear-btn:hover { color: var(--error-color, #db4437); }
      .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-height: 240px;
        overflow-y: auto;
        background: var(--ss-bg);
        border: 1px solid var(--ss-border);
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 20;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 2px;
        padding: 4px;
      }
      .icon-option {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        color: var(--primary-text-color, #212121);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .icon-option:hover {
        background: color-mix(in srgb, var(--ss-primary) 15%, transparent);
      }
      .icon-option mdi-icon {
        --mdi-icon-size: 20px;
        flex-shrink: 0;
      }
      .icon-option .icon-name {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .no-results {
        padding: 12px;
        text-align: center;
        color: var(--secondary-text-color, #727272);
        font-size: 13px;
        grid-column: 1 / -1;
      }
    `,
    ];

    private get _filtered(): string[] {
        const q = this._query.toLowerCase().replace(/^mdi:/, "");
        if (!q) return ICON_LIST;
        return ICON_LIST.filter((icon) => icon.toLowerCase().includes(q));
    }

    render() {
        return html`
      <div class="picker-input">
        ${this.value
                ? html`<div class="current-icon"><mdi-icon .icon=${this.value}></mdi-icon></div>`
                : nothing}
        <input
          type="text"
          .value=${this._open ? this._query : (this.value || "")}
          placeholder="Type to search icons…"
          @focus=${this._onFocus}
          @input=${this._onInput}
          @keydown=${this._onKeydown}
        />
        ${this.value ? html`
          <button class="clear-btn" title="Clear icon" @click=${this._clear}>✕</button>
        ` : nothing}
      </div>
      ${this._open ? this._renderDropdown() : nothing}
    `;
    }

    private _renderDropdown() {
        const items = this._filtered;
        return html`
      <div class="dropdown">
        ${items.length
                ? items.map((icon) => html`
              <div class="icon-option" @mousedown=${(e: Event) => { e.preventDefault(); this._select(icon); }}>
                <mdi-icon .icon=${icon}></mdi-icon>
                <span class="icon-name">${icon.replace("mdi:", "")}</span>
              </div>
            `)
                : html`<div class="no-results">
                ${this._query ? html`No matches. Press Enter to use "<b>${this._query.startsWith("mdi:") ? this._query : "mdi:" + this._query}</b>"` : "Type to search…"}
              </div>`}
      </div>
    `;
    }

    private _onFocus() {
        this._query = this.value || "";
        this._open = true;
    }

    private _onInput(e: InputEvent) {
        this._query = (e.target as HTMLInputElement).value;
        if (!this._open) this._open = true;
    }

    private _onKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            this._open = false;
            (e.target as HTMLInputElement).blur();
        } else if (e.key === "Enter") {
            e.preventDefault();
            const items = this._filtered;
            if (items.length === 1) {
                this._select(items[0]);
            } else if (this._query) {
                const name = this._query.startsWith("mdi:") ? this._query : `mdi:${this._query}`;
                this._select(name);
            }
        }
    }

    private _select(icon: string) {
        this._open = false;
        this._query = "";
        this._fireChange(icon);
    }

    private _clear() {
        this._open = false;
        this._query = "";
        this._fireChange("");
    }

    private _fireChange(icon: string) {
        this.dispatchEvent(
            new CustomEvent("icon-changed", {
                detail: { icon },
                bubbles: true,
                composed: true,
            })
        );
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("click", this._onDocClick);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("click", this._onDocClick);
    }

    private _onDocClick = (e: MouseEvent) => {
        if (this._open && !this.renderRoot.contains(e.target as Node) && !this.contains(e.target as Node)) {
            this._open = false;
        }
    };
}
