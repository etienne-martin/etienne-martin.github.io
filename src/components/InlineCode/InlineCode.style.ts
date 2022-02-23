import { css } from "linaria";

export const styles = {
  wrapper: css`
    border-radius: 5px;
    font-size: var(--font-size-m);
    color: var(--primary-color);
    padding: 0 5px;
    white-space: nowrap;
    background: #edebfb;
    font-family: var(--font-mono);
    transition: background-color 0.25s;

    html[data-theme="dark"] & {
      background: #3f3764;
    }
  `,
};
