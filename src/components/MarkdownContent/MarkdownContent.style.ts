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

    & > :is(h1, h2, h3, h4, h5, h6):not(:first-child) {
      margin-top: 30px;
    }
  `,
};
