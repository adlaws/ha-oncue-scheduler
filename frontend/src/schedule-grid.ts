import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles } from "./styles";
import type { HvacPreset, PaletteEntry, BrightnessPreset, ScenePreset } from "./types";
import { normalizePaletteEntry, paletteEntryDisplayColor, paletteEntryBackground } from "./types";
import "./mdi-icon";

const SLOTS_PER_DAY = 96;
const MOBILE_SLOTS_PER_ROW = 16;
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_KEYS_WEEKLY = ["0", "1", "2", "3", "4", "5", "6"];

function _chipTextColor(hex: string): string {
    const v = parseInt(hex.slice(1), 16);
    const r = (v >> 16) & 0xff, g = (v >> 8) & 0xff, b = v & 0xff;
    return (r * 0.299 + g * 0.587 + b * 0.114) > 160 ? "#000" : "#fff";
}

/** Interactive time-slot grid supporting drag-paint, palette modes, and mobile layout. */
@customElement("schedule-grid")
export class ScheduleGrid extends LitElement {
    @property({ type: String }) cadence: "daily" | "weekly" | "custom" = "daily";
    @property({ type: Object }) slots: Record<string, number[]> = {};
    @property({ type: Array }) customDates: string[] = [];
    @property({ type: String }) slotType: string = "on_off";
    @property({ type: Array }) palette: PaletteEntry[] = [];
    @property({ type: Array }) hvacPresets: HvacPreset[] = [];
    @property({ type: Array }) brightnessPresets: BrightnessPreset[] = [];
    @property({ type: Array }) scenePresets: ScenePreset[] = [];

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
    @state() private _mobileTimePos: { left: number; top: number; height: number } | null = null;
    @state() private _isMobile = false;
    @state() private _mobileSelectedDayKey = "";
    @state() private _mobilePaintMode = false;

    private _daysPerPage = 56;
    private _tapTarget: { row: number; col: number; dayKey: string } | null = null;
    private _tapStartX = 0;
    private _tapStartY = 0;
    private _timerHandle: ReturnType<typeof setInterval> | null = null;
    private _mediaQuery: MediaQueryList | null = null;

    /** Current time of day in minutes since midnight. */
    private static _currentMinutes(): number {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    }

    connectedCallback() {
        super.connectedCallback();
        this._timerHandle = setInterval(() => {
            this._nowMinutes = ScheduleGrid._currentMinutes();
        }, 30_000);
        this._mediaQuery = window.matchMedia("(max-width: 768px)");
        this._isMobile = this._mediaQuery.matches;
        this._mediaQuery.addEventListener("change", this._onMediaChange);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._timerHandle !== null) {
            clearInterval(this._timerHandle);
            this._timerHandle = null;
        }
        this._mediaQuery?.removeEventListener("change", this._onMediaChange);
    }

    /** Respond to viewport width changes. */
    private _onMediaChange = (e: MediaQueryListEvent) => {
        this._isMobile = e.matches;
    };

    protected updated(changed: Map<string, unknown>) {
        super.updated(changed);
        if (changed.has("_nowMinutes") || changed.has("slots") || changed.has("cadence")
            || changed.has("_isMobile") || changed.has("_mobileSelectedDayKey")) {
            requestAnimationFrame(() => this._updateTimeIndicatorPosition());
        }
    }

    /** Position the red "now" line on the desktop grid. */
    private _updateTimeIndicatorPosition() {
        if (this._isMobile) {
            this._updateMobileTimeIndicator();
            return;
        }
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

    /** Position the red "now" marker on the mobile single-day grid. */
    private _updateMobileTimeIndicator() {
        const grid = this.shadowRoot?.querySelector(".mobile-grid") as HTMLElement | null;
        const wrapper = this.shadowRoot?.querySelector(".grid-wrapper") as HTMLElement | null;
        if (!grid || !wrapper) { this._mobileTimePos = null; return; }

        const selectedDay = this._effectiveMobileDay;
        const isToday = this.cadence === "daily" || this._rowTemporalState(selectedDay) === "today";
        if (!isToday) { this._mobileTimePos = null; return; }

        const slotIndex = Math.floor(this._nowMinutes / 15);
        const fraction = (this._nowMinutes % 15) / 15;
        const quadrant = Math.floor(slotIndex / MOBILE_SLOTS_PER_ROW);
        const colInQuadrant = slotIndex % MOBILE_SLOTS_PER_ROW;

        const cell = grid.querySelector(`[data-row="${quadrant}"][data-col="${colInQuadrant}"]`) as HTMLElement | null;
        if (!cell) { this._mobileTimePos = null; return; }

        const wrapperRect = wrapper.getBoundingClientRect();
        const cellRect = cell.getBoundingClientRect();
        this._mobileTimePos = {
            left: cellRect.left - wrapperRect.left + cellRect.width * fraction,
            top: cellRect.top - wrapperRect.top,
            height: cellRect.height,
        };
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
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        position: relative;
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
      .palette-swatch .swatch-remove {
        display: none;
        position: absolute;
        top: -6px;
        right: -6px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: none;
        background: var(--error-color, #db4437);
        color: #fff;
        font-size: 9px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
      }
      .palette-swatch:hover .swatch-remove {
        display: flex;
      }
      .palette-swatch .swatch-edit {
        display: none;
        position: absolute;
        top: -6px;
        left: -6px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: none;
        background: var(--primary-color, #03a9f4);
        color: #fff;
        font-size: 8px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
      }
      .palette-swatch:hover .swatch-edit {
        display: flex;
      }
      .palette-swatch-add {
        background: var(--ss-cell-off, #e0e0e0);
        border-color: var(--ss-border, #ccc);
        color: var(--secondary-text-color, #727272);
        font-size: 16px;
        font-weight: bold;
      }
      .palette-swatch-add:hover {
        background: var(--ss-border, #ccc);
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
      /* ── Mobile layout ── */
      .day-select {
        flex: 1;
        min-width: 120px;
      }
      .mobile-grid {
        display: grid;
        grid-template-columns: 64px repeat(${MOBILE_SLOTS_PER_ROW}, 1fr);
        gap: 1px;
        user-select: none;
        -webkit-user-select: none;
      }
      .mobile-grid .cell {
        aspect-ratio: 1;
        min-width: 0;
        min-height: 0;
      }
      .mobile-grid .header-cell {
        font-size: 9px;
        height: 16px;
        line-height: 16px;
      }
      .mobile-grid .row-label {
        font-size: 11px;
        padding-right: 4px;
        position: static;
        display: flex;
        align-items: center;
      }
      .mobile-grid .header-spacer {
        position: static;
      }
      .paint-toggle {
        transition: background 0.15s;
      }
      .paint-toggle.paint-active {
        background: var(--ss-primary);
        color: #fff;
      }
      .mobile-grid.paint-active {
        outline: 2px solid var(--ss-primary);
        outline-offset: 2px;
        border-radius: 4px;
      }
    `,
    ];

    /** All day keys for the current cadence, unpaginated. */
    private get _allDayKeys(): string[] {
        if (this.cadence === "daily") return ["0"];
        if (this.cadence === "weekly") return DAY_KEYS_WEEKLY;
        return this.customDates;
    }

    /** Day keys for the current page (paginated for custom cadence). */
    private get _dayKeys(): string[] {
        if (this.cadence === "daily") return ["0"];
        if (this.cadence === "weekly") return DAY_KEYS_WEEKLY;
        // custom: paginate
        const allDates = this.customDates;
        if (allDates.length <= this._daysPerPage) return allDates;
        const start = this._page * this._daysPerPage;
        return allDates.slice(start, start + this._daysPerPage);
    }

    /** The day key currently shown in mobile single-day view. */
    private get _effectiveMobileDay(): string {
        const keys = this._allDayKeys;
        if (this._mobileSelectedDayKey && keys.includes(this._mobileSelectedDayKey)) {
            return this._mobileSelectedDayKey;
        }
        return keys[0] || "0";
    }

    /** Total pages for custom cadence pagination. */
    private get _totalPages(): number {
        if (this.cadence !== "custom") return 1;
        return Math.max(1, Math.ceil(this.customDates.length / this._daysPerPage));
    }

    /**
     * Render a day label — day-of-week + date for custom cadence.
     * @param key - Day key string.
     */
    private _renderLabel(key: string) {
        if (this.cadence !== "custom") return this._dayLabel(key);
        const d = new Date(key + "T00:00:00");
        const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
        return html`<span class="day-name">${dow}</span><span class="day-date">${key}</span>`;
    }

    /**
     * Human-readable label for a day key.
     * @param key - Day key string.
     * @returns Day name for weekly, date string for custom, "Every day" for daily.
     */
    private _dayLabel(key: string): string {
        if (this.cadence === "daily") return "Every day";
        if (this.cadence === "weekly") return DAY_NAMES[parseInt(key)] ?? key;
        const d = new Date(key + "T00:00:00");
        const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
        return `${dow} ${key}`;
    }

    /**
     * Day label appended with "(Today)" for mobile view.
     * @param key - Day key string.
     */
    private _mobileDayLabel(key: string): string {
        const label = this._dayLabel(key);
        return this._rowTemporalState(key) === "today" ? `${label} (Today)` : label;
    }

    render() {
        if (this._isMobile) return this._renderMobileLayout();
        return this._renderDesktopLayout();
    }

    /** Render the desktop multi-row grid with drag support. */
    private _renderDesktopLayout() {
        const dayKeys = this._dayKeys;
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const isPalette = this.slotType === "color" || this.slotType === "hvac" || this.slotType === "brightness" || this.slotType === "scene";

        return html`
      ${isPalette ? this._renderPaletteBar() : nothing}
      <div class="toolbar">
        ${isPalette
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

    /** Render the single-day mobile layout with day selector. */
    private _renderMobileLayout() {
        const isPalette = this.slotType === "color" || this.slotType === "hvac" || this.slotType === "brightness" || this.slotType === "scene";
        const dayKeys = this._allDayKeys;
        const selectedDay = this._effectiveMobileDay;
        const daySlots = this.slots[selectedDay] ?? new Array(SLOTS_PER_DAY).fill(0);
        const showDaySelect = this.cadence !== "daily";
        const isToday = this.cadence === "daily" || this._rowTemporalState(selectedDay) === "today";
        const quadrants = [
            { label: "00 – 03", startHour: 0 },
            { label: "04 – 07", startHour: 4 },
            { label: "08 – 11", startHour: 8 },
            { label: "12 – 15", startHour: 12 },
            { label: "16 – 19", startHour: 16 },
            { label: "20 – 23", startHour: 20 },
        ];

        return html`
      ${isPalette ? this._renderPaletteBar() : nothing}
      <div class="toolbar">
        ${isPalette
                ? html`
              <button class="secondary" @click=${() => this._bulkSet(this._activePaletteIndex)}>Fill All</button>
              <button class="secondary" @click=${() => this._bulkSet(0)}>Clear All</button>
            `
                : html`
              <button class="secondary" @click=${() => this._bulkSet(1)}>All On</button>
              <button class="secondary" @click=${() => this._bulkSet(0)}>All Off</button>
            `}
        ${this.cadence === "weekly"
                ? html`<button class="secondary" @click=${this._copyMondayToAll}>Copy Mon → All</button>`
                : nothing}
        <button class="secondary paint-toggle ${this._mobilePaintMode ? "paint-active" : ""}"
                @click=${this._togglePaintMode}>
            ${this._mobilePaintMode ? "Paint: ON" : "Paint: OFF"}
        </button>
        ${showDaySelect
                ? html`
              <select class="day-select" .value=${selectedDay} @change=${this._onMobileDayChange}>
                ${dayKeys.map((k) => html`
                  <option value=${k} ?selected=${k === selectedDay}>${this._mobileDayLabel(k)}</option>
                `)}
              </select>
            `
                : nothing}
      </div>
      <div class="grid-container">
        <div class="grid-wrapper">
          ${this._renderMobileTimeIndicator()}
          <div class="mobile-grid ${this._mobilePaintMode ? "paint-active" : ""}" @mouseup=${this._onMouseUp} @mouseleave=${this._onMouseUp}>
            ${quadrants.map((q, qIdx) => {
                    const startSlot = qIdx * MOBILE_SLOTS_PER_ROW;
                    const hours = Array.from({ length: 4 }, (_, i) => q.startHour + i);
                    return html`
                <div class="header-spacer"></div>
                ${hours.map((h) => html`
                  <div class="header-cell" style="grid-column: span 4">${String(h).padStart(2, "0")}</div>
                `)}
                <div class="row-label ${isToday ? "today-row" : ""}">${q.label}</div>
                ${Array.from({ length: MOBILE_SLOTS_PER_ROW }, (_, colIdx) => {
                        const slotIdx = startSlot + colIdx;
                        const val = daySlots[slotIdx];
                        const inDrag = this._isInDragRegion(qIdx, colIdx);
                        const cellStyle = isPalette ? this._paletteCellStyle(val) : "";
                        return html`
                    <div
                      class="cell ${isPalette ? (val ? "color-set" : "off") : (val ? "on" : "off")} ${isToday ? "today-row" : ""} ${inDrag ? "drag-preview" : ""} ${colIdx % 4 === 0 ? "hour-start" : ""}"
                      style=${cellStyle}
                      data-row=${qIdx}
                      data-col=${colIdx}
                      data-day=${selectedDay}
                      title="${this._cellTooltip(slotIdx, val)}"
                      @mousedown=${(e: MouseEvent) => this._onMouseDown(e, qIdx, colIdx, selectedDay)}
                      @mouseenter=${(e: MouseEvent) => this._onMouseEnter(e, qIdx, colIdx)}
                      @touchstart=${(e: TouchEvent) => this._onTouchStart(e, qIdx, colIdx, selectedDay)}
                      @touchmove=${this._onTouchMove}
                      @touchend=${this._onTouchEnd}
                    ></div>
                  `;
                    })}
              `;
                })}
          </div>
        </div>
      </div>
    `;
    }

    /** Update the selected day from the mobile dropdown. */
    private _onMobileDayChange(e: Event) {
        this._mobileSelectedDayKey = (e.target as HTMLSelectElement).value;
    }

    /** Toggle mobile paint mode on/off. */
    private _togglePaintMode() {
        this._mobilePaintMode = !this._mobilePaintMode;
    }

    /**
     * Toggle a single cell's value (used for mobile tap-to-toggle).
     * @param row - Row index within the mobile grid.
     * @param col - Column index within the mobile grid.
     * @param dayKey - Day key for the slot array to modify.
     */
    private _toggleSingleCell(row: number, col: number, dayKey: string) {
        const slotIdx = row * MOBILE_SLOTS_PER_ROW + col;
        if (slotIdx >= SLOTS_PER_DAY) return;
        const daySlots = [...(this.slots[dayKey] ?? new Array(SLOTS_PER_DAY).fill(0))];
        if (this.slotType === "color" || this.slotType === "hvac" || this.slotType === "brightness" || this.slotType === "scene") {
            daySlots[slotIdx] = daySlots[slotIdx] === this._activePaletteIndex ? 0 : this._activePaletteIndex;
        } else {
            daySlots[slotIdx] = daySlots[slotIdx] ? 0 : 1;
        }
        const newSlots = { ...this.slots, [dayKey]: daySlots };
        this.dispatchEvent(
            new CustomEvent("slots-changed", {
                detail: { slots: newSlots },
                bubbles: true,
                composed: true,
            })
        );
    }

    /**
     * Week index for alternating row shading in custom cadence.
     * @param dayKey - ISO date string.
     * @returns Zero-based week number relative to the schedule's first date.
     */
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

    /**
     * Classify a day key as today, past, or other.
     * @param dayKey - Day key string.
     * @returns "today", "past", or "other".
     */
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

    /** Render a day row of slot cells with drag and touch handlers. */
    private _renderRow(dayKey: string, rowIdx: number) {
        const daySlots = this.slots[dayKey] ?? new Array(SLOTS_PER_DAY).fill(0);
        const isPalette = this.slotType === "color" || this.slotType === "hvac" || this.slotType === "brightness" || this.slotType === "scene";
        const weekEven = this.cadence === "custom" && this._weekIndex(dayKey) % 2 === 1;
        const rowState = this._rowTemporalState(dayKey);
        const isToday = rowState === "today";
        const isPast = rowState === "past";
        return html`
      <div class="row-label ${weekEven ? "week-even" : ""} ${isToday ? "today-row" : ""} ${isPast ? "past-row" : ""}">${this._renderLabel(dayKey)}</div>
      ${daySlots.map((val, colIdx) => {
            const inDrag = this._isInDragRegion(rowIdx, colIdx);
            const cellStyle = isPalette ? this._paletteCellStyle(val) : "";
            return html`
          <div
            class="cell ${isPalette ? (val ? "color-set" : "off") : (val ? "on" : "off")} ${weekEven && !val ? "week-even" : ""} ${isToday ? "today-row" : ""} ${isPast ? "past-row" : ""} ${inDrag ? "drag-preview" : ""} ${colIdx % 4 === 0 ? "hour-start" : ""}"
            style=${cellStyle}
            data-row=${rowIdx}
            data-col=${colIdx}
            data-day=${dayKey}
            title="${this._cellTooltip(colIdx, val)}"
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

    /**
     * Build a tooltip string for a grid cell.
     * @param colIdx - Slot index within the day.
     * @param val - Slot value (0 = off, 1..N = preset index).
     * @returns Multi-line tooltip with time range and preset details.
     */
    private _cellTooltip(colIdx: number, val: number = 0): string {
        const startH = Math.floor((colIdx * 15) / 60);
        const startM = (colIdx * 15) % 60;
        const endH = Math.floor(((colIdx + 1) * 15) / 60);
        const endM = ((colIdx + 1) * 15) % 60;
        const time = `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")} – ${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
        if (this.slotType === "hvac" && val > 0 && this.hvacPresets && val <= this.hvacPresets.length) {
            const preset = this.hvacPresets[val - 1];
            const lines = [time];
            if (preset.alias) lines.push(preset.alias);
            if (preset.temperature !== null) lines.push(`Temp: ${preset.temperature}°C`);
            if (preset.hvac_mode) lines.push(`Mode: ${preset.hvac_mode}`);
            if (preset.fan_mode) lines.push(`Fan: ${preset.fan_mode}`);
            return lines.join("\n");
        }
        if (this.slotType === "color" && val > 0 && this.palette && val <= this.palette.length) {
            const norm = normalizePaletteEntry(this.palette[val - 1]);
            if (norm.mode === "cycle" && norm.alias) {
                return `${time}\n${norm.alias}`;
            }
        }
        if (this.slotType === "brightness" && val > 0 && this.brightnessPresets && val <= this.brightnessPresets.length) {
            const preset = this.brightnessPresets[val - 1];
            const pct = Math.round(preset.brightness / 255 * 100);
            const label = preset.alias || `${pct}%`;
            const suffix = preset.transition === "crossfade" ? " ⇢" : "";
            return `${time}\n${label}${suffix}`;
        }
        if (this.slotType === "scene" && val > 0 && this.scenePresets && val <= this.scenePresets.length) {
            const preset = this.scenePresets[val - 1];
            return `${time}\n${preset.alias || preset.name}`;
        }
        return time;
    }

    /**
     * Inline CSS background for a palette/HVAC cell.
     * @param val - Slot value (0 = off).
     * @returns CSS `background` property value, or empty string for off.
     */
    private _paletteCellStyle(val: number): string {
        if (val === 0) return "";
        if (this.slotType === "hvac") {
            if (!this.hvacPresets || val > this.hvacPresets.length) return "";
            return `background: ${this.hvacPresets[val - 1].color}`;
        }
        if (this.slotType === "brightness") {
            if (!this.brightnessPresets || val > this.brightnessPresets.length) return "";
            return `background: ${this.brightnessPresets[val - 1].color}`;
        }
        if (this.slotType === "scene") {
            if (!this.scenePresets || val > this.scenePresets.length) return "";
            return `background: ${this.scenePresets[val - 1].color}`;
        }
        if (!this.palette || val > this.palette.length) return "";
        const norm = normalizePaletteEntry(this.palette[val - 1]);
        return `background: ${paletteEntryBackground(norm)}`;
    }

    /** Render the preset/color swatch bar for palette and HVAC modes. */
    private _renderPaletteBar() {
        let swatches: { color: string; label: string; tooltip: string; icon?: string; index: number; textColor?: string }[];
        let maxCount: number;

        if (this.slotType === "hvac") {
            maxCount = 20;
            swatches = this.hvacPresets.map((p, i) => ({
                color: p.color,
                label: p.alias || this._hvacShortLabel(p),
                tooltip: this._hvacSwatchTooltip(p),
                icon: p.icon,
                index: i + 1,
            }));
        } else if (this.slotType === "brightness") {
            maxCount = 20;
            swatches = this.brightnessPresets.map((p, i) => ({
                color: p.color,
                label: `${p.alias || `${Math.round(p.brightness / 255 * 100)}%`}${p.transition === "crossfade" ? " ⇢" : ""}`,
                tooltip: `${p.alias || `${Math.round(p.brightness / 255 * 100)}%`}${p.transition === "crossfade" ? "\nCross-fade" : ""}`,
                icon: p.icon,
                index: i + 1,
                textColor: _chipTextColor(p.color),
            }));
        } else if (this.slotType === "scene") {
            maxCount = 20;
            swatches = this.scenePresets.map((p, i) => ({
                color: p.color,
                label: p.alias || p.name,
                tooltip: `${p.alias || p.name}\n${p.scene_id}`,
                icon: p.icon,
                index: i + 1,
            }));
        } else {
            maxCount = 10;
            swatches = this.palette.map((entry, i) => {
                const norm = normalizePaletteEntry(entry);
                const badge = norm.mode === "crossfade" ? "⇢"
                    : norm.mode === "cycle" ? "⟳"
                        : norm.mode === "tv" ? "📺" : "";
                const label = norm.mode === "cycle" && norm.alias
                    ? norm.alias
                    : `${norm.color} (${norm.mode})`;
                return {
                    color: paletteEntryBackground(norm),
                    label,
                    tooltip: norm.alias ? `${norm.alias}\n${norm.color} – ${norm.mode}` : `${norm.color} – ${norm.mode}`,
                    icon: badge || undefined,
                    index: i + 1,
                };
            });
        }

        const canDelete = swatches.length > 1;
        const canAdd = swatches.length < maxCount;

        return html`
      <div class="palette-bar">
        <div
          class="palette-swatch eraser ${this._activePaletteIndex === 0 ? "active" : ""}"
          title="Eraser"
          @click=${() => { this._activePaletteIndex = 0; }}
        >✕</div>
        ${swatches.map((s) => html`
          <div
            class="palette-swatch ${this._activePaletteIndex === s.index ? "active" : ""}"
            style="background: ${s.color}${s.textColor ? `; color: ${s.textColor}` : ""}"
            title="${s.tooltip}"
            @click=${() => { this._activePaletteIndex = s.index; }}
            @dblclick=${(e: Event) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent("preset-edit", { detail: { index: s.index - 1 } }));
            }}
          >${html`<button class="swatch-edit" @click=${(e: Event) => {
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent("preset-edit", { detail: { index: s.index - 1 } }));
            }}>✏</button>`}${s.icon ? html`<mdi-icon .icon=${s.icon} style="--mdi-icon-size:16px"></mdi-icon>` : ""}${canDelete ? html`<button class="swatch-remove" @click=${(e: Event) => {
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent("preset-delete", { detail: { index: s.index - 1 } }));
            }}>✕</button>` : ""}</div>
        `)}
        ${canAdd ? html`
          <div
            class="palette-swatch palette-swatch-add"
            title="Add preset"
            @click=${() => { this.dispatchEvent(new CustomEvent("preset-add")); }}
          >+</div>
        ` : ""}
      </div>
    `;
    }

    /**
     * Short label for an HVAC preset swatch.
     * @param preset - HVAC preset object.
     * @returns Compact string like "22° | cool | auto".
     */
    private _hvacShortLabel(preset: HvacPreset): string {
        const parts: string[] = [];
        if (preset.temperature !== null) parts.push(`${preset.temperature}°`);
        if (preset.hvac_mode) parts.push(preset.hvac_mode);
        if (preset.fan_mode) parts.push(preset.fan_mode);
        return parts.join(" | ") || "Preset";
    }

    /**
     * Tooltip for an HVAC preset swatch.
     * @param preset - HVAC preset object.
     * @returns Multi-line tooltip string.
     */
    private _hvacSwatchTooltip(preset: HvacPreset): string {
        const lines: string[] = [];
        if (preset.alias) lines.push(preset.alias);
        if (preset.temperature !== null) lines.push(`Temp: ${preset.temperature}°C`);
        if (preset.hvac_mode) lines.push(`Mode: ${preset.hvac_mode}`);
        if (preset.fan_mode) lines.push(`Fan: ${preset.fan_mode}`);
        return lines.join("\n");
    }

    /** Render the "now" time indicator line on the desktop grid. */
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

    /** Render the "now" time indicator on the mobile grid. */
    private _renderMobileTimeIndicator() {
        if (!this._mobileTimePos) return nothing;
        const h = Math.floor(this._nowMinutes / 60);
        const m = this._nowMinutes % 60;
        const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const { left, top, height } = this._mobileTimePos;
        return html`
      <span class="time-label" style="left: ${left}px; top: ${top}px; transform: translate(-50%, -100%)">${timeStr}</span>
      <div class="time-indicator" style="left: ${left}px; top: ${top}px; height: ${height}px; bottom: auto"></div>
    `;
    }

    /**
     * Check whether a cell falls within the current drag rectangle.
     * @param row - Row index to test.
     * @param col - Column index to test.
     */
    private _isInDragRegion(row: number, col: number): boolean {
        if (!this._dragActive) return false;
        const r0 = Math.min(this._dragStartRow, this._dragEndRow);
        const r1 = Math.max(this._dragStartRow, this._dragEndRow);
        const c0 = Math.min(this._dragStartCol, this._dragEndCol);
        const c1 = Math.max(this._dragStartCol, this._dragEndCol);
        return row >= r0 && row <= r1 && col >= c0 && col <= c1;
    }

    /** Start a drag operation, determining paint vs erase from the initial cell. */
    private _onMouseDown(e: MouseEvent, row: number, col: number, dayKey: string) {
        e.preventDefault();
        const daySlots = this.slots[dayKey] ?? new Array(SLOTS_PER_DAY).fill(0);
        const slotIdx = this._isMobile ? row * MOBILE_SLOTS_PER_ROW + col : col;
        if (this.slotType === "color" || this.slotType === "hvac" || this.slotType === "brightness" || this.slotType === "scene") {
            this._dragValue = daySlots[slotIdx] === this._activePaletteIndex ? 0 : this._activePaletteIndex;
        } else {
            this._dragValue = daySlots[slotIdx] ? 0 : 1;
        }
        this._dragStartRow = row;
        this._dragStartCol = col;
        this._dragEndRow = row;
        this._dragEndCol = col;
        this._dragActive = true;
    }

    /** Extend the drag rectangle as the cursor moves. */
    private _onMouseEnter(_e: MouseEvent, row: number, col: number) {
        if (!this._dragActive) return;
        this._dragEndRow = row;
        this._dragEndCol = col;
    }

    /** Finalize the drag and apply changes on mouse release. */
    private _onMouseUp() {
        if (!this._dragActive) return;
        this._applyDrag();
        this._dragActive = false;
    }

    /** Start a touch drag or record a tap target for single-cell toggle. */
    private _onTouchStart(e: TouchEvent, row: number, col: number, dayKey: string) {
        if (this._isMobile && !this._mobilePaintMode) {
            const touch = e.touches[0];
            this._tapTarget = { row, col, dayKey };
            this._tapStartX = touch.clientX;
            this._tapStartY = touch.clientY;
            return;
        }
        e.preventDefault();
        const daySlots = this.slots[dayKey] ?? new Array(SLOTS_PER_DAY).fill(0);
        const slotIdx = this._isMobile ? row * MOBILE_SLOTS_PER_ROW + col : col;
        if (this.slotType === "color" || this.slotType === "hvac" || this.slotType === "brightness" || this.slotType === "scene") {
            this._dragValue = daySlots[slotIdx] === this._activePaletteIndex ? 0 : this._activePaletteIndex;
        } else {
            this._dragValue = daySlots[slotIdx] ? 0 : 1;
        }
        this._dragStartRow = row;
        this._dragStartCol = col;
        this._dragEndRow = row;
        this._dragEndCol = col;
        this._dragActive = true;
    }

    /** Track touch movement to extend drag or cancel a tap. */
    private _onTouchMove(e: TouchEvent) {
        if (this._isMobile && !this._mobilePaintMode) {
            if (this._tapTarget) {
                const touch = e.touches[0];
                const dx = Math.abs(touch.clientX - this._tapStartX);
                const dy = Math.abs(touch.clientY - this._tapStartY);
                if (dx > 10 || dy > 10) this._tapTarget = null;
            }
            return;
        }
        if (!this._dragActive) return;
        const touch = e.touches[0];
        const el = this.shadowRoot?.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
        if (el?.dataset.row !== undefined && el?.dataset.col !== undefined) {
            this._dragEndRow = parseInt(el.dataset.row);
            this._dragEndCol = parseInt(el.dataset.col);
        }
    }

    /** Finalize a touch drag or apply a single-cell tap toggle. */
    private _onTouchEnd() {
        if (this._isMobile && !this._mobilePaintMode) {
            if (this._tapTarget) {
                this._toggleSingleCell(this._tapTarget.row, this._tapTarget.col, this._tapTarget.dayKey);
                this._tapTarget = null;
            }
            return;
        }
        if (!this._dragActive) return;
        this._applyDrag();
        this._dragActive = false;
    }

    /** Commit the current drag selection to slot data and fire slots-changed. */
    private _applyDrag() {
        const r0 = Math.min(this._dragStartRow, this._dragEndRow);
        const r1 = Math.max(this._dragStartRow, this._dragEndRow);
        const c0 = Math.min(this._dragStartCol, this._dragEndCol);
        const c1 = Math.max(this._dragStartCol, this._dragEndCol);

        const newSlots = { ...this.slots };

        if (this._isMobile) {
            const dayKey = this._effectiveMobileDay;
            const daySlots = [...(newSlots[dayKey] ?? new Array(SLOTS_PER_DAY).fill(0))];
            for (let r = r0; r <= r1; r++) {
                for (let c = c0; c <= c1; c++) {
                    const actualSlot = r * MOBILE_SLOTS_PER_ROW + c;
                    if (actualSlot < SLOTS_PER_DAY) {
                        daySlots[actualSlot] = this._dragValue;
                    }
                }
            }
            newSlots[dayKey] = daySlots;
        } else {
            const dayKeys = this._dayKeys;
            for (let r = r0; r <= r1; r++) {
                const dayKey = dayKeys[r];
                if (!dayKey) continue;
                const daySlots = [...(newSlots[dayKey] ?? new Array(SLOTS_PER_DAY).fill(0))];
                for (let c = c0; c <= c1; c++) {
                    daySlots[c] = this._dragValue;
                }
                newSlots[dayKey] = daySlots;
            }
        }

        this.dispatchEvent(
            new CustomEvent("slots-changed", {
                detail: { slots: newSlots },
                bubbles: true,
                composed: true,
            })
        );
    }

    /**
     * Set all slots across all days to a single value.
     * @param value - Slot value to fill (0 = off, 1 = on or palette index).
     */
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

    /** Copy Monday's slot data to all other weekdays. */
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

    /** Navigate to the previous page of custom cadence days. */
    private _prevPage() {
        this._page = Math.max(0, this._page - 1);
    }

    /** Navigate to the next page of custom cadence days. */
    private _nextPage() {
        this._page = Math.min(this._totalPages - 1, this._page + 1);
    }
}
