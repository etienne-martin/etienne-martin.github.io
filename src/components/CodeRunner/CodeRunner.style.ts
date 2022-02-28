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
    height: 30px;
    padding: 0 5px 0 10px;
    background: none;
    border: none;
    border-radius: var(--radius);
    color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    cursor: pointer;
    position: absolute;
    top: 15px;
    right: 15px;
    text-transform: uppercase;
    font-size: var(--font-size-xs);
    font-family: var(--font-mono);
    display: flex;
    align-items: center;

    &[disabled] {
      opacity: 0.5;
    }

    &:not([disabled]) {
      &:hover,
      &:focus {
        color: #fff;
        transition: color 0.25s;
      }

      &:active {
        color: rgb(var(--color-primary));
      }
    }

    svg {
      width: 24px;
      height: auto;
      fill: currentColor;
    }
  `,
  footer: css`
    padding-bottom: 10px;
    clear: both;
  `,
  scroll: css`
    overflow-x: auto;
  `,
  console: css`
    min-height: 10px;
  `,
  log: css`
    clear: both;

    &:not(:first-child) {
      border-bottom: dashed rgb(98, 114, 164, 0.5) 1px;
    }
  `,
  line: css`
    padding: 10px 0;
  `,
  status: css`
    padding: 0 20px 10px 20px;
    clear: both;
  `,
  pending: css`
    &:after {
      content: "";
      animation: dotty steps(1, end) 0.5s infinite;
    }

    @keyframes dotty {
      0% {
        content: "";
      }
      25% {
        content: ".";
      }
      50% {
        content: "..";
      }
      75% {
        content: "...";
      }
      100% {
        content: "";
      }
    }
  `,
};
