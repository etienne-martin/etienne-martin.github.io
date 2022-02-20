import { css } from "linaria";

export const styles = {
  container: css`
    word-break: break-word;
    display: grid;
    grid-row-gap: 30px;
    /**
    minmax fix for grid blowout on Safari
    https://css-tricks.com/preventing-a-grid-blowout/
     */
    grid-template-columns: minmax(0, 1fr);
    justify-items: start;

    // code blocks are wrapped with a pre element
    & > pre {
      min-width: 0;
      width: 100%;
    }
  `,
};
