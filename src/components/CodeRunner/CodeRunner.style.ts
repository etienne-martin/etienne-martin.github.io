import { css } from "linaria";

export const styles = {
  wrapper: css`
    position: relative;
    color: rgb(98, 114, 164);
    font-family: var(--font-mono);
    border-top: dashed rgb(98, 114, 164, 0.5) 1px;
    background: rgba(0, 0, 0, 0.25);
  `,
  header: css`
    padding: 20px 20px 0 20px;
  `,
  label: css`
    font-size: var(--font-size-xs);
    font-weight: 400;
    text-transform: uppercase;
    display: block;
  `,
  replay: css`
    background: none;
    border: none;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: all;

    svg {
      width: 30px;
      height: auto;
      fill: currentColor;
    }
  `,
  footer: css`
    padding: 0 20px 20px 20px;
    font-size: var(--font-size-xs);
    font-weight: 400;
    text-transform: uppercase;
    clear: both;
  `,
  scroll: css`
    overflow-x: auto;
  `,
  console: css``,
  log: css`
    clear: both;

    &:not(:first-child) {
      border-bottom: dashed rgb(98, 114, 164, 0.5) 1px;
    }
  `,
  line: css`
    padding: 10px 0;
  `,
  status: css``,
};
