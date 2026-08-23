import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles } from "./styles";

const SLOTS_PER_DAY = 96;
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_KEYS_WEEKLY = ["0", "1", "2", "3", "4", "5", "6"];

@customElement("schedule-grid")
export class ScheduleGrid extends LitElement {
    @property({ type: String }) cadence: "daily" | "weekly" | "custom" = "daily";
    @property({ type: Object }) slots: Record<string, number[]> = {};
    @property({ type: Array }) customDates: string[] = [];

    @state() private _dragActive = false;
    @state() private _dragValue = 0;
    @state() private _dragStartRow = -1;
    @state() private _dragStartCol = -1;
    @state() private _dragEndRow = -1;
    @state() private _dragEndCol = -1;
    @state() private _page = 0;

    private _daysPerPage = 7;

    static styles = [
        sharedStyles,
        css`
      :host {
        display: block;
      }
      .grid-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .toolbar {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
        flex-wrap: wrap;
        align-items: center;
      }
      .toolbar button {
        font-size: 12px;
        padding: 4px 10px;
      }
      .grid {
        display: grid;
        grid-template-columns: 100px repeat(${SLOTS_PER_DAY}, var(--ss-cell-size));
        gap: 1px;
        user-select: none;
        -webkit-user-select: none;
      }
      .header-cell {
        font-size: 10px;
        text-align: center;
        color: var(--secondary-text-color, #727272);
        height: 20px;
        line-height: 20px;
      }
      .header-spacer {
        grid-column: 1;
      }
      .row-label {
        font-size: 12px;
        font-weight: 500;
        line-height: var(--ss-cell-size);
        padding-right: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
      }
      .cell {
        width: var(--ss-cell-size);
        height: var(--ss-cell-size);
        border-radius: 2px;
        cursor: pointer;
        transition: background 0.1s;
      }
      .cell.on {
        background: var(--ss-cell-on);
      }
      .cell.off {
        background: var(--ss-cell-off);
      }
      .cell.drag-preview {
        outline: 2px solid var(--ss-primary);
        outline-offset: -1px;
      }
      .pagination {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        justify-content: center;
      }
      .pagination button {
        font-size: 12px;
        padding: 4px 10px;
      }
      .pagination span {
        font-size: 13px;
        color: var(--secondary-text-color, #727272);
      }
    `,
    ];

    private get _dayKeys(): string[] {
        if (this.cadence === "daily") return ["0"];
        if (this.cadence === "weekly") return DAY_KEYS_WEEKLY;
        // custom: paginate
        const allDates = this.customDates;
        if (allDates.length <= this._daysPerPage) return allDates;
        const start = this._page * this._daysPerPage;
        return allDates.slice(start, start + this._daysPerPage);
    }

    private get _totalPages(): number {
        if (this.cadence !== "custom") return 1;
        return Math.max(1, Math.ceil(this.customDates.length / this._daysPerPage));
    }

    private _dayLabel(key: string): string {
        if (this.cadence === "daily") return "Every day";
        if (this.cadence === "weekly") return DAY_NAMES[parseInt(key)] ?? key;
        return key; // date string for custom
    }

    render() {
        const dayKeys = this._dayKeys;
        const hours = Array.from({ length: 24 }, (_, i) => i);

        return html`
      <div class="toolbar">
        <button class="secondary" @click=${() => this._bulkSet(1)}>All On</button>
        <button class="secondary" @click=${() => this._bulkSet(0)}>All Off</button>
        ${this.cadence === "weekly"
                ? html`
              <button class="secondary" @click=${this._copyMondayToAll}>Copy Mon → All</button>
            `
                : nothing}
      </div>
      <div class="grid-container">
        <div class="grid" @mouseup=${this._onMouseUp} @mouseleave=${this._onMouseUp}>
          <!-- hour headers -->
          <div class="header-spacer"></div>
          ${hours.map(
                    (h) => html`
              <div class="header-cell" style="grid-column: span 4">${String(h).padStart(2, "0")}</div>
            `
                )}

          <!-- rows -->
          ${dayKeys.map((dayKey, rowIdx) => this._renderRow(dayKey, rowIdx))}
        </div>
      </div>
      ${this.cadence === "custom" && this._totalPages > 1
                ? html`
            <div class="pagination">
              <button class="secondary" ?disabled=${this._page === 0} @click=${this._prevPage}>
                ← Prev
              </button>
              <span>Page ${this._page + 1} of ${this._totalPages}</span>
              <button
                class="secondary"
                ?disabled=${this._page >= this._totalPages - 1}
                @click=${this._nextPage}
              >
                Next →
              </button>
            </div>
          `
                : nothing}
    `;
    }

    private _renderRow(dayKey: string, rowIdx: number) {
        const daySlots = this.slots[dayKey] ?? new Array(SLOTS_PER_DAY).fill(0);
        return html`
      <div class="row-label">${this._dayLabel(dayKey)}</div>
      ${daySlots.map((val, colIdx) => {
            const inDrag = this._isInDragRegion(rowIdx, colIdx);
            return html`
          <div
            class="cell ${val ? "on" : "off"} ${inDrag ? "drag-preview" : ""}"
            data-row=${rowIdx}
            data-col=${colIdx}
            data-day=${dayKey}
            title="${this._cellTooltip(colIdx)}"
            @mousedown=${(e: MouseEvent) => this._onMouseDown(e, rowIdx, colIdx, dayKey)}
            @mouseenter=${(e: MouseEvent) => this._onMouseEnter(e, rowIdx, colIdx)}
            @touchstart=${(e: TouchEvent) => this._onTouchStart(e, rowIdx, colIdx, dayKey)}
            @touchmove=${this._onTouchMove}
            @touchend=${this._onTouchEnd}
          ></div>
        `;
        })}
    `;
    }

    private _cellTooltip(colIdx: number): string {
        const startH = Math.floor((colIdx * 15) / 60);
        const startM = (colIdx * 15) % 60;
        const endH = Math.floor(((colIdx + 1) * 15) / 60);
        const endM = ((colIdx + 1) * 15) % 60;
        return `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")} – ${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    }

    private _isInDragRegion(row: number, col: number): boolean {
        if (!this._dragActive) return false;
        const r0 = Math.min(this._dragStartRow, this._dragEndRow);
        const r1 = Math.max(this._dragStartRow, this._dragEndRow);
        const c0 = Math.min(this._dragStartCol, this._dragEndCol);
        const c1 = Math.max(this._dragStartCol, this._dragEndCol);
        return row >= r0 && row <= r1 && col >= c0 && col <= c1;
    }

    private _onMouseDown(e: MouseEvent, row: number, col: number, dayKey: string) {
        e.preventDefault();
        const daySlots = this.slots[dayKey] ?? new Array(SLOTS_PER_DAY).fill(0);
        this._dragValue = daySlots[col] ? 0 : 1;
        this._dragStartRow = row;
        this._dragStartCol = col;
        this._dragEndRow = row;
        this._dragEndCol = col;
        this._dragActive = true;
    }

    private _onMouseEnter(_e: MouseEvent, row: number, col: number) {
        if (!this._dragActive) return;
        this._dragEndRow = row;
        this._dragEndCol = col;
    }

    private _onMouseUp() {
        if (!this._dragActive) return;
        this._applyDrag();
        this._dragActive = false;
    }

    private _onTouchStart(e: TouchEvent, row: number, col: number, dayKey: string) {
        e.preventDefault();
        const daySlots = this.slots[dayKey] ?? new Array(SLOTS_PER_DAY).fill(0);
        this._dragValue = daySlots[col] ? 0 : 1;
        this._dragStartRow = row;
        this._dragStartCol = col;
        this._dragEndRow = row;
        this._dragEndCol = col;
        this._dragActive = true;
    }

    private _onTouchMove(e: TouchEvent) {
        if (!this._dragActive) return;
        const touch = e.touches[0];
        const el = this.shadowRoot?.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
        if (el?.dataset.row !== undefined && el?.dataset.col !== undefined) {
            this._dragEndRow = parseInt(el.dataset.row);
            this._dragEndCol = parseInt(el.dataset.col);
        }
    }

    private _onTouchEnd() {
        if (!this._dragActive) return;
        this._applyDrag();
        this._dragActive = false;
    }

    private _applyDrag() {
        const dayKeys = this._dayKeys;
        const r0 = Math.min(this._dragStartRow, this._dragEndRow);
        const r1 = Math.max(this._dragStartRow, this._dragEndRow);
        const c0 = Math.min(this._dragStartCol, this._dragEndCol);
        const c1 = Math.max(this._dragStartCol, this._dragEndCol);

        const newSlots = { ...this.slots };
        for (let r = r0; r <= r1; r++) {
            const dayKey = dayKeys[r];
            if (!dayKey) continue;
            const daySlots = [...(newSlots[dayKey] ?? new Array(SLOTS_PER_DAY).fill(0))];
            for (let c = c0; c <= c1; c++) {
                daySlots[c] = this._dragValue;
            }
            newSlots[dayKey] = daySlots;
        }

        this.dispatchEvent(
            new CustomEvent("slots-changed", {
                detail: { slots: newSlots },
                bubbles: true,
                composed: true,
            })
        );
    }

    private _bulkSet(value: number) {
        const dayKeys = this.cadence === "custom" ? this.customDates : this._dayKeys;
        const newSlots: Record<string, number[]> = {};
        for (const key of dayKeys) {
            newSlots[key] = new Array(SLOTS_PER_DAY).fill(value);
        }
        this.dispatchEvent(
            new CustomEvent("slots-changed", {
                detail: { slots: newSlots },
                bubbles: true,
                composed: true,
            })
        );
    }

    private _copyMondayToAll() {
        const monday = this.slots["0"] ?? new Array(SLOTS_PER_DAY).fill(0);
        const newSlots: Record<string, number[]> = {};
        for (const key of DAY_KEYS_WEEKLY) {
            newSlots[key] = [...monday];
        }
        this.dispatchEvent(
            new CustomEvent("slots-changed", {
                detail: { slots: newSlots },
                bubbles: true,
                composed: true,
            })
        );
    }

    private _prevPage() {
        this._page = Math.max(0, this._page - 1);
    }

    private _nextPage() {
        this._page = Math.min(this._totalPages - 1, this._page + 1);
    }
}
