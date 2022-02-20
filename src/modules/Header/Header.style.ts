import { css } from "linaria";

export const styles = {
  header: css`
    display: flex;
    justify-content: space-between;
    padding: 20px;
    align-items: center;
  `,
  homeLink: css`
    font-weight: 800;
    text-decoration: none;
    color: var(--primary-color);
  `,
  themeToggle: css`
    width: 30px;
    height: 30px;
    border: none;
    background: none;
    cursor: pointer;
    opacity: 0.75;
    font-size: 0;

    &:hover {
      opacity: 1;
      color: var(--primary-color);
    }

    svg {
      width: 100%;
      height: auto;
      fill: currentColor;
    }
  `,
};
