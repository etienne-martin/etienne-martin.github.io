import { css } from "linaria";

export const styles = {
  wrapper: css`
    border-radius: 3px;
    font-size: var(--font-size-m);
    color: var(--primary-color);
    padding: 3px 5px;
    white-space: nowrap;
    background: #edebfb;

    html[data-theme="dark"] & {
      background: #3f3764;
    }
  `,
};
