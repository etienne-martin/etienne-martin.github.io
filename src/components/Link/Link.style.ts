import { css } from "linaria";

export const styles = {
  link: css`
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;

    &:hover,
    &:focus {
      box-shadow: 0 1px 0 0 currentColor;
    }
  `,
};
