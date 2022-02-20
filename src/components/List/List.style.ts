import { css } from "linaria";

export const styles = {
  list: css`
    list-style: none;
    display: grid;
    grid-row-gap: 10px;
    /**
    minmax fix for grid blowout on Safari
    https://css-tricks.com/preventing-a-grid-blowout/
     */
    grid-template-columns: minmax(0, 1fr);
    justify-items: start;
  `,
};
