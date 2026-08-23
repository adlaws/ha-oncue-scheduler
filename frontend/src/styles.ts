import { css } from "lit";

export const sharedStyles = css`
  :host {
    display: block;
    font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
    color: var(--primary-text-color, #212121);
    --ss-primary: var(--primary-color, #03a9f4);
    --ss-bg: var(--card-background-color, #fff);
    --ss-border: var(--divider-color, #e0e0e0);
    --ss-sidebar-width: 280px;
    --ss-cell-on: var(--primary-color, #03a9f4);
    --ss-cell-off: var(--secondary-background-color, #f5f5f5);
    --ss-cell-size: 12px;
  }

  .card {
    background: var(--ss-bg);
    border-radius: 8px;
    padding: 16px;
    box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0, 0, 0, 0.14));
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-family: inherit;
  }

  button.primary {
    background: var(--ss-primary);
    color: #fff;
  }

  button.secondary {
    background: var(--ss-border);
    color: var(--primary-text-color, #212121);
  }

  button.danger {
    background: var(--error-color, #db4437);
    color: #fff;
  }

  input,
  select,
  textarea {
    font-family: inherit;
    font-size: 14px;
    padding: 8px;
    border: 1px solid var(--ss-border);
    border-radius: 4px;
    background: var(--ss-bg);
    color: var(--primary-text-color, #212121);
    box-sizing: border-box;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid var(--ss-primary);
    outline-offset: -1px;
  }

  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--secondary-text-color, #727272);
  }

  .form-group {
    margin-bottom: 12px;
  }

  .warning-banner {
    background: var(--warning-color, #ff9800);
    color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    margin-bottom: 12px;
    font-size: 13px;
  }

  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .badge-daily {
    background: #e3f2fd;
    color: #1565c0;
  }
  .badge-weekly {
    background: #e8f5e9;
    color: #2e7d32;
  }
  .badge-custom {
    background: #fff3e0;
    color: #e65100;
  }
`;
