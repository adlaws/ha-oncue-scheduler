import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sharedStyles } from "./styles";
import type { ScheduleSummary } from "./types";

/** Sidebar list of schedule summaries with add/select/toggle controls. */
@customElement("schedule-list")
export class ScheduleList extends LitElement {
    @property({ type: Array }) schedules: ScheduleSummary[] = [];
    @property({ type: String }) selectedId: string | null = null;

    static styles = [
        sharedStyles,
        css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .header {
        padding: 16px;
        border-bottom: 1px solid var(--ss-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .header h2 {
        margin: 0;
        font-size: 16px;
      }
      .list {
        flex: 1;
        overflow-y: auto;
      }
      .item {
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--ss-border);
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background 0.15s;
      }
      .item:hover {
        background: var(--ss-cell-off);
      }
      .item.selected {
        background: color-mix(in srgb, var(--ss-primary) 15%, transparent);
        border-left: 3px solid var(--ss-primary);
      }
      .item-info {
        flex: 1;
        min-width: 0;
      }
      .item-name {
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .item-meta {
        font-size: 12px;
        color: var(--secondary-text-color, #727272);
        margin-top: 2px;
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
        cursor: pointer;
        position: relative;
      }
      .status-dot.active {
        background: var(--success-color, #4caf50);
      }
      .status-dot.paused {
        background: var(--disabled-text-color, #bdbdbd);
      }
      .toggle-btn {
        background: none;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        padding: 2px 8px;
        font-size: 11px;
        color: var(--secondary-text-color, #727272);
        cursor: pointer;
        flex-shrink: 0;
        line-height: 1.4;
      }
      .toggle-btn:hover {
        background: var(--secondary-background-color, #f5f5f5);
        color: var(--primary-text-color, #212121);
      }
      .empty {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color, #727272);
        font-size: 14px;
      }
    `,
    ];

    render() {
        return html`
      <div class="header">
        <h2>Schedules</h2>
        <button class="primary" @click=${this._onAdd}>+ Add</button>
      </div>
      <div class="list">
        ${this.schedules.length === 0
                ? html`<div class="empty">No schedules yet. Click + Add to create one.</div>`
                : this.schedules.map(
                    (s) => html`
                <div
                  class="item ${s.id === this.selectedId ? "selected" : ""}"
                  @click=${() => this._onSelect(s.id)}
                >
                  <div
                    class="status-dot ${s.active ? "active" : "paused"}"
                    title=${s.active ? "Active" : "Paused"}
                  ></div>
                  <div class="item-info">
                    <div class="item-name">${s.name}</div>
                    <div class="item-meta">
                      <span class="badge badge-${s.cadence}">${s.cadence}</span>
                      ${s.entity_ids.length} ${s.entity_ids.length !== 1 ? "entities" : "entity"}
                    </div>
                  </div>
                  <button
                    class="toggle-btn"
                    title=${s.active ? "Pause schedule" : "Resume schedule"}
                    @click=${(e: Event) => { e.stopPropagation(); this._onToggleActive(s.id, !s.active); }}
                  >${s.active ? "Pause" : "Resume"}</button>
                </div>
              `
                )}
      </div>
    `;
    }

    /**
     * Fire schedule-selected event.
     * @param id - Schedule ID that was selected.
     */
    private _onSelect(id: string) {
        this.dispatchEvent(
            new CustomEvent("schedule-selected", { detail: { id }, bubbles: true, composed: true })
        );
    }

    /** Fire schedule-add event. */
    private _onAdd() {
        this.dispatchEvent(
            new CustomEvent("schedule-add", { bubbles: true, composed: true })
        );
    }

    /**
     * Fire schedule-toggle-active event with the new state.
     * @param id - Schedule ID to toggle.
     * @param active - Desired active state.
     */
    private _onToggleActive(id: string, active: boolean) {
        this.dispatchEvent(
            new CustomEvent("schedule-toggle-active", {
                detail: { id, active },
                bubbles: true,
                composed: true,
            })
        );
    }
}
