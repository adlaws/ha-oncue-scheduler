import { LitElement, html, css, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";

// Cache: icon name → SVG path data
const _pathCache = new Map<string, string>();
const _pendingFetches = new Map<string, Promise<string>>();

async function fetchIconPath(name: string): Promise<string> {
    const cached = _pathCache.get(name);
    if (cached !== undefined) return cached;

    const pending = _pendingFetches.get(name);
    if (pending) return pending;

    const slug = name.replace(/^mdi:/, "");
    const promise = fetch(`https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${slug}.svg`)
        .then((r) => (r.ok ? r.text() : ""))
        .then((text) => {
            const match = text.match(/\bd="([^"]+)"/);
            const path = match?.[1] ?? "";
            _pathCache.set(name, path);
            _pendingFetches.delete(name);
            return path;
        })
        .catch(() => {
            _pathCache.set(name, "");
            _pendingFetches.delete(name);
            return "";
        });
    _pendingFetches.set(name, promise);
    return promise;
}

/**
 * Thin wrapper that renders an MDI icon.
 * Uses <ha-icon> when running inside Home Assistant, otherwise fetches SVG
 * path data from the jsDelivr CDN and renders inline.
 */
@customElement("mdi-icon")
export class MdiIcon extends LitElement {
    @property({ type: String }) icon = "";
    @state() private _path = "";

    private _haIconAvailable = customElements.get("ha-icon") !== undefined;

    static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--mdi-icon-size, var(--mdc-icon-size, 24px));
      height: var(--mdi-icon-size, var(--mdc-icon-size, 24px));
      vertical-align: middle;
    }
    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
    ha-icon {
      --mdc-icon-size: var(--mdi-icon-size, var(--mdc-icon-size, 24px));
    }
  `;

    willUpdate(changed: Map<string, unknown>) {
        if (changed.has("icon") && this.icon && !this._haIconAvailable) {
            this._loadPath();
        }
    }

    private async _loadPath() {
        this._path = "";
        if (!this.icon) return;
        this._path = await fetchIconPath(this.icon);
    }

    render() {
        if (!this.icon) return html``;

        if (this._haIconAvailable) {
            return html`<ha-icon .icon=${this.icon}></ha-icon>`;
        }

        if (!this._path) {
            return html``;
        }

        return html`
      <svg viewBox="0 0 24 24">
        ${svg`<path d=${this._path} />`}
      </svg>
    `;
    }
}
