import { css } from "linaria";

export const styles = {
  wrapper: css`
    position: relative;
    background: #3f3764;
    box-shadow: rgba(0, 0, 0, 0.25) 0 50px 100px -50px;
    border-radius: var(--radius);
    font-size: var(--font-size-s);
    line-height: 1.5em;
    overflow: hidden;
    cursor: text;
  `,
  clipboard: css`
    && {
      position: absolute;
      top: 15px;
      right: 15px;
    }
  `,
  scroll: css`
    overflow-x: auto;
  `,
};
