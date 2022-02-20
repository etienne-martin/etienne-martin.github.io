import { css } from "linaria";

const tapSurface = css`
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: var(--radius);
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  svg {
    width: 100%;
    height: auto;
    fill: currentColor;
  }
`;

const button = css`
  position: relative;
  width: 30px;
  height: 30px;
  background: none;
  border: none;

  &:hover .${tapSurface}, &:focus .${tapSurface} {
    color: #fff;
    transition: color 0.25s;
  }

  &:active .${tapSurface} {
    color: var(--primary-color);
  }
`;

export const styles = {
  button,
  tapSurface,
  confirmation: css`
    position: absolute;
    top: 0;
    right: 100%;
    margin-right: 3px;
    height: 100%;
    padding: 0 10px;
    border-radius: var(--radius);
    pointer-events: none;
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 2s;
    font-size: var(--font-size-xs);
  `,
  shouldShowConfirmation: css`
    opacity: 1;
    transition: none;
  `,
};
