import { css } from "linaria";

export const styles = {
  list: css`
    display: grid;
    grid-row-gap: 30px;
  `,
  year: css`
    display: flex;
    align-items: center;

    &:after {
      content: "";
      border-top: dashed var(--foreground) 1px;
      display: block;
      opacity: 0.15;
      flex-grow: 1;
      margin-left: 10px;
    }
  `,
};
