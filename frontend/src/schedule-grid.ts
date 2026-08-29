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
    @property({ type: String }) slotType: string = "on_off";
    @property({ type: Array }) palette: string[] = [];

    @state() private _dragActive = false;
    @state() private _dragValue = 0;
    @state() private _dragStartRow = -1;
    @state() private _dragStartCol = -1;
    @state() private _dragEndRow = -1;
    @state() private _dragEndCol = -1;
    @state() private _page = 0;
    @state() private _activePaletteIndex = 1;
    @state() private _nowMinutes = ScheduleGrid._currentMinutes();
    @state() private _timeIndicatorLeft: number | null = null;

    private _daysPerPage = 56;
    private _timerHandle: ReturnType<typeof setInterval> | null = null;

    private static _currentMinutes(): number {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    }

    connectedCallback() {
        super.connectedCallback();
        this._timerHandle = setInterval(() => {
            this._nowMinutes = ScheduleGrid._currentMinutes();
        }, 30_000);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._timerHandle !== null) {
            clearInterval(this._timerHandle);
            this._timerHandle = null;
        }
    }

    protected updated(changed: Map<string, unknown>) {
        super.updated(changed);
        if (changed.has("_nowMinutes") || changed.has("slots") || changed.has("cadence")) {
            requestAnimationFrame(() => this._updateTimeIndicatorPosition());
        }
    }

    private _updateTimeIndicatorPosition() {
        const grid = this.shadowRoot?.querySelector(".grid") as HTMLElement | null;
        const wrapper = this.shadowRoot?.querySelector(".grid-wrapper") as HTMLElement | null;
        if (!grid || !wrapper) return;
        const slotIndex = Math.floor(this._nowMinutes / 15);
        const fraction = (this._nowMinutes % 15) / 15;
        // Find the cell at the current slot index (first row's cells)
        const cell = grid.querySelector(`[data-col="${slotIndex}"]`) as HTMLElement | null;
        if (!cell) return;
        const wrapperRect = wrapper.getBoundingClientRect();
        const cellRect = cell.getBoundingClientRect();
        this._timeIndicatorLeft = cellRect.left - wrapperRect.left + cellRect.width * fraction;
    }

    static styles = [
        sharedStyles,
        css`
      :host {
        display: block;
        --_grid-bg: var(--ha-card-background, var(--card-background-color, var(--primary-background-color, #fafafa)));
      }
      .grid-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-top: 18px;
        padding-bottom: 18px;
        background: var(--_grid-bg);
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
        grid-template-columns: 130px repeat(${SLOTS_PER_DAY}, minmax(var(--ss-cell-size), 1fr));
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
        position: sticky;
        left: 0;
        z-index: 2;
        background: var(--_grid-bg);
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
        justify-content: space-between;
        gap: 4px;
        position: sticky;
        left: 0;
        z-index: 2;
        background: var(--_grid-bg);
      }
      .row-label .day-name {
        flex-shrink: 0;
      }
      .row-label .day-date {
        color: var(--secondary-text-color, #727272);
        font-weight: 400;
      }
      .row-label.week-even {
        background: color-mix(in srgb, var(--ss-primary) 6%, var(--_grid-bg));
      }
      .row-label.today-row {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 18%, var(--_grid-bg));
        font-weight: 700;
      }
      .row-label.past-row {
        opacity: 0.4;
      }
      .cell {
        aspect-ratio: 1;
        min-width: var(--ss-cell-size);
        min-height: var(--ss-cell-size);
        border-radius: 2px;
        cursor: pointer;
        transition: background 0.1s;
        box-sizing: border-box;
      }
      .cell.on {
        background: var(--ss-cell-on);
      }
      .cell.off {
        background: var(--ss-cell-off);
        border: 1px solid var(--divider-color, #e0e0e0);
      }
      .cell.off.week-even {
        background: color-mix(in srgb, var(--ss-primary) 6%, var(--ss-cell-off));
      }
      .cell.today-row.on {
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--warning-color, #ff9800) 40%, transparent);
      }
      .cell.today-row.off {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, var(--ss-cell-off));
        border-color: color-mix(in srgb, var(--warning-color, #ff9800) 30%, var(--divider-color, #e0e0e0));
      }
      .cell.past-row {
        opacity: 0.4;
      }
      .cell.color-set {
        border: 1px solid rgba(0, 0, 0, 0.15);
      }
      .cell.hour-start {
        border-left: 2px solid var(--warning-color, #ff9800);
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
      .palette-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
        flex-wrap: wrap;
      }
      .palette-bar span {
        font-size: 12px;
        color: var(--secondary-text-color, #727272);
        margin-right: 2px;
      }
      .palette-swatch {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        box-sizing: border-box;
        transition: border-color 0.15s, transform 0.1s;
      }
      .palette-swatch:hover {
        transform: scale(1.15);
      }
      .palette-swatch.active {
        border-color: var(--primary-text-color, #212121);
        box-shadow: 0 0 0 1px var(--ss-bg);
      }
      .palette-swatch.eraser {
        background: var(--ss-cell-off);
        border-color: var(--ss-border);
        position: relative;
      }
      .palette-swatch.eraser.active {
        border-color: var(--primary-text-color, #212121);
      }
      .grid-wrapper {
        position: relative;
      }
      .time-indicator {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 0;
        border-left: 2px dashed var(--error-color, #db4437);
        z-index: 3;
        pointer-events: none;
      }
      .time-label {
        position: absolute;
        font-size: 10px;
        font-weight: 600;
        color: var(--error-color, #db4437);
        white-space: nowrap;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 4;
      }
      .time-label.top {
        top: 0;
        transform: translate(-50%, -100%);
      }
      .time-label.bottom {
        bottom: 0;
        transform: translate(-50%, calc(100% + 4px));
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

    private _renderLabel(key: string) {
        if (this.cadence !== "custom") return this._dayLabel(key);
        const d = new Date(key + "T00:00:00");
        const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
        return html`<span class="day-name">${dow}</span><span class="day-date">${key}</span>`;
    }

    private _dayLabel(key: string): string {
        if (this.cadence === "daily") return "Every day";
        if (this.cadence === "weekly") return DAY_NAMES[parseInt(key)] ?? key;
        const d = new Date(key + "T00:00:00");
        const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
        return `${dow} ${key}`;
    }

    render() {
        const dayKeys = this._dayKeys;
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const isColor = this.slotType === "color";

        return html`
      ${isColor ? this._renderPaletteBar() : nothing}
      <div class="toolbar">
        ${isColor
                ? html`
              <button class="secondary" @click=${() => this._bulkSet(this._activePaletteIndex)}>Fill All</button>
              <button class="secondary" @click=${() => this._bulkSet(0)}>Clear All</button>
            `
                : html`
              <button class="secondary" @click=${() => this._bulkSet(1)}>All On</button>
              <button class="secondary" @click=${() => this._bulkSet(0)}>All Off</button>
            `}
        ${this.cadence === "weekly"
                ? html`
              <button class="secondary" @click=${this._copyMondayToAll}>Copy Mon → All</button>
            `
                : nothing}
      </div>
      <div class="grid-container">
        <div class="grid-wrapper">
          ${this._renderTimeIndicator()}
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

    private _weekIndex(dayKey: string): number {
        if (this.cadence !== "custom") return 0;
        const d = new Date(dayKey + "T00:00:00");
        const allDates = this.customDates;
        if (allDates.length === 0) return 0;
        const first = new Date(allDates[0] + "T00:00:00");
        // Align to Sunday: days since the Sunday on or before the first date
        const firstSunday = new Date(first);
        firstSunday.setDate(first.getDate() - first.getDay());
        const daysSinceSunday = Math.floor((d.getTime() - firstSunday.getTime()) / 86400000);
        return Math.floor(daysSinceSunday / 7);
    }

    private _rowTemporalState(dayKey: string): "today" | "past" | "other" {
        const now = new Date();
        if (this.cadence === "weekly") {
            // Monday=0 in our keys, JS getDay(): Mon=1..Sun=0
            const todayKey = String((now.getDay() + 6) % 7);
            return dayKey === todayKey ? "today" : "other";
        }
        if (this.cadence === "custom") {
            const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
            if (dayKey === todayStr) return "today";
            if (dayKey < todayStr) return "past";
            return "other";
        }
        return "other";
    }

    private _renderRow(dayKey: string, rowIdx: number) {
        const daySlots = this.slots[dayKey] ?? new Array(SLOTS_PER_DAY).fill(0);
        const isColor = this.slotType === "color";
        const weekEven = this.cadence === "custom" && this._weekIndex(dayKey) % 2 === 1;
        const rowState = this._rowTemporalState(dayKey);
        const isToday = rowState === "today";
        const isPast = rowState === "past";
        return html`
      <div class="row-label ${weekEven ? "week-even" : ""} ${isToday ? "today-row" : ""} ${isPast ? "past-row" : ""}">${this._renderLabel(dayKey)}</div>
      ${daySlots.map((val, colIdx) => {
            const inDrag = this._isInDragRegion(rowIdx, colIdx);
            const cellStyle = isColor ? this._colorCellStyle(val) : "";
            return html`
          <div
            class="cell ${isColor ? (val ? "color-set" : "off") : (val ? "on" : "off")} ${weekEven && !val ? "week-even" : ""} ${isToday ? "today-row" : ""} ${isPast ? "past-row" : ""} ${inDrag ? "drag-preview" : ""} ${colIdx % 4 === 0 ? "hour-start" : ""}"
            style=${cellStyle}
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

    private _colorCellStyle(val: number): string {
        if (val === 0 || !this.palette || val > this.palette.length) return "";
        return `background: ${this.palette[val - 1]}`;
    }

    private _renderPaletteBar() {
        return html`
      <div class="palette-bar">
        <span>Paint:</span>
        <div
          class="palette-swatch eraser ${this._activePaletteIndex === 0 ? "active" : ""}"
          title="Eraser"
          @click=${() => { this._activePaletteIndex = 0; }}
        >✕</div>
        ${this.palette.map((color, i) => html`
          <div
            class="palette-swatch ${this._activePaletteIndex === i + 1 ? "active" : ""}"
            style="background: ${color}"
            title="${color}"
            @click=${() => { this._activePaletteIndex = i + 1; }}
          ></div>
        `)}
      </div>
    `;
    }

    private _renderTimeIndicator() {
        if (this._timeIndicatorLeft === null) return nothing;
        const h = Math.floor(this._nowMinutes / 60);
        const m = this._nowMinutes % 60;
        const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const pos = `${this._timeIndicatorLeft}px`;
        return html`
      <span class="time-label top" style="left: ${pos}">${timeStr}</span>
      <div class="time-indicator" style="left: ${pos}"></div>
      <span class="time-label bottom" style="left: ${pos}">${timeStr}</span>
    `;
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
        if (this.slotType === "color") {
            this._dragValue = daySlots[col] === this._activePaletteIndex ? 0 : this._activePaletteIndex;
        } else {
            this._dragValue = daySlots[col] ? 0 : 1;
        }
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
        if (this.slotType === "color") {
            this._dragValue = daySlots[col] === this._activePaletteIndex ? 0 : this._activePaletteIndex;
        } else {
            this._dragValue = daySlots[col] ? 0 : 1;
        }
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
