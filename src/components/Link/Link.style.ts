import { css } from "linaria";

export const styles = {
  link: css`
    color: rgb(var(--color-primary));
    text-decoration: none;
    font-weight: 500;

    &:hover,
    &:focus {
      box-shadow: 0 1px 0 0 currentColor;

      code {
        text-decoration: underline;
      }
    }
  `,
};
