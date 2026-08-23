import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("toast-notification")
export class ToastNotification extends LitElement {
    @property({ type: String }) message = "";
    @property({ type: String }) type: "info" | "warning" | "error" = "info";
    @property({ type: Boolean, reflect: true }) visible = false;

    private _timer: ReturnType<typeof setTimeout> | null = null;

    static styles = css`
    :host {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 100;
      transition: opacity 0.3s, transform 0.3s;
      opacity: 0;
      transform: translateY(-12px);
      pointer-events: none;
    }
    :host([visible]) {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .toast {
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
      color: #fff;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      max-width: 400px;
    }
    .toast.info {
      background: var(--primary-color, #03a9f4);
    }
    .toast.warning {
      background: var(--warning-color, #ff9800);
    }
    .toast.error {
      background: var(--error-color, #db4437);
    }
  `;

    render() {
        return html`
      <div class="toast ${this.type}" @click=${this.dismiss}>
        ${this.message}
      </div>
    `;
    }

    show(message: string, type: "info" | "warning" | "error" = "info") {
        if (this._timer) clearTimeout(this._timer);
        this.message = message;
        this.type = type;
        this.visible = true;
        this._timer = setTimeout(() => this.dismiss(), 5000);
    }

    dismiss() {
        this.visible = false;
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }
}
